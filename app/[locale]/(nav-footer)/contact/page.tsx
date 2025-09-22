import { Metadata, ResolvingMetadata } from "next";
import { host, SITE_NAME } from "@/data";
import ContactForm from "@/components/contact/contact-form";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

async function ContactTitle() {
  const t = await getTranslations("contact");
  return <>{t("title")}</>;
}

async function ContactIntro() {
  const t = await getTranslations("contact");
  return <>{t("intro")}</>;
}

async function ContactGeneral() {
  const t = await getTranslations("contact");
  return <>{t("general")}</>;
}

async function ContactFormIntro() {
  const t = await getTranslations("contact");
  return <>{t("formIntro")}</>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  let parentData = await parent;

  const t = await getTranslations("pages.contact");

  const path = "/contact";
  const canonicalPath = locale === "en" ? path : `/${locale}${path}`;

  const imageUrl = `${host}/og-contact.jpg`;

  return {
    title: t("title") || "Contact Us",
    description:
      t("description") || parentData?.description + ", contact us page",
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
      title: t("title") || "Contact Us",
      description:
        t("description") || parentData?.description + ", contact us page",
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
      title: t("title") || "Contact Us",
      description:
        t("description") || parentData?.description + ", contact us page",
      images: [imageUrl],
    },
  };
}

export default async function ContactUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="max-w-[min(98%,64rem)] mx-auto my-16 border border-border rounded-lg shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-8 px-8 pt-12 pb-8 bg-card">
          <h2 className="font-bold text-3xl text-foreground">
            <ContactTitle />
          </h2>

          <div className="text-muted-foreground leading-7">
            <ContactIntro />
          </div>

          <div className="space-y-6 text-muted-foreground leading-7">
            <p>
              <ContactGeneral />
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <a
                  href="mailto:since20130904@gmail.com"
                  className="text-primary hover:underline"
                >
                  xxx@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6 px-8 pt-12 pb-8 bg-background border-t md:border-t-0 md:border-l border-border">
          <div className="text-muted-foreground">
            <ContactFormIntro />
          </div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
