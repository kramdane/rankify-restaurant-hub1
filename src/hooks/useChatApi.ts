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
      const { data, error } = await supabase
        .rpc('handle_chat', { message });

      if (error) throw error;
      
      return data || 'Sorry, I could not process your request.';
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