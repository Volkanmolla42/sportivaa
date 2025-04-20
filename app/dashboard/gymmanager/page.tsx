"use client";

import { User } from "@/types/supabase";
import DashboardGymManager from "@/components/Dashboard/DashboardGymManager";

export default function GymManagerDashboardPage({ user }: { user: User }) {
  if (!user.is_gymmanager) return null;
  return <DashboardGymManager userId={user.id} />;
}
