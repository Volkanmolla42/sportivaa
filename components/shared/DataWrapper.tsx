"use client";

import { ReactNode } from "react";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { cn } from "@/lib/utils";

interface DataWrapperProps<T> {
  data: T | null | undefined;
  isLoading: boolean;
  error: Error | null;
  children: (data: NonNullable<T>) => ReactNode;
  loadingMessage?: string;
  emptyMessage?: string;
  className?: string;
  onRetry?: () => void;
}

export function DataWrapper<T>({
  data,
  isLoading,
  error,
  children,
  loadingMessage = "Veriler yükleniyor...",
  emptyMessage = "Gösterilecek veri bulunamadı.",
  className,
  onRetry,
}: DataWrapperProps<T>) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} className={className} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} className={className} />;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        {emptyMessage}
      </div>
    );
  }

  return <>{children(data as NonNullable<T>)}</>;
}
