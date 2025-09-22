/**
 * Creem.io configuration management
 * Centralized management of all Creem.io related configuration
 */

export interface CreemConfig {
  serverMode: number;
  apiKey: string;
  productMapping: {
    BASIC: string;
    PREMIUM: string;
  };
}

/**
 * Get Creem.io configuration
 */
export function getCreemConfig(): CreemConfig {
  const serverMode = parseInt(process.env.CREEM_SERVER_MODE || "1");
  const apiKey = process.env.CREEM_API_KEY || "";

  const config: CreemConfig = {
    serverMode,
    apiKey,
    productMapping: {
      BASIC: process.env.CREEM_PRODUCT_BASIC || "prod_basic_200_credits",
      PREMIUM: process.env.CREEM_PRODUCT_PREMIUM || "prod_premium_500_credits",
    },
  };

  return config;
}

/**
 * Validate Creem.io configuration
 */
export function validateCreemConfig(): { isValid: boolean; errors: string[] } {
  const config = getCreemConfig();
  const errors: string[] = [];

  if (!config.apiKey) {
    errors.push("CREEM_API_KEY not set");
  }

  if (!process.env.CREEM_PRODUCT_BASIC) {
    errors.push("CREEM_PRODUCT_BASIC not set, using default value");
  }

  if (!process.env.CREEM_PRODUCT_PREMIUM) {
    errors.push("CREEM_PRODUCT_PREMIUM not set, using default value");
  }

  if (config.serverMode !== 0 && config.serverMode !== 1) {
    errors.push("CREEM_SERVER_MODE must be 0 (production) or 1 (test mode)");
  }

  return {
    isValid: errors.length === 0 || (errors.length <= 2 && !!config.apiKey), // Valid if only product IDs use default values and API Key is present
    errors,
  };
}

/**
 * Print configuration information (for debugging)
 */
export function logCreemConfig(): void {
  const config = getCreemConfig();
  const validation = validateCreemConfig();

  console.log("🔧 Creem.io Configuration:");
  console.log(
    "  Server mode:",
    config.serverMode === 1
      ? "TEST (test mode)"
      : "PRODUCTION (production mode)",
  );
  console.log("  API Key:", config.apiKey ? "✅ Set" : "❌ Not set");
  console.log("  Product mapping:", config.productMapping);

  if (!validation.isValid) {
    console.warn("⚠️  Configuration warnings:");
    validation.errors.forEach((error) => console.warn(`  - ${error}`));
  } else {
    console.log("✅ Configuration validation passed");
  }
}

/**
 * Get product ID
 */
export function getProductId(packageType: "BASIC" | "PREMIUM"): string {
  const config = getCreemConfig();
  return config.productMapping[packageType];
}

/**
 * Check if in test mode
 */
export function isTestMode(): boolean {
  const config = getCreemConfig();
  return config.serverMode === 1;
}

/**
 * Check if in production mode
 */
export function isProductionMode(): boolean {
  return !isTestMode();
}
