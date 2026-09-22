import { describe, expect, it } from "vitest";

import { InventoryMovementSchema } from "../src/inventory.js";

const movement = {
  tenantId: "0199e7e6-88c0-7d0c-9ab2-6ff5f113ef8f",
  storeId: "0199e7e7-1629-75bc-9ee7-3c2c97225bea",
  productVariantId: "0199e7e7-9014-7dbb-b389-4b66397f90d2",
  movementType: "purchase_receipt",
  quantityDelta: "10.500",
  referenceType: "goods_receipt",
  referenceId: "0199e7e8-6b87-794c-8bee-a97a161e2791",
  idempotencyKey: "receipt:0199e7e8",
} as const;

describe("InventoryMovementSchema", () => {
  it("accepts a valid decimal movement", () => {
    expect(InventoryMovementSchema.parse(movement).quantityDelta).toBe(
      "10.500",
    );
  });

  it("rejects zero quantity movements", () => {
    expect(() =>
      InventoryMovementSchema.parse({ ...movement, quantityDelta: "0" }),
    ).toThrow("cannot be zero");
  });
});
