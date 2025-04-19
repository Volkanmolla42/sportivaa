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
import { SPECIALTY_OPTIONS } from "./constants";
import { FormValues } from "./schemas";

interface TrainerFormProps {
  control: Control<FormValues>;
  isLoading: boolean;
}

export default function TrainerForm({ control, isLoading }: TrainerFormProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg border-slate-200 dark:border-slate-700">
      <h3 className="font-medium text-lg">Eğitmen Bilgileri</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Eğitmen profiliniz için gerekli bilgileri doldurun. Bu bilgiler üyeler tarafından görüntülenecektir.
      </p>

      <div className="space-y-2">
        <Label htmlFor="experience">
          Deneyim (Yıl) <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="experience"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Input
                id="experience"
                type="number"
                min="0"
                placeholder="Örn: 3"
                {...field}
                disabled={isLoading}
              />
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">
          Uzmanlık Alanı <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="specialty"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <SelectTrigger id="specialty" className="w-full">
                  <SelectValue placeholder="Uzmanlık alanınızı seçin" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Eğitmen Profili Bilgilendirmesi</p>
          <p className="mt-1">
            Eğitmen rolü ekledikten sonra, profil sayfanızdan daha fazla bilgi ekleyebilir ve
            antrenman programları oluşturabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
