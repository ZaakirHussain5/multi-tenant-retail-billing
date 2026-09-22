import { and, asc, eq, isNull, lte, sql } from "drizzle-orm";

import { db, outboxEvents } from "@retail/database";

export interface OutboxPublisher {
  publish(topic: string, payload: Record<string, unknown>): Promise<void>;
}

export async function processOutboxBatch(
  publisher: OutboxPublisher,
  batchSize = 50,
): Promise<number> {
  return db.transaction(async (tx) => {
    const events = await tx
      .select()
      .from(outboxEvents)
      .where(
        and(
          isNull(outboxEvents.processedAt),
          lte(outboxEvents.availableAt, new Date()),
        ),
      )
      .orderBy(asc(outboxEvents.createdAt))
      .limit(batchSize)
      .for("update", { skipLocked: true });

    for (const event of events) {
      try {
        await publisher.publish(event.topic, event.payload);
        await tx
          .update(outboxEvents)
          .set({
            processedAt: new Date(),
            attempts: sql`${outboxEvents.attempts} + 1`,
          })
          .where(eq(outboxEvents.id, event.id));
      } catch (error) {
        await tx
          .update(outboxEvents)
          .set({
            attempts: sql`${outboxEvents.attempts} + 1`,
            lastError:
              error instanceof Error
                ? error.message
                : "Unknown publish failure",
            availableAt: new Date(Date.now() + 30_000),
          })
          .where(eq(outboxEvents.id, event.id));
      }
    }

    return events.length;
  });
}
