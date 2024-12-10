import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";

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
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Supabase credentials not found');
      return new Response(
        JSON.stringify({ error: 'Supabase credentials not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { restaurantId } = await req.json();
    if (!restaurantId) {
      console.error('No restaurant ID provided');
      return new Response(
        JSON.stringify({ error: 'Restaurant ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Fetching reviews for restaurant:', restaurantId);
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('comment')
      .eq('restaurant_id', restaurantId)
      .not('comment', 'is', null);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch reviews' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found ${reviews.length} reviews`);
    
    if (reviews.length === 0) {
      console.log('No reviews found, returning empty array');
      return new Response(
        JSON.stringify({ words: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const reviewText = reviews.map(r => r.comment).join(' ');
    const openai = new OpenAI({ apiKey: openAIApiKey });

    console.log('Calling OpenAI API for sentiment analysis');
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Extract key words and phrases from the reviews and classify their sentiment. Return a JSON array where each item has: word (string), sentiment (positive, negative, or neutral), and count (number of occurrences). Focus on meaningful words and ignore common stop words. Format the response as a valid JSON array."
          },
          {
            role: "user",
            content: reviewText
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content;
      console.log('OpenAI API response:', response);

      if (!response) {
        throw new Error('No response from OpenAI');
      }

      let analysis;
      try {
        analysis = JSON.parse(response);
        console.log('Parsed analysis:', analysis);
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        throw new Error('Failed to parse OpenAI response');
      }

      return new Response(
        JSON.stringify({ words: analysis }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    } catch (openAIError) {
      console.error('OpenAI API error:', openAIError);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze reviews with OpenAI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error in analyze-reviews function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});