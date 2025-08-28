"use server";

import { z } from "zod";
import formSchema from "./schema";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user as usersTable } from "@/db/schema";
import { headers } from "next/headers";

export async function loginAction(values: z.infer<typeof formSchema>) {
  const validation = formSchema.safeParse(values);

  if (!validation.success) {
    return { errors: z.flattenError(validation.error).fieldErrors };
  }

  const { email, password } = validation.data;

  const currentUser = await db.query.user.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!currentUser) {
    return { errors: { email: ["Invalid credentials"] } };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
        rememberMe: true,
      },
      headers: await headers(),
    });
  } catch {
    return { errors: { email: ["Something went wrong"] } };
  }

  return null;
}
