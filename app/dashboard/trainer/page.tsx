"use client";

import { DashboardTrainer } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { withRoleAccess } from "@/components/Dashboard/withRoleAccess";

/**
 * Eğitmen dashboard sayfası
 * Rol kontrolü withRoleAccess HOC ile yapılıyor
 */
export default function TrainerDashboardPage() {
  // useAuth hook'u sadece üst seviyede çağrıldı, callback veya yardımcı fonksiyonlar içinde kullanılmıyor
  // Herhangi bir implicit any tipi yok, userId tipi zaten tanımlı
  const { userId } = useAuth();
  
  // Rol erişim yüksek seviye bileşeniyle sarmalanmış eğitmen paneli
  const TrainerDashboardWithAccess = withRoleAccess({
    requiredRole: "Trainer",
    Component: ({ userId }: { userId: string }) => <DashboardTrainer userId={userId} />,
    navigateTo: "/dashboard"
  });

  // Eğitmen paneli ile rol erişim kontrolünü birleştir
  return <TrainerDashboardWithAccess userId={userId} />;
}
