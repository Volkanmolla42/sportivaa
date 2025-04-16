"use client";
import { useState } from "react";
import { registerGymManager } from "@/lib/profileApi";

interface GymManagerRegisterFormProps {
  userId: string;
  onComplete?: () => void;
}

export default function GymManagerRegisterForm({ userId, onComplete }: GymManagerRegisterFormProps) {
  const [gymName, setGymName] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await registerGymManager(userId, gymName, city);
      onComplete && onComplete();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto p-4 bg-white dark:bg-neutral-800 border rounded shadow">
      <div>
        <label htmlFor="gymName" className="block text-sm font-medium mb-1">Salon Adı</label>
        <input
          id="gymName"
          type="text"
          value={gymName}
          onChange={e => setGymName(e.target.value)}
          required
          className="block w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-900"
        />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-1">Şehir</label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
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
        Salon Yöneticisi Olarak Kaydol
      </button>
    </form>
  );
}
