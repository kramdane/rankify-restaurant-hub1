import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatBot = ({ restaurantId }: { restaurantId?: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const processQuestion = async (question: string) => {
    if (!reviews) return "I don't have access to your review data at the moment.";

    const questionLower = question.toLowerCase();
    
    if (questionLower.includes("average rating") || questionLower.includes("average score")) {
      const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      return `Your average rating is ${average.toFixed(1)} stars based on ${reviews.length} reviews.`;
    }
    
    if (questionLower.includes("last review") || questionLower.includes("recent review")) {
      const lastReview = reviews[0];
      if (lastReview) {
        return `Your most recent review was ${lastReview.rating} stars with the comment: "${lastReview.comment}" from ${lastReview.reviewer_name} on ${new Date(lastReview.created_at).toLocaleDateString()}.`;
      }
      return "I couldn't find any reviews.";
    }
    
    if (questionLower.includes("how many reviews")) {
      return `You have a total of ${reviews.length} reviews.`;
    }
    
    if (questionLower.includes("best review")) {
      const bestReview = [...reviews].sort((a, b) => b.rating - a.rating)[0];
      if (bestReview) {
        return `Your best review is ${bestReview.rating} stars from ${bestReview.reviewer_name}: "${bestReview.comment}"`;
      }
      return "I couldn't find any reviews.";
    }
    
    if (questionLower.includes("worst review")) {
      const worstReview = [...reviews].sort((a, b) => a.rating - b.rating)[0];
      if (worstReview) {
        return `Your lowest rated review is ${worstReview.rating} stars from ${worstReview.reviewer_name}: "${worstReview.comment}"`;
      }
      return "I couldn't find any reviews.";
    }

    return "I can help you with information about your reviews! You can ask me about your average rating, last review, total number of reviews, or your best/worst reviews.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await processQuestion(userMessage);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error processing question:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error while processing your question." 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Restaurant Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "assistant"
                  ? "bg-primary/10 p-3 rounded-lg"
                  : "bg-muted p-3 rounded-lg"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your reviews..."
            disabled={isProcessing}
          />
          <Button type="submit" disabled={isProcessing}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};