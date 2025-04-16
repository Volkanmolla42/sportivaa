// Profil sayfası: Rol seçici ve salonlar entegre edildi.
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import CardProfileRole from "@/app/components/CardProfileRole";
import { CardGyms } from "@/app/components/CardGyms";
import { Button } from "@/components/ui/button";
import UserNameStep from "@/app/components/UserNameStep";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [showNameStep, setShowNameStep] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      // Kullanıcıyı getir
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        // Ad/soyad var mı kontrol et
        const { data: nameData } = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('id', data.user.id)
          .single();
        setShowNameStep(!nameData?.first_name || !nameData?.last_name);
        setUser({ id: data.user.id, email: data.user.email ?? "" });
      }
      setLoading(false);
    }
    fetchUser();
  }, [router]);

  function handleLogout() {
    supabase.auth.signOut().then(() => router.replace("/auth/login"));
  }

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
  if (!user) return <div className="text-center py-8">Kullanıcı bulunamadı.</div>;

  if (showNameStep) {
    return <UserNameStep userId={user.id} onComplete={() => setShowNameStep(false)} />;
  }

  // Profil içeriği (roller, salonlar, tema ve çıkış)
  return (
    <main className="flex flex-col items-center py-8 px-2 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <div className="w-full bg-white dark:bg-neutral-800 rounded shadow p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="mb-2">
          <div className="font-semibold">Kullanıcı ID:</div>
          <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">{user.id}</div>
          <div className="font-semibold">E-posta:</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{user.email}</div>
        </div>
        <CardProfileRole userId={user.id} />
        <div className="mt-4">
          <CardGyms userId={user.id} />
        </div>
        <Link
          href="/dashboard"
          className="block w-full mt-4 px-4 py-2 rounded bg-primary text-white text-center font-medium hover:bg-blue-700 transition dark:bg-primary dark:hover:bg-blue-800"
        >
          Dashboard'a Git
        </Link>
        <Button
          variant={"outline"}
          className="w-full mt-2 cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          Tema Değiştir
        </Button>
        <Button
          variant={"link"}
          className="w-full mt-2 cursor-pointer "
          onClick={handleLogout}
        >
          Çıkış Yap
        </Button>
      </div>
    </main>
  );
}
