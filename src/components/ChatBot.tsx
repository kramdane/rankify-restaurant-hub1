import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "./ui/scroll-area";
import { MessageBubble } from "./chat/MessageBubble";
import { ChatInput } from "./chat/ChatInput";
import { type Message } from "./chat/types";
import { exportReviews, getYesterdayReviews, getReviewerContact } from "@/utils/chatBotUtils";

export const ChatBot = ({ restaurantId }: { restaurantId?: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId,
  });

  const { data: reviews } = useQuery({
    queryKey: ["all-reviews", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurantId,
  });

  useEffect(() => {
    if (restaurant?.owner_name) {
      setMessages([
        {
          role: "assistant",
          content: `Hello ${restaurant.owner_name}! How can I help you today?`,
        },
      ]);
    }
  }, [restaurant?.owner_name]);

  const processQuestion = async (question: string) => {
    if (!reviews) return "I don't have access to your review data at the moment.";

    const questionLower = question.toLowerCase();
    
    // Contact Information for specific reviewer
    if (questionLower.includes("phone number of") || questionLower.includes("contact for")) {
      const nameMatch = question.match(/(?:of|for)\s+(.+?)(?:\s|$)/i);
      if (nameMatch && nameMatch[1]) {
        const reviewerName = nameMatch[1].trim();
        const contact = getReviewerContact(reviews, reviewerName);
        if (contact) {
          return `Contact information for ${reviewerName}:\n${contact.phone ? `Phone: ${contact.phone}` : "No phone number available"}\n${contact.email ? `Email: ${contact.email}` : "No email available"}`;
        }
        return `I couldn't find any reviews from ${reviewerName}.`;
      }
      return "Please specify the name of the reviewer you're asking about.";
    }

    // Yesterday's reviews
    if (questionLower.includes("yesterday")) {
      const yesterdayReviews = getYesterdayReviews(reviews);
      if (yesterdayReviews.length === 0) {
        return "There were no reviews yesterday.";
      }

      const averageRating = yesterdayReviews.reduce((sum, review) => sum + review.rating, 0) / yesterdayReviews.length;
      
      if (questionLower.includes("export")) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const count = await exportReviews(yesterdayReviews, yesterday);
        return `Yesterday you received ${count} reviews with an average rating of ${averageRating.toFixed(1)} stars. I've exported them to a CSV file for you.`;
      }

      return `Yesterday you received ${yesterdayReviews.length} reviews with an average rating of ${averageRating.toFixed(1)} stars.`;
    }

    // Active campaigns
    if (questionLower.includes("active campaign") || questionLower.includes("campaign")) {
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active");
      
      if (!campaigns || campaigns.length === 0) {
        return "You don't have any active campaigns at the moment.";
      }

      return `You have ${campaigns.length} active campaign${campaigns.length > 1 ? 's' : ''}.${
        campaigns.map(campaign => `\n- ${campaign.name}`).join('')
      }`;
    }

    // Help message for unknown questions
    return "I can help you with information about your reviews! You can ask me about:\n" +
           "- Average rating\n" +
           "- Last/recent review\n" +
           "- Total number of reviews\n" +
           "- Best/worst reviews\n" +
           "- This month's performance\n" +
           "- Rating distribution\n" +
           "- Whether ratings are improving\n" +
           "Feel free to ask any of these questions!";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await processQuestion(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error processing question:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your question.",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Business Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 pr-4 mb-4 min-h-0">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </ScrollArea>
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isProcessing={isProcessing}
        />
      </CardContent>
    </Card>
  );
};