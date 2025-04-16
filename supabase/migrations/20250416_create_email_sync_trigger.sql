-- auth.users tablosuna yeni kayıt eklendiğinde users tablosuna e-posta ve id ekleyen trigger

CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer users tablosunda id yoksa ekle, varsa güncelle
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_user_email ON auth.users;
CREATE TRIGGER trg_sync_user_email
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();
