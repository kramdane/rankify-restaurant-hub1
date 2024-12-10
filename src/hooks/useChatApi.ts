import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UseChatApiProps {
  restaurantId?: number;
  reviews?: any[];
}

export const useChatApi = ({ restaurantId, reviews }: UseChatApiProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (message: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          restaurantId,
          reviews 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error in sendMessage:', error);
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