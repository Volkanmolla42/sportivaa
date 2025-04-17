"use client";
import { useState } from "react";
import { registerGymManager } from "@/lib/profileApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface GymManagerRegisterFormProps {
  userId: string;
  onComplete?: () => void;
}

export default function GymManagerRegisterForm({ userId, onComplete }: GymManagerRegisterFormProps) {
  const [formData, setFormData] = useState({
    gymName: "",
    city: "",
  });
  
  const [status, setStatus] = useState({
    isLoading: false,
    error: "",
    success: "",
  });

  // Turkish cities list
  const cities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", 
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", 
    "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", 
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", 
    "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", 
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", 
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", 
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt",
    "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
    "Kilis", "Osmaniye", "Düzce"
  ].sort();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    setStatus({
      isLoading: true,
      error: "",
      success: "",
    });
    
    try {
      await registerGymManager(userId, formData.gymName, formData.city);
      
      setStatus({
        isLoading: false,
        error: "",
        success: "Salon yöneticisi profili başarıyla oluşturuldu!",
      });
      
      onComplete?.();
    } catch (err: any) {
      setStatus({
        isLoading: false,
        error: err.message || "Bir hata oluştu.",
        success: "",
      });
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="bg-primary/10 dark:bg-primary/20 p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-center text-primary dark:text-primary-foreground">
            Salon Yöneticisi Profili Oluştur
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label htmlFor="gymName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Salon Adı
            </label>
            <Input
              id="gymName"
              value={formData.gymName}
              onChange={handleChange}
              placeholder="Salon adını giriniz"
              disabled={status.isLoading}
              required
              className="w-full px-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="city" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Şehir
            </label>
            <Select 
              value={formData.city} 
              onValueChange={handleCityChange}
              disabled={status.isLoading}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Şehir seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="submit"
              disabled={status.isLoading}
              className="w-full px-4 py-3"
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
                "Kaydet"
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => onComplete?.()}
              disabled={status.isLoading}
              className="w-full px-4 py-3"
            >
              İptal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}