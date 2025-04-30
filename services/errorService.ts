export type ErrorSeverity = "low" | "medium" | "high" | "critical";

interface ErrorContext {
  userId?: string;
  path?: string;
  component?: string;
  type?: "unhandled_rejection" | "global_error";
  source?: string;
  line?: number;
  column?: number;
  additionalData?: Record<string, unknown>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  timestamp: string;
  context: ErrorContext;
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private errors: ErrorReport[] = [];
  private readonly maxStoredErrors = 100;

  private constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
      window.onerror = this.handleGlobalError;
    }
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.captureError(event.reason, "high", {
      type: "unhandled_rejection",
    });
  };

  private handleGlobalError = (
    message: string | Event,
    source?: string,
    line?: number,
    column?: number,
    error?: Error
  ) => {
    this.captureError(error || message, "high", {
      source,
      line,
      column,
      type: "global_error",
    });
  };

  captureError(
    error: Error | unknown,
    severity: ErrorSeverity = "medium",
    context: ErrorContext = {}
  ): void {
    const errorReport = this.createErrorReport(error, severity, context);
    this.storeError(errorReport);
    void this.notifyError(errorReport);

    if (process.env.NODE_ENV === "development") {
      console.error("[Error Monitor]", errorReport);
    }
  }

  private createErrorReport(
    error: Error | unknown,
    severity: ErrorSeverity,
    context: ErrorContext
  ): ErrorReport {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown error";

    const errorStack = error instanceof Error ? error.stack : undefined;

    return {
      message: errorMessage,
      stack: errorStack,
      severity,
      timestamp: new Date().toISOString(),
      context: {
        path: typeof window !== "undefined" ? window.location.pathname : "",
        ...context,
      },
    };
  }

  private storeError(errorReport: ErrorReport): void {
    this.errors.push(errorReport);
    if (this.errors.length > this.maxStoredErrors) {
      this.errors.shift();
    }
  }

  private async notifyError(errorReport: ErrorReport): Promise<void> {
    if (errorReport.severity === "critical") {
      if (process.env.NODE_ENV === "production") {
        console.error("[CRITICAL ERROR]", errorReport);
      }
    }
  }

  getStoredErrors(): readonly ErrorReport[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Export a singleton instance
export const errorMonitor = ErrorMonitor.getInstance();

// Utility functions for common error handling scenarios
export function captureError(
  error: Error | unknown,
  context: ErrorContext = {}
): void {
  errorMonitor.captureError(error, "medium", context);
}

export function captureCriticalError(
  error: Error | unknown,
  context: ErrorContext = {}
): void {
  errorMonitor.captureError(error, "critical", context);
}

export function withErrorCapture<T extends (...args: any[]) => Promise<unknown>>(
  fn: T,
  context: ErrorContext = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return (await fn(...args)) as ReturnType<T>;
    } catch (error) {
      errorMonitor.captureError(error, "medium", context);
      throw error;
    }
  };
}
