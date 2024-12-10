import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Type declarations for Vite's import.meta.env
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export default defineConfig(({ mode }) => {
  // Load environment variables safely
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

  // Validate required environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing required environment variables');
  }

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api/chat': {
          target: supabaseUrl,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/chat/, '/functions/v1/chat'),
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          } as Record<string, string>
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});