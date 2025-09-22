import { Category, Post, Tag } from "@/lib/types";
import {
  allHeadlessPost,
  allHeadlessPostCount,
  LEVEL_DETAIL,
} from "@/lib/utils";
import { formatCategory, formatTag } from "@/lib/ui_kit";
import ImageShow from "@/components/image_show";
import Link from "next/link";
import { getBlogTranslations } from "@/components/blog-translation";
import { getFormatter } from "next-intl/server";
import { CalendarDaysIcon } from "lucide-react";

async function Page({
  pageSize,
  pageIndex,
  category,
  tag,
  itemsPerLine,
  tailCategory,
  tailTag,
  pinned,
  locale,
}: {
  pageSize: number;
  pageIndex: number;
  category?: string;
  tag?: string;
  itemsPerLine?: number;
  tailCategory?: boolean;
  tailTag?: boolean;
  pinned?: number;
  locale: string;
}) {
  // const data = await allHeadlessPost(
  //   LEVEL_DETAIL,
  //   pageSize,
  //   pageIndex,
  //   category,
  //   tag,
  //   pinned
  // );

  const data: any = [];
  const format = await getFormatter({ locale });

  const grid = (itemsPerLine?: number) => {
    if (itemsPerLine && itemsPerLine > 1) {
      return `md:grid md:grid-cols-2 lg:grid-cols-${itemsPerLine} md:gap-4`;
    }

    return "space-y-6";
  };

  return (
    <div className={"relative p-2 mt-12"}>
      {(!data || data.length == 0) && (
        <div className={""}>{"loading error..."}</div>
      )}
      <div className={`${grid(itemsPerLine)}`}>
        {data?.map((post: Post, index: number) => {
          return (
            <div
              key={"recent-post-" + index}
              className={"space-y-6 border border-gray-200 rounded-xl"}
            >
              <div className={""}>
                <ImageShow
                  width={380}
                  height={380}
                  src={post.featured_image}
                  alt={post.title}
                  className={"object-cover my-auto"}
                />
              </div>

              {tailCategory && (
                <div className={""}>{formatCategory(post.category)}</div>
              )}

              <div className={"p-3 space-y-3"}>
                <div className={"flex justify-between"}>
                  <h3
                    className={
                      "font-semibold text-xl tracking-wide overflow-hidden text-ellipsis line-clamp-2"
                    }
                  >
                    <a
                      className={"hover:underline hover:underline-offset-4"}
                      href={"/blog/post/" + post.slug}
                    >
                      {post.title}
                    </a>
                  </h3>
                  {/*<a href={'/blog/post/' + post.slug}> {GoIcon()}</a>*/}
                </div>
                <div
                  className={
                    "text-text/60 overflow-hidden text-ellipsis line-clamp-3"
                  }
                >
                  {post.summary}
                </div>

                {tailTag && <div className={""}>{formatTag(post.tag)}</div>}
                <div className={"text-primary flex items-center space-x-2"}>
                  {/*{formatDistanceToNow(toDate(Number(post.updated_at)),{addSuffix:true})}*/}
                  <CalendarDaysIcon />
                  {format.dateTime(new Date(post.date_updated), {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const pagingButtonClass = "text-primary p-3  h-10 w-10 rounded-lg text-sm";
const pagingButtonClass2 =
  "flex text-primary h-5 rounded-lg text-sm space-x-2 disabled:text-neutral-500";

const lastPage = async (pageIndex: number, urlPrefix?: string) => {
  const t = await getBlogTranslations();

  if (pageIndex == 1) {
    return <div></div>;
  }
  let url = "/blog/page/" + (pageIndex - 1);
  if (urlPrefix) {
    url = urlPrefix + url;
  }
  return (
    <Link className={pagingButtonClass2} href={url}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.3334 10.5001H4.66669M4.66669 10.5001L10.5 16.3334M4.66669 10.5001L10.5 4.66675"
          stroke="currentColor"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{t.previousPage}</span>
    </Link>
  );
};

const nextPage = async (
  pageIndex: number,
  count: number,
  urlPrefix?: string
) => {
  const t = await getBlogTranslations();

  if (pageIndex == count) {
    return <div></div>;
  }
  let url = "/blog/page/" + (pageIndex + 1);
  if (urlPrefix) {
    url = urlPrefix + url;
  }
  return (
    <Link className={pagingButtonClass2} href={url}>
      <span>{t.nextPage}</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.66667 10.5001H16.3333M16.3333 10.5001L10.5 4.66675M16.3333 10.5001L10.5 16.3334"
          stroke="currentColor"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
};

const Pagination = async ({
  count,
  pageSize,
  pageIndex,
  cat,
  tag,
}: {
  count: number;
  pageSize: number;
  pageIndex: number;
  cat?: string;
  tag?: string;
}) => {
  const pageCount = Math.ceil(count / pageSize);
  let urlPrefix = "";
  if (cat) {
    urlPrefix = `/blog/category/${cat}`;
  }
  if (tag) {
    urlPrefix = `/blog/tag/${tag}`;
  }
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 text-center justify-between items-center mt-6">
      {await lastPage(pageIndex, urlPrefix)}
      {pageButton(pageCount, pageIndex, urlPrefix)}
      {await nextPage(pageIndex, pageCount, urlPrefix)}
    </div>
  );
};

function generateNumbers(from: number, to: number) {
  const numbers: string[] = [];

  for (let i = from; i <= to; i++) {
    numbers.push(String(i));
  }

  return numbers;
}

function pageNumbers(pageCount: number, pageIndex: number) {
  let numbers: string[] = [];

  if (pageCount <= 6) {
    return generateNumbers(1, pageCount);
  }

  if (pageCount - pageIndex <= 5) {
    return generateNumbers(pageCount - 5, pageCount);
  }

  let start = Math.max(pageIndex - 2, 1);
  let end = Math.max(pageIndex, 3);
  numbers.push(...generateNumbers(start, end));
  numbers.push("...");
  numbers.push(...generateNumbers(pageCount - 2, pageCount));
  return numbers;
}

function pageButton(pageCount: number, pageIndex: number, urlPrefix?: string) {
  const Links = [];

  let showNumbers = pageNumbers(pageCount, pageIndex);
  for (let i = 0; i < showNumbers.length; i++) {
    let buttonClass = pagingButtonClass;
    let num = showNumbers[i];
    let actual = parseInt(num);

    if (actual == pageIndex) {
      buttonClass += " bg-primary text-white";
    }

    if (!actual) {
      buttonClass += " text-border-gray-200";
      Links.push(
        <div className={buttonClass} key={num}>
          <p>{num}</p>
        </div>
      );
    } else {
      let url = "/blog/page/" + actual;
      if (urlPrefix) {
        url = urlPrefix + url;
      }
      Links.push(
        <Link href={url} className={buttonClass} key={num}>
          <p>{num}</p>
        </Link>
      );
    }
  }

  return <div className={"flex"}>{Links}</div>;
}

const Title = async ({
  categoryName,
  tagName,
}: {
  categoryName?: string;
  tagName?: string;
}) => {
  const t = await getBlogTranslations();

  if (categoryName) {
    return (
      <h1 className={"text-2xl font-bold tracking-wider"}>
        {t.categoryArticles}
      </h1>
    );
  }

  if (tagName) {
    return (
      <h1 className={"text-3xl font-semibold tracking-wider"}>
        {tagName}
        {t.relatedArticles}
      </h1>
    );
  }

  return (
    <h1 className={"text-3xl font-semibold leading-10 p-2 mt-16"}>
      {t.recentPost}
    </h1>
  );
};

export default async function RecentPost({
  pageIndex,
  category,
  tag,
  itemsPerLine,
  tailCategory,
  tailTag,
  pinned,
  locale,
}: {
  pageIndex: number;
  category?: Category;
  tag?: Tag;
  itemsPerLine?: number;
  tailCategory?: boolean;
  tailTag?: boolean;
  pinned?: number;
  locale: string;
}) {
  const pageSize = 8;
  let url = category?.name;

  let categoryName = category?.name;
  let tagName = tag?.slug;

  // let count = parseInt(
  //   (await allHeadlessPostCount(category?.slug, tag?.slug)) || "0"
  // );

  let count = 0;
  return (
    <div className={"mt-8"}>
      <Title categoryName={categoryName} tagName={tagName} />
      <Page
        pageSize={pageSize}
        pageIndex={pageIndex}
        category={url}
        tag={tag?.slug}
        itemsPerLine={itemsPerLine}
        tailCategory={tailCategory}
        tailTag={tailTag}
        pinned={pinned}
        locale={locale}
      />
      <div className={"mt-6"}>
        <Pagination
          count={count}
          pageSize={pageSize}
          pageIndex={pageIndex}
          cat={category?.slug}
          tag={tag?.slug}
        />
      </div>
    </div>
  );
}
