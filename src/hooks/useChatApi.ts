import { useState } from 'react';
import { useToast } from './use-toast';

interface UseChatApiProps {
  restaurantId?: number;
  reviews?: any[];
}

export const useChatApi = ({ restaurantId, reviews }: UseChatApiProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    setIsProcessing(true);
    try {
      const baseUrl = import.meta.env.DEV 
        ? '/api/chat'
        : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(import.meta.env.PROD && {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          })
        },
        credentials: import.meta.env.PROD ? 'include' : 'omit',
        body: JSON.stringify({
          message,
          restaurantId,
          reviews,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "There was an error processing your message. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    sendMessage,
    isProcessing,
  };
};