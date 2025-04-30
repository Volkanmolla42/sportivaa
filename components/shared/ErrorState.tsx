"use client";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";

interface ErrorStateProps {
  title?: string;
  error: Error | string | null;
  className?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Bir Hata Oluştu",
  error,
  className,
  onRetry,
}: ErrorStateProps): JSX.Element {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className={cn("w-full p-4", className)}>
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {errorMessage || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."}
        </AlertDescription>
      </Alert>
      {onRetry && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={onRetry}
            className="inline-flex items-center space-x-2"
          >
            <ReloadIcon className="h-4 w-4" />
            <span>Tekrar Dene</span>
          </Button>
        </div>
      )}
    </div>
  );
}
