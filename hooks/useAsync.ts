"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { formatError } from "@/lib/utils";

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showSuccessToast = false,
    showErrorToast = true,
  }: UseAsyncOptions<T> = {}
) {
  const { toast } = useToast();
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const mountedRef = useRef(true);
  const asyncFunctionRef = useRef(asyncFunction);

  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      try {
        const result = await asyncFunctionRef.current(...args);

        if (mountedRef.current) {
          setState({
            data: result,
            error: null,
            isLoading: false,
          });

          onSuccess?.(result);

          if (showSuccessToast && successMessage) {
            toast({
              title: successMessage,
              variant: "default",
            });
          }

          return result;
        }
      } catch (error) {
        if (mountedRef.current) {
          const formattedError =
            error instanceof Error ? error : new Error(formatError(error));

          setState({
            data: null,
            error: formattedError,
            isLoading: false,
          });

          onError?.(formattedError);

          if (showErrorToast) {
            toast({
              title: "Hata",
              description: errorMessage || formattedError.message,
              variant: "destructive",
            });
          }

          throw formattedError;
        }
      }
    },
    [onSuccess, onError, successMessage, errorMessage, showSuccessToast, showErrorToast, toast]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
    });
  }, []);

  return {
    execute,
    reset,
    ...state,
  };
}
