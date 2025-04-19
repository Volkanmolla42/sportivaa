"use client";

import { useState, useEffect, useCallback } from "react";
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
 * Custom hook for Supabase authentication
 * @returns Authentication state and methods
 */
export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user roles from the database
   * @param userId User ID
   * @returns Array of user roles
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
      return ["Member"]; // Default to Member role if there's an error
    }
  }, []);

  /**
   * Refresh the authentication state
   */
  const refresh = useCallback(async (): Promise<void> => {
    console.log("Auth: Refreshing authentication state...");
    setIsLoading(true);
    setError(null);

    try {
      console.log("Auth: Fetching session from Supabase...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Auth: Session error:", sessionError);
        throw sessionError;
      }

      const currentUser = session?.user ?? null;
      console.log("Auth: Session result:", {
        hasSession: !!session,
        hasUser: !!currentUser,
        userId: currentUser?.id ? `${currentUser.id.substring(0, 8)}...` : null,
        email: currentUser?.email
      });

      setUser(currentUser);

      if (currentUser) {
        console.log("Auth: Fetching roles for user...");
        const userRoles = await fetchRoles(currentUser.id);
        console.log("Auth: User roles:", userRoles);
        setRoles(userRoles);
      } else {
        console.log("Auth: No user, clearing roles");
        setRoles([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Auth: Error refreshing auth state:", errorMessage);
      setError(errorMessage);
    } finally {
      console.log("Auth: Refresh completed, isLoading set to false");
      setIsLoading(false);
    }
  }, [fetchRoles]);

  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @returns Authentication data
   */
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        throw error;
      }

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
   * @param email User email
   * @param password User password
   * @param firstName User first name
   * @param lastName User last name
   */
  const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create the user in Supabase Auth
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
        // Save user data to localStorage for later insertion into the database
        savePendingUserData({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });

        setUser(data.user);
        setRoles(["Member"]); // Default role for new users
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Bilinmeyen bir hata oluştu";

      setError(errorMessage);
      console.error("Kayıt işlemi sırasında hata:", error);
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
      console.error("Çıkış yapılırken hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    console.log("Auth: Initializing auth state on mount");
    refresh();

    // Set up auth state change listener
    console.log("Auth: Setting up auth state change listener");
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth: Auth state changed - Event: ${event}, Has session: ${!!session}`);
      refresh();
    });

    // Clean up listener on unmount
    return () => {
      console.log("Auth: Cleaning up auth state change listener");
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
