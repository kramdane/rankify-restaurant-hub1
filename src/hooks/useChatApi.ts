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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid content type:', contentType);
        console.error('Response text:', text);
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();

      if (!data.response) {
        console.error('Invalid response format:', data);
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