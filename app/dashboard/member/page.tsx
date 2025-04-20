"use client";

import DashboardMember from "@/components/Dashboard/DashboardMember";

export default function MemberDashboardPage() {
  // Auth middleware already handles protection
  return <DashboardMember />;
}
