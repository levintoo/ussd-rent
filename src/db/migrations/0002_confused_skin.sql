CREATE TABLE `tenants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`unit_id` text NOT NULL,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_phone_unique` ON `tenants` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_unit_id_unique` ON `tenants` (`unit_id`);