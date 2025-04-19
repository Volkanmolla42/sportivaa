"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { LoadingOverlay } from "@/components/ui/loading";

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Auth kontrolü
  useEffect(() => {
    console.log("DashboardLayout: Auth kontrolü", {
      isLoading,
      hasUser: !!user,
    });

    // Yükleme tamamlandığında
    if (!isLoading) {
      // Kullanıcı giriş yapmamışsa
      if (!user && !isRedirecting) {
        console.log(
          "DashboardLayout: Kullanıcı giriş yapmamış, yönlendiriliyor"
        );
        setIsRedirecting(true);

        // Doğrudan window.location ile yönlendir
        window.location.href = "/auth";
        return;
      }

      // Auth kontrolü tamamlandı
      setIsAuthChecked(true);
    }
  }, [user, isLoading, isRedirecting]);

  // Yükleme durumunda veya yönlendirme sırasında
  if (isLoading || isRedirecting || !isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingOverlay
          text={
            isRedirecting
              ? "Giriş sayfasına yönlendiriliyorsunuz..."
              : "Yükleniyor..."
          }
        />
      </div>
    );
  }

  // Kullanıcı giriş yapmışsa normal içeriği göster
  return (
    <RoleProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </RoleProvider>
  );
}
