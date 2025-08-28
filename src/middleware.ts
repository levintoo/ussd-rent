import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

const authRoutes = ["/dashboard", "/units", "/tenants", "/payments"];
const guestRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (![...authRoutes, ...guestRoutes].includes(path)) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  if (authRoutes.includes(path) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (guestRoutes.includes(path) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
