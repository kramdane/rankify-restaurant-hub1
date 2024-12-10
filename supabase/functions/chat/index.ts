import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { OpenAI } from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

const openai = new OpenAI(Deno.env.get('OPENAI_API_KEY') || '')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Test OpenAI connection
    if (!Deno.env.get('OPENAI_API_KEY')) {
      console.error('OpenAI API key is not set')
      throw new Error('OpenAI API key is not configured')
    }

    const { message } = await req.json()
    console.log('Received message:', message)

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
      max_tokens: 500,
    })

    console.log('OpenAI response received:', completion.choices[0]?.message)

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process that.'

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