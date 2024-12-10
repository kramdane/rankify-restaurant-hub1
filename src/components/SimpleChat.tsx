import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useChatApi } from "@/hooks/useChatApi";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const SimpleChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { sendMessage, isProcessing } = useChatApi();

  // Get the current user's restaurant
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    try {
      const response = await sendMessage(userMessage, restaurant?.id);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error('Error in handleSubmit:', error);

Let's enhance the chat functionality to integrate with your database data. We'll modify the Edge Function to handle specific queries about reviews and ratings.

<lov-code>
Let's update the chat Edge Function to handle database queries:

<lov-write file_path="supabase/functions/chat/index.ts">
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, restaurantId } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query data based on the message content
    let additionalContext = '';
    
    if (message.toLowerCase().includes('last review') || message.toLowerCase().includes('latest review')) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (reviews && reviews.length > 0) {
        const review = reviews[0];
        additionalContext = `The latest review was from ${review.reviewer_name} with a rating of ${review.rating} stars and the comment: "${review.comment}". It was posted on ${new Date(review.created_at).toLocaleDateString()}.`;
      }
    } else if (message.toLowerCase().includes('average') && message.toLowerCase().includes('rate')) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('restaurant_id', restaurantId);

      if (reviews && reviews.length > 0) {
        const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        additionalContext = `Based on ${reviews.length} reviews, your average rating is ${average.toFixed(1)} stars.`;
      }
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful restaurant management assistant. Help users with their restaurant-related questions and tasks. When providing information about reviews or ratings, be precise and friendly."
        },
        {
          role: "user",
          content: message
        },
        ...(additionalContext ? [{
          role: "system",
          content: `Here is the relevant information from the database: ${additionalContext}`
        }] : [])
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});