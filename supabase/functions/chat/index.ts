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
      console.error('Message is required')
      return new Response(
        JSON.stringify({ 
          error: 'Message is required',
          details: 'Please provide a message to process',
          isConfigured: true 
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
          },
          status: 400,
        }
      )
    }

    // Log incoming request details
    console.log('Processing request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      message
    })

    // Validate OpenAI API key
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      console.error('OpenAI API key missing from environment')
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          details: 'Please configure your OpenAI API key in the project settings',
          isConfigured: false 
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
          },
          status: 500,
        }
      )
    }

    // Initialize OpenAI with the API key
    const openai = new OpenAI({ apiKey })
    
    try {
      // Create chat completion
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
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
        console.error('No response received from OpenAI')
        throw new Error('No response received from OpenAI')
      }

      // Log successful response
      console.log('OpenAI response received:', { response })

      // Return successful response
      return new Response(
        JSON.stringify({ 
          response,
          isConfigured: true 
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
          },
          status: 200,
        }
      )
    } catch (openAiError) {
      console.error('OpenAI API Error:', openAiError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process message with OpenAI',
          details: openAiError.message || 'An error occurred while processing your request with OpenAI',
          isConfigured: true
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
          },
          status: 500,
        }
      )
    }
  } catch (error) {
    console.error('General Error in chat function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message || 'An unexpected error occurred while processing your request',
        isConfigured: true
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        },
        status: 500,
      }
    )
  }
})