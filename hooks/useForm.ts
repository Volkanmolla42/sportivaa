"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ZodSchema } from "zod";

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  successMessage?: string;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
  onSuccess,
  successMessage = "İşlem başarıyla tamamlandı",
}: UseFormOptions<T>) {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const validateField = useCallback(
    async (name: keyof T, value: unknown): Promise<string> => {
      if (!validationSchema) return "";

      try {
        await validationSchema.parseAsync({
          ...formState.values,
          [name]: value,
        });
        return "";
      } catch (error) {
        if (error instanceof Error && "errors" in error) {
          const zodError = error as { errors: Array<{ path: string[]; message: string }> };
          const fieldError = zodError.errors?.find(
            (e) => e.path[0] === String(name)
          );
          return fieldError?.message || "";
        }
        return "Validation error";
      }
    },
    [validationSchema, formState.values]
  );

  const setFieldValue = useCallback(
    async (name: keyof T, value: unknown) => {
      const error = await validateField(name, value);

      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value } as T,
        errors: { ...prev.errors, [name]: error },
        touched: { ...prev.touched, [name]: true },
        isValid: !error && Object.values(prev.errors).every((e) => !e),
      }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        if (validationSchema) {
          await validationSchema.parseAsync(formState.values);
        }

        await onSubmit(formState.values);

        if (mountedRef.current) {
          toast({
            title: successMessage,
            variant: "default",
          });

          onSuccess?.();
        }
      } catch (error) {
        if (mountedRef.current) {
          let errorMessage = "Bir hata oluştu";

          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === "string") {
            errorMessage = error;
          }

          toast({
            title: "Hata",
            description: errorMessage,
            variant: "destructive",
          });

          if (error instanceof Error && "errors" in error) {
            const zodError = error as { errors: Array<{ path: string[]; message: string }> };
            const newErrors: Partial<Record<keyof T, string>> = {};

            zodError.errors.forEach((e) => {
              if (e.path[0]) {
                newErrors[e.path[0] as keyof T] = e.message;
              }
            });

            setFormState((prev) => ({
              ...prev,
              errors: newErrors,
              isValid: false,
            }));
          }
        }
      } finally {
        if (mountedRef.current) {
          setFormState((prev) => ({ ...prev, isSubmitting: false }));
        }
      }
    },
    [formState.values, onSubmit, onSuccess, successMessage, toast, validationSchema]
  );

  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    });
  }, [initialValues]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    setFieldValue,
    handleSubmit,
    resetForm,
  };
}
