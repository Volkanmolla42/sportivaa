// Supabase veritabanı tipleri
// Bu dosya, ana tablolar ve ilişkiler için temel TypeScript tiplerini içerir.

export type User = {
  id: string; // uuid
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  is_trainer: boolean;
  is_gymmanager: boolean;
  email?: string | null;
  created_at: string;
};

export type Gym = {
  id: string;
  name: string;
  city: string;
  created_at?: string | null;
  owner_user_id?: string | null;
};

export type GymUser = {
  id: string;
  user_id: string;
  gym_id: string;
  joined_at?: string | null;
};

export type Trainer = {
  id: string;
  user_id: string;
  experience: number;
  specialty: string;
  created_at?: string | null;
};

// İlişkili tipler
export type UserWithGyms = User & { gyms: Gym[] };
export type GymWithMembers = Gym & { members: User[] };
