import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { tenants, transactions, units } from "@/db/schema";
import { and, eq, gte, lt, sql } from "drizzle-orm";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  })
    .format(n)
    .replace("KES", "Ksh")
    .replace("Ksh ", "Ksh ");
}

async function getBody(request: Request): Promise<Record<string, string>> {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      const obj: Record<string, string> = {};
      for (const [k, v] of form.entries()) obj[k] = String(v);
      return obj;
    }
    if (contentType.includes("application/json")) {
      const json = await request.json();
      return json ?? {};
    }
    const text = await request.text();
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  } catch {
    return {};
  }
}

async function resolvePhoneFromSession(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const phone = (session as any)?.user?.phone as string | undefined;
    return phone ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const payload = await getBody(request);
  const sessionPhone = await resolvePhoneFromSession();
  const phoneNumber =
    sessionPhone || payload.phoneNumber || payload.msisdn || "";
  const text: string = payload.text || "";

  let response = "";

  const tenantRow = phoneNumber
    ? await db
        .select({
          id: tenants.id,
          name: tenants.name,
          phone: tenants.phone,
          unitNumber: units.unitNumber,
          monthlyRent: units.monthlyRent,
        })
        .from(tenants)
        .leftJoin(units, eq(tenants.unitId, units.id))
        .where(eq(tenants.phone, phoneNumber))
        .limit(1)
        .then((r) => r[0])
    : null;

  if (!tenantRow) {
    response = `END Sorry, we could not find a tenant for ${
      phoneNumber || "your number"
    }. Please contact support.`;
    return new NextResponse(response, {
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (text === "") {
    response = `CON Welcome ${tenantRow.name}
1. My account
2. My unit
3. This month's balance`;
  } else if (text === "1") {
    response = `CON Account info
1. Name
2. Phone`;
  } else if (text === "1*1") {
    response = `END Name: ${tenantRow.name}`;
  } else if (text === "1*2") {
    response = `END Phone: ${tenantRow.phone}`;
  } else if (text === "2") {
    const unitStr = tenantRow.unitNumber
      ? `Unit: ${tenantRow.unitNumber}`
      : "Unit: Not assigned";
    const rentStr =
      tenantRow.monthlyRent != null
        ? `Monthly rent: ${formatCurrency(Number(tenantRow.monthlyRent))}`
        : "Monthly rent: N/A";
    response = `END ${unitStr}\n${rentStr}`;
  } else if (text === "3") {
    const now = new Date();
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
    ).toISOString();
    const end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0)
    ).toISOString();
    const totals = await db
      .select({ total: sql<number>`sum(${transactions.amount})` })
      .from(transactions)
      .where(
        and(
          eq(transactions.tenantId, tenantRow.id),
          gte(transactions.createdAt, start),
          lt(transactions.createdAt, end)
        )
      );
    const paid = Number(totals[0]?.total ?? 0);
    const due = Number(tenantRow.monthlyRent ?? 0);
    const outstanding = Math.max(due - paid, 0);
    response = `END This month\nDue: ${formatCurrency(
      due
    )}\nPaid: ${formatCurrency(paid)}\nOutstanding: ${formatCurrency(
      outstanding
    )}`;
  } else {
    response = "END Invalid choice";
  }

  return new NextResponse(response, {
    headers: { "Content-Type": "text/plain" },
  });
}
