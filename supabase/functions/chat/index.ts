import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, restaurantId, reviews } = await req.json()

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Get restaurant data
    const { data: restaurant } = await supabaseClient
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single()

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

    const aiResponse = completion.data.choices[0].message?.content || "I apologize, but I couldn't process that request."

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})