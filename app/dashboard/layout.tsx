"use client";
import { ReactNode, useEffect, useState, useTransition } from "react";
import { getUserRoles } from "@/lib/profileApi";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ROLE_ROUTES: Record<string, { label: string; path: string }> = {
  GymManager: { label: "Salon Yöneticisi", path: "/dashboard/gymmanager" },
  Trainer: { label: "Eğitmen", path: "/dashboard/trainer" },
  Member: { label: "Üye", path: "/dashboard/member" },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUserAndRoles() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const userRoles = await getUserRoles(user.id);
        setRoles(userRoles);
        const found = Object.entries(ROLE_ROUTES).find(([role, val]) => pathname.startsWith(val.path));
        if (found) setSelectedRole(found[0]);
        else if (userRoles.includes("GymManager")) setSelectedRole("GymManager");
        else if (userRoles.includes("Trainer")) setSelectedRole("Trainer");
        else setSelectedRole("Member");
      }
    }
    fetchUserAndRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function handleRoleChange(role: string) {
    setSelectedRole(role);
    startTransition(() => {
      router.push(ROLE_ROUTES[role].path);
    });
  }

  if (!userId) {
    return <div className="p-8">Lütfen giriş yapın.</div>;
  }
  if (roles.length === 0 || !selectedRole) {
    return <div className="p-8">Yetkiniz yok.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-8 border-b bg-card flex flex-col md:flex-row md:items-center gap-4">
        <label htmlFor="dashboard-role" className="font-medium">Panel Seç:</label>
        <select
          id="dashboard-role"
          className="border rounded px-3 py-2 text-base dark:bg-neutral-900 dark:text-white"
          value={selectedRole}
          onChange={e => handleRoleChange(e.target.value)}
          disabled={isPending}
        >
          {roles.map(role => (
            <option key={role} value={role}>{ROLE_ROUTES[role]?.label || role}</option>
          ))}
        </select>
       
      </div>
      <main className="w-full max-w-5xl mx-auto py-6 px-2">
        {children}
      </main>
    </div>
  );
}
