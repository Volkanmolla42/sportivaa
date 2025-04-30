import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') {
          return undefined;
        }
        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${name}=`));
        return cookie ? cookie.split("=")[1] : undefined;
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean; sameSite?: string }) {
        if (typeof document === 'undefined') {
          return;
        }
        let cookie = `${name}=${value}`;
        if (options.path) cookie += `; path=${options.path}`;
        if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
        if (options.domain) cookie += `; domain=${options.domain}`;
        if (options.secure) cookie += `; secure`;
        if (options.sameSite) cookie += `; samesite=${options.sameSite}`;
        document.cookie = cookie;
      },
      remove(name: string, options: { path?: string; domain?: string }) {
        if (typeof document === 'undefined') {
          return;
        }
        let cookie = `${name}=; max-age=0`;
        if (options.path) cookie += `; path=${options.path}`;
        if (options.domain) cookie += `; domain=${options.domain}`;
        document.cookie = cookie;
      },
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce'
    }
  }
);

