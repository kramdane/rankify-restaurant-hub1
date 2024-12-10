import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"
import { corsHeaders, handleCors } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { message, restaurantId, reviews } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: req.headers.get('Authorization') ?? '' } 
        } 
      }
    )

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const configuration = new Configuration({
      apiKey: openaiApiKey,
    })
    const openai = new OpenAIApi(configuration)

    // Get restaurant data
    const { data: restaurant, error: restaurantError } = await supabaseClient
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single()

    if (restaurantError) {
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

    // Get AI response
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiResponse = completion.data.choices[0].message?.content
    if (!aiResponse) {
      throw new Error('No response received from OpenAI')
    }

    // Return response with CORS headers
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in Edge Function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500 
      },
    )
  }
})