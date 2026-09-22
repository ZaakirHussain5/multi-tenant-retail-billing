import {
  Injectable,
  NotFoundException,
  type NestMiddleware,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";

import { TenantResolverService } from "./tenant-resolver.service.js";
import type { TenantRequest } from "./tenant.types.js";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantResolver: TenantResolverService) {}

  async use(request: TenantRequest, _reply: FastifyReply, next: () => void) {
    const rawHost = request.headers.host;
    const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;
    if (!host) throw new NotFoundException("Tenant not found");

    const tenant = await this.tenantResolver.resolve(host);
    if (!tenant) throw new NotFoundException("Tenant not found");

    request.tenant = tenant;
    next();
  }
}
