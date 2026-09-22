import { z } from "zod";

export const PurchaseOrderStatusSchema = z.enum([
  "draft",
  "pending_approval",
  "approved",
  "sent",
  "partially_received",
  "received",
  "closed",
  "cancelled",
]);

export type PurchaseOrderStatus = z.infer<typeof PurchaseOrderStatusSchema>;

export const ReceivePurchaseOrderSchema = z.object({
  purchaseOrderId: z.string().uuid(),
  receiptNumber: z.string().trim().min(1).max(50),
  items: z
    .array(
      z.object({
        purchaseOrderItemId: z.string().uuid(),
        quantity: z.string().regex(/^\d+(?:\.\d{1,3})?$/),
      }),
    )
    .min(1),
  notes: z.string().trim().max(2000).optional(),
});
