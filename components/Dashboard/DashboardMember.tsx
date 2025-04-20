"use client";
import { memo } from "react";
import { useSupabaseRecord, useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/lib/supabaseClient";
import type { Gym } from "@/types/supabase";
import type { BasicUser } from "@/contexts/AuthContext";
import WelcomeMessage from "./WelcomeMessage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Separate components for better organization
const GymCard = memo(({ gym }: { gym: Gym }) => {
  return (
  <div className="rounded-lg border bg-card p-4 flex flex-col shadow-sm">
    <span className="font-semibold text-lg mb-1">{gym.name}</span>
    <span className="text-muted-foreground">{gym.city}</span>
    {/* İleride salon detayına gitmek için buton/link eklenebilir */}
  </div>
  );
});

GymCard.displayName = "GymCard";

const GymsList = memo(
  ({ gyms, isLoading }: { gyms: Gym[]; isLoading: boolean }) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      );
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
  }
);

GymsList.displayName = "GymsList";

import { useAuth } from "@/contexts/AuthContext";

function DashboardMember() {
  const { user: authUser } = useAuth();
  const userId = authUser?.id;

  // Hooks must be called unconditionally
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useSupabaseRecord<BasicUser>("users", "id", userId ?? "");

  const {
    data: gymsRaw,
    isLoading: isLoadingGyms,
    error: gymsError,
  } = useSupabaseQuery<
    { gym_id: string; gym_name: string; gym_city: string }[]
  >(() =>
    userId
      ? supabase
          .from("gym_users")
          .select("gym_id, gyms(name, city)")
          .eq("user_id", userId)
      : Promise.resolve({ data: null, error: null })
  );

  // Show loading if userId is not ready
  const isAuthLoading = !userId;
  if (isAuthLoading) {
    return <div className="p-6 text-center text-muted-foreground">Kullanıcı bilgisi yükleniyor...</div>;
  }


  // Transform gym data
  const userGyms: Gym[] = gymsRaw
    ? gymsRaw.map((g) => ({
        id: g.gym_id,
        name: g.gym_name,
        city: g.gym_city,
        owner_user_id: null,
      }))
    : [];

  // Combine errors
  const error = userError || gymsError;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Üye Paneli</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error.message || "Veriler yüklenirken bir hata oluştu."}
          </AlertDescription>
        </Alert>
      )}

      {isLoadingUser ? (
        <div className="mb-6">
          <Skeleton className="h-12 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      ) : userData ? (
        <div className="mb-6">
          <WelcomeMessage
            firstName={userData.first_name || ""}
            lastName={userData.last_name || ""}
            role="Member"
          />
        </div>
      ) : null}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Katıldığınız Salonlar</CardTitle>
          </CardHeader>
          <CardContent>
            <GymsList gyms={userGyms} isLoading={isLoadingGyms} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
const MemoizedDashboardMember = memo(DashboardMember);
MemoizedDashboardMember.displayName = "DashboardMember";

export default MemoizedDashboardMember;
