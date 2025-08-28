CREATE TABLE `units` (
	`id` text PRIMARY KEY NOT NULL,
	`unit_number` text NOT NULL,
	`monthly_rent` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `units_unit_number_unique` ON `units` (`unit_number`);