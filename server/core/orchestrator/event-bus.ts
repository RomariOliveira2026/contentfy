import type {
  OrchestratorEventEnvelope,
  OrchestratorEventName,
  OrchestratorEventPayload,
  OrchestratorMotor,
} from "@shared/contentfy";
import { eventRegistry } from "./event-registry";
import { resolveOrchestratorRules, sanitizeOrchestratorMeta } from "./config";

type Listener = (event: OrchestratorEventEnvelope) => void | Promise<void>;

let seq = 0;

function nextId(prefix: string) {
  seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${seq.toString(36)}`;
}

/**
 * In-process event bus with bounded priority queue.
 */
export class EventBus {
  private listeners = new Map<OrchestratorEventName | "*", Set<Listener>>();
  private queue: OrchestratorEventEnvelope[] = [];
  private recent: OrchestratorEventEnvelope[] = [];
  private maxRecent = 100;

  on(name: OrchestratorEventName | "*", listener: Listener) {
    const set = this.listeners.get(name) || new Set();
    set.add(listener);
    this.listeners.set(name, set);
    return () => set.delete(listener);
  }

  create(input: {
    name: OrchestratorEventName;
    payload: OrchestratorEventPayload;
    source?: OrchestratorMotor | "edge" | "admin" | "system";
    priority?: number;
    correlationId?: string;
  }): OrchestratorEventEnvelope {
    const rules = resolveOrchestratorRules();
    const def = eventRegistry.get(input.name);
    const priority =
      input.priority ??
      rules.eventPriorityOverrides?.[input.name] ??
      def?.defaultPriority ??
      100;

    const envelope: OrchestratorEventEnvelope = {
      id: nextId("evt"),
      name: input.name,
      payload: {
        ...input.payload,
        meta: sanitizeOrchestratorMeta(input.payload.meta || null),
      },
      source: input.source || "system",
      priority,
      createdAt: new Date().toISOString(),
      correlationId: input.correlationId,
    };

    this.recent.push(envelope);
    if (this.recent.length > this.maxRecent) {
      this.recent.splice(0, this.recent.length - this.maxRecent);
    }
    return envelope;
  }

  enqueue(envelope: OrchestratorEventEnvelope) {
    const rules = resolveOrchestratorRules();
    if (this.queue.length >= rules.maxQueueSize) {
      this.queue.shift();
    }
    this.queue.push(envelope);
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  /** @deprecated use create + enqueue */
  publish(input: {
    name: OrchestratorEventName;
    payload: OrchestratorEventPayload;
    source?: OrchestratorMotor | "edge" | "admin" | "system";
    priority?: number;
    correlationId?: string;
  }): OrchestratorEventEnvelope {
    const envelope = this.create(input);
    this.enqueue(envelope);
    return envelope;
  }

  dequeue(limit = 1): OrchestratorEventEnvelope[] {
    return this.queue.splice(0, Math.max(0, limit));
  }

  depth() {
    return this.queue.length;
  }

  recentEvents(limit = 50) {
    return this.recent.slice(-limit).reverse();
  }

  async notify(event: OrchestratorEventEnvelope) {
    const specific = this.listeners.get(event.name);
    const all = this.listeners.get("*");
    const handlers = [
      ...(specific ? Array.from(specific) : []),
      ...(all ? Array.from(all) : []),
    ];
    await Promise.allSettled(handlers.map((h) => Promise.resolve(h(event))));
  }

  clear() {
    this.queue = [];
    this.recent = [];
  }
}

export const eventBus = new EventBus();
