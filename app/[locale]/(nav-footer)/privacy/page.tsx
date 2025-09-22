import { Metadata, ResolvingMetadata } from "next";
import { host, SITE_NAME } from "@/data";
import { LocalizedMarkdownContent } from "@/components/localized-markdown-content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  let parentData = await parent;

  const t = await getTranslations("pages.privacy");

  const path = "/privacy";
  const canonicalPath = locale === "en" ? path : `/${locale}${path}`;

  const imageUrl = `${host}/og-privacy.jpg`;

  return {
    title: t("title") || "Privacy Policy",
    description:
      t("description") || parentData?.description + ", privacy policy page",
    metadataBase: new URL(host),
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: path,
        zh: "/zh" + path,
        de: "/de" + path,
        es: "/es" + path,
        pt: "/pt" + path,
        ja: "/ja" + path,
        "x-default": path,
      },
    },
    openGraph: {
      title: t("title") || "Privacy Policy",
      description:
        t("description") || parentData?.description + ", privacy policy page",
      url: canonicalPath,
      siteName: SITE_NAME,
      images: [{ url: imageUrl }],
      locale:
        locale === "en"
          ? "en_US"
          : locale === "zh"
            ? "zh_CN"
            : locale === "de"
              ? "de_DE"
              : locale === "es"
                ? "es_ES"
                : locale === "pt"
                  ? "pt_PT"
                  : locale === "ja"
                    ? "ja_JP"
                    : `${locale}_${locale.toUpperCase()}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title") || "Privacy Policy",
      description:
        t("description") || parentData?.description + ", privacy policy page",
      images: [imageUrl],
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  return (
    <main className="max-w-[min(98%,64rem)] mx-auto my-16">
      <div className="prose dark:prose-invert mx-auto">
        <LocalizedMarkdownContent
          contentKey="privacy"
          locale={locale}
          className="prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-primary"
        />
      </div>
    </main>
  );
}
