"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import type { Gym, Trainer } from "@/types/supabase";
import { supabase } from "@/lib/supabaseClient";

export type UserRole = "Member" | "Trainer" | "GymManager";

interface AuthContextType {
  user: User | null;
  roles: UserRole[];
  isLoading: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null } | undefined>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
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

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use the custom hook for Supabase authentication
  const auth = useSupabaseAuth();
  const memoizedAuth = useMemo(() => auth, [auth]);
  return <AuthContext.Provider value={memoizedAuth}>{children}</AuthContext.Provider>;
};

// Types for Dashboard data helpers
// All fields guaranteed to be string (never null/undefined)
export interface BasicUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
export type BasicGym = Pick<Gym, "id" | "name" | "city">;
export type TrainerProfile = Pick<Trainer, "experience" | "specialty">;

// Additional data functions for Dashboard

/**
 * Returns gyms that a user is a member of (via gym_users join)
 */
export async function getUserGyms(
  userId: string
): Promise<{ gym_id: string; gym_name: string; gym_city: string }[]> {
  // Get all gyms where user is a member
  const { data, error } = await supabase
    .from("gym_users")
    .select("gym_id, gyms(name, city)")
    .eq("user_id", userId);
  if (error) throw error;
  if (!data) return [];
  interface GymUserRow {
    gym_id: string;
    gyms: { name: string; city: string } | { name: string; city: string }[];
  }
  return (data || []).map((row: GymUserRow) => ({
    gym_id: row.gym_id,
    gym_name: Array.isArray(row.gyms)
      ? row.gyms[0]?.name ?? ""
      : row.gyms?.name ?? "",
    gym_city: Array.isArray(row.gyms)
      ? row.gyms[0]?.city ?? ""
      : row.gyms?.city ?? "",
  }));
}

// --- Stubs for missing helpers (for type safety and to fix import errors) ---
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
    return ["Member"]; // Default to Member role if there's an error
  }
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
export async function registerGymManager(
  email: string,
  password: string,
  gymId: string
): Promise<void> {
  try {
    // This is a stub implementation
    console.log(
      `Registering gym manager with email: ${email}, password: ${password}, gymId: ${gymId}`
    );
    // Actual implementation would create a user with gym manager role
  } catch (error) {
    console.error("Error registering gym manager:", error);
    throw error;
  }
}
export async function registerTrainer(
  email: string,
  password: string,
  gymId: string
): Promise<void> {
  try {
    // This is a stub implementation
    console.log(
      `Registering trainer with email: ${email}, password: ${password}, gymId: ${gymId}`
    );
    // Actual implementation would create a user with trainer role
  } catch (error) {
    console.error("Error registering trainer:", error);
    throw error;
  }
}
export async function addUserToGym(
  userId: string,
  gymId: string,
  role: string
): Promise<void> {
  try {
    const { error } = await supabase.from("gym_users").insert({
      user_id: userId,
      gym_id: gymId,
      role: role,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error adding user to gym:", error);
    throw error;
  }
}
export async function getUsersByEmailPrefix(
  emailPrefix: string
): Promise<
  { id: string; email: string; first_name: string; last_name: string }[]
> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .ilike("email", `${emailPrefix}%`)
      .limit(10);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error searching users by email:", error);
    return [];
  }
}

/**
 * Fetches a user's basic info (never null fields)
 */
export async function getUserName(userId: string): Promise<BasicUser> {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .eq("id", userId)
    .single();
  if (error || !data) throw error ?? new Error("User not found");

  // Null veya undefined değerleri boş string olarak dönüştür
  // Ayrıca boş stringleri temizle
  const firstName = data.first_name ?? "";
  const lastName = data.last_name ?? "";

  return {
    id: data.id,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: data.email ?? "",
  };
}

/**
 * Returns gyms managed by a user (owner_user_id)
 */
export async function getGymsByManager(userId: string): Promise<BasicGym[]> {
  const { data, error } = await supabase
    .from("gyms")
    .select("id, name, city")
    .eq("owner_user_id", userId);
  if (error) throw error;
  return (data || []).map((g) => ({
    id: g.id,
    name: g.name ?? "",
    city: g.city ?? "",
  }));
}

/**
 * Returns a trainer's profile
 */
export async function getTrainerProfile(
  userId: string
): Promise<TrainerProfile> {
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

/**
 * Returns all members of a gym with all fields guaranteed string
 */
export async function getGymMembers(gymId: string): Promise<BasicUser[]> {
  const { data: gymUsers, error: gyError } = await supabase
    .from("gym_users")
    .select("user_id")
    .eq("gym_id", gymId);
  if (gyError) throw gyError;
  const userIds: string[] = Array.isArray(gymUsers)
    ? gymUsers.map((g: { user_id: string }) => g.user_id)
    : [];
  if (userIds.length === 0) return [];
  const { data: users, error: uError } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .in("id", userIds);
  if (uError) throw uError;
  return (users || []).map((u) => ({
    id: u.id,
    first_name: u.first_name ?? "",
    last_name: u.last_name ?? "",
    email: u.email ?? "",
  }));
}

/**
 * Adds a user to a gym by email
 */
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
