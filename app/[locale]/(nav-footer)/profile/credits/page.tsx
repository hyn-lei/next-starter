"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

interface CreditPackage {
  credits: number;
  price: number;
  currency: string;
  name: string;
  description: string;
}

interface UsageRecord {
  id: number;
  action: string;
  credits: number;
  createdAt: string;
  metadata: {
    format?: string;
    width?: number;
    height?: number;
  };
}

interface PaymentRecord {
  id: number;
  amount: number;
  credits: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
}

interface UserCreditInfo {
  credits: number;
  usageHistory: UsageRecord[];
  paymentHistory: PaymentRecord[];
  packages: Record<string, CreditPackage>;
}

export default function ProfileCreditsPage() {
  const t = useTranslations("credits");
  const { isLoaded, userId } = useAuth();
  const [creditInfo, setCreditInfo] = useState<UserCreditInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const fetchCreditInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/payment");
      if (response.ok) {
        const data = await response.json();
        setCreditInfo(data);
      }
    } catch (error) {
      console.error(t("fetchError"), error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchCreditInfo();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, userId, fetchCreditInfo]);

  const handlePurchase = async (packageType: string) => {
    if (!userId || purchasing) return;
    setPurchasing(packageType);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageType }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.paymentUrl;
      } else {
        const error = await response.json();
        alert(error.error || t("purchaseError"));
      }
    } catch (error) {
      console.error(t("purchaseFailed"), error);
      alert(t("purchaseFailedMessage"));
    } finally {
      setPurchasing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to localize error codes
  const getLocalizedErrorMessage = (errorCode: string, errorData?: any) => {
    switch (errorCode) {
      case "INSUFFICIENT_CREDITS":
        return t("errors.INSUFFICIENT_CREDITS", {
          current: errorData?.current || 0,
          required: errorData?.required || 1,
        });
      case "SYSTEM_ERROR":
        return t("errors.SYSTEM_ERROR");
      case "ORDER_NOT_FOUND":
        return t("errors.ORDER_NOT_FOUND", {
          orderId: errorData?.orderId || "",
        });
      case "ORDER_ALREADY_PROCESSED":
        return t("errors.ORDER_ALREADY_PROCESSED");
      case "PAYMENT_COMPLETED":
        return t("errors.PAYMENT_COMPLETED", {
          credits: errorData?.credits || 0,
        });
      default:
        return errorCode;
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("signInPrompt")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>⚡</span>
          {t("balance.title")}
        </h2>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {creditInfo?.credits || 0} {t("balance.creditsUnit")}
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          {t("balance.description")}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>💳</span>
          {t("packages.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-md font-semibold mb-1">
                {t("packages.basic.name")}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {t("packages.basic.description")}
              </p>
            </div>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold">
                20 {t("balance.creditsUnit")}
              </div>
              <div className="text-md text-muted-foreground">5$</div>
            </div>
            <button
              onClick={() => handlePurchase("BASIC")}
              disabled={purchasing === "BASIC"}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t("packages.purchaseNow")}
            </button>
          </div>

          {creditInfo?.packages &&
            Object.entries(creditInfo.packages).map(([key, pkg]) => (
              <div
                key={key}
                className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 flex flex-col"
              >
                <div className="flex-grow">
                  <h3 className="text-md font-semibold mb-1">
                    {key === "BASIC"
                      ? t("packages.basic.name")
                      : key === "PREMIUM"
                        ? t("packages.premium.name")
                        : pkg.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {key === "BASIC"
                      ? t("packages.basic.description")
                      : key === "PREMIUM"
                        ? t("packages.premium.description")
                        : pkg.description}
                  </p>
                </div>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">
                    {pkg.credits} {t("balance.creditsUnit")}
                  </div>
                  <div className="text-md text-muted-foreground">
                    ${pkg.price.toFixed(2)} {pkg.currency}
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(key)}
                  disabled={purchasing === key}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {purchasing === key
                    ? t("packages.purchasing")
                    : t("packages.purchaseNow")}
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>📊</span>
          {t("usage.title")}
        </h2>
        <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {creditInfo?.usageHistory && creditInfo.usageHistory.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {creditInfo.usageHistory.map((usage) => (
                <div
                  key={usage.id}
                  className="p-4 flex justify-between items-center text-sm"
                >
                  <div>
                    <div className="font-medium">{usage.action}</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(usage.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${
                        [
                          "WELCOME_BONUS",
                          "PAYMENT_SUCCESS",
                          "ADMIN_GRANT",
                        ].includes(usage.action)
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {[
                        "WELCOME_BONUS",
                        "PAYMENT_SUCCESS",
                        "ADMIN_GRANT",
                      ].includes(usage.action)
                        ? "+"
                        : "-"}
                      {usage.credits} {t("balance.creditsUnit")}
                    </div>
                    {usage.metadata && (
                      <div className="text-xs text-muted-foreground">
                        {usage.metadata.format &&
                          `${t(
                            "usage.format",
                          )}: ${usage.metadata.format.toUpperCase()}`}
                        {usage.metadata.width &&
                          ` | ${usage.metadata.width}×${usage.metadata.height}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              {t("usage.noRecords")}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("payment.title")}</h2>
        <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {creditInfo?.paymentHistory &&
          creditInfo.paymentHistory.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {creditInfo.paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 flex justify-between items-center text-sm"
                >
                  <div>
                    <div className="font-medium text-green-600 dark:text-green-400">
                      +{payment.credits} {t("balance.creditsUnit")}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${payment.amount}</div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        payment.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : payment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                    >
                      {t(`payment.status${payment.status}` as any)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              {t("payment.noRecords")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
