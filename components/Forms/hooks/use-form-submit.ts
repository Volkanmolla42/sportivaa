"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dataService } from "@/services/dataService";
import { FormSubmissionStatus, FormValues } from "../schemas";
import { useAuth } from "@/contexts/AuthContext";

interface UseFormSubmitOptions {
  redirectPath?: string;
  redirectDelay?: number;
}

/**
 * Hook to handle form submission for role addition
 * 
 * @param options Optional configuration for redirection
 * @returns Form submission handler and status
 */
export function useFormSubmit(options: UseFormSubmitOptions = {}) {
  const { redirectPath = "/dashboard", redirectDelay = 2000 } = options;
  const [status, setStatus] = useState<FormSubmissionStatus>({
    isLoading: false,
    error: null,
    success: false,
  });
  const { user, refresh } = useAuth();
  const router = useRouter();

  /**
   * Handles form submission for adding a new role
   */
  const handleSubmit = async (data: FormValues) => {
    if (!user) {
      setStatus({
        isLoading: false,
        error: "Kullanıcı oturum açmamış, lütfen tekrar giriş yapın",
        success: false,
      });
      return;
    }

    setStatus({
      isLoading: true,
      error: null,
      success: false,
    });

    try {
      // Call the appropriate service based on the selected role
      if (data.roleType === "Trainer") {
        const experienceValue = typeof data.experience === "string" 
          ? parseInt(data.experience, 10)
          : data.experience;
          
        await dataService.createTrainerProfile(
          user.id, 
          experienceValue, 
          data.specialty
        );
      } else if (data.roleType === "GymManager") {
        // First update the user to be a gym manager
        await dataService.createGymManagerProfile(user.id);

        // Then create a gym with the provided information
        await dataService.createGym({
          name: data.gymName,
          city: data.city,
          owner_user_id: user.id
        });
      }

      setStatus({
        isLoading: false,
        error: null,
        success: true,
      });

      // Refresh user roles
      await refresh();

      // Redirect to dashboard after a short delay
      if (redirectPath) {
        setTimeout(() => {
          router.push(redirectPath);
        }, redirectDelay);
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setStatus({
          isLoading: false,
          error: (err as { message?: string }).message || "Bir hata oluştu.",
          success: false,
        });
      } else {
        setStatus({
          isLoading: false,
          error: "Rol eklenirken bir hata oluştu.",
          success: false,
        });
      }
    }
  };

  return {
    handleSubmit,
    status,
  };
}
