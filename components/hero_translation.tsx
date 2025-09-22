import { getTranslations } from "next-intl/server";

export async function HeroTitle() {
  const t = await getTranslations("home.hero");
  return <>{t("title")}</>;
}

export async function HeroSubtitle() {
  const t = await getTranslations("home.hero");
  return <>{t("subtitle")}</>;
}

export async function PdfImageBadge() {
  const t = await getTranslations("home.hero");
  return <>{t("badge")}</>;
}
