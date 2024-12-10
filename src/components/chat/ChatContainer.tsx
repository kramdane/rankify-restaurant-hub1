import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { type Message } from "./types";
import { useChatApi } from "@/hooks/useChatApi";
import { processSpecialCommands } from "@/utils/chatBotUtils";

interface ChatContainerProps {
  restaurantId?: number;
  reviews?: any[];
  ownerName?: string;
}

export const ChatContainer = ({ restaurantId, reviews, ownerName }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { sendMessage, isProcessing } = useChatApi({ restaurantId, reviews });

  useEffect(() => {
    if (ownerName) {
      setMessages([
        {
          role: "assistant",
          content: `Hello ${ownerName}! I'm your AI assistant. How can I help you today?`,
        },
      ]);
    }
  }, [ownerName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const specialResponse = await processSpecialCommands(userMessage, reviews);
      
      if (specialResponse) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: specialResponse },
        ]);
      } else {
        const response = await sendMessage(userMessage);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
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