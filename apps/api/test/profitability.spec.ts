import { describe, expect, it } from "vitest";

import { calculateProfitability } from "../src/modules/reporting/profitability.js";

describe("calculateProfitability", () => {
  it("uses captured COGS and recorded expenses", () => {
    expect(
      calculateProfitability({
        grossRevenue: "10000",
        discounts: "500",
        cogs: "5700",
        operatingExpenses: "1200",
      }),
    ).toEqual({
      grossRevenue: "10000.00",
      discounts: "500.00",
      netSales: "9500.00",
      cogs: "5700.00",
      grossProfit: "3800.00",
      operatingExpenses: "1200.00",
      operationalProfit: "2600.00",
    });
  });
});
