"use client";

import { useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { eventBus } from "@/lib/eventSystem";
import type { Database } from "@/types/supabase";

type TableName = keyof Database["public"]["Tables"];
type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface SubscriptionOptions<T> {
  event?: RealtimeEvent;
  filter?: string;
  onData?: (payload: { new: T; old: T | null }) => void;
  enabled?: boolean;
}

export function useRealtimeSubscription<T = any>(
  table: TableName,
  {
    event = "*",
    filter,
    onData,
    enabled = true,
  }: SubscriptionOptions<T> = {}
) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let channel = supabase
      .channel(`table-${table}-changes`)
      .on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          // Emit event through our event system
          const eventType = `${table}:${payload.eventType.toLowerCase()}`;
          eventBus.emit(eventType as any, {
            id: payload.new?.id,
            data: payload.new,
            oldData: payload.old,
          });

          // Call the onData callback if provided
          if (onData) {
            onData({
              new: payload.new as T,
              old: payload.old as T | null,
            });
          }

          // Invalidate relevant queries
          queryClient.invalidateQueries({
            queryKey: [table],
          });

          // If we have an ID, also invalidate the specific entity query
          if (payload.new?.id) {
            queryClient.invalidateQueries({
              queryKey: [table, payload.new.id],
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, event, filter, onData, enabled, queryClient]);

  return {
    unsubscribe: () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    },
  };
}

// Utility hook for subscribing to specific tables
export function useGymSubscription(gymId: string, options?: Omit<SubscriptionOptions<any>, "filter">) {
  return useRealtimeSubscription("gyms", {
    ...options,
    filter: `id=eq.${gymId}`,
  });
}

export function useGymMembersSubscription(gymId: string, options?: Omit<SubscriptionOptions<any>, "filter">) {
  return useRealtimeSubscription("gym_users", {
    ...options,
    filter: `gym_id=eq.${gymId}`,
  });
}

export function useTrainerProfileSubscription(userId: string, options?: Omit<SubscriptionOptions<any>, "filter">) {
  return useRealtimeSubscription("trainers", {
    ...options,
    filter: `user_id=eq.${userId}`,
  });
}

export function useUserProfileSubscription(userId: string, options?: Omit<SubscriptionOptions<any>, "filter">) {
  return useRealtimeSubscription("users", {
    ...options,
    filter: `id=eq.${userId}`,
  });
}
