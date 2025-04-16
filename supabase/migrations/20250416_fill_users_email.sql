-- users tablosundaki email alanını auth.users ile doldur
update public.users u
set email = a.email
from auth.users a
where u.id = a.id and (u.email is null or u.email = '');
