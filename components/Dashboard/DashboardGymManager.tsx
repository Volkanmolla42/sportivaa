"use client";
import { useEffect, useState } from "react";
import { getUserName, getGymsByManager } from "@/contexts/AuthContext";
import type { User } from "@/types/supabase";
import type { BasicUser } from "@/contexts/AuthContext";
import GymDetail from "@/components/Dashboard/GymDetail";
import WelcomeMessage from "./WelcomeMessage";

export default function DashboardGymManager({ userId }: { userId: string }) {
  const [user, setUser] = useState<(User & BasicUser) | null>(null);
  const [gyms, setGyms] = useState<
    { id: string; name: string; city: string }[]
  >([]);
  const [selectedGym, setSelectedGym] = useState<{
    id: string;
    name: string;
    city: string;
  } | null>(null);
  useEffect(() => {
    async function fetchData() {
      const userData = await getUserName(userId);
      setUser({
        ...userData,
        is_trainer: false,
        is_gymmanager: false,
        created_at: "",
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
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
        <div className="mb-4">
          <WelcomeMessage
            firstName={user.first_name || ""}
            lastName={user.last_name || ""}
            role="GymManager"
          />
        </div>
      )}
      <div className="grid gap-4 mb-8">
        <div className="p-4 rounded border bg-card">
          <h2 className="font-semibold mb-2">Sahip Olduğunuz Salonlar</h2>
          {gyms.length === 0 ? (
            <div className="text-muted-foreground">
              Henüz bir salonunuz yok.
            </div>
          ) : (
            <ul className="space-y-2">
              {gyms.map((g) => (
                <li
                  key={g.id}
                  className="border rounded p-3 bg-muted hover:bg-primary/10 cursor-pointer transition"
                  onClick={() => setSelectedGym(g)}
                >
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Şehir: {g.city}
                  </div>
                  <div className="text-xs text-primary mt-1">Detayları Gör</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="grid gap-4">
        <div className="p-4 rounded border bg-card">
          Yakında: Salon üyeleri, rezervasyonlar, istatistikler...
        </div>
      </div>
    </div>
  );
}
