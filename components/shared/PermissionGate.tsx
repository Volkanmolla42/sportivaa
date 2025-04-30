"use client";

import { ReactNode } from "react";
import { useRole } from "@/contexts/RoleContext";
import type { UserRole } from "@/contexts/AuthContext";

interface PermissionGateProps {
  children: ReactNode;
  roles?: UserRole[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function PermissionGate({
  children,
  roles = [],
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { roles: userRoles, isLoading } = useRole();

  if (isLoading) {
    return null;
  }

  // If no roles are specified, render children
  if (roles.length === 0) {
    return <>{children}</>;
  }

  const hasPermission = requireAll
    ? roles.every((role) => userRoles.includes(role))
    : roles.some((role) => userRoles.includes(role));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
