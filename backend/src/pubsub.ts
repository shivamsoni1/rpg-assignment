import { EventEmitter } from 'events';

type Payload = unknown;
type Handler = (payload: Payload) => void;

class SimplePubSub {
  private ee = new EventEmitter();
  private subIdCounter = 1;
  private subs = new Map<number, { trigger: string; handler: Handler }>();

  async publish(triggerName: string, payload: Payload): Promise<void> {
    // emit synchronously like graphql-subscriptions PubSub
    this.ee.emit(triggerName, payload);
  }

  subscribe(triggerName: string, onMessage: Handler): number {
    const id = this.subIdCounter++;
    const handler: Handler = (payload) => onMessage(payload);
    this.subs.set(id, { trigger: triggerName, handler });
    this.ee.on(triggerName, handler);
    return id;
  }

  unsubscribe(subId: number): void {
    const entry = this.subs.get(subId);
    if (!entry) return;
    this.ee.removeListener(entry.trigger, entry.handler);
    this.subs.delete(subId);
  }

  asyncIterator<T = unknown>(
    triggerName: string | string[],
  ): AsyncIterator<T> & AsyncIterable<T> {
    const triggers = Array.isArray(triggerName) ? triggerName : [triggerName];

    let pullQueue: Array<(result: IteratorResult<T>) => void> = [];
    const pushQueue: T[] = [];
    const subIds: number[] = [];

    const pushValue = (event: T) => {
      if (pullQueue.length !== 0) {
        const resolve = pullQueue.shift()!;
        resolve({ value: event, done: false });
      } else {
        pushQueue.push(event);
      }
    };

    // capture owner to call unsubscribe later
    const owner = this;

    for (const t of triggers) {
      const id = this.subscribe(t, (payload: unknown) => {
        pushValue(payload as T);
      });
      subIds.push(id);
    }

    type AsyncIteratorWithIterable<U> = AsyncIterator<U> & AsyncIterable<U>;

    const iterator: AsyncIteratorWithIterable<T> = {
      next(): Promise<IteratorResult<T>> {
        return new Promise<IteratorResult<T>>((resolve) => {
          if (pushQueue.length !== 0) {
            const value = pushQueue.shift()!;
            resolve({ value, done: false });
          } else {
            pullQueue.push(resolve);
          }
        });
      },
      return(): Promise<IteratorResult<T>> {
        for (const id of subIds) {
          try {
            owner.unsubscribe(id);
          } catch {
            /* ignore unsubscribe errors */
          }
        }
        pullQueue.forEach((resolve) =>
          resolve({ value: undefined as unknown as T, done: true }),
        );
        pullQueue = [];
        return Promise.resolve({
          value: undefined as unknown as T,
          done: true,
        });
      },
      throw(err?: unknown): Promise<IteratorResult<T>> {
        for (const id of subIds) {
          try {
            owner.unsubscribe(id);
          } catch {
            /* ignore unsubscribe errors */
          }
        }
        pullQueue = [];
        return Promise.reject(err);
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };

    return iterator;
  }
}

export const pubSub = new SimplePubSub();
