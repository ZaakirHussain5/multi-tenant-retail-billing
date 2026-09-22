const SENSITIVE_KEYS = new Set([
  "password",
  "passwordHash",
  "refreshToken",
  "sessionToken",
  "secret",
]);

export function redactAuditValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactAuditValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      SENSITIVE_KEYS.has(key) ? "[REDACTED]" : redactAuditValue(child),
    ]),
  );
}
