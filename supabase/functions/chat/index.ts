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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query restaurant data
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (restaurantError) {
      console.error('Error fetching restaurant:', restaurantError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch restaurant data' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Query reviews if needed
    let reviews = [];
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('review') || 
        lowerMessage.includes('rating') || 
        lowerMessage.includes('good point') || 
        lowerMessage.includes('bad point') ||
        lowerMessage.includes('like') ||
        lowerMessage.includes('love')) {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (!reviewsError) {
        reviews = reviewsData;
      }
    }

    // Build context based on the message content and restaurant data
    let contextData = '';

    // Handle different types of queries
    if (lowerMessage.includes('good point') || lowerMessage.includes('bad point') || 
        (lowerMessage.includes('what') && (lowerMessage.includes('like') || lowerMessage.includes('love')))) {
      if (reviews.length > 0) {
        const reviewTexts = reviews.map(review => ({
          rating: review.rating,
          comment: review.comment
        }));

        const positiveReviews = reviewTexts.filter(r => r.rating >= 4);
        const negativeReviews = reviewTexts.filter(r => r.rating <= 2);

        contextData = 'Based on reviews:\n';
        
        if (positiveReviews.length > 0) {
          contextData += '\nPositive points:\n';
          positiveReviews.forEach(review => {
            if (review.comment) contextData += `- ${review.comment}\n`;
          });
        }

        if (negativeReviews.length > 0) {
          contextData += '\nAreas for improvement:\n';
          negativeReviews.forEach(review => {
            if (review.comment) contextData += `- ${review.comment}\n`;
          });
        }
      } else {
        contextData = "No reviews yet.";
      }
    } else if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
      if (reviews.length > 0) {
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        const recentReviews = reviews.slice(0, 3);
        contextData = `${reviews.length} reviews, ${averageRating.toFixed(1)}★ average.\n\nLatest reviews:\n`;
        recentReviews.forEach(review => {
          contextData += `- ${review.reviewer_name}: ${review.rating}★ - "${review.comment}"\n`;
        });
      } else {
        contextData = "No reviews yet.";
      }
    } else {
      // For other queries, use minimal context
      contextData = `Restaurant: ${restaurant.name}`;
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
          content: `You are a concise restaurant assistant. Keep initial responses brief and direct. Only provide detailed explanations when specifically asked. Format responses with bullet points when listing multiple items. The restaurant name is "${restaurant.name}".`
        },
        {
          role: "user",
          content: contextData ? `${message}\nContext: ${contextData}` : message
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
    console.log('Context:', contextData);
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