const RESERVED_SUBDOMAINS = new Set([
  "admin",
  "api",
  "app",
  "status",
  "support",
  "www",
]);

export function normalizeHostname(rawHost: string): string {
  return rawHost.trim().toLowerCase().replace(/\.$/, "").replace(/:\d+$/, "");
}

export function validateSubdomain(value: string): string {
  const subdomain = value.trim().toLowerCase();

  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) {
    throw new Error("Subdomain must be a valid DNS label");
  }
  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    throw new Error("Subdomain is reserved");
  }

  return subdomain;
}
