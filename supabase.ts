import { createClient } from '@supabase/supabase-js';

// Safely access environment variables with fallbacks
const getEnvVar = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    console.warn(`Error accessing ${key} from import.meta.env`, e);
  }
  
  // Return fallback if env var is missing
  return fallback;
};

// We use the values derived from your .env file as fallbacks to guarantee connection
// even if the environment variable loader fails in this specific runtime.
const supabaseUrl = getEnvVar(
  'VITE_SUPABASE_URL', 
  'https://rwbbjotykxktcnotvsvc.supabase.co'
).trim();

const supabaseAnonKey = getEnvVar(
  'VITE_SUPABASE_ANON_KEY', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YmJqb3R5a3hrdGNub3R2c3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDMxNjYsImV4cCI6MjA4Mzk3OTE2Nn0.V9Ovw0Rv8WX846iwu9J8CfnWrPNOLa2MygMnxvNeyCQ'
).trim();

// Warn if we are somehow still missing keys (should be impossible with fallbacks)
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    console.error("CRITICAL: Missing Supabase Configuration.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
