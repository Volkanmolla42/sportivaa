-- users tablosuna email sütunu ekle
alter table public.users add column if not exists email text;

-- email sütununu auth.users ile eşleştirmek için bir trigger veya manuel güncelleme gerekir.
