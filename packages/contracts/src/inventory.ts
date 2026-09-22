import { z } from "zod";

export const InventoryMovementSchema = z
  .object({
    tenantId: z.string().uuid(),
    storeId: z.string().uuid(),
    productVariantId: z.string().uuid(),
    movementType: z.enum([
      "purchase_receipt",
      "sale",
      "sale_return",
      "stock_adjustment",
      "transfer_out",
      "transfer_in",
    ]),
    quantityDelta: z.string().regex(/^-?\d+(?:\.\d{1,3})?$/),
    unitCost: z
      .string()
      .regex(/^\d+(?:\.\d{1,4})?$/)
      .optional(),
    referenceType: z.string().min(1).max(50),
    referenceId: z.string().uuid(),
    idempotencyKey: z.string().min(8).max(120),
    createdBy: z.string().uuid().optional(),
  })
  .refine((value) => Number(value.quantityDelta) !== 0, {
    message: "Inventory movement quantity cannot be zero",
    path: ["quantityDelta"],
  });

export type InventoryMovement = z.infer<typeof InventoryMovementSchema>;
