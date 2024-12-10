import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

      // Log the raw response for debugging
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!data.response) {
        throw new Error('Invalid response format');
      }

      return data.response;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error('Failed to send message. Please try again.');
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