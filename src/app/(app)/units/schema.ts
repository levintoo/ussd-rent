import { z } from "zod";

export const createUnitSchema = z.object({
  unitNumber: z
    .string({ required_error: "Unit number is required" })
    .min(1, "Unit number is required")
    .max(50, "Unit number is too long"),
  monthlyRent: z.coerce
    .number({ invalid_type_error: "Monthly rent must be a number" })
    .min(0, "Monthly rent must be positive"),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
