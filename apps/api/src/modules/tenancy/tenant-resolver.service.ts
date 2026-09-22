import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { db, tenantDomains, tenants } from "@retail/database";

import { normalizeHostname } from "./hostname.js";
import type { ResolvedTenant } from "./tenant.types.js";

@Injectable()
export class TenantResolverService {
  async resolve(rawHost: string): Promise<ResolvedTenant | null> {
    const hostname = normalizeHostname(rawHost);
    const [tenant] = await db
      .select({ id: tenants.id, slug: tenants.slug })
      .from(tenantDomains)
      .innerJoin(
        tenants,
        and(
          eq(tenantDomains.tenantId, tenants.id),
          eq(tenants.status, "active"),
        ),
      )
      .where(eq(tenantDomains.hostname, hostname))
      .limit(1);

    return tenant ? { ...tenant, hostname } : null;
  }
}
