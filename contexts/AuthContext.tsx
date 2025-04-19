"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

// Context veri tipi
type AuthContextType = {
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  user: User | null; // Supabase user objesi
  refreshUserData: () => Promise<void>; // Kullanıcı verilerini yenileme fonksiyonu
  displayName: string; // Görüntülenecek kullanıcı adı
};

// Başlangıç değeri
const initialState: AuthContextType = {
  userId: null,
  isLoading: true,
  error: null,
  user: null,
  refreshUserData: async () => {},
  displayName: "Kullanıcı"
};

// Context oluşturma
const AuthContext = createContext<AuthContextType>(initialState);

// Hook
export const useAuth = () => useContext(AuthContext);

// Kullanıcı adını belirlemek için yardımcı fonksiyon
const getUserDisplayName = (user: User | null): string => {
  if (!user) return "Kullanıcı";
  
  // user_metadata'dan ad bilgisini kontrol et
  const metadata = user.user_metadata;
  if (metadata?.first_name) return metadata.first_name;
  if (metadata?.firstName) return metadata.firstName;
  if (metadata?.name) return metadata.name;
  
  // Email'den kullanıcı adını çıkar
  if (user.email) {
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  
  return "Kullanıcı";
};

// Profile API functions (merged from lib/profileApi)
export async function getUserRoles(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("users")
    .select("is_trainer, is_gymmanager")
    .eq("id", userId)
    .single();
  if (error) throw error;
  const roles = ["Member"];
  if (data?.is_trainer) roles.push("Trainer");
  if (data?.is_gymmanager) roles.push("GymManager");
  return roles;
}

export async function updateUserRole(
  userId: string,
  role: "Trainer" | "GymManager",
  value: boolean
): Promise<void> {
  interface RolePayload {
  is_trainer?: boolean;
  is_gymmanager?: boolean;
}
const payload: RolePayload = {};
  if (role === "Trainer") payload.is_trainer = value;
  if (role === "GymManager") payload.is_gymmanager = value;
  const { error } = await supabase.from("users").update(payload).eq("id", userId);
  if (error) throw error;
}

export async function createGym({
  name,
  address,
  phone,
  owner_user_id,
}: {
  name: string;
  address: string;
  phone: string;
  owner_user_id: string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("gyms")
    .insert([{ name, address, phone, owner_user_id }])
    .select("id")
    .single();
  if (error) throw error;
  return String(data.id);
}

export async function addUserToGym({
  user_id,
  gym_id,
  role,
  added_by,
}: {
  user_id: string;
  gym_id: string;
  role: "Member" | "Trainer";
  added_by: string;
}): Promise<void> {
  const { error } = await supabase
    .from("gym_users")
    .insert([{ user_id, gym_id, role, added_by }]);
  if (error) throw error;
}

export async function getUserGyms(userId: string): Promise<
  { gym_id: string; gym_name: string; gym_city: string }[]
> {
  const { data, error } = await supabase
    .from("gym_users")
    .select("gym_id, gyms(name, city)")
    .eq("user_id", userId);
  if (error) throw error;
  return (
    data?.map((item: { gym_id: string; gyms?: { name?: string; city?: string } | { name?: string; city?: string }[] }) => {
      const gym = Array.isArray(item.gyms) ? item.gyms[0] : item.gyms;
      return {
        gym_id: String(item.gym_id),
        gym_name: gym?.name ?? "",
        gym_city: gym?.city ?? "",
      };
    }) ?? []
  );
}

export async function updateUserName(
  userId: string,
  firstName: string,
  lastName: string
): Promise<void> {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  if (!user) throw new Error("Kullanıcı bulunamadı");
  const { error: dbErr } = await supabase
    .from("users")
    .update({ first_name: firstName, last_name: lastName })
    .eq("id", userId);
  if (dbErr) throw dbErr;
  const { error: metaErr } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      firstName,
      lastName,
    },
  });
  if (metaErr) throw metaErr;
  await supabase.auth.refreshSession();
}

export async function getUserName(
  userId: string
): Promise<{ first_name: string; last_name: string }> {
  const { data, error } = await supabase
    .from("users")
    .select("first_name, last_name")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return { first_name: data.first_name, last_name: data.last_name };
}

export async function registerTrainer(
  userId: string,
  experience: string,
  specialty: string
): Promise<void> {
  const { error } = await supabase
    .from("trainers")
    .insert({ user_id: userId, experience, specialty });
  if (error) throw error;
  await supabase.from("users").update({ is_trainer: true }).eq("id", userId);
}

