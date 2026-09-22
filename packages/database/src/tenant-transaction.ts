import { sql } from "drizzle-orm";

import { db } from "./client.js";

export async function withTenant<T>(
  tenantId: string,
  operation: (
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  ) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.tenant_id', ${tenantId}, true)`,
    );
    return operation(tx);
  });
}
