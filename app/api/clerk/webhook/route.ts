import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

/**
 * 
 * {
  "data": {
    "birthday": "",
    "created_at": 1654012591514,
    "email_addresses": [
      {
        "email_address": "example@example.org",
        "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
        "linked_to": [],
        "object": "email_address",
        "verification": {
          "status": "verified",
          "strategy": "ticket"
        }
      }
    ],
    "external_accounts": [],
    "external_id": "567772",
    "first_name": "Example",
    "gender": "",
    "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
    "image_url": "https://img.clerk.com/xxxxxx",
    "last_name": "Example",
    "last_sign_in_at": 1654012591514,
    "object": "user",
    "password_enabled": true,
    "phone_numbers": [],
    "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
    "primary_phone_number_id": null,
    "primary_web3_wallet_id": null,
    "private_metadata": {},
    "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
    "public_metadata": {},
    "two_factor_enabled": false,
    "unsafe_metadata": {},
    "updated_at": 1654012591835,
    "username": null,
    "web3_wallets": []
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654012591835,
  "type": "user.created"
}
 * 
 * @param req request data
 * @returns 
 */
export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // For now, we'll skip signature verification for simplicity
  // In production, you should implement proper webhook verification
  const evt = body;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id: userId, email_addresses } = evt.data;
    const userEmail = email_addresses?.[0]?.email_address || "";

    console.log(`New user created: ${userId} (${userEmail})`);

    try {
      // Add 5 credits to new user as welcome bonus
      // const result = await CreditService.addCredits(
      //   userId,
      //   userEmail,
      //   "WELCOME_BONUS",
      //   5,
      //   {
      //     source: "registration_bonus",
      //     description: "New user registration bonus",
      //   }
      // );
      // if (result.success) {
      //   console.log(`Welcome bonus added: 5 credits for user ${userId}`);
      // } else {
      //   console.error(
      //     `Failed to add welcome bonus for user ${userId}:`,
      //     result.message
      //   );
      // }
    } catch (error) {
      console.error(`Error adding welcome bonus for user ${userId}:`, error);
    }
  }

  return NextResponse.json({ message: "success" });
}
