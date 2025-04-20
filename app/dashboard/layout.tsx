import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

export default async function DashboardRootLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
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
