"use client";

import React, { createContext, useContext, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import type { Gym, Trainer } from "@/types/supabase";
import { supabase } from "@/lib/supabaseClient";

export type UserRole = "Member" | "Trainer" | "GymManager";

export type BasicUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type BasicGym = {
  id: string;
  name: string;
  city: string;
};

export type TrainerProfile = {
  experience: number;
  specialty: string;
};

interface AuthContextType {
  user: User | null;
  roles: UserRole[];
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ user: User | null } | undefined>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: [],
  isLoading: true,
  error: null,
  signIn: async () => undefined,
  signUp: async () => {},
  signOut: async () => {},
  refresh: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useSupabaseAuth();

  // Subscribe to auth state changes and session sync
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      auth.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Helper functions for role-based operations
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("is_trainer, is_gymmanager")
      .eq("id", userId)
      .single();
    if (error) throw error;

    const roles: UserRole[] = ["Member"];
    if (data.is_trainer) roles.push("Trainer");
    if (data.is_gymmanager) roles.push("GymManager");
    return roles;
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return ["Member"];
  }
}

export async function getUserName(userId: string): Promise<BasicUser> {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .eq("id", userId)
    .single();
  if (error || !data) throw error ?? new Error("User not found");
  return {
    id: data.id,
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
    email: data.email ?? "",
  };
}

export async function createGym({
  name,
  city,
  phone,
  owner_user_id,
}: {
  name: string;
  city: string;
  phone: string;
  owner_user_id: string;
}): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("gyms")
      .insert({
        name,
        city,
        phone,
        owner_user_id,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error creating gym:", error);
    throw error;
  }
}

export async function getGymMembers(gymId: string): Promise<BasicUser[]> {
  const { data: gymUsers, error: gyError } = await supabase
    .from("gym_users")
    .select("user_id")
    .eq("gym_id", gymId);
  if (gyError) throw gyError;

  const userIds = gymUsers?.map(g => g.user_id) || [];
  if (userIds.length === 0) return [];

  const { data: users, error: uError } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .in("id", userIds);
  if (uError) throw uError;

  return (users || []).map(u => ({
    id: u.id,
    first_name: u.first_name ?? "",
    last_name: u.last_name ?? "",
    email: u.email ?? "",
  }));
}

export async function addMemberToGym({
  gymId,
  email,
}: {
  gymId: string;
  email: string;
}): Promise<void> {
  const { data: user, error: uErr } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
  if (uErr || !user) throw uErr ?? new Error("User not found");

  const { error: iErr } = await supabase
    .from("gym_users")
    .insert({ gym_id: gymId, user_id: user.id });
  if (iErr) throw iErr;
}

export async function getGymsByManager(userId: string): Promise<BasicGym[]> {
  const { data, error } = await supabase
    .from("gyms")
    .select("id, name, city")
    .eq("owner_user_id", userId);
  if (error) throw error;
  return (data || []).map(g => ({
    id: g.id,
    name: g.name ?? "",
    city: g.city ?? "",
  }));
}

export async function getTrainerProfile(userId: string): Promise<TrainerProfile> {
  const { data, error } = await supabase
    .from("trainers")
    .select("experience, specialty")
    .eq("user_id", userId)
    .single();
  if (error || !data) throw error ?? new Error("Profile not found");
  return {
    experience: data.experience ?? 0,
    specialty: data.specialty ?? "",
  };
}

export async function getUsersByEmailPrefix(
  emailPrefix: string
): Promise<BasicUser[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email")
      .ilike("email", `${emailPrefix}%`)
      .limit(10);
    if (error) throw error;
    return data?.map(u => ({
      id: u.id,
      first_name: u.first_name ?? "",
      last_name: u.last_name ?? "",
      email: u.email ?? "",
    })) || [];
  } catch (error) {
    console.error("Error searching users by email:", error);
    return [];
  }
}
