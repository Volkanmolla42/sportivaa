"use client";
import DashboardMember from "@/components/Dashboard/Member/DashboardMember";
import { useEffect, useState } from "react";
import { getUserSessionWithRoles } from "@/lib/profileApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRole, setHasRole] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSession() {
      setLoading(true);
      const { userId: uid, roles } = await getUserSessionWithRoles();
      setUserId(uid);
      setHasRole(roles.includes("Member"));
      setLoading(false);
    }
    fetchSession();
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
  return <DashboardMember userId={userId} />;
}
