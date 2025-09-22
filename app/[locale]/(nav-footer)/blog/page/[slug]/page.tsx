import { Metadata, ResolvingMetadata } from "next";
import { allHeadlessPostCount } from "@/lib/utils";
import { host, SITE_NAME } from "@/data";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import RecentPost from "../../post/recent_post";

export async function generateMetadata(
  props: { params: Promise<{ slug: string; locale: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  let slug = params.slug;
  const locale = params.locale;

  if (!slug || slug.length == 0) {
    return {};
  }

  let parentData = await parent;

  let title = "Blog Page " + slug;
  let desc = parentData.description + ", blog page " + slug;

  const path = `/blog/page/${slug}`;
  const canonicalPath = locale === "en" ? path : `/${locale}${path}`;
  let imageUrl = host + "/og-blog.jpg";

  return {
    title: title,
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
        "x-default": path,
      },
    },
    authors: [{ name: "mti" }],
    openGraph: {
      title: title,
      description: desc,
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
      type: "article",
      url: canonicalPath,
      siteName: SITE_NAME,
      images: [{ url: imageUrl }],
    },
    twitter: {
      creator: "@Light_Tian",
      creatorId: "@Light_Tian",
      card: "summary_large_image",
      title: title,
      description: desc,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams(): Promise<
  { slug: string; locale: string }[]
> {
  let data: { slug: string; locale: string }[] = [];

  // const count = parseInt((await allHeadlessPostCount()) || "0");
  const count = 0;
  let pageSize = 9;
  let pageCount = Math.ceil(count / pageSize);

  for (let i = 1; i <= pageCount; i++) {
    routing.locales.map((locale) => {
      data.push({ slug: i.toString(), locale });
    });
  }

  return data;
}

export default async function Paging({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  let pageIndex = parseInt(slug);
  if (isNaN(pageIndex)) {
    return notFound();
  }

  return (
    <main className={"mx-auto max-w-6xl p-4"}>
      <RecentPost pageIndex={pageIndex} itemsPerLine={3} locale={locale} />
    </main>
  );
}
