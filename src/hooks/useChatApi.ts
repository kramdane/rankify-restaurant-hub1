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

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization headers only in production
      if (!import.meta.env.DEV) {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
        headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY;
      }

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers,
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