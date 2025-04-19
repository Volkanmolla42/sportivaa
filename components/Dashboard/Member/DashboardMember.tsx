"use client";
import { useEffect, useState } from "react";
import { getUserName, getUserGyms } from "@/contexts/AuthContext";
import type { User, Gym } from "@/types/supabase";

// Separate components for better organization
const GymCard = ({ gym }: { gym: Gym }) => (
  <div className="rounded-lg border bg-card p-4 flex flex-col shadow-sm">
    <span className="font-semibold text-lg mb-1">{gym.name}</span>
    <span className="text-muted-foreground">{gym.city}</span>
    {/* İleride salon detayına gitmek için buton/link eklenebilir */}
  </div>
);

const GymsList = ({ gyms, isLoading }: { gyms: Gym[]; isLoading: boolean }) => {
  if (isLoading) {
    return <div className="py-4">Salonlar yükleniyor...</div>;
  }

  if (gyms.length === 0) {
    return (
      <div className="py-4 text-muted-foreground">
        Herhangi bir salona üye değilsiniz.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {gyms.map((gym) => (
        <GymCard key={gym.id} gym={gym} />
      ))}
    </div>
  );
};

export default function DashboardMember({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<{
    user: User | null;
    userGyms: Gym[];
    isLoadingUser: boolean;
    isLoadingGyms: boolean;
    error: string | null;
  }>({
    user: null,
    userGyms: [],
    isLoadingUser: true,
    isLoadingGyms: true,
    error: null,
  });

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserName(userId);
        setUserData((prev) => ({
          ...prev,
          user: data as User,
          isLoadingUser: false,
        }));
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenirken hata:", error);
        setUserData((prev) => ({
          ...prev,
          isLoadingUser: false,
          error: "Kullanıcı bilgileri yüklenirken bir hata oluştu.",
        }));
      }
    }

    fetchUser();
  }, [userId]);

  // Fetch user gyms
  useEffect(() => {
    async function fetchGyms() {
      setUserData((prev) => ({ ...prev, isLoadingGyms: true }));

      try {
        const gymsRaw = await getUserGyms(userId);

        const gyms: Gym[] = gymsRaw.map(
          (g: { gym_id: string; gym_name: string; gym_city: string }) => ({
            id: g.gym_id,
            name: g.gym_name,
            city: g.gym_city,
            owner_user_id: null,
          })
        );

        setUserData((prev) => ({
          ...prev,
          userGyms: gyms,
          isLoadingGyms: false,
        }));
      } catch (err) {
        console.error("Salon bilgileri yüklenirken hata:", err);
        setUserData((prev) => ({
          ...prev,
          userGyms: [],
          isLoadingGyms: false,
          error: "Salon bilgileri yüklenirken bir hata oluştu.",
        }));
      }
    }

    fetchGyms();
  }, [userId]);

  const { user, userGyms, isLoadingUser, isLoadingGyms, error } = userData;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Üye Paneli</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      )}

      {isLoadingUser ? (
        <div className="mb-4">Kullanıcı bilgileri yükleniyor...</div>
      ) : user ? (
        <div className="mb-6 text-lg">
          Hoş geldin,{" "}
          <span className="font-medium">
            {user.first_name} {user.last_name}
          </span>
          !
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="p-4 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-4">Katıldığınız Salonlar</h2>
          <GymsList gyms={userGyms} isLoading={isLoadingGyms} />
        </div>
      </div>
    </div>
  );
}
