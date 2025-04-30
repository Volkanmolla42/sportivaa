"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

export function LoadingState({
  className,
  message = "Yükleniyor...",
  size = "md"
}: LoadingStateProps): JSX.Element {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-2 p-4",
      className
    )}>
      <Loader2 className={cn("animate-spin text-muted-foreground", sizes[size])} />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
