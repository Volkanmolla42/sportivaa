"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import { dataService } from "@/services/dataService";


// User related hooks
export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId || ""),
    queryFn: () => dataService.getUserName(userId || ""),
    enabled: !!userId,
  });
}

export function useUserRoles(userId: string | undefined) {
  return useQuery({
    queryKey: ["userRoles", userId],
    queryFn: () => dataService.getUserRoles(userId || ""),
    enabled: !!userId,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      userId,
      firstName,
      lastName,
    }: {
      userId: string;
      firstName: string;
      lastName: string;
    }) => dataService.updateUserProfile(userId, firstName, lastName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });
    },
  });
}

// Gym related hooks
export function useUserGyms(userId: string | undefined) {
  return useQuery({
    queryKey: ["userGyms", userId],
    queryFn: () => dataService.getUserGyms(userId || ""),
    enabled: !!userId,
  });
}

export function useManagedGyms(userId: string | undefined) {
  return useQuery({
    queryKey: ["managedGyms", userId],
    queryFn: () => dataService.getGymsByManager(userId || ""),
    enabled: !!userId,
  });
}

export function useCreateGym() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (gymData: {
      name: string;
      city: string;
      phone: string;
      owner_user_id: string;
    }) => dataService.createGym(gymData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["managedGyms", variables.owner_user_id],
      });
    },
  });
}

export function useGymMembers(gymId: string | undefined) {
  return useQuery({
    queryKey: ["gymMembers", gymId],
    queryFn: () => dataService.getGymMembers(gymId || ""),
    enabled: !!gymId,
  });
}

export function useAddMemberToGym() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      gymId,
      email,
    }: {
      gymId: string;
      email: string;
    }) => dataService.addMemberToGym({ gymId, email }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["gymMembers", variables.gymId],
      });
    },
  });
}

// Trainer related hooks
export function useTrainerProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["trainerProfile", userId],
    queryFn: () => dataService.getTrainerProfile(userId || ""),
    enabled: !!userId,
  });
}

export function useCreateTrainerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      userId,
      experience,
      specialty,
    }: {
      userId: string;
      experience: number;
      specialty: string;
    }) => dataService.createTrainerProfile(userId, experience, specialty),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trainerProfile", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userRoles", variables.userId],
      });
    },
  });
}

export function useUpdateTrainerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      userId,
      experience,
      specialty,
    }: {
      userId: string;
      experience: number;
      specialty: string;
    }) => dataService.updateTrainerProfile(userId, experience, specialty),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trainerProfile", variables.userId],
      });
    },
  });
}

// Gym Manager related hooks
export function useCreateGymManagerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => dataService.createGymManagerProfile(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ["userRoles", userId],
      });
    },
  });
}
