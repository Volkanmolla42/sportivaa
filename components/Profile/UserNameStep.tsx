"use client";
import { useState } from "react";
import { updateUserName } from "@/lib/profileApi";

interface UserNameStepProps {
  userId: string;
  onComplete?: () => void;
}

export default function UserNameStep({ userId, onComplete }: UserNameStepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // error değişkeni kullanılıyor, sorun yok.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await updateUserName(userId, firstName, lastName);
      if (onComplete) onComplete();
    } catch (err: unknown) {
      // err tipi artık unknown, typescript önerisiyle daha güvenli
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "Bir hata oluştu.");
      } else {
        setError("Bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto p-4 bg-white dark:bg-neutral-800 border rounded shadow">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium mb-1">Ad</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
          className="block w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-900"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium mb-1">Soyad</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
          className="block w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-900"
        />
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-blue-700 transition dark:bg-primary dark:hover:bg-blue-800"
        disabled={isLoading}
      >
        Kaydet
      </button>
    </form>
  );
}
