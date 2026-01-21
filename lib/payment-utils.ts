/**
 * Utility functions for payment confirmation
 * These functions can be called from admin panel or webhook handlers
 */

export interface PendingTransaction {
  transactionId: string;
  description: string;
  amount: number;
  createdAt: number;
}

export interface ConfirmedPayment {
  transactionId?: string;
  description: string;
  amount?: number;
  confirmedAt: number;
}

/**
 * Get all pending transactions
 */
export function getPendingTransactions(): PendingTransaction[] {
  if (typeof window === "undefined") return [];
  
  try {
    return JSON.parse(localStorage.getItem("pendingTransactions") || "[]");
  } catch {
    return [];
  }
}

/**
 * Confirm a payment by transaction ID or description
 * This should be called when payment is verified (by admin or webhook)
 */
export function confirmPayment(
  identifier: { transactionId?: string; description?: string },
  amount?: number
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const confirmedPayments: ConfirmedPayment[] = JSON.parse(
      localStorage.getItem("confirmedPayments") || "[]"
    );

    // Check if already confirmed
    const alreadyConfirmed = confirmedPayments.some(
      (p) =>
        (identifier.transactionId && p.transactionId === identifier.transactionId) ||
        (identifier.description && p.description === identifier.description)
    );

    if (alreadyConfirmed) {
      return false; // Already confirmed
    }

    // Add to confirmed list
    confirmedPayments.push({
      transactionId: identifier.transactionId,
      description: identifier.description || "",
      amount,
      confirmedAt: Date.now(),
    });

    localStorage.setItem("confirmedPayments", JSON.stringify(confirmedPayments));

    // Dispatch custom event to notify components
    window.dispatchEvent(
      new CustomEvent("paymentConfirmed", {
        detail: identifier,
      })
    );

    return true;
  } catch (error) {
    console.error("Error confirming payment:", error);
    return false;
  }
}

/**
 * Confirm payment by description (useful when you only have the transfer content)
 * Example: confirmPaymentByDescription("Nap tien vao vi 1768815930428")
 */
export function confirmPaymentByDescription(description: string): boolean {
  return confirmPayment({ description });
}

/**
 * Confirm payment by transaction ID
 */
export function confirmPaymentByTransactionId(transactionId: string): boolean {
  return confirmPayment({ transactionId });
}

/**
 * Clear confirmed payments (useful for testing)
 */
export function clearConfirmedPayments(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("confirmedPayments");
}

/**
 * Clear pending transactions (useful for testing)
 */
export function clearPendingTransactions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("pendingTransactions");
}

/**
 * Get all confirmed payments
 */
export function getConfirmedPayments(): ConfirmedPayment[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("confirmedPayments") || "[]");
  } catch {
    return [];
  }
}

// Expose to window for easy access from browser console (development only)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).paymentUtils = {
    confirmPayment,
    confirmPaymentByDescription,
    confirmPaymentByTransactionId,
    getPendingTransactions,
    getConfirmedPayments,
    clearConfirmedPayments,
    clearPendingTransactions,
  };
}
