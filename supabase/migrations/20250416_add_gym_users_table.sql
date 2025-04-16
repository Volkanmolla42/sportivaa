-- Kullanıcıların salonlara üyeliği için gym_users tablosu
create table if not exists public.gym_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  gym_id uuid references gyms(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc', now()),
  unique(user_id, gym_id)
);

-- Hızlı erişim için index
create index if not exists idx_gym_users_user_id on public.gym_users(user_id);
create index if not exists idx_gym_users_gym_id on public.gym_users(gym_id);
