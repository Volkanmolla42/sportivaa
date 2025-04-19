"use client";

import { supabase } from "@/lib/supabaseClient";
import type { BasicUser, BasicGym, TrainerProfile, UserRole } from "@/contexts/AuthContext";


/**
 * Data service for fetching and manipulating data from Supabase
 */
export const dataService = {
  /**
   * Returns gyms that a user is a member of (via gym_users join)
   */
  async getUserGyms(
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
  },

  /**
   * Returns user roles
   */
  async getUserRoles(userId: string): Promise<UserRole[]> {
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
  },

  /**
   * Creates a new gym
   */
  async createGym({
    name,
    city,
    address,
    phone,
    owner_user_id,
  }: {
    name: string;
    city: string;
    address: string;
    phone: string;
    owner_user_id: string;
  }): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("gyms")
        .insert({
          name,
          city,
          address,
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
  },

  /**
   * Adds a user to a gym
   */
  async addUserToGym(
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
  },

  /**
   * Searches users by email prefix
   */
  async getUsersByEmailPrefix(
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
  },

  /**
   * Fetches a user's basic info (never null fields)
   */
  async getUserName(userId: string): Promise<BasicUser> {
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
  },

  /**
   * Returns gyms managed by a user (owner_user_id)
   */
  async getGymsByManager(userId: string): Promise<BasicGym[]> {
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
  },

  /**
   * Returns a trainer's profile
   */
  async getTrainerProfile(userId: string): Promise<TrainerProfile | null> {
    try {
      const { data, error } = await supabase
        .from("trainers")
        .select("experience, specialty")
        .eq("user_id", userId)
        .single();
      if (error) {
        // If the error is because the record doesn't exist, return null
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }
      return {
        experience: data.experience ?? 0,
        specialty: data.specialty ?? "",
      };
    } catch (error) {
      console.error("Error fetching trainer profile:", error);
      return null;
    }
  },

  /**
   * Returns all members of a gym with all fields guaranteed string
   */
  async getGymMembers(gymId: string): Promise<BasicUser[]> {
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
  },

  /**
   * Adds a user to a gym by email
   */
  async addMemberToGym({
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
  },

  /**
   * Creates a trainer profile
   */
  async createTrainerProfile(
    userId: string,
    experience: number,
    specialty: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from("trainers").insert({
        user_id: userId,
        experience,
        specialty,
      });
      if (error) throw error;

      // Update the user record to mark as trainer
      const { error: updateError } = await supabase
        .from("users")
        .update({ is_trainer: true })
        .eq("id", userId);
      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error creating trainer profile:", error);
      throw error;
    }
  },

  /**
   * Updates a trainer profile
   */
  async updateTrainerProfile(
    userId: string,
    experience: number,
    specialty: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("trainers")
        .update({ experience, specialty })
        .eq("user_id", userId);
      if (error) throw error;
    } catch (error) {
      console.error("Error updating trainer profile:", error);
      throw error;
    }
  },

  /**
   * Creates a gym manager profile
   */
  async createGymManagerProfile(userId: string): Promise<void> {
    try {
      // Update the user record to mark as gym manager
      const { error } = await supabase
        .from("users")
        .update({ is_gymmanager: true })
        .eq("id", userId);
      if (error) throw error;
    } catch (error) {
      console.error("Error creating gym manager profile:", error);
      throw error;
    }
  },

  /**
   * Updates user profile
   */
  async updateUserProfile(
    userId: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("users")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", userId);
      if (error) throw error;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },
};
