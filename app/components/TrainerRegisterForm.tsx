"use client";
import { useState } from "react";
import { registerTrainer } from "@/lib/profileApi";

interface TrainerRegisterFormProps {
  userId: string;
  onComplete?: () => void;
}

export default function TrainerRegisterForm({ userId, onComplete }: TrainerRegisterFormProps) {
  const [experience, setExperience] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await registerTrainer(userId, experience, specialty);
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
        <label htmlFor="experience" className="block text-sm font-medium mb-1">Kaç yıl deneyiminiz var?</label>
        <input
          id="experience"
          type="number"
          min="0"
          value={experience}
          onChange={e => setExperience(e.target.value)}
          required
          className="block w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-900"
        />
      </div>
      <div>
        <label htmlFor="specialty" className="block text-sm font-medium mb-1">Uzmanlık alanınız nedir?</label>
        <input
          id="specialty"
          type="text"
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
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
        Eğitmen Olarak Kaydol
      </button>
    </form>
  );
}
