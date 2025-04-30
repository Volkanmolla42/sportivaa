// Supabase database types and relationships
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type User = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_trainer: boolean;
  is_gymmanager: boolean;
  email: string | null;
  created_at: string;
  avatar_url: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type Gym = {
  id: string;
  name: string;
  city: string;
  address?: string | null;
  phone?: string | null;
  description?: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  owner_user_id: string | null;
  features?: Json | null;
  status?: 'active' | 'inactive' | 'pending' | null;
};

export type GymUser = {
  id: string;
  user_id: string;
  gym_id: string;
  role?: string | null;
  joined_at: string;
  expires_at?: string | null;
  status?: 'active' | 'inactive' | 'pending' | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type Trainer = {
  id: string;
  user_id: string;
  experience: number;
  specialty: string;
  certifications?: Json | null;
  availability?: Json | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TrainerGym = {
  id: string;
  trainer_id: string;
  gym_id: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type Session = {
  id: string;
  trainer_id: string;
  gym_id: string;
  member_id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

// Composite types with relationships
export type UserWithGyms = User & { gyms: Gym[] };
export type GymWithMembers = Gym & { members: User[] };
export type GymWithTrainers = Gym & { trainers: Trainer[] };
export type TrainerWithGyms = Trainer & { gyms: Gym[] };

// Main Database type for Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      gyms: {
        Row: Gym;
        Insert: Omit<Gym, 'created_at'>;
        Update: Partial<Omit<Gym, 'id' | 'created_at'>>;
      };
      gym_users: {
        Row: GymUser;
        Insert: Omit<GymUser, 'id' | 'created_at'>;
        Update: Partial<Omit<GymUser, 'id' | 'created_at'>>;
      };
      trainers: {
        Row: Trainer;
        Insert: Omit<Trainer, 'id' | 'created_at'>;
        Update: Partial<Omit<Trainer, 'id' | 'created_at'>>;
      };
      trainer_gyms: {
        Row: TrainerGym;
        Insert: Omit<TrainerGym, 'id' | 'created_at'>;
        Update: Partial<Omit<TrainerGym, 'id' | 'created_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at'>;
        Update: Partial<Omit<Session, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: unknown;
    };
    Enums: {
      [key: string]: unknown;
    };
  };
};
