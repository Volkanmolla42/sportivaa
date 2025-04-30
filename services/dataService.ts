"use client";

import { QueryBuilder, QueryOptions } from "@/lib/QueryBuilder";
import { supabase } from "@/lib/supabaseClient";
import { ApiError } from "@/lib/apiUtils";
import { eventBus } from "@/lib/eventSystem";
import type { Database } from "@/types/supabase";
import type { BasicUser, BasicGym, TrainerProfile, UserRole } from "@/contexts/AuthContext";

type TableName = keyof Database["public"]["Tables"];

class DataService {
  private static instance: DataService;

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async query<T>(
    table: TableName,
    options: QueryOptions = {}
  ): Promise<{ data: T[]; count: number }> {
    const queryBuilder = new QueryBuilder<T>(table, options);
    const result = await queryBuilder
      .filter()
      .search()
      .sort()
      .paginate()
      .execute();

    if (result.error) {
      throw new ApiError(result.error.message);
    }

    return {
      data: result.data,
      count: result.count,
    };
  }

  async getById<T>(table: TableName, id: string): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new ApiError(error.message);
    }

    return data as T;
  }

  async create<T extends { id?: string }>(
    table: TableName,
    data: Omit<T, "id">
  ): Promise<T> {
    const { data: created, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new ApiError(error.message);
    }

    // Emit event based on table name
    eventBus.emit(`${table}:created`, {
      id: created.id,
      data: created,
    });

    return created as T;
  }

  async update<T>(table: TableName, id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new ApiError(error.message);
    }

    // Emit event based on table name
    eventBus.emit(`${table}:updated`, {
      id,
      changes: data,
    });

    return updated as T;
  }

  async delete(table: TableName, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      throw new ApiError(error.message);
    }

    // Emit event based on table name
    eventBus.emit(`${table}:deleted`, { id });
  }

  async bulkCreate<T>(table: TableName, items: T[]): Promise<T[]> {
    const { data, error } = await supabase.from(table).insert(items).select();

    if (error) {
      throw new ApiError(error.message);
    }

    return data as T[];
  }

  async bulkUpdate<T>(
    table: TableName,
    items: Array<{ id: string } & Partial<T>>
  ): Promise<T[]> {
    // Using transaction to ensure all updates succeed or none do
    const { data, error } = await supabase.rpc("bulk_update", {
      table_name: table,
      records: items,
    });

    if (error) {
      throw new ApiError(error.message);
    }

    return data as T[];
  }

  async count(table: TableName, filters: Record<string, any> = {}): Promise<number> {
    const query = supabase.from(table).select("*", { count: "exact", head: true });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.eq(key, value);
      }
    });

    const { count, error } = await query;

    if (error) {
      throw new ApiError(error.message);
    }

    return count || 0;
  }

  // Method to handle file uploads
  async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<{ path: string; url: string }> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new ApiError(error.message);
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  }

  // Method to handle file deletions
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new ApiError(error.message);
    }
  }

  // Method to get public URL for a file
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  // User-related operations
  async getUserProfile(userId: string): Promise<BasicUser> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, email")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("User not found");

      return {
        id: data.id,
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        email: data.email ?? "",
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  async updateUserProfile(
    userId: string,
    updates: {
      first_name?: string;
      last_name?: string;
      phone?: string | null;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

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
      return ["Member"];
    }
  }

  // Gym-related operations
  async getUserGyms(userId: string): Promise<BasicGym[]> {
    try {
      const { data, error } = await supabase
        .from("gym_users")
        .select(`
          gym_id,
          gyms (
            id,
            name,
            city
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      return (data || []).map(({ gyms }) => ({
        id: gyms.id,
        name: gyms.name ?? "",
        city: gyms.city ?? "",
      }));
    } catch (error) {
      console.error("Error fetching user gyms:", error);
      return [];
    }
  }

  async getManagedGyms(userId: string): Promise<BasicGym[]> {
    try {
      const { data, error } = await supabase
        .from("gyms")
        .select("id, name, city")
        .eq("owner_user_id", userId);

      if (error) throw error;

      return (data || []).map(gym => ({
        id: gym.id,
        name: gym.name ?? "",
        city: gym.city ?? "",
      }));
    } catch (error) {
      console.error("Error fetching managed gyms:", error);
      return [];
    }
  }

  /**
   * Creates a new gym
   */
  async createGym({
    name,
    city,
    owner_user_id,
  }: {
    name: string;
    city: string;
    owner_user_id: string;
  }): Promise<string> {
    try {
      // Input validation
      if (!name?.trim()) {
        throw new Error("Salon adı boş olamaz");
      }
      if (!city?.trim()) {
        throw new Error("Şehir bilgisi boş olamaz");
      }
      if (!owner_user_id) {
        throw new Error("Salon sahibi ID'si gerekli");
      }

      const { data, error } = await supabase
        .from("gyms")
        .insert({
          name: name.trim(),
          city: city.trim(),
          owner_user_id,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error("Bu isimde bir salon zaten mevcut");
        }
        if (error.code === '42501') { // RLS violation
          throw new Error("Bu işlem için yetkiniz yok");
        }
        throw new Error(`Salon oluşturulurken bir hata oluştu: ${error.message}`);
      }

      if (!data?.id) {
        throw new Error("Salon oluşturuldu fakat ID alınamadı");
      }

      return data.id;
    } catch (error) {
      console.error("Error creating gym:", error);
      throw error instanceof Error ? error : new Error("Salon oluşturulurken beklenmeyen bir hata oluştu");
    }
  }

  async getGymMembers(gymId: string): Promise<BasicUser[]> {
    try {
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
    } catch (error) {
      console.error("Error fetching gym members:", error);
      throw error;
    }
  }

  async addMemberToGym({
    gymId,
    email,
  }: {
    gymId: string;
    email: string;
  }): Promise<void> {
    try {
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
    } catch (error) {
      console.error("Error adding member to gym:", error);
      throw error;
    }
  }

  // Trainer-related operations
  async getTrainerProfile(userId: string): Promise<TrainerProfile | null> {
    try {
      const { data, error } = await supabase
        .from("trainers")
        .select("experience, specialty")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.message.includes("no rows")) {
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
      throw error;
    }
  }

  async createTrainerProfile(
    userId: string,
    experience: number,
    specialty: string
  ): Promise<void> {
    try {
      const { error: insertError } = await supabase
        .from("trainers")
        .insert({
          user_id: userId,
          experience,
          specialty,
        });

      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from("users")
        .update({ is_trainer: true })
        .eq("id", userId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error creating trainer profile:", error);
      throw error;
    }
  }

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
  }

  async createGymManagerProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("users")
        .update({ is_gymmanager: true })
        .eq("id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error creating gym manager profile:", error);
      throw error;
    }
  }

  // Search operations
  async searchUsersByEmail(emailPrefix: string): Promise<BasicUser[]> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, email")
        .ilike("email", `${emailPrefix}%`)
        .limit(10);

      if (error) throw error;

      return (data || []).map(u => ({
        id: u.id,
        first_name: u.first_name ?? "",
        last_name: u.last_name ?? "",
        email: u.email ?? "",
      }));
    } catch (error) {
      console.error("Error searching users by email:", error);
      return [];
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
