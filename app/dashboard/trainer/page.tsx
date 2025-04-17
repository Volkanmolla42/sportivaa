"use client";

import { DashboardTrainer } from "@/components/Dashboard";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRoles } from "@/lib/profileApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Durum tipleri
type PageState = {
  hasRole: boolean;
  loading: boolean;
  error: string | null;
};

export default function TrainerDashboardPage() {
  const { userId, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<PageState>({
    hasRole: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const checkRoleAccess = async () => {
      if (!userId) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const roles = await getUserRoles(userId);
        setState({
          hasRole: roles.includes("Trainer"),
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Rol bilgileri alınırken hata:", error);
        setState({
          hasRole: false,
          loading: false,
          error: "Rol bilgileri yüklenirken bir hata oluştu."
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
    return <UnauthorizedState message="Lütfen önce giriş yapın." />;
  }

  // Yetkisiz erişim durumunda
  if (!state.hasRole) {
    return <UnauthorizedState message="Bu sayfaya erişim yetkiniz bulunmuyor. Eğitmen olarak kaydolun." />;
  }

  // Başarılı durumda
  return <DashboardTrainer userId={userId} />;
}

// Yükleme durumu bileşeni
function LoadingState() {
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
function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <CardTitle className="text-lg">Hata Oluştu</CardTitle>
          </div>
          <CardDescription>
            {message}
          </CardDescription>
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
function UnauthorizedState({ message }: { message: string }) {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Card className="border-yellow-200 dark:border-yellow-900">
        <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            <CardTitle className="text-lg">Erişim Reddedildi</CardTitle>
          </div>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Ana Panele Dön</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
