export interface ResolvedTenant {
  id: string;
  hostname: string;
  slug: string;
}

export interface TenantRequest {
  headers: Record<string, string | string[] | undefined>;
  tenant?: ResolvedTenant;
}
