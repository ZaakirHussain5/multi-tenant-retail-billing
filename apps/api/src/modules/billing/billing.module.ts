import { Module } from "@nestjs/common";

import { TaxCalculationService } from "./tax-calculation.service.js";

@Module({
  providers: [TaxCalculationService],
  exports: [TaxCalculationService],
})
export class BillingModule {}
