import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { OpenAI } from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

const openai = new OpenAI(Deno.env.get('OPENAI_API_KEY') || '')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate OpenAI API key
    if (!Deno.env.get('OPENAI_API_KEY')) {
      throw new Error('OpenAI API key is not configured')
    }

    // Parse the request body
    const { message } = await req.json()
    
    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
      max_tokens: 500,
    })

    // Extract and validate the response
    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process that.'

    // Return JSON response with CORS headers
    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error in chat function:', error)
    
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An error occurred while processing your request'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})