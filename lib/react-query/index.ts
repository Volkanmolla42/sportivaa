"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Utility function to create a query key
export function createQueryKey<T extends string>(baseKey: T) {
  return {
    all: [baseKey] as const,
    lists: () => [...this.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...this.lists(), { filters }] as const,
    details: () => [...this.all, "detail"] as const,
    detail: (id: string) => [...this.details(), id] as const,
  };
}

// Query keys for different entities
export const queryKeys = {
  users: createQueryKey("users"),
  gyms: createQueryKey("gyms"),
  trainers: createQueryKey("trainers"),
  memberships: createQueryKey("memberships"),
  workouts: createQueryKey("workouts"),
  appointments: createQueryKey("appointments"),
};
