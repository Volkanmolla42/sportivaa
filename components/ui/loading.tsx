"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function Loading({
  size = "md",
  className,
  text,
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex flex-col items-center justify-center";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2
          className={cn("animate-spin text-primary", sizeClasses[size])}
        />
        {text && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
        )}
      </div>
    </div>
  );
}

export function LoadingOverlay({
  text = "Yükleniyor...",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 dark:border-blue-400 border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {text}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Lütfen bekleyin...
        </p>
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-100 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  );
}
