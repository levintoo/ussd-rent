"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { tenants } from "@/db/schema";
import { createTenantSchema } from "./schema";
import { z } from "zod";
import { authSession } from "@/lib/auth-guard";

export async function createTenantAction(
  values: z.infer<typeof createTenantSchema>
) {
  await authSession();
  const parsed = createTenantSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { name, phone, unitId } = parsed.data;

  const existingPhone = await db
    .select()
    .from(tenants)
    .where(eq(tenants.phone, phone))
    .limit(1);
  if (existingPhone.length > 0) {
    return { errors: { phone: ["Phone already exists"] } };
  }
  const existingUnit = await db
    .select()
    .from(tenants)
    .where(eq(tenants.unitId, unitId))
    .limit(1);
  if (existingUnit.length > 0) {
    return { errors: { unitId: ["Unit is already occupied"] } };
  }

  await db.insert(tenants).values({ id: randomUUID(), name, phone, unitId });

  revalidatePath("/tenants");
  return null;
}
