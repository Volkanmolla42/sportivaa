"use client";

import { Suspense, ComponentType } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingState } from "./LoadingState";

interface WithSuspenseOptions {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingMessage?: string;
}

export function withSuspense<P extends object>(
  WrappedComponent: ComponentType<P>,
  {
    fallback,
    errorFallback,
    loadingMessage = "Yükleniyor...",
  }: WithSuspenseOptions = {}
) {
  return function WithSuspenseComponent(props: P) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Suspense
          fallback={fallback || <LoadingState message={loadingMessage} />}
        >
          <WrappedComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
