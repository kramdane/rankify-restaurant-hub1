import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch reviews for the restaurant
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch reviews' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Store the user message
    const { error: messageError } = await supabase
      .from('messages')
      .insert([
        {
          role: 'user',
          content: message,
          restaurant_id: restaurantId
        }
      ]);

    if (messageError) {
      console.error('Error storing message:', messageError);
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

    // Prepare review data for analysis
    const reviewStats = {
      totalReviews: reviews.length,
      averageRating: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
      latestReview: reviews[0],
      recentReviews: reviews.slice(0, 5)
    };

    // Create a detailed prompt based on the user's question
    let systemPrompt = `You are a helpful restaurant assistant analyzing reviews for a restaurant. Here are the current statistics:
    - Total Reviews: ${reviewStats.totalReviews}
    - Average Rating: ${reviewStats.averageRating.toFixed(1)}
    
    Recent reviews:
    ${reviewStats.recentReviews.map(review => 
      `- ${review.reviewer_name}: ${review.rating}★ - "${review.comment}"`
    ).join('\n')}
    
    Please provide specific insights based on this data.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I was unable to analyze the reviews at this moment.';
    
    // Store the assistant's response
    const { error: assistantMessageError } = await supabase
      .from('messages')
      .insert([
        {
          role: 'assistant',
          content: response,
          restaurant_id: restaurantId
        }
      ]);

    if (assistantMessageError) {
      console.error('Error storing assistant message:', assistantMessageError);
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