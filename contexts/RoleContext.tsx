"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import type { UserRole } from "./AuthContext";

interface RoleContextType {
  roles: UserRole[];
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, roles: authRoles, isLoading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("Member");
  const [roles, setRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    if (!authLoading && authRoles.length > 0) {
      setRoles(authRoles);
      // Set selected role to the highest privilege role available
      if (authRoles.includes("GymManager")) {
        setSelectedRole("GymManager");
      } else if (authRoles.includes("Trainer")) {
        setSelectedRole("Trainer");
      } else {
        setSelectedRole("Member");
      }
    } else if (!authLoading && !user) {
      setRoles([]);
      setSelectedRole("Member");
    }
  }, [user, authRoles, authLoading]);

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  return (
    <RoleContext.Provider
      value={{
        roles,
        selectedRole,
        setSelectedRole,
        isLoading: authLoading,
        hasRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
