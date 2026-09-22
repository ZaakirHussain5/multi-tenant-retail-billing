import { z } from "zod";

import { MoneySchema } from "./money.js";

export const CheckoutItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.string().regex(/^\d+(?:\.\d{1,3})?$/),
  unitPrice: MoneySchema,
  discount: MoneySchema.default("0"),
  gstRate: z.string().regex(/^\d+(?:\.\d{1,4})?$/),
  cessRate: z
    .string()
    .regex(/^\d+(?:\.\d{1,4})?$/)
    .default("0"),
  taxInclusive: z.boolean().default(false),
});

export const CheckoutSchema = z.object({
  storeId: z.string().uuid(),
  invoiceType: z.enum(["b2c", "b2b"]),
  customerName: z.string().trim().max(200).optional(),
  customerGstin: z.string().trim().length(15).optional(),
  supplierStateCode: z.string().length(2),
  placeOfSupply: z.string().length(2),
  paymentMethod: z.enum(["cash", "card", "upi", "credit"]),
  paymentReference: z.string().trim().max(120).optional(),
  items: z.array(CheckoutItemSchema).min(1),
});

export type Checkout = z.infer<typeof CheckoutSchema>;

export interface TaxCalculationResult {
  taxableAmount: string;
  cgst: string;
  sgst: string;
  igst: string;
  cess: string;
  totalTax: string;
  grandTotal: string;
}
