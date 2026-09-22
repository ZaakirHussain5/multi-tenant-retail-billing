import { describe, expect, it } from "vitest";

import { hasAllPermissions } from "../src/modules/identity/permissions.js";

describe("hasAllPermissions", () => {
  it("requires every declared permission", () => {
    expect(
      hasAllPermissions(
        ["inventory.view", "inventory.adjust"],
        ["inventory.view", "inventory.adjust"],
      ),
    ).toBe(true);
    expect(hasAllPermissions(["inventory.view"], ["inventory.adjust"])).toBe(
      false,
    );
  });
});
