"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AuthForm from "@/components/Auth/AuthForm";

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/profile");
    }
    checkSession();
  }, [router]);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>
      <AuthForm mode="register" />
    </main>
  );
}
