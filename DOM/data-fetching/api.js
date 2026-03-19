import { NEWS_API_KEY } from "./config.js";

const BASE_URL = "https://newsdata.io/api/1/latest";

export function buildLatestUrl({ category, page }) {
  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", NEWS_API_KEY);

  if (category) url.searchParams.set("category", category);
  if (page) url.searchParams.set("page", page);

  // Avoid surprise language defaults; let API decide unless provided later.
  return url.toString();
}

export async function fetchLatest({ category, page, signal } = {}) {
  const url = buildLatestUrl({ category, page });
  const res = await fetch(`${url}&country=in,us,cn,jp,kr
  &language=en`, { signal });

  if (!res.ok) {
    let extra = "";
    try {
      const text = await res.text();
      extra = text ? `\n${text}` : "";
    } catch {
      // ignore
    }
    throw new Error(`Request failed: ${res.status} ${res.statusText}${extra}`);
  }

  const data = await res.json();

  // NewsData.io typically returns: { status, totalResults, results: [], nextPage }
  const results = Array.isArray(data?.results) ? data.results : [];
  const nextPage = typeof data?.nextPage === "string" ? data.nextPage : null;

  return { results, nextPage, raw: data };
}

