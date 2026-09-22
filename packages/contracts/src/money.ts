import { z } from "zod";

export const MoneySchema = z
  .string()
  .regex(/^\d+(?:\.\d{1,2})?$/, "Money must have at most two decimal places");

export type Money = z.infer<typeof MoneySchema>;
