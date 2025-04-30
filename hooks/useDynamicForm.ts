"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { captureError } from "@/services/errorService";

type ValidationRule<T> = {
  test: (value: T) => boolean;
  message: string;
};

type TransformFunction<T> = (value: T) => T;

interface FieldConfig<T> {
  initialValue: T;
  required?: boolean;
  validate?: Array<ValidationRule<T>>;
  transform?: TransformFunction<T>;
  dependencies?: Array<string>;
}

interface FormConfig<T extends Record<string, unknown>> {
  fields: {
    [K in keyof T]: FieldConfig<T[K]>;
  };
  onSubmit: (values: T) => Promise<void>;
  zodSchema?: z.ZodType<T>;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Set<keyof T>;
  dirty: Set<keyof T>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useDynamicForm<T extends Record<string, unknown>>(config: FormConfig<T>) {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState<T>>(() => ({
    values: Object.entries(config.fields).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: field.initialValue,
      }),
      {} as T
    ),
    errors: {},
    touched: new Set(),
    dirty: new Set(),
    isSubmitting: false,
    isValid: true,
  }));

  const prevValuesRef = useRef(formState.values);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const validateField = useCallback(
    async (name: keyof T, value: unknown): Promise<string> => {
      const fieldConfig = config.fields[name];

      if (!fieldConfig) {
        return "";
      }

      // Required field validation
      if (fieldConfig.required && (value === undefined || value === null || value === "")) {
        return "Bu alan zorunludur";
      }

      // Custom validation rules
      if (fieldConfig.validate) {
        for (const rule of fieldConfig.validate) {
          if (!rule.test(value as T[keyof T])) {
            return rule.message;
          }
        }
      }

      // Zod schema validation
      if (config.zodSchema) {
        try {
          await config.zodSchema.parseAsync({
            ...formState.values,
            [name]: value,
          });
          return "";
        } catch (error) {
          if (error instanceof z.ZodError) {
            const fieldError = error.errors.find((e) => e.path[0] === name);
            return fieldError?.message || "";
          }
        }
      }

      return "";
    },
    [config.fields, config.zodSchema, formState.values]
  );

  const validateDependentFields = useCallback(
    async (name: keyof T) => {
      const dependentFields = Object.entries(config.fields).filter(
        ([_, field]) => field.dependencies?.includes(name as string)
      );

      const errors: Partial<Record<keyof T, string>> = {};

      for (const [fieldName] of dependentFields) {
        const error = await validateField(
          fieldName as keyof T,
          formState.values[fieldName as keyof T]
        );
        if (error) {
          errors[fieldName as keyof T] = error;
        }
      }

      return errors;
    },
    [config.fields, formState.values, validateField]
  );

  const setFieldValue = useCallback(
    async (name: keyof T, value: unknown) => {
      const fieldConfig = config.fields[name];

      // Apply transformation if configured
      const transformedValue = fieldConfig?.transform ? fieldConfig.transform(value as T[keyof T]) : value;

      const error = await validateField(name, transformedValue);
      const dependentErrors = await validateDependentFields(name);

      setFormState((prev) => {
        const newErrors = {
          ...prev.errors,
          [name]: error,
          ...dependentErrors,
        };

        const newTouched = new Set(prev.touched).add(name);
        const newDirty = new Set(prev.dirty);

        if (transformedValue !== prev.values[name]) {
          newDirty.add(name);
        }

        return {
          ...prev,
          values: { ...prev.values, [name]: transformedValue } as T,
          errors: newErrors,
          touched: newTouched,
          dirty: newDirty,
          isValid: Object.values(newErrors).every((e) => !e),
        };
      });

      prevValuesRef.current = {
        ...prevValuesRef.current,
        [name]: transformedValue,
      };
    },
    [config.fields, validateField, validateDependentFields]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
      }));

      try {
        // Validate all fields
        const errors: Partial<Record<keyof T, string>> = {};
        for (const name of Object.keys(config.fields) as Array<keyof T>) {
          const error = await validateField(name, formState.values[name]);
          if (error) {
            errors[name] = error;
          }
        }

        if (Object.keys(errors).length > 0) {
          setFormState((prev) => ({
            ...prev,
            errors,
            isValid: false,
            isSubmitting: false,
          }));
          return;
        }

        await config.onSubmit(formState.values);

        if (mountedRef.current) {
          toast({
            title: "Başarılı",
            description: "Form başarıyla gönderildi",
          });
        }
      } catch (error) {
        captureError(error, {
          component: "useDynamicForm",
          additionalData: { values: formState.values },
        });

        if (mountedRef.current) {
          toast({
            title: "Hata",
            description: "Form gönderilirken bir hata oluştu",
            variant: "destructive",
          });
        }
      } finally {
        if (mountedRef.current) {
          setFormState((prev) => ({
            ...prev,
            isSubmitting: false,
          }));
        }
      }
    },
    [config, formState.values, toast, validateField]
  );

  const resetForm = useCallback(() => {
    const initialValues = Object.entries(config.fields).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: field.initialValue,
      }),
      {} as T
    );

    setFormState({
      values: initialValues,
      errors: {},
      touched: new Set(),
      dirty: new Set(),
      isSubmitting: false,
      isValid: true,
    });

    prevValuesRef.current = initialValues;
  }, [config.fields]);

  const isDirty = formState.dirty.size > 0;
  const isValid = formState.isValid && Object.keys(formState.errors).length === 0;

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isDirty,
    isValid,
    isSubmitting: formState.isSubmitting,
    setFieldValue,
    handleSubmit,
    resetForm,
  };
}
