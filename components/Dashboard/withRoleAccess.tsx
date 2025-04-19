"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRoles } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Durum tipleri
type PageState = {
  hasRole: boolean;
  loading: boolean;
  error: string | null;
};

// HOC özellikleri
type WithRoleAccessProps = {
  requiredRole: "Member" | "Trainer" | "GymManager";
  Component: React.ComponentType<{ userId: string }>;
  navigateTo: string;
};

/**
 * Rol erişim kontrolü için Higher Order Component
 * @param requiredRole Gereken rol adı
 * @param Component Erişim izni verilecek bileşen
 * @param navigateTo Erişim reddedildiğinde yönlendirilecek sayfa
 * @returns Rol kontrolü yapılmış bileşen
 */
export function withRoleAccess({
  requiredRole,
  Component,
  navigateTo,
}: WithRoleAccessProps) {
  // Rol kontrollü bileşen
  return function RoleProtectedComponent({
    userId,
  }: {
    userId?: string | null;
  }) {
    const { isLoading: authLoading } = useAuth();
    const [state, setState] = useState<PageState>({
      hasRole: false,
      loading: true,
      error: null,
    });

    // Rol kontrolü
    useEffect(() => {
      const checkRoleAccess = async () => {
        if (!userId) return;

        try {
          setState((prev) => ({ ...prev, loading: true, error: null }));
          const roles = await getUserRoles(userId);
          const hasRole = Array.isArray(roles)
            ? roles.includes(requiredRole)
            : false;
          setState({
            hasRole,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error("Rol bilgileri alınırken hata:", error);
          setState({
            hasRole: false,
            loading: false,
            error: "Rol bilgileri yüklenirken bir hata oluştu.",
          });
        }
      };

      checkRoleAccess();
    }, [userId]);

    // Yükleme durumunda
    if (authLoading || state.loading) {
      return <LoadingState />;
    }

    // Hata durumunda
    if (state.error) {
      return <ErrorState message={state.error} />;
    }

    // Giriş yapılmadıysa
    if (!userId) {
      return (
        <UnauthorizedState
          message="Lütfen önce giriş yapın."
          navigateTo={navigateTo}
        />
      );
    }

    // Yetkisiz erişim durumunda
    if (!state.hasRole) {
      return (
        <UnauthorizedState
          message={`Bu sayfaya erişim yetkiniz bulunmuyor. '${requiredRole}' rolüne sahip olmanız gerekiyor.`}
          navigateTo={navigateTo}
        />
      );
    }

    // Başarılı durumda - userId string olarak geçirildiğinden emin oluyoruz
    return <Component userId={userId} />;
  };
}

// Yükleme durumu bileşeni
export function LoadingState() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

// Hata durumu bileşeni
export function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <CardTitle className="text-lg">Hata Oluştu</CardTitle>
          </div>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button onClick={() => window.location.reload()} className="w-full">
            Yeniden Dene
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Yetkisiz erişim bileşeni
export function UnauthorizedState({
  message,
  navigateTo,
}: {
  message: string;
  navigateTo: string;
}) {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <CardTitle className="text-lg">Erişim Reddedildi</CardTitle>
          </div>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href={navigateTo} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Geri Dön</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
