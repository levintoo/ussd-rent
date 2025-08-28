import { z } from "zod";

export const createUnitSchema = z.object({
  unitNumber: z
    .string()
    .min(1, "Unit number is required")
    .max(50, "Unit number is too long"),
  monthlyRent: z.coerce.number().min(0, "Monthly rent must be positive"),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
