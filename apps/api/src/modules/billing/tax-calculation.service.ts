import { Injectable } from "@nestjs/common";
import { Decimal } from "decimal.js";

import type { TaxCalculationResult } from "@retail/contracts";

interface TaxInput {
  amount: string;
  discount: string;
  gstRate: string;
  cessRate?: string;
  taxInclusive: boolean;
  supplierStateCode: string;
  placeOfSupply: string;
}

const money = (value: Decimal): string =>
  value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);

@Injectable()
export class TaxCalculationService {
  calculate(input: TaxInput): TaxCalculationResult {
    const netAmount = Decimal.max(
      new Decimal(input.amount).minus(input.discount),
      0,
    );
    const gstRate = new Decimal(input.gstRate).dividedBy(100);
    const cessRate = new Decimal(input.cessRate ?? "0").dividedBy(100);
    const divisor = new Decimal(1).plus(gstRate).plus(cessRate);
    const taxableAmount = input.taxInclusive
      ? netAmount.dividedBy(divisor)
      : netAmount;
    const gst = taxableAmount.times(gstRate);
    const cess = taxableAmount.times(cessRate);
    const interstate = input.supplierStateCode !== input.placeOfSupply;
    const igst = interstate ? gst : new Decimal(0);
    const cgst = interstate ? new Decimal(0) : gst.dividedBy(2);
    const sgst = interstate ? new Decimal(0) : gst.minus(cgst);
    const totalTax = gst.plus(cess);
    const grandTotal = taxableAmount.plus(totalTax);

    return {
      taxableAmount: money(taxableAmount),
      cgst: money(cgst),
      sgst: money(sgst),
      igst: money(igst),
      cess: money(cess),
      totalTax: money(totalTax),
      grandTotal: money(grandTotal),
    };
  }
}
