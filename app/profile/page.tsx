"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { CardProfileRole, UserNameStep } from "@/components/Profile";
import {
  UserCircle,
  Mail,
  LogOut,
  Palette,
  LayoutDashboard,
  Shield,
  Home,
} from "lucide-react";
import Link from "next/link";
import { CardGyms, CardOwnedGyms } from "@/components/Gyms";

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
      if (error) {
        console.error("Kullanıcı bilgileri alınamadı.:", error);
        return;
      }
      if (data?.user) {
        // Ad/soyad var mı kontrol et
        const { data: nameData } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("id", data.user.id)
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-500 animate-pulse">Profil yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-200 dark:border-red-800 shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-red-700 dark:text-red-400">
            Kullanıcı bulunamadı
          </h2>
          <p className="mt-4 text-center text-red-600 dark:text-red-300">
            Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Giriş Sayfasına Dön</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showNameStep) {
    return (
      <UserNameStep
        userId={user.id}
        onComplete={() => setShowNameStep(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-gradient-to-r from-primary to-blue-600 p-0.5 rounded-full mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-full p-3">
              <UserCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Profil Sayfası</h1>
          <div className="mt-2 text-gray-500 dark:text-gray-400">
            {user.email}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sütun - Kullanıcı Bilgileri */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Hesap Bilgileri</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Kullanıcı ID
                </span>
                <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 break-all">
                  {user.id}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  E-posta Adresi
                </span>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Hızlı İşlemler
              </h3>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard&apos;a Git</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center justify-center gap-2"
              >
                <Palette className="h-4 w-4" />
                <span>{theme === "dark" ? "Açık Tema" : "Koyu Tema"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-600 border-red-200 dark:border-red-800"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıkış Yap</span>
              </Button>
            </div>
          </div>

          {/* Orta ve Sağ Sütun - Roller ve Salonlar */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold">Rolleriniz</h2>
              </div>
              <div className="p-6">
                <CardProfileRole userId={user.id} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold">Üye olduğunuz Salonlar</h2>
              </div>
              <div className="p-6">
                <CardGyms userId={user.id} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold">Sahip Olduğunuz Salonlar</h2>
              </div>
              <div className="p-6">
                <CardOwnedGyms userId={user.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
