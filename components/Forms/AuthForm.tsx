// Bu dosya, shadcn form ve input bileşenleri ile oluşturulacaktır.
// Yüklemen gereken shadcn bileşenleri: form, input, button, card (isteğe bağlı olarak alert veya toast da eklenebilir)

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  mode: "login" | "register";
  onAuthSuccess?: (userId: string) => void;
}

export default function AuthForm({ mode, onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");
  const router = useRouter();

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
        // Kayıt ol
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { user } = data;
        if (user) {
          onAuthSuccess?.(user.id);
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
    <form
      onSubmit={handleSubmit}
      className="rounded shadow p-6 w-full max-w-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col gap-4"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          E-posta
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-900"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Şifre
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-900"
        />
      </div>
      {hasError && <div className="text-destructive text-sm">{hasError}</div>}
      <Button
        type="submit"
        className="w-full px-4 py-2 rounded bg-primary hover:bg-blue-700 transition dark:bg-primary dark:hover:bg-blue-800"
        disabled={isLoading}
      >
        {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
      </Button>
      <div className="text-center text-sm mt-2">
        {mode === "login" ? (
          <span>
            Hesabın yok mu?{" "}
            <a
              href="/auth/register"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Kayıt Ol
            </a>
          </span>
        ) : (
          <span>
            Zaten hesabın var mı?{" "}
            <a
              href="/auth/login"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Giriş Yap
            </a>
          </span>
        )}
      </div>
    </form>
  );
}
