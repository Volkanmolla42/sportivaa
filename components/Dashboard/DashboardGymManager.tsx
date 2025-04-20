"use client";
import { useEffect, useState } from "react";
import { getGymsByManager } from "@/contexts/AuthContext";

import GymDetail from "@/components/Dashboard/GymDetail";
import WelcomeMessage from "./WelcomeMessage";

import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseRecord } from "@/hooks/useSupabaseQuery";

export default function DashboardGymManager() {
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch DB user info for first_name/last_name
  const {
    data: dbUser,
    isLoading: isLoadingDbUser,
    error: dbUserError,
  } = useSupabaseRecord<import("@/types/supabase").User>("users", "id", userId ?? "");

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
      if (!userId) return;
      const gymsData = await getGymsByManager(userId);
      setGyms(gymsData);
    }
    fetchData();
  }, [userId]);

  // Show loading or unauthorized state if userId is not ready
  if (!userId || isLoadingDbUser) {
    return <div className="p-6 text-center text-muted-foreground">Kullanıcı bilgisi yükleniyor...</div>;
  }

  if (dbUserError) {
    return <div className="p-6 text-center text-destructive">Kullanıcı verisi yüklenirken hata oluştu.</div>;
  }

  if (selectedGym) {
    return <GymDetail gym={selectedGym} onBack={() => setSelectedGym(null)} />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Salon Yöneticisi Paneli</h1>
      {dbUser && (
        <div className="mb-4">
          <WelcomeMessage
            firstName={dbUser.first_name || ""}
            lastName={dbUser.last_name || ""}
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
