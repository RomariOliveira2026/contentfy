import type {
  NotificationPayload,
  NotificationRecord,
} from "@shared/contentfy";

/** ContentFy Notification Center — multi-channel (architecture). */
export class NotificationCenter {
  private inbox = new Map<number, NotificationRecord[]>();

  enqueue(payload: NotificationPayload): NotificationRecord {
    const record: NotificationRecord = {
      ...payload,
      id: `cf_n_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const list = this.inbox.get(payload.userId) ?? [];
    list.unshift(record);
    this.inbox.set(payload.userId, list);
    return record;
  }

  list(userId: number) {
    return this.inbox.get(userId) ?? [];
  }

  markRead(userId: number, id: string) {
    const list = this.inbox.get(userId) ?? [];
    const next = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.inbox.set(userId, next);
    return next.find((n) => n.id === id) ?? null;
  }
}

export const notificationCenter = new NotificationCenter();
