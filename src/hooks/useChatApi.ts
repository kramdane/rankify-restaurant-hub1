import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export const useChatApi = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const sendMessage = async (message: string, restaurantId?: string) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message,
          restaurantId: restaurantId || restaurant?.id 
        }
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