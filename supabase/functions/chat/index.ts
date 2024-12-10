import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { OpenAI } from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required', isConfigured: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate OpenAI API key
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          isConfigured: false 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Initialize OpenAI with the API key
    const openai = new OpenAI({ apiKey })
    
    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed back to a valid model name
      messages: [
        {"role": "system", "content": "You are a helpful restaurant assistant. You help with reviews, menu management, and customer service."},
        {"role": "user", "content": message}
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    // Extract and validate the response
    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Return successful response
    return new Response(
      JSON.stringify({ 
        response,
        isConfigured: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in chat function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isConfigured: true,
        details: 'An error occurred while processing your request'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})