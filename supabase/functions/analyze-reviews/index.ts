import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";

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
    console.log('Starting analyze-reviews function');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured. Please set it in the Edge Function secrets.');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Supabase credentials not found');
      throw new Error('Supabase credentials not configured');
    }

    const { restaurantId } = await req.json();
    if (!restaurantId) {
      console.error('No restaurant ID provided');
      throw new Error('Restaurant ID is required');
    }

    console.log('Fetching reviews for restaurant:', restaurantId);
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .not('comment', 'is', null);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      throw new Error('Failed to fetch reviews');
    }

    console.log(`Found ${reviews.length} reviews`);
    
    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({ words: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    const reviewText = reviews.map(r => r.comment).join('\n');
    const openai = new OpenAI({ apiKey: openAIApiKey });

    console.log('Calling OpenAI API for sentiment analysis');
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis assistant. Analyze the reviews and extract key words with their sentiments. Return a JSON object with a 'words' array. Each word object must have: 'word' (string), 'sentiment' (string: 'positive', 'negative', or 'neutral'), and 'count' (number). Example response format: { \"words\": [{ \"word\": \"delicious\", \"sentiment\": \"positive\", \"count\": 3 }] }. Only return valid JSON, no additional text or formatting."
          },
          {
            role: "user",
            content: reviewText
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      console.log('OpenAI API response received:', response);

      if (!response) {
        console.error('No response content from OpenAI');
        throw new Error('Empty response from OpenAI');
      }

      let analysis;
      try {
        analysis = JSON.parse(response);
        console.log('Successfully parsed OpenAI response:', analysis);
        
        if (!analysis.words || !Array.isArray(analysis.words)) {
          console.error('Invalid response structure:', analysis);
          throw new Error('Invalid response format from OpenAI');
        }

        // Validate each word object
        analysis.words.forEach((word: any, index: number) => {
          if (!word.word || !word.sentiment || typeof word.count !== 'number') {
            console.error(`Invalid word object at index ${index}:`, word);
            throw new Error('Invalid word object structure');
          }
        });

      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        console.error('Raw response:', response);
        throw new Error('Failed to parse OpenAI response');
      }

      // Add the full review objects to each word's reviews array
      const wordsWithReviews = analysis.words.map((word: any) => ({
        ...word,
        reviews: reviews.filter(review => 
          review.comment.toLowerCase().includes(word.word.toLowerCase())
        )
      }));

      return new Response(
        JSON.stringify({ words: wordsWithReviews }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (openAIError) {
      console.error('OpenAI API error:', openAIError);
      throw new Error('Failed to analyze reviews with OpenAI');
    }
  } catch (error) {
    console.error('Error in analyze-reviews function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});