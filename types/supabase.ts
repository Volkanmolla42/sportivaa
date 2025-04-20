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
  avatar_url?: string | null;
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

// Supabase ana Database tipi (DRY için tek kaynak!)
export type Database = {
  public: {
    Tables: {
      users: { Row: User };
      gyms: { Row: Gym };
      gym_users: { Row: GymUser };
      trainers: { Row: Trainer };
    };
  };
};
