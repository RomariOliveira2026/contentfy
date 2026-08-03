-- ContentFy Protect v1 — refund_requests
-- Apply with: npx drizzle-kit migrate
-- Do NOT use on production without backup. See docs/evolution-x/protect-homologation.md

CREATE TABLE `refund_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`reason` enum('content_mismatch','access_issue','accidental_purchase','not_needed','other') NOT NULL,
	`details` text,
	`status` enum('requested','under_review','approved','rejected','processing','refunded','failed','cancelled') NOT NULL DEFAULT 'requested',
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`reviewedBy` int,
	`refundAmount` int,
	`providerRefundId` varchar(255),
	`adminNotes` text,
	`idempotencyKey` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `refund_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `refund_requests_orderId_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`),
	CONSTRAINT `refund_requests_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
	CONSTRAINT `refund_requests_productId_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`),
	CONSTRAINT `refund_requests_reviewedBy_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE INDEX `refund_requests_orderId_idx` ON `refund_requests` (`orderId`);
--> statement-breakpoint
CREATE INDEX `refund_requests_userId_idx` ON `refund_requests` (`userId`);
--> statement-breakpoint
CREATE INDEX `refund_requests_status_idx` ON `refund_requests` (`status`);
--> statement-breakpoint
CREATE INDEX `refund_requests_productId_idx` ON `refund_requests` (`productId`);
--> statement-breakpoint
-- Unique when set; multiple NULLs allowed (idempotency set at process time)
CREATE UNIQUE INDEX `refund_requests_idempotencyKey_uidx` ON `refund_requests` (`idempotencyKey`);
--> statement-breakpoint
CREATE UNIQUE INDEX `refund_requests_providerRefundId_uidx` ON `refund_requests` (`providerRefundId`);
