import { describe, expect, it } from "vitest";

import { TaxCalculationService } from "../src/modules/billing/tax-calculation.service.js";

const service = new TaxCalculationService();

describe("TaxCalculationService", () => {
  it("splits intrastate GST into CGST and SGST", () => {
    expect(
      service.calculate({
        amount: "1000",
        discount: "0",
        gstRate: "18",
        taxInclusive: false,
        supplierStateCode: "29",
        placeOfSupply: "29",
      }),
    ).toEqual({
      taxableAmount: "1000.00",
      cgst: "90.00",
      sgst: "90.00",
      igst: "0.00",
      cess: "0.00",
      totalTax: "180.00",
      grandTotal: "1180.00",
    });
  });

  it("uses IGST for interstate sales and extracts inclusive tax", () => {
    const result = service.calculate({
      amount: "1180",
      discount: "0",
      gstRate: "18",
      taxInclusive: true,
      supplierStateCode: "29",
      placeOfSupply: "27",
    });

    expect(result.taxableAmount).toBe("1000.00");
    expect(result.igst).toBe("180.00");
    expect(result.grandTotal).toBe("1180.00");
  });
});
