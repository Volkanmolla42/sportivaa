-- gyms tablosundan user_id sütununu kaldır
ALTER TABLE public.gyms DROP COLUMN IF EXISTS user_id;