export async function registerGymManager(
  userId: string,
  gymName: string,
  city: string
): Promise<void> {
  const { error } = await supabase
    .from("gyms")
    .insert({ owner_user_id: userId, name: gymName, city });
  if (error) throw error;
  await supabase
    .from("users")
    .update({ is_gymmanager: true })
    .eq("id", userId);
}

export async function getGymsByManager(
  userId: string
): Promise<{ id: string; name: string; city: string }[]> {
  const { data, error } = await supabase
    .from("gyms")
    .select("id, name, city")
    .eq("owner_user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function getGymMembers(
  gymId: string
): Promise<
  { id: string; first_name: string; last_name: string; email: string }[]
> {
  const { data, error } = await supabase
    .from("gym_users")
    .select("user_id, user:users(first_name, last_name, email)")
    .eq("gym_id", gymId);
  if (error) throw error;
  return (
    data?.map((row: { user_id: string; user?: { first_name?: string; last_name?: string; email?: string } | { first_name?: string; last_name?: string; email?: string }[] }) => {
      const user = Array.isArray(row.user) ? row.user[0] : row.user;
      return {
        id: row.user_id,
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        email: user?.email ?? "",
      };
    }) ?? []
  );
}

export async function addMemberToGym({
  gymId,
  email,
}: {
  gymId: string;
  email: string;
}): Promise<void> {
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
  if (userErr || !userRow) throw new Error("Kullanıcı bulunamadı.");
  const { data: exists } = await supabase
    .from("gym_users")
    .select("id")
    .eq("user_id", userRow.id)
    .eq("gym_id", gymId)
    .maybeSingle();
  if (exists) throw new Error("Bu kullanıcı zaten üye.");
  const { error } = await supabase
    .from("gym_users")
    .insert({ user_id: userRow.id, gym_id: gymId });
  if (error) throw error;
}

export async function getUsersByEmailPrefix(
  prefix: string
): Promise<{ id: string; email: string; first_name: string; last_name: string }[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, first_name, last_name")
    .ilike("email", `${prefix}%`)
    .limit(8);
  if (error) throw error;
  return data ?? [];
}

export async function getTrainerProfile(
  userId: string
): Promise<{ experience: number; specialty: string } | null> {
  const { data, error } = await supabase
    .from("trainers")
    .select("experience, specialty")
    .eq("user_id", userId)
    .single();
  if (error?.code === "PGRST116") return null;
  if (error) throw error;
  return data;
}

export async function getUserSessionWithRoles(): Promise<{
  userId: string | null;
  roles: string[];
}> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { userId: null, roles: [] };
  const roles = await getUserRoles(session.user.id);
  return { userId: session.user.id, roles };
}

// Provider bileşeni
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextType>(initialState);

  // Kullanıcı verilerini yenileme fonksiyonu
  const refreshUserData = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      const user = data.user;
      setState(prevState => ({
        ...prevState,
        userId: user?.id || null,
        user: user || null,
        displayName: getUserDisplayName(user)
      }));
    } catch (err) {
      console.error("Kullanıcı verileri yenilenemedi:", err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setState({
            ...initialState,
            isLoading: false,
            error: error.message,
            refreshUserData
          });
          return;
        }
        
        const user = data.session?.user || null;
        setState({
          userId: user?.id || null,
          isLoading: false,
          error: null,
          user: user,
          refreshUserData,
          displayName: getUserDisplayName(user)
        });
      } catch (err) {
        setState({ 
          userId: null, 
          isLoading: false, 
          error: err instanceof Error ? err.message : "Bilinmeyen hata",
          user: null,
          refreshUserData,
          displayName: "Kullanıcı"
        });
      }
    };

    // Oturumu kontrol et
    checkSession();

    // Oturum değişikliklerini dinle
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      
      // Kullanıcı oturum açtığında veya güncellendiğinde
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setState({
          userId: user?.id || null,
          isLoading: false,
          error: null,
          user: user,
          refreshUserData,
          displayName: getUserDisplayName(user)
        });
      } 
      // Kullanıcı oturumu kapattığında
      else if (event === 'SIGNED_OUT') {
        setState({
          ...initialState,
          isLoading: false,
          refreshUserData
        });
      }
    });

    // Cleanup
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}
