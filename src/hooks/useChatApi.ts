import { useState } from 'react';
import { toast } from 'sonner';

export const useChatApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (message: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      if (!data.isConfigured) {
        toast.error('OpenAI API key is not configured. Please add it in the project settings.');
        throw new Error('OpenAI API key not configured');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.response;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
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