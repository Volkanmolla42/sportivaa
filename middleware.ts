import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard/gymmanager": ["GymManager"],
  "/dashboard/trainer": ["Trainer"],
  "/dashboard": ["Member", "Trainer", "GymManager"],
  "/profile": ["Member", "Trainer", "GymManager"],
} as const;

// Define public routes that don't require authentication
const publicRoutes = ["/auth", "/", "/about", "/contact"] as const;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  try {
    // Create Supabase server client with proper cookie handling
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean; sameSite?: string }) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: { path?: string; domain?: string }) {
            response.cookies.set({
              name,
              value: "",
              ...options,
              maxAge: 0
            });
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

    // Get session instead of just user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session error:", sessionError);
      throw sessionError;
    }

    // Get current path
    const path = request.nextUrl.pathname;

    // Handle public routes
    if (publicRoutes.some(route => path.startsWith(route))) {
      // Redirect logged-in users away from auth page
      if (session?.user && path.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return response;
    }

    // Handle unauthenticated users
    if (!session?.user) {
      const redirectUrl = new URL("/auth", request.url);
      redirectUrl.searchParams.set("redirectTo", path);
      return NextResponse.redirect(redirectUrl);
    }

    // Check for protected routes that require specific roles
    for (const [protectedPath, requiredRoles] of Object.entries(protectedRoutes)) {
      if (path.startsWith(protectedPath)) {
        // Get user roles from database
        const { data: userData, error: roleError } = await supabase
          .from("users")
          .select("is_trainer, is_gymmanager")
          .eq("id", session.user.id)
          .single();

        if (roleError) {
          console.error("Error fetching user roles:", roleError);
          return NextResponse.redirect(new URL("/auth", request.url));
        }

        // Convert database flags to role array
        const userRoles = ["Member"];
        if (userData.is_trainer) userRoles.push("Trainer");
        if (userData.is_gymmanager) userRoles.push("GymManager");

        // Check if user has any of the required roles
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
          console.warn(`User ${session.user.id} attempted to access ${path} without required roles`);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // Clear auth cookies on error
    const redirectUrl = new URL("/auth", request.url);
    const errorResponse = NextResponse.redirect(redirectUrl);
    errorResponse.cookies.delete("sb-access-token");
    errorResponse.cookies.delete("sb-refresh-token");
    return errorResponse;
  }
}
