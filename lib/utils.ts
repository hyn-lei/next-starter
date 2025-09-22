import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { createDirectus, readItems, rest } from "@directus/sdk";
import { Category, Post, Tag } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { aggregate } from "@directus/sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatISO(date: string) {
  if (!date) {
    return "";
  }
  return format(parseISO(date), "EEEE, MMMM do yyyy");
}

export function formatISO2(date: string) {
  if (!date) {
    return "";
  }
  return format(parseInt(date), "yyyy-MM-dd HH:mm");
}

const API_HOST = "https://directus-example.com";
type FetchInterface = (
  input: string | any,
  init?: RequestInit | any,
) => Promise<unknown>;

const fetcher: FetchInterface = (input, init?) => {
  // console.log('request info:', input, init)
  return fetch(input, init).then((res) => res.json());
};

export const directus = createDirectus(API_HOST, {
  globals: { fetch: fetcher },
}).with(
  rest({
    onRequest: (options: RequestInit) => {
      // options.cache = 'no-cache'
      options.next = { revalidate: 30 };
      return options;
    },
  }),
);

export async function getHeadlessPost(slug: string): Promise<Post | null> {
  try {
    const data = await directus.request<Post[]>(
      readItems("post", {
        filter: { slug: decodeURIComponent(slug) },
        fields: [
          "*",
          // {category: ["*", {post_categories_id: ["*"]}]},
          // {tag: ["*", {post_tags_id: ["*"]}]},
        ],
      }),
    );
    return data[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function allPinnedPosts(maxItems: number): Promise<Post[]> {
  const query = {
    filter: { pinned: { _gt: 0 } },
    fields: [
      "title",
      "slug",
      "summary",
      "featured_image",
      "date_updated",
      { category: ["*", { post_categories_id: ["*"] }] },
      { tag: ["*", { post_tags_id: ["*"] }] },
    ],
    limit: maxItems ? maxItems : -1,
    sort: "-date_updated",
  };
  return await directus.request<Post[]>(readItems("posts", query));
}

export const LEVEL_DETAIL = 1;
export const LEVEL_NO_DETAIL = 0;

export async function allHeadlessPost(
  detailLevel: number,
  pageSize: number,
  page: number,
  catFilter?: string,
  tagFilter?: string,
  pinned?: number,
): Promise<Post[]> {
  let fields: any = ["title", "slug"];
  if (detailLevel == 1) {
    fields = [
      "title",
      "featured_image",
      "slug",
      "summary",
      "date_updated",
      // "date_created",
      "tag",
      // {category: ["*", {post_categories_id: ["*"]}]},
      // {tag: ["*", {post_tags_id: ["*"]}]},
    ];
  }
  const query: any = {
    // filter: {'category': {'data_categories_id': {'slug': {"_eq": catSlug}}}},
    filter: {},
    fields: fields,
    limit: pageSize ? pageSize : -1,
    sort: "-date_updated",
    page: page,
  };
  if (catFilter) {
    query.filter = {
      category: { post_categories_id: { slug: { _eq: catFilter } } },
    };
  }
  if (tagFilter) {
    query.filter = { tag: { post_tags_id: { slug: { _eq: tagFilter } } } };
  }
  if (pinned != undefined) {
    query.filter["pinned"] = pinned;
  }

  const data = await directus.request<Post[]>(readItems("post", query));

  // console.log(data)
  return data;
}

export async function allHeadlessPostCount(
  catFilter?: string,
  tagFilter?: string,
): Promise<string | null> {
  const options = {
    aggregate: { count: "*" },
    query: {
      filter: {},
    },
  };
  if (catFilter) {
    options.query.filter = {
      category: { post_categories_id: { slug: { _eq: catFilter } } },
    };
  }
  if (tagFilter) {
    options.query.filter = {
      tag: { post_tags_id: { slug: { _eq: tagFilter } } },
    };
  }
  const result = await directus.request(aggregate("post", options));

  return result[0].count;
}

export async function getHeadlessCategory(
  slug: string,
): Promise<Category | null> {
  try {
    const data = await directus.request<Category[]>(
      readItems("post_categories", {
        filter: { slug: decodeURIComponent(slug) },
        fields: ["*"],
      }),
    );
    return data[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getHeadlessTag(slug: string): Promise<Tag | null> {
  try {
    const data = await directus.request<Tag[]>(
      readItems("post_tags", {
        filter: { slug: decodeURIComponent(slug) },
        fields: ["*"],
      }),
    );
    return data[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}
