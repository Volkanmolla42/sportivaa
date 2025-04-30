"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/types/supabase";
import type { BasicUser, BasicGym, TrainerProfile } from "@/contexts/AuthContext";
import { queryKeys, createQueryOptions, createMutationOptions, parseQueryError } from "@/lib/react-query";

type TableName = keyof Database["public"]["Tables"];

// User related hooks
export function useUserProfile(userId: string) {
  const { toast } = useToast();

  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => dataService.getUserProfile(userId),
    ...createQueryOptions<BasicUser>({
      enabled: Boolean(userId),
      onError: (error) => {
        toast({
          title: "Error",
          description: parseQueryError(error),
          variant: "destructive",
        });
      },
    }),
  });
}

export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(`${userId}/roles`),
    queryFn: () => dataService.getUserRoles(userId),
    ...createQueryOptions({
      enabled: Boolean(userId),
    }),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, updates }: {
      userId: string;
      updates: { first_name?: string; last_name?: string; phone?: string | null; }
    }) => dataService.updateUserProfile(userId, updates),
    ...createMutationOptions({
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: parseQueryError(error),
          variant: "destructive",
        });
      },
    }),
  });
}

// Gym related hooks
export function useUserGyms(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(`${userId}/gyms`),
    queryFn: () => dataService.getUserGyms(userId),
    ...createQueryOptions<BasicGym[]>({
      enabled: Boolean(userId),
    }),
  });
}

export function useManagedGyms(userId: string) {
  return useQuery({
    queryKey: queryKeys.gyms.list({ managed: true, userId }),
    queryFn: () => dataService.getManagedGyms(userId),
    ...createQueryOptions<BasicGym[]>({
      enabled: Boolean(userId),
    }),
  });
}

export function useCreateGym() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: { name: string; city: string; owner_user_id: string }) =>
      dataService.createGym(data),
    ...createMutationOptions({
      onSuccess: (_, { owner_user_id }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.gyms.list({ managed: true, userId: owner_user_id }) });
        toast({
          title: "Success",
          description: "Gym created successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: parseQueryError(error),
          variant: "destructive",
        });
      },
    }),
  });
}

export function useGymMembers(gymId: string) {
  return useQuery({
    queryKey: queryKeys.gyms.detail(`${gymId}/members`),
    queryFn: () => dataService.getGymMembers(gymId),
    ...createQueryOptions<BasicUser[]>({
      enabled: Boolean(gymId),
    }),
  });
}

export function useAddGymMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ gymId, email }: { gymId: string; email: string }) =>
      dataService.addMemberToGym({ gymId, email }),
    ...createMutationOptions({
      onSuccess: (_, { gymId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.gyms.detail(`${gymId}/members`) });
        toast({
          title: "Success",
          description: "Member added successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: parseQueryError(error),
          variant: "destructive",
        });
      },
    }),
  });
}

// Trainer related hooks
export function useTrainerProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.trainers.detail(userId),
    queryFn: () => dataService.getTrainerProfile(userId),
    ...createQueryOptions<TrainerProfile | null>({
      enabled: Boolean(userId),
    }),
  });
}

export function useCreateTrainerProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, experience, specialty }: {
      userId: string;
      experience: number;
      specialty: string;
    }) => dataService.createTrainerProfile(userId, experience, specialty),
    ...createMutationOptions({
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.trainers.detail(userId) });
        toast({
          title: "Success",
          description: "Trainer profile created successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: parseQueryError(error),
          variant: "destructive",
        });
      },
    }),
  });
}

export function useUpdateTrainerProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, experience, specialty }: {
      userId: string;
      experience: number;
      specialty: string;
    }) => dataService.updateTrainerProfile(userId, experience, specialty),
    ...createMutationOptions({
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.trainers.detail(userId) });
        toast({
          title: "Success",
          description: "Trainer profile updated successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: parseQueryError(error),
          variant: "destructive",
        });
      },
    }),
  });
}

// Generic data hooks
export function useTableData<T>(
  table: TableName,
  options: {
    page?: number;
    limit?: number;
    filters?: Record<string, unknown>;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: { column: string; query: string };
    enabled?: boolean;
  } = {}
) {
  const { page = 1, limit = 10, filters = {}, sortBy, sortOrder, search, enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.users.list({ table, page, limit, ...filters }),
    queryFn: async () => {
      const result = await dataService.query<T>(table)
        .page(page)
        .limit(limit)
        .filter(filters)
        .sort(sortBy, sortOrder)
        .search(search?.column, search?.query)
        .execute();

      if (result.error) throw result.error;
      return result;
    },
    ...createQueryOptions({
      enabled,
      keepPreviousData: true,
    }),
  });
}

export function useEntityById<T>(table: TableName, id: string) {
  return useQuery({
    queryKey: [table, id],
    queryFn: async () => {
      const result = await dataService.query<T>(table)
        .where("id", "eq", id)
        .single();

      if (result.error) throw result.error;
      return result.data;
    },
    ...createQueryOptions({
      enabled: Boolean(id),
    }),
  });
}
