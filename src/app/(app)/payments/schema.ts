import { z } from "zod";

export const createTransactionSchema = z.object({
  tenantId: z
    .string({ required_error: "Tenant is required" })
    .min(1, "Tenant is required"),
  amount: z.coerce.number({ invalid_type_error: "Amount must be a number" }),
  note: z.string().max(255).optional().or(z.literal("")),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
