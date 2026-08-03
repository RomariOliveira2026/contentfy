-- ContentFy Protect hardening — audit trail + reconciliation flags
-- Apply after 0010: npx drizzle-kit migrate

ALTER TABLE `refund_requests`
	ADD `accessRevocationStatus` enum('pending','revoked','failed','not_applicable') NOT NULL DEFAULT 'not_applicable',
	ADD `reconciliationNeeded` boolean NOT NULL DEFAULT false;
--> statement-breakpoint
CREATE TABLE `refund_audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`refundRequestId` int,
	`orderId` int,
	`actorUserId` int,
	`eventType` varchar(64) NOT NULL,
	`fromStatus` varchar(32),
	`toStatus` varchar(32),
	`message` text,
	`metadataJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refund_audit_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `refund_audit_events_request_fk` FOREIGN KEY (`refundRequestId`) REFERENCES `refund_requests`(`id`)
);
--> statement-breakpoint
CREATE INDEX `refund_audit_events_request_idx` ON `refund_audit_events` (`refundRequestId`);
--> statement-breakpoint
CREATE INDEX `refund_audit_events_order_idx` ON `refund_audit_events` (`orderId`);
--> statement-breakpoint
CREATE INDEX `refund_audit_events_type_idx` ON `refund_audit_events` (`eventType`);
