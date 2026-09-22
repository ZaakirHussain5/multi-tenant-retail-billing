CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'finalized', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."invoice_type" AS ENUM('b2c', 'b2b');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'card', 'upi', 'credit');--> statement-breakpoint
CREATE TABLE "invoice_sequences" (
	"tenant_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"financial_year" varchar(9) NOT NULL,
	"series" varchar(16) NOT NULL,
	"next_value" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "invoice_sequences_tenant_id_store_id_financial_year_series_pk" PRIMARY KEY("tenant_id","store_id","financial_year","series"),
	CONSTRAINT "invoice_sequence_positive_check" CHECK ("invoice_sequences"."next_value" > 0)
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"method" "payment_method" NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"reference" varchar(120),
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_amount_positive_check" CHECK ("payments"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "sales_invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"product_variant_id" uuid NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"sku" varchar(100) NOT NULL,
	"hsn_sac" varchar(16),
	"quantity" numeric(18, 3) NOT NULL,
	"unit_price" numeric(18, 2) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"taxable_amount" numeric(18, 2) NOT NULL,
	"gst_rate" numeric(7, 4) NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"line_total" numeric(18, 2) NOT NULL,
	"unit_cost" numeric(18, 4) NOT NULL,
	CONSTRAINT "invoice_item_quantity_check" CHECK ("sales_invoice_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "sales_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"financial_year" varchar(9) NOT NULL,
	"series" varchar(16) NOT NULL,
	"type" "invoice_type" NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"customer_name" varchar(200),
	"customer_gstin" varchar(15),
	"place_of_supply" varchar(2) NOT NULL,
	"subtotal" numeric(18, 2) NOT NULL,
	"discount_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"taxable_total" numeric(18, 2) NOT NULL,
	"cgst_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"grand_total" numeric(18, 2) NOT NULL,
	"finalized_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice_sequences" ADD CONSTRAINT "invoice_sequences_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_sequences" ADD CONSTRAINT "invoice_sequences_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payments_tenant_invoice_idx" ON "payments" USING btree ("tenant_id","invoice_id");--> statement-breakpoint
CREATE INDEX "invoice_items_tenant_invoice_idx" ON "sales_invoice_items" USING btree ("tenant_id","invoice_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoice_business_number_uidx" ON "sales_invoices" USING btree ("tenant_id","store_id","financial_year","series","invoice_number");--> statement-breakpoint
CREATE INDEX "invoices_tenant_store_date_idx" ON "sales_invoices" USING btree ("tenant_id","store_id","created_at");
--> statement-breakpoint
ALTER TABLE "invoice_sequences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoice_sequences" FORCE ROW LEVEL SECURITY;
CREATE POLICY "invoice_sequences_tenant_isolation" ON "invoice_sequences"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
--> statement-breakpoint
ALTER TABLE "sales_invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales_invoices" FORCE ROW LEVEL SECURITY;
CREATE POLICY "sales_invoices_tenant_isolation" ON "sales_invoices"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales_invoice_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY "sales_invoice_items_tenant_isolation" ON "sales_invoice_items"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" FORCE ROW LEVEL SECURITY;
CREATE POLICY "payments_tenant_isolation" ON "payments"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
