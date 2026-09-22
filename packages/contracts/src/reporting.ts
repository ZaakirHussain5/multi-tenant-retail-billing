import { z } from "zod";

export const ReportRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    storeId: z.string().uuid().optional(),
  })
  .refine((range) => range.from <= range.to, {
    message: "Report start must be before report end",
  });

export interface ProfitabilitySummary {
  grossRevenue: string;
  discounts: string;
  netSales: string;
  cogs: string;
  grossProfit: string;
  operatingExpenses: string;
  operationalProfit: string;
}
