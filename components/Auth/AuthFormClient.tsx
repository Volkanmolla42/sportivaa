"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthModeImage from "../../app/auth/AuthModeImage";
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
import Logo from "../home/Logo";

type Mode = "login" | "register";

export default function AuthFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const { signIn, signUp, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isRedirecting = useRef(false);

  // Update URL without full page navigation when mode changes
  const updateMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", newMode);
    window.history.pushState({}, "", url);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRedirecting.current) return;

      if (mode === "login") {
        const result = await signIn(email, password);
        if (result?.user) {
          isRedirecting.current = true;
          router.push("/dashboard");
        }
      } else {
        // Register mode
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();

        if (!trimmedFirstName || !trimmedLastName) {
          setError("Ad ve soyad alanları zorunludur.");
          return;
        }

        await signUp(email, password, trimmedFirstName, trimmedLastName);
        isRedirecting.current = true;
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      isRedirecting.current = false;
    }
  };

  // Memoize the left side content to prevent re-renders
  const leftSideContent = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center p-4 md:p-8">
        <div className="relative w-full h-48 md:h-80">
          <AuthModeImage mode={mode} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mt-4 md:mt-6 text-center">
          {mode === "login"
            ? "Sportif Yolculuğunuza Devam Edin"
            : "Sportiva Ailesine Katılın"}
        </h2>
        <p className="text-center text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
          {mode === "login"
            ? "Hesabınıza giriş yaparak antrenmanlarınızı takip edin, etkinliklere katılın ve spor topluluğumuzla bağlantı kurun."
            : "Hesap oluşturarak kişisel antrenman programınızı oluşturun, spor etkinliklerine katılın ve hedeflerinize ulaşın."}
        </p>
      </div>
    ),
    [mode]
  );

  // Memoize the form content
  const formContent = useMemo(() => {
    return mode === "register" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            Adınız
          </Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required={mode === "register"}
            placeholder="Adınız"
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Soyadınız
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required={mode === "register"}
            placeholder="Soyadınız"
            className="w-full"
            disabled={isLoading}
          />
        </div>
      </div>
    ) : null;
  }, [mode, firstName, lastName, isLoading]);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100">
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <Link href="/">
          <Logo size="large" />
        </Link>
        <div className="relative w-full max-w-4xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {leftSideContent}
            <div>
              <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-xl mx-auto max-w-md md:max-w-none">
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
                  {/* Loading göstergesi kaldırıldı, doğrudan dashboard'a yönlendirme yapılıyor */}
                  <form onSubmit={handleSubmit} className="space-y-4 relative">
                    {formContent}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive" className="py-2">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
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
                        <button
                          type="button"
                          onClick={() => updateMode("register")}
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          disabled={isLoading}
                        >
                          Kayıt Ol
                        </button>
                      </>
                    ) : (
                      <>
                        Zaten hesabın var mı?{" "}
                        <button
                          type="button"
                          onClick={() => updateMode("login")}
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          disabled={isLoading}
                        >
                          Giriş Yap
                        </button>
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
