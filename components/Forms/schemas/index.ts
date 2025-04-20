import { z } from "zod";

/**
 * Base schema for role selection form
 */
export const baseSchema = z.object({
  roleType: z.enum(["Trainer", "GymManager"], {
    required_error: "Lütfen bir rol seçin",
  }),
});

/**
 * Schema for trainer role form fields
 */
export const trainerSchema = baseSchema.extend({
  roleType: z.literal("Trainer"),
  experience: z.coerce
    .number({
      required_error: "Deneyim yılı gereklidir",
      invalid_type_error: "Deneyim yılı sayı olmalıdır",
    })
    .min(0, "Deneyim yılı negatif olamaz")
    .max(50, "Deneyim yılı çok yüksek görünüyor"),
  specialty: z
    .string({
      required_error: "Uzmanlık alanı gereklidir",
    })
    .min(2, "Uzmanlık alanı en az 2 karakter olmalıdır")
    .max(100, "Uzmanlık alanı çok uzun"),
});

/**
 * Schema for gym manager role form fields
 */
export const gymManagerSchema = baseSchema.extend({
  roleType: z.literal("GymManager"),
  gymName: z
    .string({
      required_error: "Salon adı gereklidir",
    })
    .min(2, "Salon adı en az 2 karakter olmalıdır")
    .max(100, "Salon adı çok uzun"),
  city: z.string({
    required_error: "Şehir seçmelisiniz",
  }),
});

/**
 * Discriminated union schema for form validation
 */
export const formSchema = z.discriminatedUnion("roleType", [
  trainerSchema,
  gymManagerSchema,
]);

/**
 * TypeScript types inferred from the schema
 */
export type FormValues = z.infer<typeof formSchema>;

/**
 * Submission status interface for form state management
 */
export interface FormSubmissionStatus {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
