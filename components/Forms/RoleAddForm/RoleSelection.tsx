"use client";

import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_INFO } from "./constants";
import { FormValues } from "./schemas";

interface RoleSelectionProps {
  control: Control<FormValues>;
  availableRoles: Array<"Trainer" | "GymManager">;
  isLoading: boolean;
  error?: string;
}

export default function RoleSelection({
  control,
  availableRoles,
  isLoading,
  error,
}: RoleSelectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="roleType">Eklemek istediğiniz rolü seçin</Label>
      <Controller
        name="roleType"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading}
            >
              <SelectTrigger id="roleType" className="w-full">
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center">
                      {ROLE_INFO[role]?.icon}
                      <span className="ml-2">{ROLE_INFO[role]?.label}</span>
                    </div>
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
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
