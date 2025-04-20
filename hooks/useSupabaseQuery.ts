"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

type QueryOptions<T = unknown> = {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  refetchInterval?: number | false;
};

/**
 * A custom hook for fetching data from Supabase with built-in state management
 * @param queryFn Function that returns a Supabase query
 * @param options Query options
 * @returns Query state and refetch function
 */
export function useSupabaseQuery<T>(
  queryFn: () => PromiseLike<{data: unknown; error: unknown}>,
  options: QueryOptions<T> = {}
) {
  const {
    enabled = true,
    onSuccess,
    onError,
    refetchInterval = false,
  } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  // We don't memoize queryFn directly as it causes ESLint warnings
  // Instead, we'll use it directly in fetchData

  // Define the fetchData function
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const query = queryFn();
      const result = await query;
      // Supabase PostgrestResponse tipinde data ve error property'leri var
      const data = (result as { data?: unknown }).data as T | null;
      const error = (result as { error?: unknown }).error;

      let errorMessage = "Unknown error";
      if (error && typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as {message: string}).message;
      }

      if (error) {
        // Handle Supabase's "JSON object requested, multiple (or no) rows returned" error better
        if (
          typeof errorMessage === "string" &&
          errorMessage.includes(
            "JSON object requested, multiple (or no) rows returned"
          )
        ) {
          // In this case there's no data, return null instead of throwing an error
          setState((prev) => {
            if (process.env.NODE_ENV === "development") {
              console.log(
                "useSupabaseQuery: No data found for single() query, returning null"
              );
            }
            return { ...prev, data: null, isLoading: false, error: null };
          });

          if (onSuccess) {
            onSuccess(null as unknown as T);
          }
          return;
        } else {
          // Throw normal error for other errors
          throw new Error(errorMessage);
        }
      }

      // Call setState once and only log in development mode
      setState((prev) => {
        if (process.env.NODE_ENV === "development") {
          console.log("useSupabaseQuery: Data fetched successfully", {
            dataLength: Array.isArray(data) ? data.length : "single record",
          });
        }
        return { ...prev, data, isLoading: false, error: null };
      });

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(data as T);
      }
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      // Call setState once and only log in development mode
      setState((prev) => {
        if (process.env.NODE_ENV === "development") {
          console.error("useSupabaseQuery: Error fetching data", errorObj);
        }
        return { ...prev, isLoading: false, error: errorObj };
      });

      // Call onError callback
      if (onError) {
        onError(errorObj);
      }
    }
  }, [enabled, queryFn, onSuccess, onError]);

  useEffect(() => {
    // Only fetch data if enabled is true
    if (enabled) {
      fetchData();

      // Set up refetch interval if specified
      if (refetchInterval) {
        const intervalId = setInterval(fetchData, refetchInterval);
        return () => clearInterval(intervalId);
      }
    }
  }, [enabled, fetchData, refetchInterval]);

  return {
    ...state,
    refetch: fetchData
  };
}

/**
 * A custom hook for fetching a single record from Supabase
 * @param table Table name
 * @param column Column to filter on
 * @param value Value to filter by
 * @param options Query options
 * @returns Query state and refetch function
 */
export function useSupabaseRecord<T>(
  table: string,
  column: string,
  value: string | number,
  options: QueryOptions<T> = {}
) {
  return useSupabaseQuery<T>(
    () => {
      if (value === "" || value === undefined || value === null) {
        // Don't make a Supabase query, return empty promise (with limit(0))
        return supabase.from(table).select().limit(0) as PromiseLike<{data: unknown; error: unknown}>;
      }
      return supabase.from(table).select().eq(column, value).single() as PromiseLike<{data: unknown; error: unknown}>;
    },
    options
  );
}

/**
 * A custom hook for fetching multiple records from Supabase
 * @param table Table name
 * @param column Column to filter on (optional)
 * @param value Value to filter by (optional)
 * @param options Query options
 * @returns Query state and refetch function
 */
export function useSupabaseRecords<T>(
  table: string,
  column?: string,
  value?: string | number,
  options: QueryOptions<T[]> = {}
) {
  return useSupabaseQuery<T[]>(() => {
    let query = supabase.from(table).select();
    if (column && value !== undefined) {
      query = query.eq(column, value);
    }
    return query as PromiseLike<{data: unknown; error: unknown}>;
  }, options);
}