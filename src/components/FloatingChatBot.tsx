import { useState } from "react";
import { Button } from "./ui/button";
import { MessageSquare, X } from "lucide-react";
import { ChatBot } from "./ChatBot";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export const FloatingChatBot = ({ restaurantId }: { restaurantId?: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className={cn(
          "w-[350px] h-[500px] absolute bottom-0 right-0 mb-16",
          "transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}>
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Business Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-full">
            <ChatBot restaurantId={restaurantId} />
          </div>
        </Card>
      ) : null}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};