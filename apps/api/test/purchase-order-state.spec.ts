import { describe, expect, it } from "vitest";

import {
  assertPurchaseOrderTransition,
  receiptStatus,
} from "../src/modules/purchasing/purchase-order-state.js";

describe("purchase order state", () => {
  it("allows the approval workflow", () => {
    expect(() =>
      assertPurchaseOrderTransition("draft", "pending_approval"),
    ).not.toThrow();
    expect(() =>
      assertPurchaseOrderTransition("pending_approval", "approved"),
    ).not.toThrow();
  });

  it("blocks invalid jumps", () => {
    expect(() => assertPurchaseOrderTransition("draft", "received")).toThrow(
      "Invalid purchase order transition",
    );
  });

  it("supports partial receipts without over-receiving", () => {
    expect(receiptStatus("10", "2", "3")).toBe("partially_received");
    expect(receiptStatus("10", "2", "8")).toBe("received");
    expect(() => receiptStatus("10", "8", "3")).toThrow("exceeds");
  });
});
