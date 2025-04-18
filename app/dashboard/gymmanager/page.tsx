"use client";

import DashboardGymManager from "@/components/Dashboard/GymManager/DashboardGymManager";
import { useAuth } from "@/contexts/AuthContext";
import { withRoleAccess } from "@/components/Dashboard/withRoleAccess";

/**
 * Salon Yöneticisi dashboard sayfası
 * Rol kontrolü withRoleAccess HOC ile yapılıyor
 */
export default function GymManagerDashboardPage() {
  // useAuth hook'u sadece üst seviyede çağrıldı, callback veya yardımcı fonksiyonlar içinde kullanılmıyor
  // Herhangi bir implicit any tipi yok, userId tipi zaten tanımlı
  const { userId } = useAuth();
  
  // Rol erişim yüksek seviye bileşeniyle sarmalanmış salon yöneticisi paneli
  const GymManagerDashboardWithAccess = withRoleAccess({
    requiredRole: "GymManager",
    Component: ({ userId }: { userId: string }) => <DashboardGymManager userId={userId} />,
    navigateTo: "/dashboard"
  });

  // Salon yöneticisi paneli ile rol erişim kontrolünü birleştir
  return <GymManagerDashboardWithAccess userId={userId} />;
}
