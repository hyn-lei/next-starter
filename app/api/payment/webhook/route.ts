import { NextRequest, NextResponse } from "next/server";
import { processPaymentIdempotentByCheckoutId } from "@/lib/payment-utils";
import crypto from "crypto";

/**
 * Verify Creem.io webhook signature
 * According to official documentation: use HMAC-SHA256 algorithm and webhook secret
 */
function verifyCreemWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) {
    return false;
  }

  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return signature === computedSignature;
}

/**
 * Handle creem.io payment webhook callback
 * POST /api/payment/webhook
 */
export async function POST(req: NextRequest) {
  let payload: string;

  try {
    // Get raw payload for signature verification
    payload = await req.text();

    // Verify webhook signature
    const signature = req.headers.get("creem-signature");
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CREEM_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 },
      );
    }

    const isValidSignature = verifyCreemWebhookSignature(
      payload,
      signature,
      webhookSecret,
    );
    if (!isValidSignature) {
      console.error("Webhook signature verification failed:", {
        received: signature,
        payload: payload.substring(0, 100) + "...",
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("✅ Webhook signature verification passed");

    // Parse webhook data
    const webhookData = JSON.parse(payload);

    console.log("Received creem.io webhook:", webhookData);

    // Handle based on webhook event type
    switch (webhookData.eventType) {
      case "checkout.completed":
      case "checkout.success":
        await handlePaymentSuccess(webhookData);
        break;

      case "checkout.failed":
      case "checkout.cancelled":
        await handlePaymentFailure(webhookData);
        break;

      default:
        console.log("Unhandled webhook event type:", webhookData.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Failed to process webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}

/**
 * Handle payment success
 * webhookdata data structure:
 * {
  id: 'evt_3sZ9ixubVbXGgSuHRt237Z',
  eventType: 'checkout.completed',
  created_at: 1749488128765,
  object: {
    id: 'ch_63ROnKa8j8TyFg4WE9bQhp', // This is checkoutId
    object: 'checkout',
    order: {
      object: 'order',
      id: 'ord_66rMmY4y0dQGGNvdBqdE1N', // This is orderId
      customer: 'cust_2fn8aBiqjlKu7fwrxSWzL7',
      product: 'prod_1HvMAaVOcCgwI8eOdKBFv0',
      amount: 500,
      currency: 'USD',
      status: 'paid',
      ...
    },
    ...
    metadata: {
      userId: 'user_2wiCRXxNiFAJNiu1WrCPHETobGe',
      credits: '200',
      purpose: 'credit_purchase',
      packageType: 'BASIC'
    },
    ...
  }
}
 */
async function handlePaymentSuccess(webhookData: any) {
  try {
    const checkoutObject = webhookData.object;
    const checkoutId = checkoutObject.id; // checkout ID
    const order = checkoutObject.order;
    const orderId = order.id; // order ID
    const { amount, currency } = order;

    console.log(
      `Payment success: checkoutId=${checkoutId}, orderId=${orderId}, amount=${amount} ${currency}`,
    );

    // Use idempotency processing tool to find order by checkoutId and update orderId
    const processResult = await processPaymentIdempotentByCheckoutId(
      checkoutId,
      "webhook",
      { webhookData },
      orderId, // Pass orderId for update
    );

    if (processResult.alreadyProcessed) {
      console.log(
        `Order checkoutId=${checkoutId} already processed, skipping webhook handling`,
      );
      return;
    }

    console.log("Credit top-up result:", processResult.result);
  } catch (error) {
    console.error("Failed to process payment success webhook:", error);
    throw error;
  }
}

/**
 * Handle payment failure
 */
async function handlePaymentFailure(webhookData: any) {
  try {
    const checkoutObject = webhookData.object;
    const checkoutId = checkoutObject.id;
    const { reason } = webhookData.data || webhookData;

    console.log(`Payment failed: checkoutId=${checkoutId}, reason: ${reason}`);

    // TODO: Update order status to failed
    // Can send email notification to user etc.
  } catch (error) {
    console.error("Failed to process payment failure webhook:", error);
    throw error;
  }
}

/**
 * Verify creem.io webhook signature
 * TODO: Implement according to actual creem.io documentation
 */
function verifyCreemSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  // Need to implement signature verification according to creem.io specific documentation
  // Usually HMAC-SHA256
  return true; // Temporarily return true
}
