import { getTranslations } from "next-intl/server";

export async function getBlogTranslations() {
  const t = await getTranslations("blog");

  return {
    recentPost: t("recentPost"),
    categoryArticles: t("categoryArticles"),
    relatedArticles: t("relatedArticles"),
    previousPage: t("previousPage"),
    nextPage: t("nextPage"),
    backToBlog: t("backToBlog"),
  };
}
