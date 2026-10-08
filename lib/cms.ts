import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError, getData } from "./api";
import type { ApiMenus, ApiSettings, Condition, ConditionDetail, Page, PageSummary, PostArticle, PostCategory, PostList, Quiz, SeoSite } from "./content";

/**
 * Cached reads of published content. Every entry carries the `content` tag
 * plus its own, so Laravel's publish webhook (app/api/revalidate) refreshes
 * exactly what changed; `cacheLife('hours')` is the safety net if a webhook
 * is missed.
 */
export async function getSettings(): Promise<ApiSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "settings");

  return getData<ApiSettings>("public/settings");
}

export async function getMenus(): Promise<ApiMenus> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "menus");

  return getData<ApiMenus>("public/menus");
}

/** A published page, or null when there is none at that address. */
export async function getPage(path: string): Promise<Page | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `page:${path === "/" ? "home" : path.replace(/^\//, "")}`);

  return orNull(() => getData<Page>(`public/page?path=${encodeURIComponent(path)}`));
}

/** Site-wide <head> values: verification codes and the X handle. */
export async function getSeoSite(): Promise<SeoSite | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "seo");

  return orNull(() => getData<SeoSite>("public/seo"));
}

export async function getPages(): Promise<PageSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "pages");

  return getData<PageSummary[]>("public/pages");
}

export async function getConditions(): Promise<Condition[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "conditions");

  return getData<Condition[]>("public/conditions");
}

export async function getCondition(slug: string): Promise<ConditionDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "conditions", `condition:${slug}`);

  return orNull(() => getData<ConditionDetail>(`public/conditions/${encodeURIComponent(slug)}`));
}

export async function getQuiz(): Promise<Quiz | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "quiz");

  return orNull(() => getData<Quiz>("public/quiz"));
}

/** Uncached: the working copy of a page behind a signed preview token. */
export async function getPreview(path: string, token: string): Promise<Page | null> {
  return orNull(() => getData<Page>(`public/page?path=${encodeURIComponent(path)}&preview=${encodeURIComponent(token)}`));
}

/** Published posts, newest first; `category` is a category slug. */
export async function getPosts(category: string | null = null, page = 1): Promise<PostList> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "posts");

  const query = new URLSearchParams({ page: String(page) });
  if (category) query.set("category", category);

  return getData<PostList>(`public/posts?${query.toString()}`);
}

export async function getPost(slug: string): Promise<PostArticle | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "posts", `post:${slug}`);

  return orNull(() => getData<PostArticle>(`public/posts/${encodeURIComponent(slug)}`));
}

export async function getPostCategories(): Promise<PostCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "posts");

  return getData<PostCategory[]>("public/post-categories");
}

/** A post's working copy for the admin's signed preview link: never cached. */
export async function getPostPreview(slug: string, token: string): Promise<PostArticle | null> {
  return orNull(() => getData<PostArticle>(`public/posts/${encodeURIComponent(slug)}?preview=${encodeURIComponent(token)}`));
}

async function orNull<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load();
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOT_FOUND") {
      return null;
    }

    throw error;
  }
}
