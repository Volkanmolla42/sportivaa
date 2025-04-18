"use client";

import { ReactNode, useEffect, useState } from "react";
import { getUserSessionWithRoles } from "@/lib/profileApi";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Dumbbell,
  Building2,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LogoLink from "@/components/Home/Logo";

// Rol bilgilerinin tanımlanması
interface RoleInfo {
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

// Rol bilgilerinin tanımlanması
const ROLE_ROUTES: Record<string, RoleInfo> = {
  Member: {
    label: "Üye",
    path: "/dashboard/member",
    icon: <User className="w-5 h-5" />,
    description:
      "Üyelik bilgilerinizi, antrenman programlarınızı ve randevularınızı görüntüleyin.",
  },
  Trainer: {
    label: "Eğitmen",
    path: "/dashboard/trainer",
    icon: <Dumbbell className="w-5 h-5" />,
    description:
      "Öğrencilerinizi, programlarınızı ve çalışma takvimlerinizi yönetin.",
  },
  GymManager: {
    label: "Salon Yöneticisi",
    path: "/dashboard/gymmanager",
    icon: <Building2 className="w-5 h-5" />,
    description: "Spor salonunuzu, üyelerinizi ve eğitmenlerinizi yönetin.",
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Merkezi auth context'ten oturum bilgisini al
  const { userId, isLoading: authLoading } = useAuth();

  // Durum değişkenleri
  const [state, setState] = useState({
    roles: [] as string[],
    selectedRole: "",
    loading: true,
    mobileMenuOpen: false,
  });

  const router = useRouter();
  const pathname = usePathname();

  // Kullanıcı rollerini getir
  useEffect(() => {
    async function fetchRoles() {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        if (!userId) {
          setState((prev) => ({ ...prev, loading: false }));
          router.push("/auth?mode=login");
          return;
        }

        const { roles } = await getUserSessionWithRoles();

        // Mevcut rolü belirle
        let selectedRole = "";
        const found = Object.entries(ROLE_ROUTES).find(([, val]) =>
          pathname.startsWith(val.path)
        );

        if (found) {
          selectedRole = found[0];
        } else if (roles.includes("GymManager")) {
          selectedRole = "GymManager";
        } else if (roles.includes("Trainer")) {
          selectedRole = "Trainer";
        } else {
          selectedRole = "Member";
        }

        setState((prev) => ({
          ...prev,
          roles,
          selectedRole,
          loading: false,
        }));
      } catch (error) {
        console.error("Roller yüklenirken hata:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchRoles();
  }, [userId, pathname, router]);

  // Çıkış yapma işlevi
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  // Rol değiştirme işlevi
  const handleRoleChange = (role: string) => {
    setState((prev) => ({ ...prev, selectedRole: role }));
    router.push(ROLE_ROUTES[role].path);
  };

  // Mobil menü geçişi
  const toggleMobileMenu = () => {
    setState((prev) => ({
      ...prev,
      mobileMenuOpen: !prev.mobileMenuOpen,
    }));
  };

  // Yükleme durumu
  if (state.loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <LogoLink />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Giriş yapılmamışsa
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-center mb-8">
          <LogoLink size="large" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Lütfen devam etmek için giriş yapın.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white border-none"
        >
          <Link href="/auth?mode=login">Giriş Yap</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  // Rol yoksa
  if (state.roles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-center mb-8">
          <LogoLink size="large" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Platformu kullanabilmek için rolünüzün olması gerekiyor.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white border-none"
        >
          <Link href="/profile/roles">Rol Ekle</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          {/* Logo ve mobil menü butonu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              aria-label="Mobil Menü"
            >
              {state.mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <LogoLink />
          </div>

          {/* Masaüstü navigasyon */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Ana Sayfa</span>
            </Link>

            <TooltipProvider>
              {state.roles.map((role) => (
                <Tooltip key={role}>
                  <TooltipTrigger asChild>
                    <button
                      className={`px-3 py-2 rounded-md text-sm flex items-center gap-1.5 ${
                        state.selectedRole === role
                          ? "bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => handleRoleChange(role)}
                    >
                      {ROLE_ROUTES[role].icon}
                      <span>{ROLE_ROUTES[role].label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ROLE_ROUTES[role].description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>

          {/* Kullanıcı menüsü */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="/profile">
                  <User className="w-4 h-4 mr-2" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className="cursor-pointer" href="/profile/roles">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  <span>Roller</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-500 dark:text-red-400 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobil Menü */}
      {state.mobileMenuOpen && (
        <div className="lg:hidden border-b bg-white dark:bg-slate-900">
          <div className="container mx-auto p-4">
            <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800">
              <Link
                href="/"
                className="py-3 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-2"
                onClick={() =>
                  setState((prev) => ({ ...prev, mobileMenuOpen: false }))
                }
              >
                <Home className="w-5 h-5" />
                <span>Ana Sayfa</span>
              </Link>

              {state.roles.map((role) => (
                <button
                  key={role}
                  className={`py-3 flex items-center gap-2 text-left ${
                    state.selectedRole === role
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
                  onClick={() => {
                    handleRoleChange(role);
                    setState((prev) => ({ ...prev, mobileMenuOpen: false }));
                  }}
                >
                  {ROLE_ROUTES[role].icon}
                  <div className="flex flex-col">
                    <span>{ROLE_ROUTES[role].label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {ROLE_ROUTES[role].description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ana İçerik */}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
