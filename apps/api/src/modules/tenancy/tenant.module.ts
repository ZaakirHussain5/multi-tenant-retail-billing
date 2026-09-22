import { MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";

import { TenantMiddleware } from "./tenant.middleware.js";
import { TenantResolverService } from "./tenant-resolver.service.js";

@Module({
  providers: [TenantResolverService],
  exports: [TenantResolverService],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TenantMiddleware).exclude("api/v1/health").forRoutes("*");
  }
}
