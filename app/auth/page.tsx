"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Dynamically import the AuthFormClient with no SSR to improve performance
const AuthFormClient = dynamic(
  () => import("@/components/Auth/AuthFormClient"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="w-full max-w-md h-80 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm animate-pulse rounded-xl shadow-lg" />
      </div>
    ),
  }
);

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Kullanıcı giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    if (user && !isLoading) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  // Yükleme durumunda yükleme ekranını göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="w-full max-w-md h-80 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm animate-pulse rounded-xl shadow-lg" />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa auth formunu göster
  return <AuthFormClient />;
}
