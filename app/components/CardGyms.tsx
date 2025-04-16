import React, { useEffect, useState } from "react";
import { getUserGyms } from "@/lib/profileApi";

export type CardGymsProps = {
  userId: string;
};

export function CardGyms({ userId }: CardGymsProps) {
  const [gyms, setGyms] = useState<{ gym_id: string; gym_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGyms() {
      setIsLoading(true);
      const data = await getUserGyms(userId);
      setGyms(data);
      setIsLoading(false);
    }
    fetchGyms();
  }, [userId]);

  if (isLoading) {
    return <div className="p-4 text-center">Salonlar yükleniyor...</div>;
  }
  if (!gyms.length)
    return (
      <div className="p-4 border rounded bg-muted text-muted-foreground">
        Herhangi bir spor salonuna bağlı değilsiniz.
      </div>
    );
  return (
    <div className="space-y-2">
      {gyms.map((g) => (
        <div
          key={g.gym_id}
          className="p-4 border rounded flex flex-col md:flex-row md:items-center gap-2 bg-card shadow-sm"
        >
          <div className="font-semibold text-lg">{g.gym_name}</div>
        </div>
      ))}
    </div>
  );
}
