export interface PageProps {
  params: Promise<{ slug?: string; locale: string }>;
  // searchParams: { [key: string]: string | string[] | undefined };
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  description: string;
  page_content: string;
}

export interface Tag {
  title: string;
  slug: string;
  count: number;
  page_content: string;
}

export interface CategoryRelation {
  post_categories_id: Category;
}

export interface TagRelation {
  post_tags_id: Tag;
}

export interface Post {
  slug: string;
  title: string;
  summary: string;
  content: string;
  content_zh: string;
  date_created: string;
  date_updated: string;
  featured_image: string;
  view_count: number;
  read_time: number;
  category: CategoryRelation[];
  tag: string[];
}

export interface Tag {
  title: string;
  slug: string;
  count: number;
}

export interface MenuItem {
  title: string;
  href: string;
  icon?: string;
}
