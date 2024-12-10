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
    if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
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
    if (lowerMessage.includes('google') && lowerMessage.includes('business')) {
      contextData = restaurant.google_business_url 
        ? `Your Google Business URL is: ${restaurant.google_business_url}`
        : "You haven't set up your Google Business URL yet. You can add it in the settings.";
    } else if (lowerMessage.includes('facebook')) {
      contextData = restaurant.facebook_url
        ? `Your Facebook URL is: ${restaurant.facebook_url}`
        : "You haven't set up your Facebook URL yet. You can add it in the settings.";
    } else if (lowerMessage.includes('tripadvisor')) {
      contextData = restaurant.tripadvisor_url
        ? `Your TripAdvisor URL is: ${restaurant.tripadvisor_url}`
        : "You haven't set up your TripAdvisor URL yet. You can add it in the settings.";
    } else if (lowerMessage.includes('business') && lowerMessage.includes('hour')) {
      contextData = restaurant.business_hours
        ? `Your business hours are: ${JSON.stringify(restaurant.business_hours, null, 2)}`
        : "You haven't set up your business hours yet. You can add them in the settings.";
    } else if (lowerMessage.includes('address')) {
      contextData = restaurant.address
        ? `Your business address is: ${restaurant.address}`
        : "You haven't set up your business address yet. You can add it in the settings.";
    } else if (lowerMessage.includes('phone')) {
      contextData = restaurant.phone
        ? `Your phone number is: ${restaurant.phone}`
        : "You haven't set up your phone number yet. You can add it in the settings.";
    } else if (lowerMessage.includes('email')) {
      contextData = restaurant.email
        ? `Your email address is: ${restaurant.email}`
        : "You haven't set up your email address yet. You can add it in the settings.";
    } else if (lowerMessage.includes('category') || lowerMessage.includes('type of restaurant')) {
      contextData = restaurant.business_category
        ? `Your restaurant category is: ${restaurant.business_category}`
        : "You haven't set up your business category yet. You can add it in the settings.";
    } else if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
      if (reviews.length > 0) {
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        const recentReviews = reviews.slice(0, 3); // Get last 3 reviews
        contextData = `You have ${reviews.length} reviews with an average rating of ${averageRating.toFixed(1)}. Here are your most recent reviews:\n`;
        recentReviews.forEach(review => {
          contextData += `- ${review.reviewer_name}: ${review.rating}★ - "${review.comment}"\n`;
        });
      } else {
        contextData = "You don't have any reviews yet.";
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
          content: `You are a helpful restaurant management assistant. You have access to the restaurant's data and can provide accurate information about the business. The restaurant name is "${restaurant.name}". Be concise and friendly in your responses.`
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