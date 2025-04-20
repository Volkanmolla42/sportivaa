import dynamic from "next/dynamic";
import { Suspense } from "react";

// Client component dinamik import, SSR devre dışı
const AuthFormClient = dynamic(() => import("@/components/Auth/AuthFormClient"));

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<div className="w-full flex justify-center items-center h-96">Yükleniyor...</div>}>
        <AuthFormClient />
      </Suspense>
    </div>
  );
}
