import { z } from "zod";

export const PermissionKeySchema = z.enum([
  "invoice.create",
  "invoice.cancel",
  "invoice.refund",
  "inventory.view",
  "inventory.adjust",
  "purchase.create",
  "purchase.approve",
  "report.sales.view",
  "report.profit.view",
  "user.create",
  "user.manage",
]);

export type PermissionKey = z.infer<typeof PermissionKeySchema>;

export const SessionPrincipalSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  membershipId: z.string().uuid(),
  permissions: z.array(PermissionKeySchema),
});

export type SessionPrincipal = z.infer<typeof SessionPrincipalSchema>;
