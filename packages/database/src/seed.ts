import { tenantDomains, tenants } from "./schema.js";
import { db, queryClient } from "./client.js";

const [tenant] = await db
  .insert(tenants)
  .values({ name: "Demo Retail", slug: "demo" })
  .onConflictDoUpdate({ target: tenants.slug, set: { name: "Demo Retail" } })
  .returning();

if (tenant) {
  await db
    .insert(tenantDomains)
    .values({ hostname: "demo.localhost", tenantId: tenant.id })
    .onConflictDoNothing();
}

await queryClient.end();
