"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "./ErrorBoundary";

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function QueryErrorBoundary({
  children,
  fallback,
}: QueryErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallback={
        fallback || (
          <div className="p-4 text-center">
            <p className="text-red-500">Veri yüklenirken bir hata oluştu.</p>
            <button
              onClick={reset}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Tekrar Dene
            </button>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}
