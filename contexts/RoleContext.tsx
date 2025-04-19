"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface RoleContextType {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
  isRoleLoading: boolean;
}

const RoleContext = createContext<RoleContextType>({
  selectedRole: null,
  setSelectedRole: () => {},
  isRoleLoading: true,
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { roles, isLoading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  // Initialize selected role from available roles when auth is ready
  useEffect(() => {
    if (!authLoading && roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
      setIsRoleLoading(false);
    } else if (!authLoading) {
      setIsRoleLoading(false);
    }
  }, [authLoading, roles, selectedRole]);

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    if (roles.includes(role)) {
      setSelectedRole(role);
    } else {
      console.error(`Role ${role} is not available for this user`);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        selectedRole,
        setSelectedRole: handleRoleChange,
        isRoleLoading,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
