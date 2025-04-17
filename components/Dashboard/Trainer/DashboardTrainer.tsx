"use client";
import { useEffect, useState, useCallback } from "react";
import { getUserName, getTrainerProfile } from "@/lib/profileApi";
import type { User } from "@/types/supabase";
import { TrainerRegisterForm } from "@/components/Forms";
import { Skeleton } from "@/components/ui/skeleton";

// Küçük, tekrar kullanılabilir bileşenler
const TrainerWelcome = ({ user }: { user: User }) => (
  <div className="mb-6 text-lg">
    Hoş geldin,{" "}
    <span className="font-medium">
      {user.first_name} {user.last_name}
    </span>
    !
  </div>
);

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

export default function DashboardTrainer({ userId }: { userId: string }) {
  const [state, setState] = useState<{
    user: User | null;
    trainerProfile: { experience: number; specialty: string } | null;
    isLoading: boolean;
    error: string | null;
  }>({
    user: null,
    trainerProfile: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const [userData, trainerData] = await Promise.all([
        getUserName(userId),
        getTrainerProfile(userId),
      ]);
      setState({
        user: userData as User,
        trainerProfile: trainerData,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      setState({
        user: null,
        trainerProfile: null,
        isLoading: false,
        error:
          err && typeof err === "object" && "message" in err
            ? (err as { message?: string }).message ||
              "Kullanıcı bilgileri yüklenirken bir hata oluştu."
            : "Kullanıcı bilgileri yüklenirken bir hata oluştu.",
      });
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [userId, fetchData]);

  const { user, trainerProfile, isLoading, error } = state;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Eğitmen Paneli</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <div className="p-4 rounded-lg border bg-card">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      ) : user ? (
        <TrainerWelcome user={user} />
      ) : null}

      {!isLoading && (
        <div className="space-y-6">
          {!trainerProfile ? (
            <div className="p-4 rounded-lg border bg-card">
              <h2 className="text-xl font-semibold mb-4">
                Eğitmen Profili Oluştur
              </h2>
              <p className="mb-4 text-muted-foreground">
                Eğitmen olarak hizmet verebilmek için lütfen profil
                bilgilerinizi tamamlayın.
              </p>
              <TrainerRegisterForm
                userId={userId}
                onComplete={() => fetchData()}
              />
            </div>
          ) : (
            <TrainerInfo
              experience={trainerProfile.experience}
              specialty={trainerProfile.specialty}
            />
          )}

          <TrainerFutureFeatures />
        </div>
      )}
    </div>
  );
}
