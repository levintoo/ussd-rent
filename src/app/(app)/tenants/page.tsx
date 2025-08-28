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
import { tenants, units } from "@/db/schema";
import { TenantCreateDrawer } from "./tenant-create-drawer";
import { TenantsTable } from "./tenants-table";
import { eq } from "drizzle-orm";

export default async function Page() {
  let unitRows: Array<{ id: string; unitNumber: string; monthlyRent: number }> =
    [];
  try {
    unitRows = await db.select().from(units).orderBy(units.unitNumber);
  } catch {
    unitRows = [];
  }
  const unitOptions = unitRows.map((u) => ({
    id: u.id,
    label: `${u.unitNumber} ($${Number(u.monthlyRent).toFixed(2)})`,
  }));

  let tenantRows: Array<{
    id: string;
    name: string;
    phone: string;
    unitNumber: string | null;
  }> = [];
  try {
    tenantRows = await db
      .select({
        id: tenants.id,
        name: tenants.name,
        phone: tenants.phone,
        unitNumber: units.unitNumber,
      })
      .from(tenants)
      .leftJoin(units, eq(tenants.unitId, units.id));
  } catch {
    tenantRows = [];
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
                <BreadcrumbPage>Tenants</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <TenantCreateDrawer units={unitOptions} />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <TenantsTable tenants={tenantRows} />
      </div>
    </>
  );
}
