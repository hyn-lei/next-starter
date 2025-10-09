import { notFound } from "next/navigation";
import {
  allHeadlessPost,
  formatISO,
  getHeadlessPost,
  LEVEL_NO_DETAIL,
} from "@/lib/utils";
import { PageProps, Post } from "@/lib/types";
import { Metadata, ResolvingMetadata } from "next";
import { host, SITE_NAME } from "@/data";
import ImageShow from "@/components/image_show";
import Link from "next/link";
import { getFormatter } from "next-intl/server";
import { getBlogTranslations } from "@/components/blog-translation";
import { AdSenseAd } from "@/components/adsense";
import { routing } from "@/i18n/routing";
import MdxRender from "@/components/mdx_render";

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const post = await getHeadlessPost(params.slug || "AAAA");

  const locale = params.locale;
  if (!post) {
    return {};
  }

  const slug = decodeURIComponent(params.slug || "AAA");
  let parentData = await parent;

  let title = SITE_NAME + " | " + post.title;
  let desc = post.summary;

  const path = `/blog/post/${slug}`;
  const canonicalPath = locale === "en" ? path : `/${locale}${path}`;

  let imageUrl = post.featured_image;

  return {
    metadataBase: new URL(host),
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
    authors: [{ name: "MarkdownToImage" }],
    openGraph: {
      title: title,
      description: desc,
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
      type: "article",
    },
    twitter: {
      creator: "@Light_Tian",
      creatorId: "@Light_Tian",
      card: "summary_large_image",
      images: { url: imageUrl },
      title: title,
      description: desc,
    },
  };
}

export async function generateStaticParams(): Promise<
  { slug: string; locale: string }[]
> {
  let data: { slug: string; locale: string }[] = [];

  // let directusPosts = await allHeadlessPost(LEVEL_NO_DETAIL, 1000, 1);
  let directusPosts: any = [];
  directusPosts.map((post: Post) => {
    routing.locales.map((locale) => {
      data.push({ slug: post.slug, locale });
    });
  });

  return data;
}

export default async function PostSlugPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  // console.log("BlogPostPage", params);

  const { slug, locale } = await params;
  const t = await getBlogTranslations();

  const format = await getFormatter({ locale });

  let post = await getHeadlessPost(slug);
  // console.log('BlogPostPage', post, slug)
  if (!post) {
    return notFound();
  }

  const formattedDate = format.dateTime(new Date(post.date_updated), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const IN_ARTICLE_TOP_SLOT = "adslot2";
  const IN_ARTICLE_BOTTOM_SLOT = "adslot2";

  // console.log(post)
  return (
    <article className={"mx-auto max-w-[min(98%,64rem)] mt-16 p-4"}>
      <Link
        className="flex gap-2 items-center text-sm text-gray-500"
        href="/blog"
      >
        <svg
          className="h-3.5 w-3.5"
          data-testid="geist-icon"
          fill="none"
          height="24"
          shapeRendering="geometricPrecision"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
        {t.backToBlog}
      </Link>
      <div
        className={
          "relative flex justify-center -center flex-col space-y-6 mt-16"
        }
      >
        <div className={"text-gray-500 text-left"}>{formattedDate}</div>
        <h1
          className={
            "font-semibold text-4xl text-primary leading-tight max-w-5xl mx-auto"
          }
        >
          {post.title}
        </h1>
        <div className={"flex justify-center"}>
          <ImageShow
            src={post.featured_image}
            width={640}
            height={480}
            alt={post.title}
          />
        </div>
      </div>

      <AdSenseAd
        adType="in-article"
        adSlot={IN_ARTICLE_TOP_SLOT}
        position="post-top-in-article"
        hideDebugLabel={true}
      />

      <div className={"overflow-hidden prose prose-image:inline"}>
        <MdxRender markdownText={post.content} />
      </div>

      <AdSenseAd
        adType="in-article"
        adSlot={IN_ARTICLE_BOTTOM_SLOT}
        position="post-bottom-in-article"
        hideDebugLabel={true}
      />
    </article>
  );
}
