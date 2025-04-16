"use client";
import { useEffect, useState } from "react";
import { getUserName } from "@/lib/profileApi";

export default function DashboardMember({ userId }: { userId: string }) {
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);
  useEffect(() => {
    async function fetchUser() {
      const data = await getUserName(userId);
      setUser(data);
    }
    fetchUser();
  }, [userId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Üye Paneli</h1>
      {user && (
        <div className="mb-4">Hoş geldin, {user.first_name} {user.last_name}!</div>
      )}
      <div className="grid gap-4">
        <div className="p-4 rounded border bg-card">Yakında: Katıldığınız salonlar, dersler, gelişim takibi...</div>
      </div>
    </div>
  );
}
