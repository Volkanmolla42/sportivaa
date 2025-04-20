"use client";

import { Control, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { CITIES } from "../../constants";
import { FormValues } from "../../schemas";

interface GymManagerFieldsProps {
  control: Control<FormValues>;
  isLoading: boolean;
}

/**
 * Gym Manager-specific form fields component
 */
export default function GymManagerFields({ control, isLoading }: GymManagerFieldsProps) {
  return (
    <div className="space-y-4 p-5 border rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <h3 className="font-medium text-lg text-slate-900 dark:text-slate-100">Salon Bilgileri</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Yönetici olacağınız salon için gerekli bilgileri doldurun. Bu bilgiler üyeler tarafından görüntülenecektir.
      </p>

      <div className="space-y-2">
        <Label htmlFor="gymName" className="flex items-center">
          Salon Adı <span className="text-red-500 ml-1">*</span>
        </Label>
        <Controller
          name="gymName"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                id="gymName"
                placeholder="Örn: Sportiva Fitness Club"
                {...field}
                disabled={isLoading}
                className={fieldState.error ? "border-red-300" : ""}
              />
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center">
          Şehir <span className="text-red-500 ml-1">*</span>
        </Label>
        <Controller
          name="city"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <SelectTrigger 
                  id="city" 
                  className={`w-full ${fieldState.error ? "border-red-300" : ""}`}
                >
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 flex items-start gap-2 mt-4">
        <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Salon Yöneticisi Bilgilendirmesi</p>
          <p className="mt-1">
            Salon yöneticisi rolü ekledikten sonra, salon sayfanızdan daha fazla bilgi ekleyebilir,
            üye ve eğitmen yönetimi yapabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
