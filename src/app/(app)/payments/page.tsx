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
import { tenants, transactions } from "@/db/schema";
import { TransactionCreateDrawer } from "./transaction-create-drawer";
import { PaymentsTable } from "./payments-table";
import { eq } from "drizzle-orm";

export default async function Page() {
  let tenantRows: Array<{ id: string; name: string; phone: string }> = [];
  try {
    tenantRows = await db.select().from(tenants).orderBy(tenants.name);
  } catch {
    tenantRows = [];
  }
  const tenantOptions = tenantRows.map((t) => ({
    id: t.id,
    label: `${t.name} (${t.phone})`,
  }));

  let payments: Array<{
    id: string;
    amount: number;
    note: string | null;
    tenantName: string | null;
    createdAt: string;
  }> = [];
  try {
    payments = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        note: transactions.note,
        tenantName: tenants.name,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .leftJoin(tenants, eq(transactions.tenantId, tenants.id));
  } catch {
    payments = [];
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <TransactionCreateDrawer tenants={tenantOptions} />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <PaymentsTable payments={payments} />
      </div>
    </>
  );
}
