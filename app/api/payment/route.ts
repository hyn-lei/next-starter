import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Import Creem.io SDK
import { Creem } from "creem";
import {
  getCreemConfig,
  logCreemConfig,
  getProductId,
  validateCreemConfig,
} from "@/lib/creem-config";

// Print configuration info on initialization
logCreemConfig();

/**
 * Create payment order
 * POST /api/payment
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 },
      );
    }

    const { packageType } = await req.json();

    // Validate package type
    // const selectedPackage =
    //   CREDIT_PACKAGES[packageType as keyof typeof CREDIT_PACKAGES];
    // if (!selectedPackage) {
    //   return NextResponse.json(
    //     { error: "Invalid package type" },
    //     { status: 400 }
    //   );
    // }

    const selectedPackage = "BASIC";
    // Get user email
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    const userEmail =
      user.email_addresses?.[0]?.email_address || "unknown@email.com";

    // Get Creem.io configuration
    const creemConfig = getCreemConfig();

    // Validate configuration
    const configValidation = validateCreemConfig();
    if (!configValidation.isValid) {
      console.error("Creem.io configuration invalid:", configValidation.errors);
      return NextResponse.json(
        { error: "Creem.io configuration error" },
        { status: 500 },
      );
    }

    // Use real Creem.io SDK to create payment session
    const creem = new Creem({
      serverIdx: creemConfig.serverMode, // Read from environment variables: 1=test mode, 0=production mode
    });

    const creemProductId = getProductId(packageType as "BASIC" | "PREMIUM");

    console.log("Create payment session:", {
      creemProductId,
      packageType,
      serverMode: creemConfig.serverMode === 1 ? "TEST" : "PRODUCTION",
      productMapping: creemConfig.productMapping,
    });
    const checkoutResult = await creem.createCheckout({
      xApiKey: creemConfig.apiKey,
      createCheckoutRequest: {
        productId: creemProductId,
        units: 1,
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        customer: {
          // id: userId,
          email: userEmail,
        },
        metadata: {
          credits: 5,
          userId: userId,
          packageType: packageType,
          purpose: "credit_purchase",
        },
      },
    });

    const checkoutId = checkoutResult.id;
    const paymentUrl = checkoutResult.checkoutUrl;

    // Temporary: Simulate creem.io response (use before getting real API keys)
    // const creemOrderId = `creem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // const paymentUrl = `https://pay.creem.io/checkout/${creemOrderId}`;

    console.log("Create payment order:", checkoutResult, {
      userEmail,
      userId,
      selectedPackage,
      checkoutId,
    });

    // Create order record in database, save checkoutId
    // await CreditService.createPaymentOrder(
    //   userId,
    //   userEmail,
    //   selectedPackage.price,
    //   selectedPackage.credits,
    //   checkoutId,
    //   packageType
    // );

    return NextResponse.json({
      success: true,
      checkoutId: checkoutId,
      paymentUrl: paymentUrl,
      package: selectedPackage,
    });
  } catch (error) {
    console.error("Failed to create payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}

/**
 * Get user's current credit balance
 * GET /api/payment
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 },
      );
    }

    // const credits = await CreditService.getUserCredits(userId);
    // const usageHistory = await CreditService.getCreditUsageHistory(userId, 10);
    // const paymentHistory = await CreditService.getPaymentHistory(userId, 10);
    // Waiting for completion of subsequent logic
    const credits = 100;
    const usageHistory = 99;
    const paymentHistory = 1;

    return NextResponse.json({
      credits,
      usageHistory,
      paymentHistory,
      // packages: CREDIT_PACKAGES,
    });
  } catch (error) {
    console.error("Failed to get user credit information:", error);
    return NextResponse.json(
      { error: "Failed to get information" },
      { status: 500 },
    );
  }
}
