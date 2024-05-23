CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`login` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);