import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServerClient";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export default async function DashboardRootLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data, error: userError } = await supabase.auth.getUser();
  const user = data?.user;
  const sessionResult = await supabase.auth.getSession();
  console.log("[dashboard/layout] supabase.auth.getUser user:", user);
  console.log("[dashboard/layout] supabase.auth.getSession result:", sessionResult);
  if (userError || !user) {
    console.error("[dashboard/layout] No user found, redirecting to /auth", userError);
    redirect("/auth");
  }
  const { data: dbUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  console.log("[dashboard/layout] dbUser sorgu sonucu:", dbUser);
  if (error) {
    console.error("[dashboard/layout] Supabase error:", error);
  }
  if (!dbUser) {
    console.error("[dashboard/layout] dbUser bulunamadı, redirecting to /auth");
    redirect("/auth");
  }
  return (
    <DashboardLayout user={dbUser}>
      {children}
    </DashboardLayout>
  );
}
