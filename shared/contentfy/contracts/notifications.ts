/** ContentFy Notifications — multi-channel notification center. */

export type NotificationChannel = "email" | "push" | "whatsapp" | "in_app";

export type NotificationKind =
  | "update"
  | "new_module"
  | "new_product"
  | "guarantee"
  | "learning"
  | "community"
  | "system";

export interface NotificationPayload {
  userId: number;
  kind: NotificationKind;
  title: string;
  body: string;
  channels: NotificationChannel[];
  href?: string;
  metadata?: Record<string, string>;
}

export interface NotificationRecord extends NotificationPayload {
  id: string;
  read: boolean;
  createdAt: string;
}
