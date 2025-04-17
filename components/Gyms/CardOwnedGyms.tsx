"use client";

import React, { useEffect, useState } from "react";
import { getGymsByManager } from "@/lib/profileApi";
import { Skeleton } from "@/components/ui/skeleton";

type OwnedGym = { id: string; name: string; city: string };

const OwnedGymCard = ({ gym }: { gym: OwnedGym }) => (
  <div className="bg-card p-4 rounded-lg shadow hover:shadow-md transition">
    <h4 className="font-semibold text-lg">{gym.name}</h4>
    <p className="text-sm text-muted-foreground">{gym.city}</p>
  </div>
);

export default function CardOwnedGyms({ userId }: { userId: string }) {
  const [state, setState] = useState<{ isLoading: boolean; gyms: OwnedGym[] }>({ isLoading: true, gyms: [] });

  useEffect(() => {
    async function fetchOwned() {
      setState({ isLoading: true, gyms: [] });
      const data = await getGymsByManager(userId);
      setState({ isLoading: false, gyms: data });
    }
    fetchOwned();
  }, [userId]);

  if (state.isLoading) {
    return <div className="p-4 text-center"><Skeleton className="h-4 w-32 mx-auto" /></div>;
  }

  if (!state.gyms.length) {
    return <div className="p-4 text-center text-muted-foreground">Henüz sahip olduğunuz salon yok.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {state.gyms.map((gym) => (
        <OwnedGymCard key={gym.id} gym={gym} />
      ))}
    </div>
  );
}
