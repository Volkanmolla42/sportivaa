-- Enable RLS on gyms table
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view gyms
CREATE POLICY \
Anyone
can
view
gyms\
  ON public.gyms
  FOR SELECT
  USING (true);

-- Allow authenticated users to create gyms if they are gym managers
CREATE POLICY \Gym
managers
can
create
gyms\
  ON public.gyms
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
      AND users.is_gymmanager = true
  ));

-- Allow gym owners to update their own gyms
CREATE POLICY \Owners
can
update
their
gyms\
  ON public.gyms
  FOR UPDATE
  USING (owner_user_id = auth.uid());

-- Allow gym owners to delete their own gyms
CREATE POLICY \Owners
can
delete
their
gyms\
  ON public.gyms
  FOR DELETE
  USING (owner_user_id = auth.uid());
