import { z } from "zod";

// Define Zod schemas for form validation
export const baseSchema = z.object({
  roleType: z.enum(["Trainer", "GymManager"], {
    required_error: "Lütfen bir rol seçin",
  }),
});

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

// Create a discriminated union schema
export const formSchema = z.discriminatedUnion("roleType", [
  trainerSchema,
  gymManagerSchema,
]);

// Infer TypeScript types from the schema
export type FormValues = z.infer<typeof formSchema>;
