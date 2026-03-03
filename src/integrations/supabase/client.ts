import { createClient } from '@supabase/supabase-js';

// Configuration: Use environment variables, with hardcoded fallbacks to ensure local dev always works
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zeyxhvrymjdypgfporuy.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpleXhodnJ5bWpkeXBnZnBvcnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODU4MDgsImV4cCI6MjA4NjQ2MTgwOH0.0hC9nFXyxk-ZPoRwXZQTkVYSGA2bCIo0ZrszdJFNK74";

// Only log missing keys in non-production environments to avoid clutter
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn("Supabase: Using hardcoded fallback credentials. If this is unintended, check your .env file and restart Vite.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
