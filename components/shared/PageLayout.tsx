"use client";

import { ReactNode } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingState } from "./LoadingState";
import type { UserRole } from "@/contexts/AuthContext";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  requiredRoles?: UserRole[];
  showLoadingState?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  title,
  requiredRoles = [],
  showLoadingState = true,
  className,
}: PageLayoutProps) {
  const { isLoading, isAuthorized } = useProtectedRoute({
    requiredRoles,
  });

  if (isLoading && showLoadingState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle redirect
  }

  return (
    <ErrorBoundary>
      <div className={className}>
        {title && (
          <header className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </header>
        )}
        <main>{children}</main>
      </div>
    </ErrorBoundary>
  );
}
