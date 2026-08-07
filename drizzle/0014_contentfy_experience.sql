-- ContentFy Experience XIII.1 — onboarding, activity, telemetry
-- Apply manually: npx drizzle-kit migrate (after backup).
-- Do not auto-apply. Do not use db:push solely for this.

CREATE TABLE `experience_onboarding` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`primaryGoalId` varchar(64),
	`improveFirst` varchar(200),
	`weeklyHours` decimal(4,1),
	`preferencesJson` text,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experience_onboarding_id` PRIMARY KEY(`id`),
	CONSTRAINT `experience_onboarding_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE INDEX `experience_onboarding_goal_idx` ON `experience_onboarding` (`primaryGoalId`);
--> statement-breakpoint
CREATE TABLE `experience_activity_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(48) NOT NULL,
	`productId` int,
	`productSlug` varchar(255),
	`lessonId` int,
	`metaJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experience_activity_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `experience_activity_user_created_idx` ON `experience_activity_events` (`userId`,`createdAt`);
--> statement-breakpoint
CREATE INDEX `experience_activity_type_idx` ON `experience_activity_events` (`eventType`);
--> statement-breakpoint
CREATE TABLE `experience_activity_daily` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`day` varchar(10) NOT NULL,
	`eventCount` int NOT NULL DEFAULT 1,
	`lastEventType` varchar(48),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experience_activity_daily_id` PRIMARY KEY(`id`),
	CONSTRAINT `experience_activity_daily_user_day` UNIQUE(`userId`,`day`)
);
--> statement-breakpoint
CREATE INDEX `experience_activity_daily_user_idx` ON `experience_activity_daily` (`userId`);
--> statement-breakpoint
CREATE TABLE `experience_telemetry_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventName` varchar(64) NOT NULL,
	`metaJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experience_telemetry_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `experience_telemetry_user_created_idx` ON `experience_telemetry_events` (`userId`,`createdAt`);
--> statement-breakpoint
CREATE INDEX `experience_telemetry_name_idx` ON `experience_telemetry_events` (`eventName`);
--> statement-breakpoint
CREATE TABLE `experience_dismissed_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recommendationId` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experience_dismissed_recommendations_id` PRIMARY KEY(`id`),
	CONSTRAINT `experience_dismissed_rec_unique` UNIQUE(`userId`,`recommendationId`)
);
