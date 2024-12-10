const ALLOWED_ORIGINS = [
  'https://preview--rankify-restaurant-hub.lovable.app',
  'https://rankify-restaurant-hub.lovable.app',
  'http://localhost:8080',
];

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export function handleCors(req: Request) {
  const origin = req.headers.get('Origin') || '';
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      },
    });
  }

  return null;
}