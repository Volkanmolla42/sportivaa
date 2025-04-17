import React, { useEffect, useState } from "react";
import { getUserGyms } from "@/lib/profileApi";
import { Skeleton } from "@/components/ui/skeleton";

type GymItem = { gym_id: string; gym_name: string; gym_city: string };

const GymCard = ({ gym }: { gym: GymItem }) => (
  <div className="bg-card p-4 rounded-lg shadow hover:shadow-md transition">
    <h4 className="font-semibold text-lg">{gym.gym_name}</h4>
    <p className="text-sm text-muted-foreground">{gym.gym_city}</p>
  </div>
);

export type CardGymsProps = {
  userId: string;
};

export default function CardGyms({ userId }: CardGymsProps) {
  const [state, setState] = useState<{ isLoading: boolean; gyms: GymItem[] }>({ isLoading: true, gyms: [] });

  useEffect(() => {
    async function fetchGyms() {
      setState({ isLoading: true, gyms: [] });
      const data = await getUserGyms(userId);
      setState({ isLoading: false, gyms: data });
    }
    fetchGyms();
  }, [userId]);

  if (state.isLoading) {
    return <div className="p-4 text-center"><Skeleton className="h-4 w-32 mx-auto" /></div>;
  }

  if (!state.gyms.length) {
    return <div className="p-4 text-center text-muted-foreground">Henüz bir salonunuz yok.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {state.gyms.map((gym) => (
        <GymCard key={gym.gym_id} gym={gym} />
      ))}
    </div>
  );
}
