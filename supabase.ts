import { createClient } from '@supabase/supabase-js';

// Credentials derived from your input
const supabaseUrl = 'https://rwbbjotykxktcnotvsvc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YmJqb3R5a3hrdGNub3R2c3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDMxNjYsImV4cCI6MjA4Mzk3OTE2Nn0.V9Ovw0Rv8WX846iwu9J8CfnWrPNOLa2MygMnxvNeyCQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);