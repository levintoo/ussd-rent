"use server";

import { z } from "zod";
import formSchema from "./schema";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user as usersTable } from "@/db/schema";

export async function registerAction(values: z.infer<typeof formSchema>) {
  const validation = formSchema.safeParse(values);

  if (!validation.success) {
    return { errors: z.flattenError(validation.error).fieldErrors };
  }

  const { name, email, password } = validation.data;

  const currentUser = await db.query.user.findFirst({
    where: eq(usersTable.email, email),
  });

  if (currentUser) {
    return { errors: { email: ["Email is already taken"] } };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: name,
        email: email,
        password: password,
      },
    });
  } catch {
    return { errors: { email: ["Something went wrong"] } };
  }

  return null;
}