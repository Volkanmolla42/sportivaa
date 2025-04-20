"use client";

import { Control, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../schemas";
import { ROLE_INFO } from "../constants";
import RoleInfoCard from "../ui/RoleInfoCard";

interface RoleSelectionProps {
  control: Control<FormValues>;
  availableRoles: Array<"Trainer" | "GymManager">;
  isLoading: boolean;
}

/**
 * Role selection component with interactive role info card
 */
export default function RoleSelection({
  control,
  availableRoles,
  isLoading,
}: RoleSelectionProps) {
  if (availableRoles.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <Controller
        name="roleType"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value as "Trainer" | "GymManager")}
              disabled={isLoading}
            >
              <SelectTrigger 
                className={`w-full ${fieldState.error ? "border-red-300" : ""}`}
              >
                <SelectValue placeholder="Eklemek istediğiniz rolü seçin" />
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
          </div>
        )}
      />

      <Controller
        name="roleType"
        control={control}
        render={({ field }) => (
          field.value ? (
            <RoleInfoCard 
              roleType={field.value as "Trainer" | "GymManager"} 
              className="mt-4 animate-in fade-in-50 duration-300"
            />
          ) : <></>
        )}
      />
    </div>
  );
}
