import { describe, expect, it } from "vitest";

import { MoneySchema } from "../src/money.js";

describe("MoneySchema", () => {
  it("accepts decimal-safe money strings", () => {
    expect(MoneySchema.parse("19.99")).toBe("19.99");
  });

  it("rejects excessive precision", () => {
    expect(() => MoneySchema.parse("19.999")).toThrow();
  });
});
