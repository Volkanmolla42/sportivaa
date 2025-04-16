-- gyms tablosuna owner_user_id sütunu ekle ve mevcut user_id değerlerini taşı
ALTER TABLE public.gyms ADD COLUMN owner_user_id uuid;

-- Eğer user_id sütunu varsa ve veri taşıması gerekiyorsa:
UPDATE public.gyms SET owner_user_id = user_id WHERE owner_user_id IS NULL AND user_id IS NOT NULL;

-- user_id sütununu kaldırmak istersen (isteğe bağlı):
-- ALTER TABLE public.gyms DROP COLUMN user_id;

-- owner_user_id için foreign key ekle
ALTER TABLE public.gyms ADD CONSTRAINT gyms_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
