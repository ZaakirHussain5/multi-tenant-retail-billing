import { Module } from "@nestjs/common";

import { BillingModule } from "./billing/billing.module.js";
import { CatalogModule } from "./catalog/catalog.module.js";
import { HealthModule } from "./health/health.module.js";
import { IdentityModule } from "./identity/identity.module.js";
import { InventoryModule } from "./inventory/inventory.module.js";
import { TenantModule } from "./tenancy/tenant.module.js";

@Module({
  imports: [
    HealthModule,
    TenantModule,
    IdentityModule,
    CatalogModule,
    InventoryModule,
    BillingModule,
  ],
})
export class AppModule {}
