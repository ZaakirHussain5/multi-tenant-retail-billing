import { Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";

import type { InventoryMovement } from "@retail/contracts";
import { inventoryLedger, stockBalances, withTenant } from "@retail/database";

@Injectable()
export class InventoryService {
  recordMovement(input: InventoryMovement) {
    return withTenant(input.tenantId, async (tx) => {
      const [movement] = await tx
        .insert(inventoryLedger)
        .values(input)
        .onConflictDoNothing({
          target: [inventoryLedger.tenantId, inventoryLedger.idempotencyKey],
        })
        .returning({ id: inventoryLedger.id });

      if (!movement) return { applied: false as const };

      const [balance] = await tx
        .insert(stockBalances)
        .values({
          tenantId: input.tenantId,
          storeId: input.storeId,
          productVariantId: input.productVariantId,
          quantity: input.quantityDelta,
        })
        .onConflictDoUpdate({
          target: [
            stockBalances.tenantId,
            stockBalances.storeId,
            stockBalances.productVariantId,
          ],
          set: {
            quantity: sql`${stockBalances.quantity} + ${input.quantityDelta}`,
            version: sql`${stockBalances.version} + 1`,
            updatedAt: new Date(),
          },
        })
        .returning({
          quantity: stockBalances.quantity,
          version: stockBalances.version,
        });

      return { applied: true as const, balance, movementId: movement.id };
    });
  }
}
