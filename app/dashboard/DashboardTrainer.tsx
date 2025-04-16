"use client";
import { useEffect, useState } from "react";
import { getUserName } from "@/lib/profileApi";
import type { User } from "@/types/supabase";

// Küçük, tekrar kullanılabilir bileşenler
const TrainerWelcome = ({ user }: { user: User }) => (
  <div className="mb-6 text-lg">
    Hoş geldin, <span className="font-medium">{user.first_name} {user.last_name}</span>!
  </div>
);

const TrainerInfo = () => (
  <div className="p-4 rounded-lg border bg-card">
    <h2 className="text-xl font-semibold mb-4">Yakında</h2>
    <ul className="text-muted-foreground space-y-1">
      <li>Dersler, üyeler, takvim, gelişim takibi...</li>
    </ul>
  </div>
);

export default function DashboardTrainer({ userId }: { userId: string }) {
  const [state, setState] = useState<{
    user: User | null;
    isLoading: boolean;
    error: string | null;
  }>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserName(userId);
        setState({ user: data as User, isLoading: false, error: null });
      } catch (error) {
        setState({ user: null, isLoading: false, error: "Kullanıcı bilgileri yüklenirken bir hata oluştu." });
      }
    }
    fetchUser();
  }, [userId]);

  const { user, isLoading, error } = state;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Eğitmen Paneli</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="mb-4">Kullanıcı bilgileri yükleniyor...</div>
      ) : user ? (
        <TrainerWelcome user={user} />
      ) : null}
      <div className="space-y-6">
        <TrainerInfo />
      </div>
    </div>
  );
}
