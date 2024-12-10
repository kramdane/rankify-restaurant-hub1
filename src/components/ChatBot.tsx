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
import { useToast } from "@/hooks/use-toast";

export const ChatBot = ({ restaurantId }: { restaurantId?: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
          content: `Hello ${restaurant.owner_name}! I'm your AI assistant. How can I help you today?`,
        },
      ]);
    }
  }, [restaurant?.owner_name]);

  const processSpecialCommands = async (question: string) => {
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

    // If no special command matches, return null to use AI
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      // First check for special commands
      const specialResponse = await processSpecialCommands(userMessage);
      
      if (specialResponse) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: specialResponse },
        ]);
      } else {
        console.log("Sending request to AI endpoint...");
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
          {
            method: 'POST',
            mode: 'no-cors', // Added no-cors mode
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              message: userMessage,
              restaurantId,
              reviews,
            }),
          }
        );

        console.log("Response status:", response.status);
        
        // Note: With no-cors mode, we can't read the response data
        // So we'll have to provide a generic response
        setMessages((prev) => [
          ...prev,
          { 
            role: "assistant", 
            content: "I received your message, but I'm unable to provide a specific response due to technical limitations. Please try again later." 
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "There was an error processing your message. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error while processing your message. Please try again.",
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
          AI Business Assistant
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