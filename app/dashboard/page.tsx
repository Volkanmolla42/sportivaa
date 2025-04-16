"use client";
import { useEffect, useState } from "react";
import { getUserRoles } from "@/lib/profileApi";
import DashboardTrainer from "./DashboardTrainer";
import DashboardGymManager from "./DashboardGymManager";
import DashboardMember from "./DashboardMember";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndRoles() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const userRoles = await getUserRoles(user.id);
        setRoles(userRoles);
      }
      setLoading(false);
    }
    fetchUserAndRoles();
  }, []);

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>;
  }
  if (!userId) {
    return <div className="p-8">Lütfen giriş yapın.</div>;
  }
  if (roles.includes("GymManager")) {
    return <DashboardGymManager userId={userId} />;
  }
  if (roles.includes("Trainer")) {
    return <DashboardTrainer userId={userId} />;
  }
  return <DashboardMember userId={userId} />;
}
