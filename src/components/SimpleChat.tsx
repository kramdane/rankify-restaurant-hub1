import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2, X, MessageCircle } from "lucide-react";
import { useChatApi } from "@/hooks/useChatApi";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const SimpleChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const { sendMessage, isProcessing } = useChatApi();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('-')) {
        return (
          <div key={index} className="ml-4 my-1 flex items-start">
            <span className="mr-2">•</span>
            <span>{line.substring(1).trim()}</span>
          </div>
        );
      }
      return <div key={index} className="my-1">{line}</div>;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    try {
      const response = await sendMessage(userMessage, restaurant?.id);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 left-4 h-12 w-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-full max-w-2xl p-4 bg-white shadow-lg">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={() => setIsOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-3 pb-4 border-b mb-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold">Restaurant Assistant</h3>
          <p className="text-sm text-muted">Always here to help</p>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-secondary"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.role === "assistant" 
                  ? formatMessage(message.content)
                  : message.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-secondary max-w-[80%] p-3 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isProcessing}
        />
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </Card>
  );
};