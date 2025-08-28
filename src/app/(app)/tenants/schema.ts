import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z.string().min(5, "Phone is too short").max(30, "Phone is too long"),
  unitId: z.string().min(1, "Unit is required"),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
