"use client";

import { Suspense } from "react";
import AuthForm from "../../components/Forms/AuthForm";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="w-full h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />}>
      <AuthForm />
    </Suspense>
  );
}
