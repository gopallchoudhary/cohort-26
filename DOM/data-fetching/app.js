import { fetchLatest } from "./api.js";

const CATEGORIES = [
  { id: "top", label: "Top" },
  { id: "technology", label: "Tech" },
  { id: "business", label: "Business" },
  { id: "sports", label: "Sports" },
  { id: "world", label: "World" },
  { id: "science", label: "Science" },
  { id: "entertainment", label: "Entertainment" },
  { id: "health", label: "Health" },
  { id: "general", label: "General" },
];

const els = {
  tabs: document.getElementById("tabs"),
  cards: document.getElementById("cards"),
  statusText: document.getElementById("statusText"),
  updatedText: document.getElementById("updatedText"),
  metaLine: document.getElementById("metaLine"),
  errorBox: document.getElementById("errorBox"),
  errorMsg: document.getElementById("errorMsg"),
  retryBtn: document.getElementById("retryBtn"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  cardTpl: document.getElementById("cardTpl"),
  skeletonTpl: document.getElementById("skeletonTpl"),
};

const state = {
  activeCategory: "top",
  nextPageByCategory: new Map(),
  inFlightByCategory: new Map(),
  abortByCategory: new Map(),
  lastUpdatedAt: null,
};

const dtf = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatPubDate(pubDate) {
  // Sample: "2026-03-18 08:10:00" in UTC
  if (!pubDate || typeof pubDate !== "string") return "";
  const iso = pubDate.includes("T") ? pubDate : pubDate.replace(" ", "T") + "Z";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return pubDate;
  return dtf.format(d);
}

function setStatus(text) {
  els.statusText.textContent = text;
}

function setUpdated(date) {
  state.lastUpdatedAt = date;
  els.updatedText.textContent = date ? `Updated ${dtf.format(date)}` : "—";
}

function clearError() {
  els.errorBox.hidden = true;
  els.errorMsg.textContent = "";
}

function showError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  els.errorMsg.textContent = msg;
  els.errorBox.hidden = false;
}

function setBusy(isBusy) {
  document.querySelector(".feed")?.setAttribute("aria-busy", String(isBusy));
}

function renderTabs() {
  els.tabs.innerHTML = "";
  for (const cat of CATEGORIES) {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.type = "button";
    btn.role = "tab";
    btn.dataset.category = cat.id;
    btn.setAttribute("aria-selected", cat.id === state.activeCategory ? "true" : "false");
    btn.textContent = cat.label;
    btn.addEventListener("click", () => selectCategory(cat.id));
    els.tabs.appendChild(btn);
  }
}

function updateTabsSelection() {
  els.tabs.querySelectorAll(".tab").forEach((t) => {
    const isSelected = t.dataset.category === state.activeCategory;
    t.setAttribute("aria-selected", isSelected ? "true" : "false");
  });
}

function clearCards() {
  els.cards.innerHTML = "";
}

function showSkeletons(count = 9) {
  clearCards();
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    frag.appendChild(els.skeletonTpl.content.cloneNode(true));
  }
  els.cards.appendChild(frag);
}

function normalizeArticle(a) {
  return {
    id: a?.article_id ?? a?.link ?? crypto.randomUUID(),
    title: (a?.title ?? "").trim(),
    description: (a?.description ?? "").trim(),
    imageUrl: a?.image_url ?? "",
    source: a?.source_name ?? a?.source_id ?? "Unknown",
    pubDate: a?.pubDate ?? "",
    link: a?.link ?? "",
  };
}

