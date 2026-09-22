import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import {
  productBarcodes,
  products,
  productVariants,
  withTenant,
} from "@retail/database";

@Injectable()
export class CatalogService {
  findByBarcode(tenantId: string, barcode: string) {
    return withTenant(tenantId, async (tx) => {
      const [result] = await tx
        .select({
          barcode: productBarcodes.value,
          productId: products.id,
          productName: products.name,
          variantId: productVariants.id,
          variantName: productVariants.name,
          sku: productVariants.sku,
          salePrice: productVariants.salePrice,
        })
        .from(productBarcodes)
        .innerJoin(
          productVariants,
          and(
            eq(productBarcodes.productVariantId, productVariants.id),
            eq(productBarcodes.tenantId, productVariants.tenantId),
          ),
        )
        .innerJoin(
          products,
          and(
            eq(productVariants.productId, products.id),
            eq(productVariants.tenantId, products.tenantId),
          ),
        )
        .where(
          and(
            eq(productBarcodes.tenantId, tenantId),
            eq(productBarcodes.value, barcode),
            eq(productVariants.isActive, true),
            eq(products.isActive, true),
          ),
        )
        .limit(1);

      return result ?? null;
    });
  }
}
