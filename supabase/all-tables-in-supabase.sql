create table public.gym_users (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  gym_id uuid not null,
  joined_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint gym_users_pkey primary key (id),
  constraint gym_users_user_id_gym_id_key unique (user_id, gym_id),
  constraint gym_users_gym_id_fkey foreign KEY (gym_id) references gyms (id) on delete CASCADE,
  constraint gym_users_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_gym_users_user_id on public.gym_users using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_gym_users_gym_id on public.gym_users using btree (gym_id) TABLESPACE pg_default;



create table public.gyms (
  id uuid not null default gen_random_uuid (),
  name text not null,
  city text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  owner_user_id uuid null,
  constraint gyms_pkey primary key (id),
  constraint gyms_owner_user_id_fkey foreign KEY (owner_user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.trainers (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  experience integer not null,
  specialty text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint trainers_pkey primary key (id),
  constraint trainers_user_id_key unique (user_id),
  constraint trainers_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_trainers_user_id on public.trainers using btree (user_id) TABLESPACE pg_default;


create table public.users (
  id uuid not null,
  first_name text null,
  last_name text null,
  phone text null,
  is_trainer boolean not null default false,
  is_gymmanager boolean not null default false,
  email text null,
  avatar_url text null,
  constraint users_pkey primary key (id),
  constraint users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;