import { useState } from 'react';
import { toast } from 'sonner';

export const useChatApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (message: string) => {
    setIsProcessing(true);
    try {
      console.log('Sending message:', message);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ message }),
      });

      // Log response status and headers for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Get the content type
      const contentType = response.headers.get('Content-Type');
      console.log('Content-Type:', contentType);

      // Read response as text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Check if response is HTML
      if (contentType?.includes('text/html') || responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        console.error('Received HTML response:', responseText.substring(0, 200));
        toast.error('Server returned an unexpected HTML response. Please check the server logs.');
        throw new Error(`Received HTML response instead of JSON. Status: ${response.status}`);
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        toast.error('Failed to parse the server response. Please try again later.');
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }

      console.log('Parsed response data:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
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
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
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