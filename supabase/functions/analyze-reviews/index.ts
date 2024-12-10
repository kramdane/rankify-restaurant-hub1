import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting analyze-reviews function');
    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);
    const { restaurantId } = await req.json();

    console.log('Fetching reviews for restaurant:', restaurantId);
    // Fetch reviews for the restaurant
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('comment')
      .eq('restaurant_id', restaurantId)
      .not('comment', 'is', null);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      throw reviewsError;
    }

    console.log(`Found ${reviews.length} reviews`);
    
    if (reviews.length === 0) {
      return new Response(JSON.stringify({ words: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Combine all reviews into a single text
    const reviewText = reviews.map(r => r.comment).join(' ');

    console.log('Calling OpenAI API for sentiment analysis');
    // Use OpenAI to analyze the sentiment
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Extract key words and phrases from the reviews and classify their sentiment. Return a JSON array where each item has: word (string), sentiment (positive, negative, or neutral), and count (number of occurrences). Focus on meaningful words and ignore common stop words.'
          },
          {
            role: 'user',
            content: reviewText
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI API response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response from OpenAI:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const analysis = JSON.parse(data.choices[0].message.content);
    console.log('Parsed analysis:', analysis);

    return new Response(JSON.stringify({ words: analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-reviews function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});