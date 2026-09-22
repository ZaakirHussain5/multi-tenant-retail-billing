import { describe, expect, it } from "vitest";

import {
  normalizeHostname,
  validateSubdomain,
} from "../src/modules/tenancy/hostname.js";

describe("tenant hostname utilities", () => {
  it("normalizes hostname case, port, and trailing dots", () => {
    expect(normalizeHostname("Demo.Localhost:3000.")).toBe("demo.localhost");
  });

  it("blocks reserved subdomains", () => {
    expect(() => validateSubdomain("admin")).toThrow("reserved");
  });

  it("accepts a valid tenant slug", () => {
    expect(validateSubdomain("acme-retail")).toBe("acme-retail");
  });
});
