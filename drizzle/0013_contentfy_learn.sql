-- ContentFy Learn v1 — learner active goal preference
-- Apply: npx drizzle-kit migrate (after backup). Do not use db:push solely for this.

CREATE TABLE `learn_user_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`goalId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learn_user_goals_id` PRIMARY KEY(`id`),
	CONSTRAINT `learn_user_goals_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE INDEX `learn_user_goals_goal_idx` ON `learn_user_goals` (`goalId`);