function createCard(article, index) {
  const node = els.cardTpl.content.cloneNode(true);
  const root = node.querySelector(".card");
  const link = node.querySelector(".card__link");
  const img = node.querySelector(".card__img");
  const title = node.querySelector(".card__title");
  const desc = node.querySelector(".card__desc");
  const chipSource = node.querySelector(".chip--source");
  const chipDate = node.querySelector(".chip--date");

  link.href = article.link || "#";
  title.textContent = article.title || "Untitled";
  desc.textContent = article.description || "No description available.";
  chipSource.textContent = article.source;
  chipDate.textContent = formatPubDate(article.pubDate);

  const hasImg = Boolean(article.imageUrl);
  if (!hasImg) {
    root.classList.add("card--noimg");
    img.alt = "";
    img.removeAttribute("src");
  } else {
    img.src = article.imageUrl;
    img.alt = article.title || "News image";
    img.addEventListener(
      "error",
      () => {
        root.classList.add("card--noimg");
        img.removeAttribute("src");
      },
      { once: true }
    );
  }

  root.classList.add("enter");
  root.style.animationDelay = `${Math.min(index * 35, 280)}ms`;
  return node;
}

function renderCards(articles, { append = false } = {}) {
  if (!append) clearCards();
  const frag = document.createDocumentFragment();
  const startIndex = append ? els.cards.children.length : 0;
  for (let i = 0; i < articles.length; i++) {
    frag.appendChild(createCard(articles[i], startIndex + i));
  }
  els.cards.appendChild(frag);
}

function setMetaLine({ count, categoryLabel }) {
  els.metaLine.textContent = `${count} stories · ${categoryLabel}`;
}

function setLoadMoreVisible(visible) {
  els.loadMoreBtn.hidden = !visible;
}

function abortCategory(category) {
  const ctrl = state.abortByCategory.get(category);
  if (ctrl) ctrl.abort();
  state.abortByCategory.delete(category);
}

async function loadCategory({ category, mode }) {
  const inFlight = state.inFlightByCategory.get(category);
  if (inFlight) return inFlight;

  clearError();
  setBusy(true);
  setStatus(mode === "append" ? "Loading more…" : "Fetching latest stories…");

  const controller = new AbortController();
  state.abortByCategory.set(category, controller);

  const page = mode === "append" ? state.nextPageByCategory.get(category) : undefined;

  const p = (async () => {
    try {
      if (mode !== "append") showSkeletons();

      const { results, nextPage } = await fetchLatest({
        category,
        page,
        signal: controller.signal,
      });

      const articles = results.map(normalizeArticle).filter((a) => a.link || a.title);

      renderCards(articles, { append: mode === "append" });

      state.nextPageByCategory.set(category, nextPage);
      setLoadMoreVisible(Boolean(nextPage));

      setUpdated(new Date());
      setStatus("Ready");

      const catLabel = CATEGORIES.find((c) => c.id === category)?.label ?? category;
      const totalShown = els.cards.querySelectorAll(".card").length;
      setMetaLine({ count: totalShown, categoryLabel: catLabel });

      if (totalShown === 0) {
        setStatus("No stories found");
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      setStatus("Error");
      showError(err);
      setLoadMoreVisible(false);
    } finally {
      state.inFlightByCategory.delete(category);
      state.abortByCategory.delete(category);
      setBusy(false);
    }
  })();

  state.inFlightByCategory.set(category, p);
  return p;
}

function selectCategory(category) {
  if (category === state.activeCategory) return;

  abortCategory(state.activeCategory);
  state.activeCategory = category;
  updateTabsSelection();

  setMetaLine({ count: 0, categoryLabel: CATEGORIES.find((c) => c.id === category)?.label ?? category });
  loadCategory({ category, mode: "replace" });
}

function wireEvents() {
  els.retryBtn.addEventListener("click", () => loadCategory({ category: state.activeCategory, mode: "replace" }));
  els.refreshBtn.addEventListener("click", () => loadCategory({ category: state.activeCategory, mode: "replace" }));
  els.loadMoreBtn.addEventListener("click", () => loadCategory({ category: state.activeCategory, mode: "append" }));
}

function init() {
  renderTabs();
  wireEvents();
  setUpdated(null);
  setMetaLine({ count: 0, categoryLabel: "Top" });
  loadCategory({ category: state.activeCategory, mode: "replace" });
}

init();

