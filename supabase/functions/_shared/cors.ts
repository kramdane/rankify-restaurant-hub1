const ALLOWED_ORIGINS = [
  'https://preview--rankify-restaurant-hub.lovable.app',
  'https://rankify-restaurant-hub.lovable.app',
  'http://localhost:8080', // For local development
];

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export function handleCors(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
      },
    });
  }

  // For non-OPTIONS requests, return null but the calling function should use corsHeaders
  return null;
}