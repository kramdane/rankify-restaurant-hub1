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
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
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