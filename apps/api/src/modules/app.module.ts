import { Module } from "@nestjs/common";

import { AuditModule } from "./audit/audit.module.js";
import { BillingModule } from "./billing/billing.module.js";
import { CatalogModule } from "./catalog/catalog.module.js";
import { HealthModule } from "./health/health.module.js";
import { IdentityModule } from "./identity/identity.module.js";
import { InventoryModule } from "./inventory/inventory.module.js";
import { PurchasingModule } from "./purchasing/purchasing.module.js";
import { ReportingModule } from "./reporting/reporting.module.js";
import { TenantModule } from "./tenancy/tenant.module.js";

@Module({
  imports: [
    HealthModule,
    TenantModule,
    IdentityModule,
    CatalogModule,
    InventoryModule,
    BillingModule,
    PurchasingModule,
    ReportingModule,
    AuditModule,
  ],
})
export class AppModule {}
