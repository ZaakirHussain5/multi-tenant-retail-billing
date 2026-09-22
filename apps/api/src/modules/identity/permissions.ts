import type { PermissionKey } from "@retail/contracts";

export function hasAllPermissions(
  granted: readonly PermissionKey[],
  required: readonly PermissionKey[],
): boolean {
  const grantedSet = new Set(granted);
  return required.every((permission) => grantedSet.has(permission));
}
