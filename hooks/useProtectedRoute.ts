"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import type { UserRole } from "@/contexts/AuthContext";

interface UseProtectedRouteOptions {
  requiredRoles?: UserRole[];
  redirectTo?: string;
  shouldRedirect?: boolean;
}

export function useProtectedRoute({
  requiredRoles = [],
  redirectTo = "/auth",
  shouldRedirect = true,
}: UseProtectedRouteOptions = {}) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { roles, isLoading: rolesLoading } = useRole();

  useEffect(() => {
    const checkAccess = () => {
      if (!authLoading && !rolesLoading) {
        const hasAccess =
          user &&
          (requiredRoles.length === 0 ||
            requiredRoles.some((role) => roles.includes(role)));

        if (!hasAccess && shouldRedirect) {
          const searchParams = new URLSearchParams();
          if (typeof window !== "undefined") {
            searchParams.set("redirectTo", window.location.pathname);
          }
          router.replace(
            `${redirectTo}${
              searchParams.toString() ? `?${searchParams.toString()}` : ""
            }`
          );
        }
      }
    };

    checkAccess();
  }, [
    user,
    roles,
    requiredRoles,
    redirectTo,
    shouldRedirect,
    authLoading,
    rolesLoading,
    router,
  ]);

  const isAuthorized =
    user &&
    (requiredRoles.length === 0 ||
      requiredRoles.some((role) => roles.includes(role)));

  return {
    isLoading: authLoading || rolesLoading,
    isAuthorized,
    user,
    roles,
  };
}
