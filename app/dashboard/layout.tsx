"use client";

import { ReactNode, useEffect, useState } from "react";
import { getUserSessionWithRoles } from "@/contexts/AuthContext";
import { UserProfileName } from "@/components/user-profile/UserProfileName";
import { Suspense } from "react";
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
  Settings,
  Bell,
  CircleHelp,
  Calendar,
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

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/home/Logo";

// Arayüz tanımlamaları
interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface RoleInfo {
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  menuItems?: MenuItem[];
}

// Rol bilgilerinin tanımlanması
const ROLE_ROUTES: Record<string, RoleInfo> = {
  Member: {
    label: "Üye",
    path: "/dashboard/member",
    icon: <User className="w-5 h-5" />,
    description:
      "Üyelik bilgilerinizi, antrenman programlarınızı ve randevularınızı görüntüleyin.",
    menuItems: [
      {
        label: "Profil",
        path: "/dashboard/member/profile",
        icon: <User className="w-4 h-4" />,
      },
      {
        label: "Antrenmanlarım",
        path: "/dashboard/member/workouts",
        icon: <Dumbbell className="w-4 h-4" />,
      },
      {
        label: "Randevularım",
        path: "/dashboard/member/appointments",
        icon: <Calendar className="w-4 h-4" />,
        badge: "Yeni",
      },
      {
        label: "Üyeliklerim",
        path: "/dashboard/member/memberships",
        icon: <Building2 className="w-4 h-4" />,
      },
    ],
  },
  Trainer: {
    label: "Eğitmen",
    path: "/dashboard/trainer",
    icon: <Dumbbell className="w-5 h-5" />,
    description:
      "Öğrencilerinizi, programlarınızı ve çalışma takvimlerinizi yönetin.",
    menuItems: [
      {
        label: "Profil",
        path: "/dashboard/trainer/profile",
        icon: <User className="w-4 h-4" />,
      },
      {
        label: "Öğrencilerim",
        path: "/dashboard/trainer/students",
        icon: <User className="w-4 h-4" />,
      },
      {
        label: "Programlarım",
        path: "/dashboard/trainer/programs",
        icon: <Dumbbell className="w-4 h-4" />,
      },
      {
        label: "Takvimim",
        path: "/dashboard/trainer/calendar",
        icon: <Calendar className="w-4 h-4" />,
      },
    ],
  },
  GymManager: {
    label: "Salon Yöneticisi",
    path: "/dashboard/gymmanager",
    icon: <Building2 className="w-5 h-5" />,
    description: "Spor salonunuzu, üyelerinizi ve eğitmenlerinizi yönetin.",
    menuItems: [
      {
        label: "Salonlarım",
        path: "/dashboard/gymmanager/gyms",
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        label: "Üyeler",
        path: "/dashboard/gymmanager/members",
        icon: <User className="w-4 h-4" />,
      },
      {
        label: "Eğitmenler",
        path: "/dashboard/gymmanager/trainers",
        icon: <Dumbbell className="w-4 h-4" />,
      },
      {
        label: "Mali Rapor",
        path: "/dashboard/gymmanager/finances",
        icon: <Settings className="w-4 h-4" />,
        badge: "Yeni",
      },
    ],
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const {
    userId,
    isLoading: authLoading,
    user,
    displayName,
    refreshUserData,
  } = useAuth();

  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Kullanıcı rollerini getir
  // Kullanıcı verilerini yenile
  useEffect(() => {
    if (userId) {
      refreshUserData();
    }
  }, [userId, refreshUserData]);

  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);

      try {
        if (!userId) {
          setLoading(false);
          router.push("/auth?mode=login");
          return;
        }

        // Roller bilgisini alıyoruz
        const { roles } = await getUserSessionWithRoles();
        // Kullanıcı adı ve e-posta bilgisi useAuth() context'inden alınacak.

        // Mevcut rolü belirle
        let role = "";
        const found = Object.entries(ROLE_ROUTES).find(([, val]) =>
          pathname.startsWith(val.path)
        );

        if (found) {
          role = found[0];
        } else if (roles.includes("GymManager")) {
          role = "GymManager";
        } else if (roles.includes("Trainer")) {
          role = "Trainer";
        } else {
          role = "Member";
        }

        setRoles(roles);
        setSelectedRole(role);
        setLoading(false);
      } catch (error) {
        console.error("Roller yüklenirken hata:", error);
        setLoading(false);
      }
    }

    fetchRoles();
  }, [userId, pathname, router]);

  // Yükleme durumu
  if (loading || authLoading) {
    return <DashboardLoadingSkeleton />;
  }

  // Rol değişimi için fonksiyon
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    router.push(ROLE_ROUTES[role].path);
  };

  // Çıkış yapma fonksiyonu
  const handleSignOut = () => {
    supabase.auth
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Çıkış yapılırken hata:", error);
      });
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        {/* Logo */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center justify-center">
            <Logo size="default" className="py-2" />
          </Link>
        </div>

        {/* Rol Seçimi */}
        {roles.length > 1 && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between gap-2 h-10"
                >
                  <div className="flex items-center gap-2">
                    {ROLE_ROUTES[selectedRole]?.icon}
                    <span className="font-medium">
                      {ROLE_ROUTES[selectedRole]?.label}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Rolünü değiştir</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      selectedRole === role && "bg-slate-100 dark:bg-slate-800"
                    )}
                  >
                    {ROLE_ROUTES[role]?.icon}
                    <div className="flex flex-col">
                      <span>{ROLE_ROUTES[role]?.label}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        {ROLE_ROUTES[role]?.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Menü İçeriği */}
        <ScrollArea className="flex-grow overflow-auto py-4">
          <nav className="flex flex-col space-y-4 px-3">
            {/* Dashboard */}
            <div>
              <div className="flex items-center px-3 mb-2">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Dashboard
                </h2>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              >
                <Home className="h-5 w-5" />
                <span>Ana Sayfa</span>
              </Link>

              <Link
                href="/dashboard/notifications"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              >
                <Bell className="h-5 w-5" />
                <span>Bildirimler</span>
              </Link>
            </div>

            {/* Seçilen Role Göre Menü */}
            {selectedRole && ROLE_ROUTES[selectedRole]?.menuItems && (
              <div>
                <div className="flex items-center px-3 mb-2">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {ROLE_ROUTES[selectedRole]?.label} Menüsü
                  </h2>
                </div>
                <div className="space-y-1">
                  {ROLE_ROUTES[selectedRole].menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.path}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>

                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Genel Menü */}
            <div>
              <div className="flex items-center px-3 mb-2">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Genel
                </h2>
              </div>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              >
                <Settings className="h-5 w-5" />
                <span>Ayarlar</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              >
                <CircleHelp className="h-5 w-5" />
                <span>Yardım</span>
              </Link>
            </div>
          </nav>
        </ScrollArea>

        {/* Kullanıcı Profili ve Çıkış */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {/* Kullanıcı Bilgisi */}
          <div className="flex items-center mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="font-medium truncate">{displayName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email || "kullanici@example.com"}
              </div>
            </div>
          </div>

          {/* Çıkış Butonu */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </Button>
        </div>
      </aside>

      {/* Mobil Menü - Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobil Menü - Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Mobil Menü Başlık */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center">
            <Logo size="small" className="h-8" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Mobil Menü İçeriği */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-6">
            {/* Kullanıcı Profili (Mobil) */}
            <div className="flex items-center px-2 py-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="font-medium truncate">
                  <Suspense
                    fallback={
                      <span className="animate-pulse text-slate-400">
                        Yükleniyor...
                      </span>
                    }
                  >
                    <UserProfileName userId={userId as string} />
                  </Suspense>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || "kullanici@example.com"}
                </div>
              </div>
            </div>
            {/* Rol Seçimleri */}
            {roles.length > 1 && (
              <div>
                <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  ROLLERİNİZ
                </h3>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        handleRoleChange(role);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-md text-left w-full
                        ${
                          selectedRole === role
                            ? "bg-slate-100 dark:bg-slate-800"
                            : ""
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {ROLE_ROUTES[role]?.icon}
                        <div>
                          <div className="font-medium">
                            {ROLE_ROUTES[role]?.label}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {ROLE_ROUTES[role]?.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dashboard Menüsü */}
            <div>
              <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                DASHBOARD
              </h3>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Ana Sayfa</span>
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bell className="h-5 w-5" />
                  <span>Bildirimler</span>
                </Link>
              </div>
            </div>

            {/* Seçili Rol Menüsü */}
            {selectedRole && ROLE_ROUTES[selectedRole]?.menuItems && (
              <div>
                <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  {ROLE_ROUTES[selectedRole]?.label.toUpperCase()} MENÜSÜ
                </h3>
                <div className="space-y-1">
                  {ROLE_ROUTES[selectedRole].menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.path}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>

                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Genel Menü */}
            <div>
              <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                GENEL
              </h3>
              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Ayarlar</span>
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CircleHelp className="h-5 w-5" />
                  <span>Yardım</span>
                </Link>
              </div>
            </div>

            {/* Çıkış */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Çıkış Yap</span>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="flex flex-col flex-grow min-h-0">
        {/* Mobil Header */}
        <header className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Menü Butonu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex-grow flex justify-center">
              <Logo size="small" className="h-8" />
            </Link>

            {/* Kullanıcı Menüsü */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

        {/* İçerik */}
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Yükleme durumu için iskelet bileşeni
function DashboardLoadingSkeleton() {
  return (
    <div className="flex h-screen flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="p-4">
          <Skeleton className="h-8 w-full mx-auto" />
        </div>
        <div className="flex-grow p-4 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-24 mb-2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
          <Skeleton className="h-4 w-24 mt-4 mb-2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="flex flex-col flex-grow">
        {/* Mobile Header Skeleton */}
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
          <Skeleton className="h-8 w-8 lg:hidden" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Main Content Skeleton */}
        <main className="flex-grow p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-full max-w-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
