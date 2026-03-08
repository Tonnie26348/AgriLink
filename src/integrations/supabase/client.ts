import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase: Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Please check your .env file.");
}

// Use dummy values as fallbacks specifically to satisfy createClient validation in tests/CI
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder-url.supabase.co", 
  SUPABASE_ANON_KEY || "placeholder-key", 
  {
    auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
