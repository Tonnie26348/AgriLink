import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials to ensure they are picked up regardless of .env loading issues
const SUPABASE_URL = "https://zeyxhvrymjdypgfporuy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpleXhodnJ5bWpkeXBnZnBvcnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODU4MDgsImV4cCI6MjA4NjQ2MTgwOH0.0hC9nFXyxk-ZPoRwXZQTkVYSGA2bCIo0ZrszdJFNK74";

console.log("Supabase Client: Initializing with URL", SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
