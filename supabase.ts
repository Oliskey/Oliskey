import { createClient } from '@supabase/supabase-js';

// Use environment variables if available (Vite uses import.meta.env), otherwise fall back to hardcoded values
// We cast import.meta to any to avoid TypeScript errors if the vite/client types are not globally available in this context.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://rwbbjotykxktcnotvsvc.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YmJqb3R5a3hrdGNub3R2c3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDMxNjYsImV4cCI6MjA4Mzk3OTE2Nn0.V9Ovw0Rv8WX846iwu9J8CfnWrPNOLa2MygMnxvNeyCQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);