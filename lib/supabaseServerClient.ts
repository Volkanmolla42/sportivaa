import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createServerSupabaseClient() {
  // Next.js 15+ ile cookies() artık asenkron! Await etmelisin.
  const cookieStore = await cookies();
  // Tüm cookie'leri string olarak birleştir
  const cookieString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ');
  console.log("[supabaseServerClient] Cookie string:", cookieString);
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Cookie: cookieString,
      },
    },
  });
}
