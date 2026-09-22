import { describe, expect, it } from "vitest";

import { redactAuditValue } from "../src/modules/audit/redact-audit.js";

describe("redactAuditValue", () => {
  it("redacts secrets recursively without changing safe fields", () => {
    expect(
      redactAuditValue({
        email: "cashier@example.com",
        passwordHash: "hash",
        nested: { refreshToken: "token", role: "cashier" },
      }),
    ).toEqual({
      email: "cashier@example.com",
      passwordHash: "[REDACTED]",
      nested: { refreshToken: "[REDACTED]", role: "cashier" },
    });
  });
});
