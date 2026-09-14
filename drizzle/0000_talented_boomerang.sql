CREATE TABLE `audits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`record_id` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`zone` text NOT NULL,
	`data` text NOT NULL,
	`created_at` text NOT NULL
);
