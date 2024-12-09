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
    
    // Basic statistics
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
    
    // Best and worst reviews
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

    // Time-based analysis
    if (questionLower.includes("this month") || questionLower.includes("current month")) {
      const thisMonth = reviews.filter(review => {
        const reviewDate = new Date(review.created_at);
        const now = new Date();
        return reviewDate.getMonth() === now.getMonth() && 
               reviewDate.getFullYear() === now.getFullYear();
      });
      return `This month you have received ${thisMonth.length} reviews with an average rating of ${
        (thisMonth.reduce((sum, review) => sum + review.rating, 0) / thisMonth.length || 0).toFixed(1)
      } stars.`;
    }

    // Rating distribution
    if (questionLower.includes("rating distribution") || questionLower.includes("ratings breakdown")) {
      const distribution = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      let response = "Here's your rating distribution:\n";
      for (let i = 5; i >= 1; i--) {
        response += `${i} stars: ${distribution[i] || 0} reviews\n`;
      }
      return response;
    }

    // Trend analysis
    if (questionLower.includes("improving") || questionLower.includes("getting better")) {
      const sortedReviews = [...reviews].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      if (sortedReviews.length < 2) return "I need more reviews to analyze trends.";
      
      const firstHalf = sortedReviews.slice(0, Math.floor(sortedReviews.length / 2));
      const secondHalf = sortedReviews.slice(Math.floor(sortedReviews.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, review) => sum + review.rating, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, review) => sum + review.rating, 0) / secondHalf.length;
      
      const difference = secondAvg - firstAvg;
      if (difference > 0.2) {
        return `Yes! Your ratings are improving. Your average rating has increased by ${difference.toFixed(1)} stars.`;
      } else if (difference < -0.2) {
        return `Your ratings have decreased by ${Math.abs(difference).toFixed(1)} stars. Consider addressing recent customer feedback.`;
      } else {
        return "Your ratings have remained relatively stable.";
      }
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Business Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "assistant"
                  ? "bg-primary/10 p-3 rounded-lg"
                  : "bg-primary p-3 rounded-lg"
              }`}
            >
              <p className={`text-sm whitespace-pre-line ${
                message.role === "assistant" 
                  ? "text-foreground" 
                  : "text-white"
              }`}>
                {message.content}
              </p>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your reviews..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button type="submit" disabled={isProcessing} size="icon">
            ✈️
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};