import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    let contextData = '';
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('last review') || lowerMessage.includes('latest review')) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (reviews && reviews.length > 0) {
        const review = reviews[0];
        contextData = `The latest review was from ${review.reviewer_name} with a rating of ${review.rating} stars on ${new Date(review.created_at).toLocaleDateString()}. They said: "${review.comment}"`;
      } else {
        contextData = "There are no reviews yet for this restaurant.";
      }
    } else if (lowerMessage.includes('average') && lowerMessage.includes('rate')) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('restaurant_id', restaurantId);

      if (reviews && reviews.length > 0) {
        const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        contextData = `The average rating for your restaurant is ${average.toFixed(1)} stars based on ${reviews.length} reviews.`;
      } else {
        contextData = "There are no reviews yet to calculate an average rating.";
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
          content: "You are a helpful restaurant management assistant. Help users understand their restaurant data and reviews. Be concise and friendly in your responses."
        },
        {
          role: "user",
          content: contextData ? `${message}\nHere's the relevant data: ${contextData}` : message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Log the interaction for debugging
    console.log('Message:', message);
    console.log('Context Data:', contextData);
    console.log('Response:', response);

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