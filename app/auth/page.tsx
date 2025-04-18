"use client";

import { Suspense, useEffect } from "react";
import AuthForm from "../../components/Forms/AuthForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const { userId, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userId) {
      router.replace("/dashboard");
    }
  }, [userId, isLoading, router]);

  return (
    <Suspense fallback={<div className="w-full h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
      <AuthForm />
    </Suspense>
  );
}
