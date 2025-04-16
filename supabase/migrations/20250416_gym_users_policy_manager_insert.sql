-- Sadece yöneticiler sahip olduğu salonlara üye ekleyebilsin (INSERT)
-- Gym yöneticisi, gyms tablosunda owner_user_id olarak tanımlı olan kullanıcıdır.

CREATE POLICY "Managers can insert members to their own gyms"
  ON public.gym_users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM gyms
      WHERE gyms.id = gym_users.gym_id
        AND gyms.owner_user_id = auth.uid()
    )
  );

ALTER TABLE public.gym_users ENABLE ROW LEVEL SECURITY;
