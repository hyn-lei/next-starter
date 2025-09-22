import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCreemConfig } from "@/lib/creem-config";
import {
  processPaymentIdempotent,
  getOrderDetails,
  processPaymentIdempotentByCheckoutId,
  getOrderDetailsByCheckoutId,
} from "@/lib/payment-utils";
import crypto from "crypto";

/**
 * Creem.io redirect parameters interface
 * Based on documentation: https://docs.creem.io/checkout-flow
 */
export interface RedirectParams {
  checkout_id?: string | null;
  order_id?: string | null;
  customer_id?: string | null;
  subscription_id?: string | null;
  product_id?: string | null;
  request_id?: string | null;
  status?: string | null;
  signature?: string | null;
}

/**
 * Generate Creem.io redirect signature
 *
 * According to the format described in Creem.io documentation:
 * 1. Organize all parameters in key=value format
 * 2. Add salt=api_key
 * 3. Connect all parts with |
 * 4. Use SHA256 hash
 *
 * Note: Parameter order is important, need to process in the order sent by Creem
 */
function generateSignature(params: RedirectParams, apiKey: string): string {
  // Process parameters in standard order according to Creem.io documentation
  const orderedKeys = [
    "checkout_id",
    "order_id",
    "customer_id",
    "subscription_id",
    "product_id",
    "request_id",
    "status",
  ];

  const paramStrings: string[] = [];

  // Add existing parameters in predefined order
  for (const key of orderedKeys) {
    const value = params[key as keyof RedirectParams];
    if (value !== null && value !== undefined && value !== "") {
      paramStrings.push(`${key}=${value}`);
    }
  }

  // Add salt
  paramStrings.push(`salt=${apiKey}`);

  const data = paramStrings.join("|");

  console.log("Generate signature data:", data);
  const signature = crypto.createHash("sha256").update(data).digest("hex");
  console.log("Generated signature:", signature);

  return signature;
}

/**
 * Verify Creem.io signature
 */
function verifyCreemSignature(params: RedirectParams, apiKey: string): boolean {
  if (!params.signature) {
    console.error("Signature verification failed: no signature provided");
    return false;
  }

  const expectedSignature = generateSignature(params, apiKey);
  const isValid = params.signature === expectedSignature;

  if (!isValid) {
    console.error("Signature verification failed:", {
      received: params.signature,
      expected: expectedSignature,
      params: Object.fromEntries(
        Object.entries(params).filter(
          ([k, v]) => k !== "signature" && v !== null,
        ),
      ),
    });
  } else {
    console.log("✅ Signature verification successful");
  }

  return isValid;
}

/**
 * Verify payment status and update order
 * GET /api/payment/verify?order_id=xxx&signature=xxx...
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("Verification failed: user not logged in");
      return NextResponse.json(
        { error: "user not logged in" },
        { status: 401 },
      );
    }

    const searchParams = req.nextUrl.searchParams;

    // Extract Creem.io redirect parameters
    const redirectParams: RedirectParams = {
      checkout_id: searchParams.get("checkout_id"),
      order_id: searchParams.get("order_id"),
      customer_id: searchParams.get("customer_id"),
      subscription_id: searchParams.get("subscription_id"),
      product_id: searchParams.get("product_id"),
      request_id: searchParams.get("request_id"),
      status: searchParams.get("status"),
      signature: searchParams.get("signature"),
    };

    console.log("Received payment verification request:", {
      ...redirectParams,
      signature: redirectParams.signature
        ? `${redirectParams.signature.substring(0, 8)}...`
        : "null",
    });

    // Verify required parameters
    if (!redirectParams.checkout_id) {
      console.error("Verification failed: missing order ID");
      return NextResponse.json(
        {
          error: "missing order id",
          success: false,
        },
        { status: 400 },
      );
    }

    if (!redirectParams.signature) {
      console.error("Verification failed: missing signature");
      return NextResponse.json(
        {
          error: "missing signature",
          success: false,
        },
        { status: 400 },
      );
    }

    // Get configuration and verify signature
    const creemConfig = getCreemConfig();
    if (!creemConfig.apiKey) {
      console.error("CREEM_API_KEY not configured");
      return NextResponse.json(
        {
          error: "payment configuration error",
          success: false,
        },
        { status: 500 },
      );
    }

    // Verify signature
    const isSignatureValid = verifyCreemSignature(
      redirectParams,
      creemConfig.apiKey,
    );
    if (!isSignatureValid) {
      return NextResponse.json(
        {
          error:
            "signature verification failed, please ensure the link is from the official payment system",
          success: false,
        },
        { status: 400 },
      );
    }

    console.log("✅ Signature verification passed, querying order details...");

    // Query order details and verify user permissions
    const order = await getOrderDetailsByCheckoutId(
      redirectParams.checkout_id!,
      userId,
    );

    if (!order) {
      console.error(
        `Order ${redirectParams.order_id} does not exist or user ${userId} has no access`,
      );
      return NextResponse.json(
        {
          error: "order not found",
          success: false,
        },
        { status: 404 },
      );
    }

    console.log("✅ Order verification passed:", {
      orderId: order.orderId,
      amount: order.amount,
      credits: order.credits,
      status: order.status,
    });

    // Check payment status (if Creem provides status parameter)
    if (redirectParams.status && redirectParams.status !== "success") {
      console.warn(`Payment status is not success: ${redirectParams.status}`);
      return NextResponse.json(
        {
          error: `payment status: ${redirectParams.status}`,
          success: false,
          order: {
            orderId: order.orderId,
            amount: order.amount,
            credits: order.credits,
            status: order.status,
          },
        },
        { status: 400 },
      );
    }

    // Use idempotency to process payment completion
    console.log("Starting payment completion processing...");
    const processResult = await processPaymentIdempotentByCheckoutId(
      redirectParams.checkout_id!,
      "redirect_verification",
      {
        redirectParams,
        userId,
        timestamp: new Date().toISOString(),
      },
      redirectParams.order_id || undefined,
    );

    console.log("✅ Payment processing completed:", processResult);

    return NextResponse.json({
      success: true,
      alreadyProcessed: processResult.alreadyProcessed,
      message: processResult.alreadyProcessed
        ? "order already processed, credit added to your account"
        : "payment verification successful, credit added to your account",
      order: {
        orderId: order.orderId,
        amount: order.amount,
        credits: order.credits,
        status: "completed",
      },
      result: processResult.result,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);

    // Provide more detailed error information
    let errorMessage = "Payment verification failed";
    let errorDetails = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || "";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
        details:
          process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
      { status: 500 },
    );
  }
}
