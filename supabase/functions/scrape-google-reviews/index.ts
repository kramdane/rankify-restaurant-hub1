import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all restaurants with Google Business URLs
    const { data: restaurants, error: restaurantsError } = await supabaseClient
      .from('restaurants')
      .select('id, google_business_url')
      .not('google_business_url', 'is', null)

    if (restaurantsError) throw restaurantsError

    for (const restaurant of restaurants) {
      if (!restaurant.google_business_url) continue

      try {
        // Here we would normally use the Google Places API
        // For this example, we'll just demonstrate the structure
        // You'll need to replace this with actual API calls using your Google API key
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${getPlaceIdFromUrl(restaurant.google_business_url)}&fields=reviews&key=${Deno.env.get('GOOGLE_API_KEY')}`
        )

        const data = await response.json()

        // Process each review
        for (const review of data.result.reviews || []) {
          const { data: existingReview, error: checkError } = await supabaseClient
            .from('reviews')
            .select('id')
            .eq('restaurant_id', restaurant.id)
            .eq('external_review_id', review.time) // Using review time as unique identifier
            .eq('source', 'google')
            .single()

          if (checkError && checkError.code !== 'PGRST116') {
            console.error(`Error checking review: ${checkError.message}`)
            continue
          }

          if (!existingReview) {
            const { error: insertError } = await supabaseClient
              .from('reviews')
              .insert({
                restaurant_id: restaurant.id,
                rating: review.rating,
                comment: review.text,
                reviewer_name: review.author_name,
                source: 'google',
                external_review_id: review.time,
                created_at: new Date(review.time * 1000).toISOString()
              })

            if (insertError) {
              console.error(`Error inserting review: ${insertError.message}`)
            }
          }
        }
      } catch (error) {
        console.error(`Error processing restaurant ${restaurant.id}: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Reviews sync completed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function getPlaceIdFromUrl(url: string): string {
  // This is a placeholder function
  // You'll need to implement the actual logic to extract the place ID from the Google Business URL
  // The format might vary, so you'll need to handle different URL patterns
  const placeIdMatch = url.match(/maps\/place\/.*\/([^\/]+)/)
  return placeIdMatch ? placeIdMatch[1] : ''
}