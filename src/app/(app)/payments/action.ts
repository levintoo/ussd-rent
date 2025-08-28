"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { createTransactionSchema } from "./schema";
import { authSession } from "@/lib/auth-guard";

export async function createTransactionAction(
  values: z.infer<typeof createTransactionSchema>
) {
  await authSession();
  const parsed = createTransactionSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { tenantId, amount, note } = parsed.data;

  await db
    .insert(transactions)
    .values({
      id: randomUUID(),
      tenantId,
      amount,
      note: note || null,
      createdAt: new Date().toISOString(),
    });

  revalidatePath("/payments");
  return null;
}
