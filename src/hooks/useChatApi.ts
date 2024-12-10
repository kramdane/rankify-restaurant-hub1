import { useState } from 'react';
import { toast } from 'sonner';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // You'll need to add this to your .env file
  dangerouslyAllowBrowser: true // Note: This is only for development
});

export const useChatApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (message: string) => {
    setIsProcessing(true);
    
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        toast.error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
        throw new Error('OpenAI API key not configured');
      }

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful restaurant assistant. You help with reviews, menu management, and customer service."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return response;
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