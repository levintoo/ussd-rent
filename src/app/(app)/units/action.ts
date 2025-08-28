"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { units } from "@/db/schema/units";
import { createUnitSchema } from "./schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export async function createUnitAction(
  values: z.infer<typeof createUnitSchema>
) {
  const parsed = createUnitSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { unitNumber, monthlyRent } = parsed.data;

  const existing = await db
    .select()
    .from(units)
    .where(eq(units.unitNumber, unitNumber))
    .limit(1);
  if (existing.length > 0) {
    return { errors: { unitNumber: ["Unit number already exists"] } };
  }

  await db.insert(units).values({ id: randomUUID(), unitNumber, monthlyRent });

  revalidatePath("/units");
  return null;
}
