type BaseEvent = {
  timestamp: string;
  userId?: string;
};

export interface EventMap {
  "auth:signIn": BaseEvent & { userId: string };
  "auth:signOut": BaseEvent;
  "gym:created": BaseEvent & { gymId: string; name: string };
  "gym:updated": BaseEvent & { gymId: string; changes: Record<string, unknown> };
  "gym:deleted": BaseEvent & { gymId: string };
  "member:added": BaseEvent & { gymId: string; userId: string };
  "member:removed": BaseEvent & { gymId: string; userId: string };
  "trainer:assigned": BaseEvent & { gymId: string; trainerId: string };
  "trainer:unassigned": BaseEvent & { gymId: string; trainerId: string };
  "session:scheduled": BaseEvent & { sessionId: string; trainerId: string; memberId: string };
  "session:cancelled": BaseEvent & { sessionId: string };
  "profile:updated": BaseEvent & { userId: string; changes: Record<string, unknown> };
}

type EventHandler<T = unknown> = (data: T) => void | Promise<void>;
type EventHandlerMap = Map<keyof EventMap, Set<EventHandler>>;

class EventBus {
  private static instance: EventBus;
  private handlers: EventHandlerMap = new Map();
  private recentEvents: Array<{ event: keyof EventMap; data: unknown }> = [];
  private readonly maxRecentEvents = 50;

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)?.add(handler as EventHandler);
  }

  off<K extends keyof EventMap>(event: K, handler?: EventHandler<EventMap[K]>): void {
    if (handler) {
      this.handlers.get(event)?.delete(handler as EventHandler);
      if (this.handlers.get(event)?.size === 0) {
        this.handlers.delete(event);
      }
    } else {
      this.handlers.delete(event);
    }
  }

  async emit<K extends keyof EventMap>(event: K, data: EventMap[K]): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    // Add timestamp to event data
    const eventData = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    // Store in recent events
    this.storeRecentEvent(event, eventData);

    // Execute all handlers
    const promises = Array.from(handlers).map(handler => {
      try {
        const result = handler(eventData);
        return result instanceof Promise ? result : Promise.resolve();
      } catch (error) {
        console.error(`Error in event handler for ${String(event)}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  private storeRecentEvent(event: keyof EventMap, data: unknown): void {
    this.recentEvents.unshift({ event, data });
    if (this.recentEvents.length > this.maxRecentEvents) {
      this.recentEvents.pop();
    }
  }

  getRecentEvents(): ReadonlyArray<{ event: keyof EventMap; data: unknown }> {
    return [...this.recentEvents];
  }

  clearRecentEvents(): void {
    this.recentEvents = [];
  }

  removeAllListeners(): void {
    this.handlers.clear();
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();

// React hook for using events in components
export function useEvent<K extends keyof EventMap>(
  event: K,
  handler: EventHandler<EventMap[K]>
) {
  React.useEffect(() => {
    const unsubscribe = eventBus.on(event, handler);
    return () => unsubscribe();
  }, [event, handler]);
}
