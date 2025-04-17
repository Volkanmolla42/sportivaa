"use client";
import { ReactNode, useEffect, useState, useTransition } from "react";
import { getUserSessionWithRoles } from "@/lib/profileApi";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSession() {
      setLoading(true);
      const { userId: uid, roles: fetchedRoles } = await getUserSessionWithRoles();
      setUserId(uid);
      setRoles(fetchedRoles);
      if (!uid) {
        setLoading(false);
        return;
      }
      const found = Object.entries(ROLE_ROUTES).find(([role, val]) => pathname.startsWith(val.path));
      if (found) setSelectedRole(found[0]);
      else if (fetchedRoles.includes("GymManager")) setSelectedRole("GymManager");
      else if (fetchedRoles.includes("Trainer")) setSelectedRole("Trainer");
      else setSelectedRole("Member");
      setLoading(false);
    }
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function handleRoleChange(role: string) {
    setSelectedRole(role);
    startTransition(() => {
      router.push(ROLE_ROUTES[role].path);
    });
  }

  if (loading) {
    // Skeleton loading UI
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 md:p-8 border-b bg-card flex flex-col md:flex-row md:items-center gap-4">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-10 w-48" />
        </div>
        <main className="w-full max-w-5xl mx-auto py-6 px-2">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
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
