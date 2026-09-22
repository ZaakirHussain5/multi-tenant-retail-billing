import { Decimal } from "decimal.js";

import type { ProfitabilitySummary } from "@retail/contracts";

interface ProfitabilityInput {
  grossRevenue: string;
  discounts: string;
  cogs: string;
  operatingExpenses: string;
}

const value = (amount: Decimal): string => amount.toDecimalPlaces(2).toFixed(2);

export function calculateProfitability(
  input: ProfitabilityInput,
): ProfitabilitySummary {
  const grossRevenue = new Decimal(input.grossRevenue);
  const discounts = new Decimal(input.discounts);
  const cogs = new Decimal(input.cogs);
  const operatingExpenses = new Decimal(input.operatingExpenses);
  const netSales = grossRevenue.minus(discounts);
  const grossProfit = netSales.minus(cogs);
  const operationalProfit = grossProfit.minus(operatingExpenses);

  return {
    grossRevenue: value(grossRevenue),
    discounts: value(discounts),
    netSales: value(netSales),
    cogs: value(cogs),
    grossProfit: value(grossProfit),
    operatingExpenses: value(operatingExpenses),
    operationalProfit: value(operationalProfit),
  };
}
