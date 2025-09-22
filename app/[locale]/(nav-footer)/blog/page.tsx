import RecentPost from "./post/recent_post";
import { Metadata, ResolvingMetadata } from "next";
import { host, SITE_NAME } from "@/data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: { locale: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  let parentData = await parent;
  const { locale } = params;

  // 根据语言设置规范URL
  // 英文使用 /path，其他语言使用 /{locale}/path
  const path = "/blog";
  const canonicalPath = locale === "en" ? path : `/${locale}${path}`;

  const title = "Blog";
  const description = parentData?.description + ", blog list page";
  let imageUrl = host + "/og-blog.jpg";

  return {
    title: title,
    description: description,
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
      title: title,
      description: description,
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
      creatorId: "@Light_Tian",
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function BlogHome({
  params,
  pageIndex = 1,
}: {
  params: Promise<{ locale: string }>;
  pageIndex?: number;
}) {
  const { locale } = await params;

  return (
    <main className={"mx-auto max-w-6xl p-4"}>
      <RecentPost pageIndex={pageIndex} itemsPerLine={3} locale={locale} />
    </main>
  );
}
