CREATE TYPE "public"."tenant_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TABLE "membership_roles" (
	"membership_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "membership_roles_membership_id_role_id_pk" PRIMARY KEY("membership_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"description" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_key" varchar(120) NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_key_pk" PRIMARY KEY("role_id","permission_key")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(160) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"hostname" varchar(253) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"default_store_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(63) NOT NULL,
	"status" "tenant_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"display_name" varchar(160) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "membership_roles" ADD CONSTRAINT "membership_roles_membership_id_tenant_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."tenant_memberships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_roles" ADD CONSTRAINT "membership_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_key_permissions_key_fk" FOREIGN KEY ("permission_key") REFERENCES "public"."permissions"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_domains" ADD CONSTRAINT "tenant_domains_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_default_store_id_stores_id_fk" FOREIGN KEY ("default_store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "roles_tenant_name_uidx" ON "roles" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "stores_tenant_code_uidx" ON "stores" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "stores_tenant_idx" ON "stores" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_domains_hostname_uidx" ON "tenant_domains" USING btree ("hostname");--> statement-breakpoint
CREATE INDEX "tenant_domains_tenant_idx" ON "tenant_domains" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_tenant_user_uidx" ON "tenant_memberships" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "memberships_tenant_idx" ON "tenant_memberships" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "memberships_user_idx" ON "tenant_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_slug_uidx" ON "tenants" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uidx" ON "users" USING btree ("email");
--> statement-breakpoint
ALTER TABLE "stores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stores" FORCE ROW LEVEL SECURITY;
CREATE POLICY "stores_tenant_isolation" ON "stores"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
--> statement-breakpoint
ALTER TABLE "tenant_memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenant_memberships" FORCE ROW LEVEL SECURITY;
CREATE POLICY "memberships_tenant_isolation" ON "tenant_memberships"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
--> statement-breakpoint
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roles" FORCE ROW LEVEL SECURITY;
CREATE POLICY "roles_tenant_isolation" ON "roles"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
--> statement-breakpoint
ALTER TABLE "membership_roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "membership_roles" FORCE ROW LEVEL SECURITY;
CREATE POLICY "membership_roles_tenant_isolation" ON "membership_roles"
  USING (
    EXISTS (
      SELECT 1 FROM tenant_memberships membership
      WHERE membership.id = membership_id
        AND membership.tenant_id = current_setting('app.tenant_id', true)::uuid
    )
  );
--> statement-breakpoint
ALTER TABLE "role_permissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "role_permissions" FORCE ROW LEVEL SECURITY;
CREATE POLICY "role_permissions_tenant_isolation" ON "role_permissions"
  USING (
    EXISTS (
      SELECT 1 FROM roles role
      WHERE role.id = role_id
        AND role.tenant_id = current_setting('app.tenant_id', true)::uuid
    )
  );
