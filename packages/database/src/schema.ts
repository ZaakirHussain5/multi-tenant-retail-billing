import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tenantStatus = pgEnum("tenant_status", ["active", "suspended"]);
export const inventoryMovementType = pgEnum("inventory_movement_type", [
  "purchase_receipt",
  "sale",
  "sale_return",
  "stock_adjustment",
  "transfer_out",
  "transfer_in",
]);

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 63 }).notNull(),
    status: tenantStatus("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("tenants_slug_uidx").on(table.slug)],
);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 32 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("stores_tenant_code_uidx").on(table.tenantId, table.code),
    index("stores_tenant_idx").on(table.tenantId),
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    displayName: varchar("display_name", { length: 160 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("users_email_uidx").on(table.email)],
);

export const tenantMemberships = pgTable(
  "tenant_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    defaultStoreId: uuid("default_store_id").references(() => stores.id, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("memberships_tenant_user_uidx").on(
      table.tenantId,
      table.userId,
    ),
    index("memberships_tenant_idx").on(table.tenantId),
    index("memberships_user_idx").on(table.userId),
  ],
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    isSystem: boolean("is_system").notNull().default(false),
  },
  (table) => [
    uniqueIndex("roles_tenant_name_uidx").on(table.tenantId, table.name),
  ],
);

export const permissions = pgTable("permissions", {
  key: varchar("key", { length: 120 }).primaryKey(),
  description: varchar("description", { length: 255 }).notNull(),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionKey: varchar("permission_key", { length: 120 })
      .notNull()
      .references(() => permissions.key, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionKey] })],
);

export const membershipRoles = pgTable(
  "membership_roles",
  {
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => tenantMemberships.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.membershipId, table.roleId] })],
);

export const taxCodes = pgTable(
  "tax_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    hsnSac: varchar("hsn_sac", { length: 16 }),
    rate: numeric("rate", { precision: 7, scale: 4 }).notNull(),
    cessRate: numeric("cess_rate", { precision: 7, scale: 4 })
      .notNull()
      .default("0"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    uniqueIndex("tax_codes_tenant_name_uidx").on(table.tenantId, table.name),
    check("tax_codes_rate_check", sql`${table.rate} >= 0`),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 120 }),
    taxCodeId: uuid("tax_code_id").references(() => taxCodes.id, {
      onDelete: "restrict",
    }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("products_tenant_name_idx").on(table.tenantId, table.name),
    index("products_tenant_category_idx").on(table.tenantId, table.category),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 100 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    unit: varchar("unit", { length: 24 }).notNull().default("each"),
    salePrice: numeric("sale_price", { precision: 18, scale: 2 }).notNull(),
    attributes: jsonb("attributes")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    uniqueIndex("variants_tenant_sku_uidx").on(table.tenantId, table.sku),
    index("variants_tenant_product_idx").on(table.tenantId, table.productId),
    check("variants_sale_price_check", sql`${table.salePrice} >= 0`),
  ],
);

export const productBarcodes = pgTable(
  "product_barcodes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    value: varchar("value", { length: 128 }).notNull(),
  },
  (table) => [
    uniqueIndex("barcodes_tenant_value_uidx").on(table.tenantId, table.value),
    index("barcodes_tenant_variant_idx").on(
      table.tenantId,
      table.productVariantId,
    ),
  ],
);

export const inventoryLedger = pgTable(
  "inventory_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "restrict" }),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "restrict" }),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),
    movementType: inventoryMovementType("movement_type").notNull(),
    quantityDelta: numeric("quantity_delta", {
      precision: 18,
      scale: 3,
    }).notNull(),
    unitCost: numeric("unit_cost", { precision: 18, scale: 4 }),
    referenceType: varchar("reference_type", { length: 50 }).notNull(),
    referenceId: uuid("reference_id").notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 120 }).notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    uniqueIndex("ledger_tenant_idempotency_uidx").on(
      table.tenantId,
      table.idempotencyKey,
    ),
    index("ledger_tenant_store_variant_idx").on(
      table.tenantId,
      table.storeId,
      table.productVariantId,
    ),
    check("ledger_nonzero_quantity_check", sql`${table.quantityDelta} <> 0`),
  ],
);

export const stockBalances = pgTable(
  "stock_balances",
  {
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: numeric("quantity", { precision: 18, scale: 3 })
      .notNull()
      .default("0"),
    averageUnitCost: numeric("average_unit_cost", { precision: 18, scale: 4 })
      .notNull()
      .default("0"),
    version: integer("version").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.tenantId, table.storeId, table.productVariantId],
    }),
    index("stock_tenant_store_idx").on(table.tenantId, table.storeId),
    check("stock_nonnegative_check", sql`${table.quantity} >= 0`),
  ],
);

export const tenantDomains = pgTable(
  "tenant_domains",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    hostname: varchar("hostname", { length: 253 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("tenant_domains_hostname_uidx").on(table.hostname),
    index("tenant_domains_tenant_idx").on(table.tenantId),
  ],
);
