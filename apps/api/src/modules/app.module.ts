import { Module } from "@nestjs/common";

import { HealthModule } from "./health/health.module.js";
import { IdentityModule } from "./identity/identity.module.js";
import { TenantModule } from "./tenancy/tenant.module.js";

@Module({
  imports: [HealthModule, TenantModule, IdentityModule],
})
export class AppModule {}
