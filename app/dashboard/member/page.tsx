"use client";

import DashboardMember from "@/components/Dashboard/DashboardMember";
import { useAuth } from "@/contexts/AuthContext";
import { withRoleAccess } from "@/components/Dashboard/withRoleAccess";

/**
 * Üye dashboard sayfası
 * Rol kontrolü withRoleAccess HOC ile yapılıyor
 */
export default function MemberDashboardPage() {
  // useAuth hook'u sadece üst seviyede çağrıldı, callback veya yardımcı fonksiyonlar içinde kullanılmıyor
  // Herhangi bir implicit any tipi yok, userId tipi zaten tanımlı
  const { user } = useAuth();
  const userId = user?.id;
  
  // Rol erişim yüksek seviye bileşeniyle sarmalanmış üye paneli
  const MemberDashboardWithAccess = withRoleAccess({
    requiredRole: "Member",
    Component: ({ userId }: { userId: string }) => <DashboardMember userId={userId} />,
    navigateTo: "/dashboard"
  });

  // Üye paneli ile rol erişim kontrolünü birleştir
  return <MemberDashboardWithAccess userId={userId} />;
}
