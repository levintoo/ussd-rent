import { z } from "zod";

export const createTenantSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  phone: z
    .string({ required_error: "Phone is required" })
    .min(5, "Phone is too short")
    .max(30, "Phone is too long"),
  unitId: z
    .string({ required_error: "Unit is required" })
    .min(1, "Unit is required"),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
