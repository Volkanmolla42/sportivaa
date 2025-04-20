import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export async function middleware(request: NextRequest) {
  // Supabase SSR client'ı oluştur
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          // NextRequest ile cookie'leri oku
          return request.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
            options: {},
          }));
        },
        setAll: () => {}, // Middleware'de setAll'a gerek yok
      },
    }
  );

  // Kullanıcıyı al
  const { data: { user } } = await supabase.auth.getUser();

  // Eğer kullanıcı yoksa /auth'a yönlendir
  if (!user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Rol bazlı koruma (örnek: /dashboard/gymmanager)
  const path = request.nextUrl.pathname;
  if (path.startsWith("/dashboard/gymmanager")) {
    const { data: userRow } = await supabase
      .from("users")
      .select("is_gymmanager")
      .eq("id", user.id)
      .single();

    if (!userRow?.is_gymmanager) {
      // Yetkisiz ise dashboard ana sayfasına yönlendir
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (path.startsWith("/dashboard/trainer")) {
    const { data: userRow } = await supabase
      .from("users")
      .select("is_trainer")
      .eq("id", user.id)
      .single();

    if (!userRow?.is_trainer) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  // ... diğer role bazlı kontrolleri ekleyebilirsin

  // Her şey yolundaysa devam et
  return NextResponse.next();
}
