import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('Request received:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log('Processing POST request');
    const { message, restaurantId, reviews } = await req.json()

    // Validate required fields
    if (!message) {
      throw new Error('Message is required')
    }

    console.log('Creating Supabase client');
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Initialize OpenAI with error handling
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Initializing OpenAI');
    const configuration = new Configuration({
      apiKey: openaiApiKey,
    })
    const openai = new OpenAIApi(configuration)

    console.log('Fetching restaurant data');
    // Get restaurant data with error handling
    const { data: restaurant, error: restaurantError } = await supabaseClient
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single()

    if (restaurantError) {
      console.error('Restaurant fetch error:', restaurantError);
      throw new Error(`Failed to fetch restaurant data: ${restaurantError.message}`)
    }

    // Prepare context for the AI
    const context = `You are a helpful AI assistant for the restaurant "${restaurant?.name}". 
    You have access to the restaurant's data and reviews. 
    Here's some context about the restaurant:
    - Owner: ${restaurant?.owner_name}
    - Address: ${restaurant?.address}
    - Business Category: ${restaurant?.business_category}
    
    The restaurant has ${reviews?.length || 0} reviews in total.
    
    Please provide helpful and friendly responses based on this context.`

    console.log('Sending request to OpenAI');
    
    // Get AI response with error handling
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    if (!completion.data.choices[0].message?.content) {
      throw new Error('No response received from OpenAI')
    }

    const aiResponse = completion.data.choices[0].message.content

    console.log('Sending successful response');
    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200
      },
    )
  } catch (error) {
    console.error('Error in chat function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})