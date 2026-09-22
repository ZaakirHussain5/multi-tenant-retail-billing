import type { PurchaseOrderStatus } from "@retail/contracts";

const transitions: Record<PurchaseOrderStatus, readonly PurchaseOrderStatus[]> =
  {
    draft: ["pending_approval", "cancelled"],
    pending_approval: ["approved", "draft", "cancelled"],
    approved: ["sent", "cancelled"],
    sent: ["partially_received", "received", "cancelled"],
    partially_received: ["partially_received", "received"],
    received: ["closed"],
    closed: [],
    cancelled: [],
  };

export function assertPurchaseOrderTransition(
  current: PurchaseOrderStatus,
  next: PurchaseOrderStatus,
): void {
  if (!transitions[current].includes(next)) {
    throw new Error(`Invalid purchase order transition: ${current} -> ${next}`);
  }
}

export function receiptStatus(
  ordered: string,
  receivedBefore: string,
  receivingNow: string,
): "partially_received" | "received" {
  const totalReceived = Number(receivedBefore) + Number(receivingNow);
  if (totalReceived > Number(ordered))
    throw new Error("Receipt exceeds ordered quantity");
  return totalReceived === Number(ordered) ? "received" : "partially_received";
}
