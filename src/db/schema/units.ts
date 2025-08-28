import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const units = sqliteTable("units", {
  id: text("id").primaryKey(),
  unitNumber: text("unit_number").notNull().unique(),
  monthlyRent: real("monthly_rent").notNull(),
});
