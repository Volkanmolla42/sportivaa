"use client";
import { useEffect, useState } from "react";
import { getUserName, getGymsByManager } from "@/lib/profileApi";
import GymDetail from "./GymDetail";

export default function DashboardGymManager({ userId }: { userId: string }) {
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);
  const [gyms, setGyms] = useState<{ id: string; name: string; city: string }[]>([]);
  const [selectedGym, setSelectedGym] = useState<{ id: string; name: string; city: string } | null>(null);
  useEffect(() => {
    async function fetchData() {
      const userData = await getUserName(userId);
      setUser(userData);
      const gymsData = await getGymsByManager(userId);
      setGyms(gymsData);
    }
    fetchData();
  }, [userId]);

  if (selectedGym) {
    return <GymDetail gym={selectedGym} onBack={() => setSelectedGym(null)} />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Salon Yöneticisi Paneli</h1>
      {user && (
        <div className="mb-4">Hoş geldin, {user.first_name} {user.last_name}!</div>
      )}
      <div className="grid gap-4 mb-8">
        <div className="p-4 rounded border bg-card">
          <h2 className="font-semibold mb-2">Sahip Olduğunuz Salonlar</h2>
          {gyms.length === 0 ? (
            <div className="text-muted-foreground">Henüz bir salonunuz yok.</div>
          ) : (
            <ul className="space-y-2">
              {gyms.map((g) => (
                <li key={g.id} className="border rounded p-3 bg-muted hover:bg-primary/10 cursor-pointer transition" onClick={() => setSelectedGym(g)}>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-muted-foreground">Şehir: {g.city}</div>
                  <div className="text-xs text-primary mt-1">Detayları Gör</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="grid gap-4">
        <div className="p-4 rounded border bg-card">Yakında: Salon üyeleri, rezervasyonlar, istatistikler...</div>
      </div>
    </div>
  );
}
