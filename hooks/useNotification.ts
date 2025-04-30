"use client";

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { eventBus } from "@/lib/eventSystem";
import { useRealtimeSubscription } from "./useRealtimeSubscription";
import { supabase } from "@/lib/supabaseClient";
import { captureError } from "@/services/errorService";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

interface UseNotificationOptions {
  userId: string;
  maxNotifications?: number;
}

export function useNotification({ userId, maxNotifications = 50 }: UseNotificationOptions) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load initial notifications
  useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("userId", userId)
          .order("createdAt", { ascending: false })
          .limit(maxNotifications);

        if (error) throw error;

        setNotifications(data || []);
        setUnreadCount((data || []).filter((n) => !n.read).length);
      } catch (error) {
        captureError(error, {
          component: "useNotification",
          additionalData: { userId },
        });
      }
    };

    loadNotifications();
  }, [userId, maxNotifications]);

  // Subscribe to real-time notifications
  useRealtimeSubscription("notifications", {
    filter: `userId=eq.${userId}`,
    onData: ({ new: newNotification }) => {
      if (newNotification) {
        setNotifications((prev) => {
          const updated = [newNotification, ...prev].slice(0, maxNotifications);
          return updated;
        });

        if (!newNotification.read) {
          setUnreadCount((prev) => prev + 1);

          // Show toast for new notifications
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === "error" ? "destructive" : "default",
          });
        }
      }
    },
    enabled: !!userId,
  });

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .eq("id", notificationId);

        if (error) throw error;

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        captureError(error, {
          component: "useNotification",
          additionalData: { notificationId },
        });

        toast({
          title: "Hata",
          description: "Bildirim durumu güncellenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("userId", userId)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      captureError(error, {
        component: "useNotification",
        additionalData: { userId },
      });

      toast({
        title: "Hata",
        description: "Bildirimler güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [userId, toast]);

  // Delete a notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("id", notificationId);

        if (error) throw error;

        setNotifications((prev) => {
          const updated = prev.filter((n) => n.id !== notificationId);
          const newUnreadCount = updated.filter((n) => !n.read).length;
          setUnreadCount(newUnreadCount);
          return updated;
        });
      } catch (error) {
        captureError(error, {
          component: "useNotification",
          additionalData: { notificationId },
        });

        toast({
          title: "Hata",
          description: "Bildirim silinirken bir hata oluştu",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("userId", userId);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      captureError(error, {
        component: "useNotification",
        additionalData: { userId },
      });

      toast({
        title: "Hata",
        description: "Bildirimler silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [userId, toast]);

  // Create a new notification
  const createNotification = useCallback(
    async (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .insert({
            ...notification,
            read: false,
            createdAt: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        // Note: We don't need to update the state here because the realtime subscription will handle it
        return data;
      } catch (error) {
        captureError(error, {
          component: "useNotification",
          additionalData: { notification },
        });

        toast({
          title: "Hata",
          description: "Bildirim oluşturulurken bir hata oluştu",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    createNotification,
  };
}
