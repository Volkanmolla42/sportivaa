import { QueryClient, QueryKey, QueryOptions, DefaultOptions } from "@tanstack/react-query";
import { ApiError } from "@/lib/apiUtils";

// Re-export the ReactQueryProvider from provider.tsx
export { ReactQueryProvider } from "./provider";

// Default configuration for React Query
export const defaultQueryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
};

interface QueryKeyFactory<T extends string> {
  all: readonly [T];
  lists: () => readonly [T, "list"];
  list: (filters: Record<string, unknown>) => readonly [T, "list", Record<string, unknown>];
  details: () => readonly [T, "detail"];
  detail: (id: string) => readonly [T, "detail", string];
}

// Utility function to create a query key factory
export function createQueryKey<T extends string>(baseKey: T): QueryKeyFactory<T> {
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

export * from './queryKeys';

// Error handling utility for React Query errors
export function parseQueryError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

// Default query client configuration
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: defaultQueryConfig,
  });
}

// Type-safe mutation options creator
export function createMutationOptions<TData, TError, TVariables, TContext>({
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: {
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => Promise<unknown> | void;
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => Promise<unknown> | void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, context: TContext | undefined) => Promise<unknown> | void;
}) {
  return {
    onMutate,
    onSuccess,
    onError,
    onSettled,
  };
}

// Type-safe query options creator
export function createQueryOptions<TData, TError = Error>({
  enabled = true,
  staleTime,
  cacheTime,
  retry,
  retryDelay,
  refetchOnWindowFocus,
  select,
  onSuccess,
  onError,
  onSettled,
}: Partial<QueryOptions<TData, TError>> = {}): QueryOptions<TData, TError> {
  return {
    enabled,
    staleTime,
    cacheTime,
    retry,
    retryDelay,
    refetchOnWindowFocus,
    select,
    onSuccess,
    onError,
    onSettled,
  };
}

