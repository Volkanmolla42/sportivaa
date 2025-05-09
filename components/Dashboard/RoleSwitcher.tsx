"use client";

import React from "react";
import { UserRole } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Dumbbell, Building2 } from "lucide-react";

interface RoleSwitcherProps {
  roles: UserRole[];
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

// Role display information mapping
const ROLE_INFO = {
  Member: {
    label: "Üye",
    icon: <User className="w-4 h-4 mr-2" />,
  },
  Trainer: {
    label: "Eğitmen",
    icon: <Dumbbell className="w-4 h-4 mr-2" />,
  },
  GymManager: {
    label: "Salon Yöneticisi",
    icon: <Building2 className="w-4 h-4 mr-2" />,
  },
};

export default function RoleSwitcher({
  roles,
  selectedRole,
  onChange,
}: RoleSwitcherProps) {
  // Convert any role value to UserRole type safely
  const handleRoleChange = React.useCallback((value: string) => {
    // Type guard to ensure value is a valid UserRole
    const isValidRole = (val: string): val is UserRole => {
      return ["Member", "Trainer", "GymManager"].includes(val);
    };

    if (!isValidRole(value)) {
      console.error('RoleSwitcher: Invalid role value:', value);
      return;
    }

    try {
      onChange(value);
    } catch (error) {
      console.error('RoleSwitcher: Error calling onChange:', error);
    }
  }, [onChange]);

  if (!roles || roles.length === 0) return null;

  return (
    <Select
      value={selectedRole}
      onValueChange={handleRoleChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Rol seçin" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            <div className="flex items-center">
              {ROLE_INFO[role]?.icon}
              <span>{ROLE_INFO[role]?.label || role}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
