"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { FormValues } from "./schemas";
import { dataService } from "@/services/dataService";
import { User } from "@supabase/supabase-js";

interface UseFormSubmitProps {
  user: User | null;
  refresh: () => Promise<void>;
}

export function useFormSubmit({ user, refresh }: UseFormSubmitProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Call the appropriate service based on the selected role
      if (data.roleType === "Trainer") {
        await dataService.createTrainerProfile(
          user.id,
          data.experience,
          data.specialty
        );
      } else if (data.roleType === "GymManager") {
        // First update the user to be a gym manager
        await dataService.createGymManagerProfile(user.id);

        // Then create a gym with the provided information
        const gymId = await dataService.createGym({
          name: data.gymName,
          city: data.city,
          owner_user_id: user.id
        });

        // Add the user as a member of their own gym
        await dataService.addUserToGym(user.id, gymId, "owner");
      }

      setSuccess(true);
      // Refresh user roles
      await refresh();

      // Show success state with progress to 100%
      setProgress(100);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "Bir hata oluştu.");
      } else {
        setError("Rol eklenirken bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    progress,
    setProgress,
    onSubmit,
  };
}
