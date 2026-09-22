import { z } from "zod";

import { MoneySchema } from "./money.js";

export const CreateProductSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().max(120).optional(),
  taxCodeId: z.string().uuid().optional(),
  variant: z.object({
    sku: z.string().trim().min(1).max(100),
    name: z.string().trim().min(1).max(160),
    unit: z.string().trim().min(1).max(24).default("each"),
    salePrice: MoneySchema,
    barcodes: z.array(z.string().trim().min(1).max(128)).default([]),
  }),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;
