"use client";
import { useState } from "react";
import { registerTrainer } from "@/lib/profileApi";

interface TrainerRegisterFormProps {
  userId: string;
  onComplete?: () => void;
}

export default function TrainerRegisterForm({
  userId,
  onComplete,
}: TrainerRegisterFormProps) {
  const [formData, setFormData] = useState({
    experience: "",
    specialty: "",
  });
  const [status, setStatus] = useState({
    isLoading: false,
    error: "",
    success: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const specialtyOptions = [
    "Fitness",
    "Pilates",
    "Yoga",
    "Kişisel Antrenörlük",
    "Fonksiyonel Antrenman",
    "Grup Dersleri",
    "Beslenme",
    "Diğer",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    setStatus({
      isLoading: true,
      error: "",
      success: "",
    });
    
    try {
      // Convert experience to number
      const experienceNumber = parseInt(formData.experience, 10);
      if (isNaN(experienceNumber)) {
        throw new Error("Deneyim yılı geçerli bir sayı olmalıdır.");
      }

      await registerTrainer(userId, experienceNumber.toString(), formData.specialty);
      
      setStatus({
        isLoading: false,
        error: "",
        success: "Eğitmen profili başarıyla oluşturuldu!",
      });
      
      onComplete?.();
    } catch (err: unknown) {
      let errorMsg = "Bir hata oluştu.";
      if (err && typeof err === "object" && "message" in err) {
        errorMsg = (err as { message?: string }).message || errorMsg;
      }
      setStatus({
        isLoading: false,
        error: errorMsg,
        success: "",
      });
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="bg-primary/10 dark:bg-primary/20 p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-center text-primary dark:text-primary-foreground">
            Eğitmen Profili Oluştur
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Deneyim Yılı
            </label>
            <div className="relative">
              <input
                id="experience"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Deneyim yılınızı giriniz"
              />
              <span className="absolute right-3 top-3 text-neutral-500 dark:text-neutral-400 text-sm">
                Yıl
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="specialty" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Uzmanlık Alanı
            </label>
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="" disabled>Uzmanlık alanınızı seçiniz</option>
              {specialtyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formData.specialty === "Diğer" && (
              <input
                type="text"
                name="customSpecialty"
                placeholder="Uzmanlık alanınızı yazınız"
                className="mt-2 block w-full px-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
              />
            )}
          </div>
          
          {status.error && (
            <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {status.error}
            </div>
          )}
          
          {status.success && (
            <div className="p-3 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
              {status.success}
            </div>
          )}
          
          <button
            type="submit"
            disabled={status.isLoading}
            className="w-full px-4 py-3 rounded-md bg-primary hover:bg-primary-dark text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status.isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </span>
            ) : (
              "Eğitmen Olarak Kaydol"
            )}
          </button>
          <button
            type="button"
            onClick={() => onComplete?.()}
            disabled={status.isLoading}
            className="w-full px-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            İptal
          </button>
        </form>
      </div>
    </div>
  );
}