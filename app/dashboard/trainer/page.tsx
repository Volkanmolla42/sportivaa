import { User } from "@/types/supabase";
import DashboardTrainer from "@/components/Dashboard/DashboardTrainer";

export default function TrainerDashboardPage({ user }: { user: User }) {
  if (!user.is_trainer) return null;
  return <DashboardTrainer userId={user.id} />;
}
