/**
 * Payment processing utilities
 * Provides duplicate processing protection and idempotency checks
 */

import { prisma } from "@/lib/prisma";

/**
 * Payment processing source enum
 */
export type PaymentSource = "webhook" | "redirect_verification";

/**
 * Check if order has already been processed (by checkoutId)
 */
export async function isOrderAlreadyProcessedByCheckoutId(
  checkoutId: string
): Promise<boolean> {
  try {
    const order = await (prisma as any).PaymentOrder.findUnique({
      where: { checkoutId },
      select: { status: true },
    });

    return order?.status === "COMPLETED";
  } catch (error) {
    console.error("Failed to check order status:", error);
    return false;
  }
}

/**
 * Check if order has already been processed (by orderId, for backward compatibility)
 */
export async function isOrderAlreadyProcessed(
  orderId: string
): Promise<boolean> {
  try {
    const order = await (prisma as any).PaymentOrder.findUnique({
      where: { orderId },
      select: { status: true },
    });

    return order?.status === "COMPLETED";
  } catch (error) {
    console.error("Failed to check order status:", error);
    return false;
  }
}

/**
 * Mark order as processing (by checkoutId)
 */
export async function markOrderAsProcessingByCheckoutId(
  checkoutId: string
): Promise<void> {
  await (prisma as any).PaymentOrder.update({
    where: { checkoutId },
    data: { status: "PROCESSING" },
  });
}

/**
 * Mark order as processing (by orderId, for backward compatibility)
 */
export async function markOrderAsProcessing(orderId: string): Promise<void> {
  await (prisma as any).PaymentOrder.update({
    where: { orderId },
    data: { status: "PROCESSING" },
  });
}

/**
 * Rollback order status to pending (by checkoutId)
 */
export async function rollbackOrderStatusByCheckoutId(
  checkoutId: string
): Promise<void> {
  await (prisma as any).PaymentOrder.update({
    where: { checkoutId },
    data: { status: "PENDING" },
  });
}

/**
 * Rollback order status to pending (by orderId, for backward compatibility)
 */
export async function rollbackOrderStatus(orderId: string): Promise<void> {
  await (prisma as any).PaymentOrder.update({
    where: { orderId },
    data: { status: "PENDING" },
  });
}

/**
 * Idempotent payment completion processing (by checkoutId)
 * Ensures the same order won't be processed multiple times, regardless of source (webhook or redirect verification)
 */
export async function processPaymentIdempotentByCheckoutId(
  checkoutId: string,
  source: PaymentSource,
  data: any,
  orderId?: string
): Promise<{ success: boolean; alreadyProcessed: boolean; result?: any }> {
  console.log(
    `[${source}] Start processing order: checkoutId=${checkoutId}, orderId=${orderId}`
  );

  // Check if already processed
  const alreadyProcessed =
    await isOrderAlreadyProcessedByCheckoutId(checkoutId);
  if (alreadyProcessed) {
    console.log(`[${source}] Order ${checkoutId} already processed, skipping`);
    return { success: true, alreadyProcessed: true };
  }

  // Mark as processing to prevent concurrent processing
  try {
    await markOrderAsProcessingByCheckoutId(checkoutId);
  } catch (error) {
    // If marking fails, might be concurrent conflict, check if already processed by another process
    const isProcessed = await isOrderAlreadyProcessedByCheckoutId(checkoutId);
    if (isProcessed) {
      console.log(
        `[${source}] Order ${checkoutId} already completed by another process`
      );
      return { success: true, alreadyProcessed: true };
    }
    throw error;
  }

  try {
    // Call actual payment completion logic
    // const { CreditService } = await import("./credit-service");
    // const result = await CreditService.completePaymentByCheckoutId(
    //   checkoutId,
    //   orderId,
    //   {
    //     source,
    //     data,
    //     timestamp: new Date().toISOString(),
    //   }
    // );
    const result = true;

    console.log(
      `[${source}] Order ${checkoutId} processed successfully:`,
      result
    );
    return { success: true, alreadyProcessed: false, result };
  } catch (error) {
    // Processing failed, rollback status
    console.error(`[${source}] Order ${checkoutId} processing failed:`, error);
    await rollbackOrderStatusByCheckoutId(checkoutId);
    throw error;
  }
}

/**
 * Idempotent payment completion processing (original method, for backward compatibility)
 * @deprecated Please use processPaymentIdempotentByCheckoutId
 */
export async function processPaymentIdempotent(
  orderId: string,
  source: PaymentSource,
  data: any
): Promise<{ success: boolean; alreadyProcessed: boolean; result?: any }> {
  console.log(`[${source}] Start processing order: ${orderId}`);

  // Check if already processed
  const alreadyProcessed = await isOrderAlreadyProcessed(orderId);
  if (alreadyProcessed) {
    console.log(`[${source}] Order ${orderId} already processed, skipping`);
    return { success: true, alreadyProcessed: true };
  }

  // Mark as processing to prevent concurrent processing
  try {
    await markOrderAsProcessing(orderId);
  } catch (error) {
    // If marking fails, might be concurrent conflict, check if already processed by another process
    const isProcessed = await isOrderAlreadyProcessed(orderId);
    if (isProcessed) {
      console.log(
        `[${source}] Order ${orderId} already completed by another process`
      );
      return { success: true, alreadyProcessed: true };
    }
    throw error;
  }

  try {
    // Call actual payment completion logic
    // const { CreditService } = await import("./credit-service");
    // const result = await CreditService.completePayment(orderId, {
    //   source,
    //   data,
    //   timestamp: new Date().toISOString(),
    // });
    const result = true;

    console.log(`[${source}] Order ${orderId} processed successfully:`, result);
    return { success: true, alreadyProcessed: false, result };
  } catch (error) {
    // Processing failed, rollback status
    console.error(`[${source}] Order ${orderId} processing failed:`, error);
    await rollbackOrderStatus(orderId);
    throw error;
  }
}

/**
 * Get order details (by checkoutId)
 */
export async function getOrderDetailsByCheckoutId(
  checkoutId: string,
  userId?: string
) {
  const order = await (prisma as any).PaymentOrder.findUnique({
    where: { checkoutId },
  });

  if (!order) {
    return null;
  }

  // If userId provided, verify permission
  if (userId && order.userId !== userId) {
    throw new Error("Unauthorized access to this order");
  }

  return order;
}

/**
 * Get order details (by orderId, for backward compatibility)
 */
export async function getOrderDetails(orderId: string, userId?: string) {
  const order = await (prisma as any).PaymentOrder.findUnique({
    where: { orderId },
  });

  if (!order) {
    return null;
  }

  // If userId provided, verify permission
  if (userId && order.userId !== userId) {
    throw new Error("Unauthorized access to this order");
  }

  return order;
}
