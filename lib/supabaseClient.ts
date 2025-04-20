import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Sadece development ortamında env logla, production'da loglama
  if (process.env.NODE_ENV !== "production") {
    console.error("[supabaseClient] ENV", { supabaseUrl, supabaseAnonKey });
  }
  throw new Error("Supabase environment variables NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY eksik! Lütfen .env dosyanı kontrol et.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
