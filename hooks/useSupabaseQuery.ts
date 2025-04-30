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
  select?: (data: any) => T;
};

/**
 * A custom hook for fetching data from Supabase with improved error handling
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
    select,
  } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const query = queryFn();
      const result = await query;
      const data = (result as { data?: unknown }).data;
      const error = (result as { error?: unknown }).error;

      if (error) {
        let errorMessage = "Unknown error";
        if (error && typeof error === "object" && error !== null && "message" in error) {
          errorMessage = (error as {message: string}).message;
        }

        // Handle Supabase's "no rows returned" error gracefully
        if (
          typeof errorMessage === "string" &&
          errorMessage.includes("JSON object requested, multiple (or no) rows returned")
        ) {
          setState(prev => ({
            ...prev,
            data: null,
            isLoading: false,
            error: null,
          }));

          if (onSuccess) {
            onSuccess(null as unknown as T);
          }
          return;
        }

        throw new Error(errorMessage);
      }

      // Transform data if select function is provided
      const transformedData = select ? select(data) : (data as T);

      setState(prev => ({
        ...prev,
        data: transformedData,
        isLoading: false,
        error: null,
      }));

      if (onSuccess) {
        onSuccess(transformedData);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorObj,
      }));

      if (onError) {
        onError(errorObj);
      }
    }
  }, [enabled, queryFn, onSuccess, onError, select]);

  useEffect(() => {
    if (enabled) {
      fetchData();

      if (refetchInterval) {
        const intervalId = setInterval(fetchData, refetchInterval);
        return () => clearInterval(intervalId);
      }
    }
  }, [enabled, fetchData, refetchInterval]);

  return {
    ...state,
    refetch: fetchData,
  };
}

/**
 * A custom hook for fetching a single record from Supabase
 */
export function useSupabaseRecord<T>(
  table: string,
  column: string,
  value: string | number,
  options: QueryOptions<T> = {}
) {
  const queryFn = useCallback(() => {
    return supabase.from(table).select("*").eq(column, value).single();
  }, [table, column, value]);

  return useSupabaseQuery<T>(queryFn, options);
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
