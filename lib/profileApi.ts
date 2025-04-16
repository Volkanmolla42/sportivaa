import { supabase } from './supabaseClient';

// Kullanıcının rollerini getirir (users tablosundan)
export async function getUserRoles(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('users')
    .select('is_trainer, is_gymmanager')
    .eq('id', userId)
    .single();
  if (error) throw error;
  const roles = ['Member'];
  if (data.is_trainer) roles.push('Trainer');
  if (data.is_gymmanager) roles.push('GymManager');
  return roles;
}

// Kullanıcıya yeni rol ekler veya günceller (users tablosu üzerinden)
export async function updateUserRole(userId: string, role: 'Trainer' | 'GymManager', value: boolean): Promise<void> {
  let updateObj: any = {};
  if (role === 'Trainer') updateObj.is_trainer = value;
  if (role === 'GymManager') updateObj.is_gymmanager = value;
  const { error } = await supabase
    .from('users')
    .update(updateObj)
    .eq('id', userId);
  if (error) throw error;
}

// Spor salonu oluşturur
export async function createGym({ name, address, phone, owner_user_id }: { name: string; address: string; phone: string; owner_user_id: string; }): Promise<string> {
  const { data, error } = await supabase
    .from('gyms')
    .insert([{ name, address, phone, owner_user_id }])
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

// Kullanıcıyı spor salonuna ekler
export async function addUserToGym({ user_id, gym_id, role, added_by }: { user_id: string; gym_id: string; role: 'Member' | 'Trainer'; added_by: string; }): Promise<void> {
  const { error } = await supabase
    .from('gym_users')
    .insert([{ user_id, gym_id, role, added_by }]);
  if (error) throw error;
}

// Kullanıcının bağlı olduğu salonları listeler
export async function getUserGyms(userId: string): Promise<{ gym_id: string; gym_name: string; gym_city: string }[]> {
  const { data, error } = await supabase
    .from('gym_users')
    .select('gym_id, gyms(name, city)')
    .eq('user_id', userId);
  if (error) throw error;
  return data?.map((item: any) => ({
    gym_id: item.gym_id,
    gym_name: item.gyms?.name || '',
    gym_city: item.gyms?.city || '',
  })) || [];
}

// Kullanıcının ad ve soyadını güncelle
export async function updateUserName(userId: string, firstName: string, lastName: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', userId);
  if (error) throw error;
}

// Kullanıcının ad ve soyadını getir
export async function getUserName(userId: string): Promise<{ first_name: string; last_name: string }> {
  const { data, error } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return { first_name: data.first_name, last_name: data.last_name };
}

// Eğitmen kaydı fonksiyonu
export async function registerTrainer(userId: string, experience: string, specialty: string): Promise<void> {
  // trainers tablosuna ekle
  const { error } = await supabase
    .from('trainers')
    .insert({ user_id: userId, experience, specialty });
  if (error) throw error;
  // users tablosunda is_trainer = true yap
  await supabase.from('users').update({ is_trainer: true }).eq('id', userId);
}

// Gym Manager kaydı fonksiyonu
export async function registerGymManager(userId: string, gymName: string, city: string): Promise<void> {
  // gyms tablosuna ekle
  const { error } = await supabase
    .from('gyms')
    .insert({ owner_user_id: userId, name: gymName, city });
  if (error) throw error;
  // users tablosunda is_gymmanager = true yap
  await supabase.from('users').update({ is_gymmanager: true }).eq('id', userId);
}

// Kullanıcının sahip olduğu salonları getirir
export async function getGymsByManager(userId: string): Promise<{ id: string; name: string; city: string }[]> {
  const { data, error } = await supabase
    .from('gyms')
    .select('id, name, city')
    .eq('owner_user_id', userId);
  if (error) throw error;
  return data || [];
}

// Bir salonun üyelerini getirir (ad, soyad, email artık doğrudan users tablosundan)
export async function getGymMembers(gymId: string): Promise<{ id: string; first_name: string; last_name: string; email: string }[]> {
  const { data, error } = await supabase
    .from('gym_users')
    .select('user_id, user:users(first_name, last_name, email)')
    .eq('gym_id', gymId);
  if (error) throw error;
  return (data || []).map((item: any) => ({
    id: item.user_id,
    first_name: item.user?.first_name || '',
    last_name: item.user?.last_name || '',
    email: item.user?.email || '',
  }));
}

// Bir salona üye ekle (email ile, doğrudan users tablosunu kullan)
export async function addMemberToGym({ gymId, email }: { gymId: string; email: string }): Promise<void> {
  // Email ile kullanıcıyı bul (users tablosu)
  const { data: userRow, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  if (userError || !userRow) throw new Error('Kullanıcı bulunamadı.');
  // Zaten üye mi kontrolü
  const { data: exists } = await supabase
    .from('gym_users')
    .select('id')
    .eq('user_id', userRow.id)
    .eq('gym_id', gymId)
    .single();
  if (exists) throw new Error('Bu kullanıcı zaten üye.');
  // Ekle
  const { error } = await supabase
    .from('gym_users')
    .insert({ user_id: userRow.id, gym_id: gymId });
  if (error) throw error;
}

// E-posta prefixine göre kullanıcıları getirir (autocomplete için)
export async function getUsersByEmailPrefix(prefix: string): Promise<{ id: string; email: string; first_name: string; last_name: string }[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name')
    .ilike('email', `${prefix}%`)
    .limit(8);
  if (error) throw error;
  return data || [];
}
