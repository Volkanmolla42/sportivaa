"use client";

import { User } from "@/types/supabase";
import DashboardMember from "@/components/Dashboard/DashboardMember";

export default function MemberDashboardPage({ user }: { user: User }) {
  return <DashboardMember userId={user.id} />;
}
