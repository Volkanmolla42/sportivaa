"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSupabaseQuery } from "./useSupabaseQuery";
import { captureError } from "@/services/errorService";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

interface CacheConfig<T> {
  key: string;
  ttl?: number;
  version?: string;
  storage?: Storage;
  onError?: (error: any) => void;
  transform?: (data: any) => T;
  shouldRevalidate?: (cachedData: T) => boolean;
  backgroundUpdate?: boolean;
}

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isStale: boolean;
}

export function useCachedQuery<T = any>(
  queryFn: () => Promise<T>,
  config: CacheConfig<T>
) {
  const {
    key,
    ttl = 5 * 60 * 1000, // 5 minutes default TTL
    version = "1",
    storage = typeof window !== "undefined" ? localStorage : null,
    onError,
    transform,
    shouldRevalidate,
    backgroundUpdate = false,
  } = config;

  const [queryState, setQueryState] = useState<QueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isStale: false,
  });

  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());
  const isMounted = useRef(true);

  // Load cache from storage on mount
  useEffect(() => {
    if (storage) {
      try {
        const storedCache = storage.getItem(`query_cache_${key}`);
        if (storedCache) {
          const entry: CacheEntry<T> = JSON.parse(storedCache);
          if (entry.version === version) {
            cache.current.set(key, entry);
            setQueryState(prev => ({
              ...prev,
              data: entry.data,
              isStale: Date.now() - entry.timestamp > ttl,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading cache:", error);
      }
    }

    return () => {
      isMounted.current = false;
    };
  }, [key, storage, version, ttl]);

  // Save cache to storage
  const persistCache = useCallback(() => {
    if (storage && cache.current.has(key)) {
      try {
        const entry = cache.current.get(key)!;
        storage.setItem(`query_cache_${key}`, JSON.stringify(entry));
      } catch (error) {
        console.error("Error persisting cache:", error);
      }
    }
  }, [key, storage]);

  // Fetch data and update cache
  const fetchData = useCallback(async (suppressLoading = false) => {
    if (!suppressLoading) {
      setQueryState(prev => ({ ...prev, isLoading: true }));
    }

    try {
      const rawData = await queryFn();
      const data = transform ? transform(rawData) : rawData;

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version,
      };

      cache.current.set(key, entry);
      persistCache();

      if (isMounted.current) {
        setQueryState({
          data,
          isLoading: false,
          error: null,
          isStale: false,
        });
      }

      return data;
    } catch (error) {
      captureError(error, {
        component: "useCachedQuery",
        additionalData: { key },
      });

      onError?.(error);

      if (isMounted.current) {
        setQueryState(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }

      throw error;
    }
  }, [key, queryFn, transform, version, onError, persistCache]);

  // Check if cache is valid
  const isCacheValid = useCallback((entry: CacheEntry<T>) => {
    if (entry.version !== version) return false;
    if (Date.now() - entry.timestamp > ttl) return false;
    if (shouldRevalidate && shouldRevalidate(entry.data)) return false;
    return true;
  }, [version, ttl, shouldRevalidate]);

  // Main effect for data fetching
  useEffect(() => {
    const entry = cache.current.get(key);

    if (!entry || !isCacheValid(entry)) {
      fetchData();
    } else if (backgroundUpdate) {
      // If backgroundUpdate is enabled, fetch in background when cache is stale
      const timeSinceLastUpdate = Date.now() - entry.timestamp;
      if (timeSinceLastUpdate > ttl / 2) {
        fetchData(true).catch(() => {}); // Suppress errors in background updates
      }
    }
  }, [key, fetchData, isCacheValid, backgroundUpdate, ttl]);

  // Force refresh function
  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // Clear cache function
  const clearCache = useCallback(() => {
    cache.current.delete(key);
    if (storage) {
      storage.removeItem(`query_cache_${key}`);
    }
    setQueryState({
      data: null,
      isLoading: true,
      error: null,
      isStale: false,
    });
    return fetchData();
  }, [key, storage, fetchData]);

  return {
    ...queryState,
    refresh,
    clearCache,
  };
}

// Helper hook for Supabase queries
export function useSupabaseCachedQuery<T = any>(
  queryBuilder: ReturnType<typeof useSupabaseQuery>,
  config: Omit<CacheConfig<T>, "queryFn">
) {
  return useCachedQuery<T>(
    () => queryBuilder.execute(),
    config
  );
}
