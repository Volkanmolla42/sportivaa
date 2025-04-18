// Birleşik ana layout bileşeni yerine daha modüler bir yapı oluşturuldu
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/home/Logo";

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

// Dashboard ana düzeni
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId, isLoading: authLoading } = useAuth();
  const [state, setState] = useState({
    roles: [] as string[],
    selectedRole: "",
    loading: true,
    mobileMenuOpen: false,
  });

  const router = useRouter();
  const pathname: string = usePathname();

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

  // Yükleme durumu
  if (state.loading || authLoading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - büyük ekranlarda kalıcı */}
      <DashboardSidebar 
        roles={state.roles} 
        selectedRole={state.selectedRole} 
        router={router}
      />

      <div className="flex flex-col flex-grow min-h-0">
        {/* Header */}
        <DashboardHeader 
          mobileMenuOpen={state.mobileMenuOpen} 
          toggleMobileMenu={() => toggleMobileMenu(setState)}
          onSignOut={() => handleSignOut(router)}
        />

        {/* Mobil Menü */}
        {state.mobileMenuOpen && (
          <DashboardMobileMenu 
            roles={state.roles}
            selectedRole={state.selectedRole}
            onRoleChange={(role) => {
              handleRoleChange(role, setState, router);
              toggleMobileMenu(setState);
            }}
          />
        )}

        {/* Ana İçerik */}
        <main className="flex-grow p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Dashboard Sidebar bileşeni
function DashboardSidebar({ 
  roles, 
  selectedRole, 
  router 
}: { 
  roles: string[], 
  selectedRole: string, 
  router: ReturnType<typeof useRouter>
}) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="p-4">
        <Link href="/">
          <Logo size="default" className="flex items-center justify-center py-2" />
        </Link>
      </div>
      
      <ScrollArea className="flex-grow overflow-auto py-6">
        <nav className="flex flex-col space-y-1 px-3">
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${selectedRole === "" ? "bg-slate-100 dark:bg-slate-800" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"} transition-all`}
          >
            <Home className="h-5 w-5" />
            <span>Ana Sayfa</span>
          </Link>
          {roles.map((role) => (
            <Link
              key={role}
              href={ROLE_ROUTES[role]?.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${selectedRole === role ? "bg-slate-100 dark:bg-slate-800" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"} transition-all`}
            >
              {ROLE_ROUTES[role]?.icon}
              <span>{ROLE_ROUTES[role]?.label}</span>
            </Link>
          ))}
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
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          onClick={() => handleSignOut(router)}
        >
          <LogOut className="h-5 w-5" />
          <span>Çıkış Yap</span>
        </Button>
      </div>
    </aside>
  );
}

// Dashboard Header bileşeni
function DashboardHeader({ 
  mobileMenuOpen, 
  toggleMobileMenu,
  onSignOut
}: { 
  mobileMenuOpen: boolean, 
  toggleMobileMenu: () => void,
  onSignOut: () => void
}) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          
          <Link href="/dashboard" className="lg:hidden ml-2">
            <Logo size="default" className="h-8" />
          </Link>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <DashboardActions />
          <DashboardUserMenu onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}

// Dashboard Mobil Menü bileşeni
function DashboardMobileMenu({ 
  roles, 
  selectedRole, 
  onRoleChange 
}: { 
  roles: string[], 
  selectedRole: string, 
  onRoleChange: (role: string) => void 
}) {
  return (
    <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-y-auto">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="py-4 px-4 space-y-6">
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Genel
            </h3>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Home className="h-5 w-5" />
              <span>Ana Sayfa</span>
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Rolleriniz
            </h3>
            {roles.map((role) => (
              <button
                key={role}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  selectedRole === role
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
                onClick={() => onRoleChange(role)}
              >
                {ROLE_ROUTES[role].icon}
                <div className="flex flex-col items-start">
                  <span>{ROLE_ROUTES[role].label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {ROLE_ROUTES[role].description}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Hızlı Erişim
            </h3>
            <Link
              href="/dashboard/calendar"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Calendar className="h-5 w-5" />
              <span>Takvim</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="h-5 w-5" />
              <span>Ayarlar</span>
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <CircleHelp className="h-5 w-5" />
              <span>Yardım</span>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Dashboard Aksiyonlar bileşeni
function DashboardActions() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute top-0 right-0 h-2 w-2 p-0 bg-red-500" />
            <span className="sr-only">Bildirimler</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bildirimler</TooltipContent>
      </Tooltip>
    </div>
  );
}

// Dashboard Kullanıcı Menüsü bileşeni
function DashboardUserMenu({ onSignOut }: { onSignOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-9 rounded-full">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard">
            <User className="w-4 h-4 mr-2" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/roles">
            <Dumbbell className="w-4 h-4 mr-2" />
            <span>Roller</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/settings">
            <Settings className="w-4 h-4 mr-2" />
            <span>Ayarlar</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="text-red-500 dark:text-red-400 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Yükleme durumu için iskelet bileşeni
function DashboardLoadingSkeleton() {
  return (
    <div className="flex h-screen flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
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

      <div className="flex flex-col flex-grow">
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
          <Skeleton className="h-8 w-8 lg:hidden" />
          <div className="flex gap-2 ml-auto">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>

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

// Yardımcı fonksiyonlar
function handleSignOut(router: ReturnType<typeof useRouter>) {
  supabase.auth.signOut().then(() => {
    router.push("/");
  }).catch((error) => {
    console.error("Çıkış yapılırken hata:", error);
  });
}

function handleRoleChange(
  role: string,
  setState: React.Dispatch<React.SetStateAction<{
    roles: string[];
    selectedRole: string;
    loading: boolean;
    mobileMenuOpen: boolean;
  }>>,
  router: ReturnType<typeof useRouter>
) {
  setState((prev) => ({ ...prev, selectedRole: role }));
  router.push(ROLE_ROUTES[role].path);
}

function toggleMobileMenu(setState: React.Dispatch<React.SetStateAction<{
  roles: string[];
  selectedRole: string;
  loading: boolean;
  mobileMenuOpen: boolean;
}>>) {
  setState((prev) => ({
    ...prev,
    mobileMenuOpen: !prev.mobileMenuOpen,
  }));
}
