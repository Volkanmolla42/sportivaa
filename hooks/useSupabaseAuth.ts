"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { UserRole } from "@/contexts/AuthContext";
import { savePendingUserData, removePendingUserData } from "@/lib/storageUtils";

interface UseSupabaseAuthReturn {
  user: User | null;
  roles: UserRole[];
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ user: User | null } | undefined>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for Supabase authentication with improved error handling and state management
 */
export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  /**
   * Fetch user roles from the database with error handling
   */
  const fetchRoles = useCallback(async (userId: string): Promise<UserRole[]> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("is_trainer, is_gymmanager")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const userRoles: UserRole[] = ["Member"];
      if (data.is_trainer) userRoles.push("Trainer");
      if (data.is_gymmanager) userRoles.push("GymManager");

      return userRoles;
    } catch (error) {
      console.error("Error fetching user roles:", error);
      return ["Member"];
    }
  }, []);

  /**
   * Refresh authentication state
   */
  const refresh = useCallback(async (): Promise<void> => {
    if (!isInitialized.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userRoles = await fetchRoles(currentUser.id);
        setRoles(userRoles);
      } else {
        setRoles([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      isInitialized.current = true;
    }
  }, [fetchRoles]);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    if (!isInitialized.current) {
      await refresh();
    }
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        const userRoles = await fetchRoles(data.user.id);
        setRoles(userRoles);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Giriş sırasında bir hata oluştu";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with email, password, and user details
   */
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> => {
    if (!isInitialized.current) {
      await refresh();
    }
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        savePendingUserData({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });

        setUser(data.user);
        setRoles(["Member"]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Kayıt sırasında bir hata oluştu";

      setError(errorMessage);
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await supabase.auth.signOut();
      setUser(null);
      setRoles([]);
      removePendingUserData();
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Çıkış yapılırken bir hata oluştu";

      setError(errorMessage);
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state and set up auth state change listener
  useEffect(() => {
    refresh();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      if (isInitialized.current) {
        refresh();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [refresh]);

  return {
    user,
    roles,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    refresh,
  };
}
