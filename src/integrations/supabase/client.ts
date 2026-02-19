import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholders only if variables are absolutely missing (e.g., in CI)
const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_ANON_KEY || 'placeholder-key';

// Log for debugging (Remove in production)
if (url.includes('placeholder')) {
  console.warn("Supabase client is using placeholder values. Ensure .env is loaded correctly.");
} else {
  console.log("Supabase client initialized with URL:", url);
}

export const supabase = createClient(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
