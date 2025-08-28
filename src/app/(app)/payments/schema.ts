import { z } from "zod";

export const createTransactionSchema = z.object({
  tenantId: z.string().min(1, "Tenant is required"),
  amount: z.coerce
    .number()
    .refine((v) => !Number.isNaN(v), { message: "Amount must be a number" }),
  note: z.string().max(255).optional().or(z.literal("")),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
