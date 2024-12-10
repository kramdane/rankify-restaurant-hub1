import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const useChatApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (message: string) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message }
      });

      if (error) throw error;
      
      if (!data?.response) {
        throw new Error('No response received from the chat service');
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
    isProcessing
  };
};