"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authSession } from "@/lib/auth-guard";

export async function logoutAction() {
  await authSession();

  await auth.api.signOut({
    headers: await headers(),
  });

  return redirect("/login");
}
