import Faq from "@/components/faq";
import HowTo from "@/components/how_to";
import FeatureList from "@/components/feature_list";
import {
  ArrowRight,
  FileText,
  Sparkles,
  Github,
  Wand2,
  Database,
  FileEdit,
  BarChart3,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  HeroTitle,
  HeroSubtitle,
  PdfImageBadge,
} from "@/components/hero_translation";
import { Metadata } from "next";
import { host, SITE_NAME } from "@/data";
import { AdSenseLayout, HorizontalAd } from "@/components/adsense";
import { I18nLink } from "@/components/i18n-link";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Get translations
  const seoT = await getTranslations("home.seo");

  const path = "/";
  const canonicalPath = locale === "en" ? path : `/${locale}${path}`;

  // Ensure image URL includes complete domain name
  const imageUrl = `${host}/og-image.jpg`;

  return {
    title: seoT("title"),
    description: seoT("description"),
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
      title: seoT("title"),
      description: seoT("description"),
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
      title: seoT("title"),
      description: seoT("description"),
      images: [imageUrl],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations("navigation");
  const toolTipsT = await getTranslations("toolTips");

  return (
    <AdSenseLayout showSidebarAds={true}>
      <main className="relative bg-linear-to-b from-background via-background to-background/95">
        {/* Simplified Hero Section */}
        <section className="relative overflow-hidden pt-[60px] md:pt-[120px] pb-8">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />

          {/* Subtle decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-10">
              <div className="aspect-square h-[300px] rounded-full bg-primary/50" />
            </div>
            <div className="absolute bottom-1/2 left-1/4 blur-3xl opacity-10">
              <div className="aspect-square h-[200px] rounded-full bg-blue-500/30" />
            </div>
          </div>

          <div className="relative px-4 sm:container sm:mx-auto sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-4 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 shadow-xs">
                <FileText className="mr-2 h-4 w-4" />
                <span>
                  <PdfImageBadge />
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-linear-to-r from-foreground via-foreground/90 to-foreground/70">
                <HeroTitle />
              </h1>

              {/* Description */}
              <div className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground/90 leading-relaxed">
                <HeroSubtitle />
              </div>
            </div>
          </div>
        </section>

        <HorizontalAd position="hero-bottom" />

        {/* Main Content - Markdown Editor is the main focus */}
        <section className="flex flex-col items-center justify-between space-y-16 pb-16">
          {/* Tool Tips Section */}
          <div className="w-full px-4 sm:container sm:mx-auto sm:px-6 lg:px-8 -mt-8">
            <div className="bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30 p-6 shadow-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {toolTipsT("title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {toolTipsT("subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Data Processing Tool */}
                <I18nLink
                  href={`/tool1`}
                  className="group flex items-center p-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {t("tool1")}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {toolTipsT("tool1Desc")}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </I18nLink>

                {/* Content Management Tool */}
                <I18nLink
                  href={`/tool2`}
                  className="group flex items-center p-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileEdit className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {t("tool2")}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {toolTipsT("tool2Desc")}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </I18nLink>

                {/* Analytics Tool */}
                <I18nLink
                  href={`/tool3`}
                  className="group flex items-center p-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-foreground group-hover:text-green-600 dark:group-hover:text-green-400">
                      {t("tool3")}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {toolTipsT("tool3Desc")}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                </I18nLink>

                {/* Collaboration Tool */}
                <I18nLink
                  href={`/tool4`}
                  className="group flex items-center p-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      {t("tool4")}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {toolTipsT("tool4Desc")}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                </I18nLink>
              </div>
            </div>
          </div>

          {/* Other components with reduced prominence */}
          <div className="w-full bg-muted/20 py-8 border-y border-border/30 backdrop-blur-xs">
            <div className="px-4 sm:container sm:mx-auto sm:px-6 lg:px-8">
              <div
                id="feature_list"
                className="opacity-80 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center gap-2 text-lg font-medium text-foreground/80 bg-muted/30 px-4 py-1.5 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Features</span>
                  </div>
                </div>
                <FeatureList />
              </div>
            </div>
          </div>

          <HorizontalAd position="features-bottom" />

          <div className="w-full px-4 sm:container sm:mx-auto sm:px-6 lg:px-8">
            <div className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-lg p-6 bg-linear-to-r from-transparent via-muted/10 to-transparent">
              <div id="how-to">
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center gap-2 text-lg font-medium text-foreground/80 bg-muted/30 px-4 py-1.5 rounded-full">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>How to Use</span>
                  </div>
                </div>
                <HowTo />
              </div>
            </div>
          </div>

          <HorizontalAd position="how-to-bottom" />

          <div className="w-full px-4 sm:container sm:mx-auto sm:px-6 lg:px-8">
            <div className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-lg p-6 bg-linear-to-r from-transparent via-muted/10 to-transparent">
              <div id="faq">
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center gap-2 text-lg font-medium text-foreground/80 bg-muted/30 px-4 py-1.5 rounded-full">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>FAQ</span>
                  </div>
                </div>
                <Faq />
              </div>
            </div>
          </div>

          <HorizontalAd position="faq-bottom" />
        </section>

        {/* Footer gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background/90 to-transparent pointer-events-none"></div>
      </main>
    </AdSenseLayout>
  );
}
