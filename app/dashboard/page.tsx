// Dashboard ana sayfa: Artık içerik layout tarafından yönetiliyor.
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) return (
    <div className="p-8">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-5 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
  if (!userId) return <div className="p-8">Lütfen giriş yapın.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel Seçerek devam edebilirsiniz.</h1>
      <div className="text-muted-foreground">Yukarıdan istediğiniz paneli seçin.</div>
    </div>
  );
}
