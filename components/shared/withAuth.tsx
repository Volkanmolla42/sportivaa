"use client";

import { ComponentType } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { LoadingState } from "./LoadingState";
import type { UserRole } from "@/contexts/AuthContext";

interface WithAuthOptions {
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  { requiredRoles = [], redirectTo = "/auth" }: WithAuthOptions = {}
) {
  return function WithAuthComponent(props: P) {
    const { isLoading, isAuthorized } = useProtectedRoute({
      requiredRoles,
      redirectTo,
    });

    if (isLoading) {
      return <LoadingState message="Authentication çözümleniyor..." />;
    }

    if (!isAuthorized) {
      return null; // Router will handle redirect
    }

    return <WrappedComponent {...props} />;
  };
}
