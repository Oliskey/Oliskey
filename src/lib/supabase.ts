import { createClient } from '@supabase/supabase-js';

// Public project URL and anon key (safe in the browser; row-level security protects the data). Override with VITE_ env vars.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || 'https://rwbbjotykxktcnotvsvc.supabase.co';
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YmJqb3R5a3hrdGNub3R2c3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDMxNjYsImV4cCI6MjA4Mzk3OTE2Nn0.V9Ovw0Rv8WX846iwu9J8CfnWrPNOLa2MygMnxvNeyCQ';

export const supabase = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });
