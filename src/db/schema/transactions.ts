import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tenants } from "@/db/schema/tenants";
import { sql } from "drizzle-orm";

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  amount: real("amount").notNull(),
  note: text("note"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
