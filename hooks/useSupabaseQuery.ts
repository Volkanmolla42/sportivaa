"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

type QueryOptions = {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
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
  queryFn: () => PostgrestFilterBuilder<any, any, any[]>,
  options: QueryOptions = {}
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

  // queryFn'i memoize edelim
  const memoizedQueryFn = useCallback(queryFn, []);

  // fetchData fonksiyonunu memoize edelim ve bağımlılıkları azaltalım
  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Sadece isLoading durumunu güncelle, diğer değerleri koru
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await memoizedQueryFn();

      if (error) {
        // Supabase'in "JSON object requested, multiple (or no) rows returned" hatasını daha iyi yönetelim
        if (
          error.message.includes(
            "JSON object requested, multiple (or no) rows returned"
          )
        ) {
          // Bu durumda veri yok, hata fırlatmak yerine null döndürelim
          setState((prev) => {
            if (process.env.NODE_ENV === "development") {
              console.log(
                "useSupabaseQuery: No data found for single() query, returning null"
              );
            }
            return { ...prev, data: null, isLoading: false, error: null };
          });

          if (onSuccess) {
            onSuccess(null);
          }
          return;
        } else {
          // Diğer hatalar için normal hata fırlat
          throw new Error(error.message);
        }
      }

      // setState'i bir kez çağıralım ve sadece development modunda log çıktısı verelim
      setState((prev) => {
        if (process.env.NODE_ENV === "development") {
          console.log("useSupabaseQuery: Data fetched successfully", {
            dataLength: Array.isArray(data) ? data.length : "single record",
          });
        }
        return { ...prev, data, isLoading: false, error: null };
      });

      // onSuccess callback'i çağıralım
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      // setState'i bir kez çağıralım ve sadece development modunda log çıktısı verelim
      setState((prev) => {
        if (process.env.NODE_ENV === "development") {
          console.error("useSupabaseQuery: Error fetching data", errorObj);
        }
        return { ...prev, isLoading: false, error: errorObj };
      });

      // onError callback'i çağıralım
      if (onError) {
        onError(errorObj);
      }
    }
  }, [enabled, memoizedQueryFn]);

  // useEffect içinde fetchData'yı çağırıyoruz
  // fetchData zaten memoize edildiği için sadece enabled değiştiğinde yeniden çalışacak
  useEffect(() => {
    // Sadece enabled true ise veri çek
    if (enabled) {
      fetchData();

      // Set up refetch interval if specified
      if (refetchInterval) {
        const intervalId = setInterval(fetchData, refetchInterval);
        return () => clearInterval(intervalId);
      }
    }
  }, [fetchData, refetchInterval, enabled]);

  return {
    ...state,
    refetch: fetchData,
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
  options: QueryOptions = {}
) {
  return useSupabaseQuery<T>(
    () => supabase.from(table).select().eq(column, value).single(),
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
  options: QueryOptions = {}
) {
  return useSupabaseQuery<T[]>(() => {
    let query = supabase.from(table).select();
    if (column && value !== undefined) {
      query = query.eq(column, value);
    }
    return query;
  }, options);
}
