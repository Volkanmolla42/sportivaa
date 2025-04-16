"use client";
import DashboardGymManager from "../DashboardGymManager";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserRoles } from "@/lib/profileApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function GymManagerDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRole, setHasRole] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const roles = await getUserRoles(user.id);
        setHasRole(roles.includes("GymManager"));
      }
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
  if (!userId) {
    return <div className="p-8">Lütfen giriş yapın.</div>;
  }
  if (!hasRole) {
    return <div className="p-8">Bu panele erişim yetkiniz yok.</div>;
  }
  return <DashboardGymManager userId={userId} />;
}
