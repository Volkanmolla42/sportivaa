"use client";
import React, { useState } from "react";
import { GymCreateForm } from "@/app/components/GymCreateForm";
import { GymUserAddForm } from "@/app/components/GymUserAddForm";
import { supabase } from "@/lib/supabaseClient";

export default function GymAdminPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [gymId, setGymId] = useState<string>("");
  const [created, setCreated] = useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });
  }, []);

  if (!userId)
    return <div className="flex justify-center items-center min-h-[40vh]">Yönetici girişi gerekli.</div>;

  return (
    <div className="max-w-xl mx-auto space-y-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Salon Yönetimi</h1>
      <GymCreateForm
        ownerUserId={userId}
        onCreated={(id) => {
          setGymId(id);
          setCreated(true);
        }}
      />
      {created && gymId && (
        <div className="mt-8">
          <GymUserAddForm gymId={gymId} addedBy={userId} />
        </div>
      )}
    </div>
  );
}
