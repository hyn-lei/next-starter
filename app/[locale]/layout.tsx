import "../globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Script from "next/script";

import { host, SITE_NAME } from "@/data";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { PageProps } from "@/lib/types";
import { ClerkProvider } from "@clerk/nextjs";
import { LocalizationResource } from "@clerk/types";
import { zhCN, deDE, esES, enUS, ptPT } from "@clerk/localizations";

const title =
  "Markdown To Image | Effortlessly Convert Markdown to PDF, JPEG, PNG, and WebP with markdowntoimage.com";
const desc =
  "Discover markdowntoimage.com, a free and user-friendly tool that allows you to convert Markdown text into high-quality images and PDFs. Enjoy features like instant conversion, privacy protection, no registration required, and data not stored. Transform your Markdown content into beautiful, shareable formats today!";

export async function generateMetadata(prop: PageProps) {
  const { locale } = await prop.params;

  const path = "/";
  const canonicalPath = locale === "en" ? path : `/${locale}${path}`;

  return {
    metadataBase: new URL(host),
    title: {
      template: "%s | MarkdownToImage",
      default: title,
    },
    description: desc,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: path,
        zh: "/zh" + path,
        de: "/de" + path,
        es: "/es" + path,
        pt: "/pt" + path,
        ja: "/ja" + path,
      },
    },
    openGraph: {
      title: title,
      description: desc,
      url: path,
      siteName: SITE_NAME,
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
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: desc,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Use Inter font consistently to avoid multiple font CSS
  let localResource: LocalizationResource;
  if (locale === "zh") {
    localResource = zhCN;
  } else if (locale === "de") {
    localResource = deDE;
  } else if (locale === "es") {
    localResource = esES;
  } else if (locale == "pt") {
    localResource = ptPT;
  } else {
    localResource = enUS;
  }

  return (
    <html lang={locale} suppressHydrationWarning className={"scroll-smooth"}>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-adsense-account"
          content="ca-pub-7710299297914449"
        ></meta>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5RBJP7M6B1"
          strategy="afterInteractive"
        ></Script>
        <Script id="analytics-google" strategy="afterInteractive">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
            
                    gtag('config', 'G-5RBJP7M6B1');
                `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7710299297914449"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body className={`antialiased bg-transparent`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider localization={localResource}>
            <NextIntlClientProvider locale={locale}>
              {children}
            </NextIntlClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
