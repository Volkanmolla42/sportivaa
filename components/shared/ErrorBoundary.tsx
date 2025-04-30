"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { captureError } from "@/services/errorService";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to error reporting service
    captureError(error, {
      component: "ErrorBoundary",
      additionalData: { errorInfo }
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Bir Hata Oluştu</AlertTitle>
              <AlertDescription>
                {this.state.error?.message || "Üzgünüz, bir şeyler yanlış gitti. Lütfen sayfayı yenilemeyi deneyin."}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button
                onClick={this.handleReset}
                className="space-x-2"
              >
                Sayfayı Yenile
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
