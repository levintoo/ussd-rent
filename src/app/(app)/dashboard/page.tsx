import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { db } from "@/db";
import { tenants, transactions, units } from "@/db/schema";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { DashboardCharts } from "./charts";

export default async function Page() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  // Active tenants with their monthly rent (if any)
  const tenantWithRent: Array<{ id: string; name: string; monthlyRent: number | null }> = await db
    .select({ id: tenants.id, name: tenants.name, monthlyRent: units.monthlyRent })
    .from(tenants)
    .leftJoin(units, eq(tenants.unitId, units.id));

  // Sum of transactions per tenant for the current month
  const monthlyTotals: Array<{ tenantId: string; total: number | null }> = await db
    .select({ tenantId: transactions.tenantId, total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .where(and(gte(transactions.createdAt, startIso), lt(transactions.createdAt, endIso)))
    .groupBy(transactions.tenantId);

  const tenantIdToTotal = new Map<string, number>();
  for (const row of monthlyTotals) {
    tenantIdToTotal.set(row.tenantId, row.total ?? 0);
  }

  const activeTenants = tenantWithRent.length;
  let cleared = 0;
  for (const t of tenantWithRent) {
    const due = t.monthlyRent ?? 0;
    const paid = tenantIdToTotal.get(t.id) ?? 0;
    if (paid >= due && due > 0) cleared++;
    if (due === 0 && paid >= 0) cleared++;
  }
  const pending = Math.max(activeTenants - cleared, 0);

  // Money KPIs
  const totalDue = tenantWithRent.reduce((sum, t) => sum + (t.monthlyRent ?? 0), 0);
  const moneyAgg = await db
    .select({
      total: sql<number>`sum(${transactions.amount})`,
      pos: sql<number>`sum(case when ${transactions.amount} > 0 then ${transactions.amount} else 0 end)`,
      neg: sql<number>`sum(case when ${transactions.amount} < 0 then ${transactions.amount} else 0 end)`,
    })
    .from(transactions)
    .where(and(gte(transactions.createdAt, startIso), lt(transactions.createdAt, endIso)));
  const totalCollected = moneyAgg[0]?.pos ?? 0;
  const totalBilled = Math.abs(moneyAgg[0]?.neg ?? 0);
  const outstanding = Math.max(totalDue - totalCollected, 0);

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  // Chart datasets
  const perTenant = tenantWithRent.map((t) => ({
    name: t.name,
    due: Number(t.monthlyRent ?? 0),
    paid: Number(tenantIdToTotal.get(t.id) ?? 0),
  }));

  // Build daily net series
  const monthDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daily = Array.from({ length: monthDays }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const dayStr = d.toISOString().slice(0, 10);
    return { date: dayStr, net: 0 };
  });
  const dailyMap = new Map(daily.map((d) => [d.date, d]));
  const dailyRows: Array<{ createdAt: string; amount: number }> = await db
    .select({ createdAt: transactions.createdAt, amount: transactions.amount })
    .from(transactions)
    .where(and(gte(transactions.createdAt, startIso), lt(transactions.createdAt, endIso)));
  for (const r of dailyRows) {
    const key = r.createdAt.slice(0, 10);
    const entry = dailyMap.get(key);
    if (entry) entry.net += Number(r.amount);
  }
  const dailySeries = Array.from(dailyMap.values());

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Active tenants</div>
            <div className="text-3xl font-semibold">{activeTenants}</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Cleared rent (this month)</div>
            <div className="text-3xl font-semibold">{cleared}</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Yet to pay (this month)</div>
            <div className="text-3xl font-semibold">{pending}</div>
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Total due (this month)</div>
            <div className="text-3xl font-semibold">{fmt(totalDue)}</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Total collected</div>
            <div className="text-3xl font-semibold text-emerald-600">{fmt(totalCollected)}</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Total billed</div>
            <div className="text-3xl font-semibold text-destructive">{fmt(totalBilled)}</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Outstanding</div>
            <div className="text-3xl font-semibold">{fmt(outstanding)}</div>
          </div>
        </div>
        <DashboardCharts perTenant={perTenant} daily={dailySeries} />
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </>
  );
}
