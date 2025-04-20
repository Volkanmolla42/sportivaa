"use client";
import { useEffect, useState, useCallback } from "react";
import { getUserName, getTrainerProfile } from "@/contexts/AuthContext";
import type { BasicUser } from "@/contexts/AuthContext";
import WelcomeMessage from "./WelcomeMessage";





const TrainerInfo = ({
  experience,
  specialty,
}: {
  experience: number;
  specialty: string;
}) => (
  <div className="p-4 rounded-lg border bg-card">
    <h2 className="text-xl font-semibold mb-4">Eğitmen Profili</h2>
    <div className="space-y-3">
      <div>
        <span className="font-medium">Deneyim:</span> {experience} yıl
      </div>
      <div>
        <span className="font-medium">Uzmanlık Alanı:</span> {specialty}
      </div>
    </div>
  </div>
);

const TrainerFutureFeatures = () => (
  <div className="p-4 rounded-lg border bg-card">
    <h2 className="text-xl font-semibold mb-4">Yakında</h2>
    <ul className="text-muted-foreground space-y-1">
      <li>Dersler, üyeler, takvim, gelişim takibi...</li>
    </ul>
  </div>
);

import { useAuth } from "@/contexts/AuthContext";

export default function DashboardTrainer() {
  const { user } = useAuth(); // Supabase Auth user
  const userId = user?.id;

  const [state, setState] = useState<{
    dbUser: BasicUser | null;
    trainerProfile: { experience: number; specialty: string } | null;
    isLoading: boolean;
    error: string | null;
  }>({
    dbUser: null,
    trainerProfile: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const [dbUserData, trainerData] = await Promise.all([
        getUserName(userId),
        getTrainerProfile(userId),
      ]);
      setState({
        dbUser: dbUserData,
        trainerProfile: trainerData,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      setState({
        dbUser: null,
        trainerProfile: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.",
      });
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!userId) {
    return <div className="p-6 text-center text-muted-foreground">Kullanıcı bilgisi yükleniyor...</div>;
  }

  if (state.isLoading) {
    return (
      <div className="p-6 text-center">
        <span className="animate-pulse text-muted-foreground">Yükleniyor...</span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-6 text-center text-destructive">
        Hata: {state.error}
      </div>
    );
  }

  const { dbUser, trainerProfile } = state;

  return (
    <div className="space-y-6">
      {dbUser && (
        <WelcomeMessage
          firstName={dbUser.first_name}
          lastName={dbUser.last_name}
          role="Trainer"
        />
      )}
      {trainerProfile && (
        <TrainerInfo
          experience={trainerProfile.experience}
          specialty={trainerProfile.specialty}
        />
      )}
      <TrainerFutureFeatures />
    </div>
  );
}
