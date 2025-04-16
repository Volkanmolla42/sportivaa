-- Eğitmen bilgileri için trainers tablosu
create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null unique,
  experience int not null,
  specialty text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Hızlı erişim için index
create index if not exists idx_trainers_user_id on public.trainers(user_id);

-- RLS aktif et
alter table public.trainers enable row level security;

-- Herkes tüm antrenörleri görebilsin
create or replace policy "Trainers: anyone can select" on public.trainers
  for select using (true);

-- Sadece kendi adından insert edebilsin
create or replace policy "Trainers: only self can insert" on public.trainers
  for insert with check (auth.uid() = user_id);

-- Sadece kendi kaydını update edebilsin
create or replace policy "Trainers: only self can update" on public.trainers
  for update using (auth.uid() = user_id);

-- Sadece kendi kaydını silebilsin
create or replace policy "Trainers: only self can delete" on public.trainers
  for delete using (auth.uid() = user_id);
