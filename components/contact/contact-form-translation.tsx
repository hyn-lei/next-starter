"use client";

import { useTranslations } from "next-intl";

export function useContactFormTranslations() {
  const t = useTranslations("contactForm");

  return {
    firstName: t("firstName"),
    lastName: t("lastName"),
    email: t("email"),
    message: t("message"),
    sending: t("sending"),
    send: t("send"),
    submitted: t("submitted"),
  };
}
