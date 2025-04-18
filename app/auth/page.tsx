"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import LogoLink from "@/components/home/Logo";
import AuthModeImage from "./AuthModeImage";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "register" ? "register" : "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push("/profile");
    }
    checkSession();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setHasError("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/profile");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { user } = data;
        if (user) {
          router.push("/profile");
        }
      }
    } catch (err: unknown) {
      setHasError(
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message || "Bir hata oluştu."
          : "Bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100">
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <LogoLink size="large" />

        <div className="relative w-full max-w-4xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:flex flex-col items-center justify-center p-8">
              <div className="relative w-full h-80">
                <AuthModeImage />
              </div>
              <h2 className="text-2xl font-bold mt-6 text-center">
                {mode === "login"
                  ? "Sportif Yolculuğunuza Devam Edin"
                  : "Sportiva Ailesine Katılın"}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
                {mode === "login"
                  ? "Hesabınıza giriş yaparak antrenmanlarınızı takip edin, etkinliklere katılın ve spor topluluğumuzla bağlantı kurun."
                  : "Hesap oluşturarak kişisel antrenman programınızı oluşturun, spor etkinliklerine katılın ve hedeflerinize ulaşın."}
              </p>
            </div>

            <div>
              <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                    {mode === "login"
                      ? "Sportiva'ya Hoş Geldiniz"
                      : "Sportiva'ya Katılın"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {mode === "login"
                      ? "Hesabınıza giriş yaparak spor yolculuğunuza devam edin"
                      : "Yeni bir hesap oluşturarak spor topluluğumuza katılın"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        E-posta
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="ornek@mail.com"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Şifre
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full"
                      />
                    </div>

                    {hasError && (
                      <Alert variant="destructive" className="py-2">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertDescription>{hasError}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {mode === "login"
                            ? "Giriş Yapılıyor..."
                            : "Kayıt Olunuyor..."}
                        </span>
                      ) : (
                        <span>
                          {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-gray-200 dark:border-gray-800 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode === "login" ? (
                      <>
                        Hesabın yok mu?{" "}
                        <Link
                          href="/auth?mode=register"
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Kayıt Ol
                        </Link>
                      </>
                    ) : (
                      <>
                        Zaten hesabın var mı?{" "}
                        <Link
                          href="/auth?mode=login"
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Giriş Yap
                        </Link>
                      </>
                    )}
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
