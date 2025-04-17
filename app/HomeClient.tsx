"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    // Skeleton loading UI
    return (
      <div className="max-w-xl w-full flex flex-col gap-8 items-center text-center">
        <Skeleton className="h-10 w-2/3 mb-2" />
        <Skeleton className="h-6 w-full mb-4" />
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return userId ? (
    <div className="max-w-xl w-full flex flex-col gap-8 items-center text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sportiva</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        Spor salonları, eğitmenler ve üyeler için tek noktadan dijital platform. Üyelik yönetimi, randevu ve spor geçmişi artık çok kolay.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link href="/dashboard" className="px-4 py-2 rounded  text-white hover:bg-blue-700 transition w-full sm:w-auto  dark:hover:bg-blue-800">Dashboard'a git</Link>
      </div>
    </div>
  ) : (
    <div className="max-w-xl w-full flex flex-col gap-8 items-center text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sportiva</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        Spor salonları, eğitmenler ve üyeler için tek noktadan dijital platform. Üyelik yönetimi, randevu ve spor geçmişi artık çok kolay.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link href="/auth/login" className="px-4 py-2 rounded  text-white hover:bg-blue-700 transition w-full sm:w-auto  dark:hover:bg-blue-800">Giriş Yap</Link>
        <Link href="/auth/register" className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition w-full sm:w-auto">Kayıt Ol</Link>
      </div>
    </div>
  );
}
