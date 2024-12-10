import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, restaurantId, reviews } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const configuration = new Configuration({ apiKey: openaiApiKey })
    const openai = new OpenAIApi(configuration)

    // Create a system message that includes context about the restaurant and reviews
    const systemMessage = `You are a helpful AI assistant for a restaurant${
      reviews ? ` with ${reviews.length} reviews` : ''
    }. You help answer questions about reviews, menu items, and general restaurant management.`

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiResponse = completion.data.choices[0].message?.content
    if (!aiResponse) {
      throw new Error('No response received from OpenAI')
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in Edge Function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})