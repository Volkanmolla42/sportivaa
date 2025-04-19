// Re-export the ReactQueryProvider from provider.tsx
export { ReactQueryProvider } from "./provider";

// Utility function to create a query key factory
export function createQueryKey<T extends string>(baseKey: T) {
  return {
    all: [baseKey] as const,
    lists: () => [baseKey, "list"] as const,
    list: (filters: Record<string, unknown>) => [baseKey, "list", filters] as const,
    details: () => [baseKey, "detail"] as const,
    detail: (id: string) => [baseKey, "detail", id] as const,
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

