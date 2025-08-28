import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { units } from "@/db/schema/units";

export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  unitId: text("unit_id")
    .notNull()
    .unique()
    .references(() => units.id),
});
