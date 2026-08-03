-- ContentFy Discovery v1 — additive tables (do not alter `products`)
-- Apply: npx drizzle-kit migrate
-- Backup DB before applying. Do not use db:push solely for this.

CREATE TABLE `product_discovery_meta` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int,
	`slug` varchar(255) NOT NULL,
	`tagsJson` text,
	`category` varchar(255),
	`subcategory` varchar(255),
	`level` varchar(64),
	`durationLabel` varchar(128),
	`author` varchar(255),
	`collectionsJson` text,
	`keywordsJson` text,
	`objectivesJson` text,
	`audienceJson` text,
	`skillsJson` text,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isLaunch` boolean NOT NULL DEFAULT false,
	`isBeginnerFriendly` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_discovery_meta_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_discovery_meta_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `product_discovery_meta_product_idx` ON `product_discovery_meta` (`productId`);
--> statement-breakpoint
CREATE TABLE `product_discovery_relationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromSlug` varchar(255) NOT NULL,
	`toSlug` varchar(255) NOT NULL,
	`relationType` enum('next','prerequisite','companion','upsell','bundle') NOT NULL DEFAULT 'next',
	`weight` int NOT NULL DEFAULT 1,
	`label` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_discovery_relationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `pdr_from_idx` ON `product_discovery_relationships` (`fromSlug`);
--> statement-breakpoint
CREATE INDEX `pdr_to_idx` ON `product_discovery_relationships` (`toSlug`);
--> statement-breakpoint
CREATE TABLE `user_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int,
	`productSlug` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_favorites_user_slug_unique` UNIQUE(`userId`, `productSlug`)
);
--> statement-breakpoint
CREATE INDEX `user_favorites_user_idx` ON `user_favorites` (`userId`);
--> statement-breakpoint
CREATE TABLE `discovery_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(64),
	`eventType` varchar(32) NOT NULL,
	`productId` int,
	`productSlug` varchar(255),
	`category` varchar(255),
	`query` varchar(512),
	`dwellMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discovery_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `discovery_events_user_idx` ON `discovery_events` (`userId`);
--> statement-breakpoint
CREATE INDEX `discovery_events_type_idx` ON `discovery_events` (`eventType`);
--> statement-breakpoint
CREATE INDEX `discovery_events_slug_idx` ON `discovery_events` (`productSlug`);
--> statement-breakpoint
CREATE INDEX `discovery_events_created_idx` ON `discovery_events` (`createdAt`);
--> statement-breakpoint
CREATE TABLE `discovery_search_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`queryNormalized` varchar(255) NOT NULL,
	`hitCount` int NOT NULL DEFAULT 1,
	`lastSearchedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discovery_search_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `discovery_search_stats_query_unique` UNIQUE(`queryNormalized`)
);
