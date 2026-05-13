const files = {
  hero: "hero.json",
  about: "about.json",
  redWall: "red-wall.json",
  recognition: "recognition.json",
  others: "others.json",
  footer: "footer.json",
};

async function readJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Missing data file: ${path}`);
  }
  const json = await response.json();
  return json.data ?? json;
}

function runtimeEnv() {
  return window.PANGPURIYE_ENV || {};
}

function apiBaseUrl() {
  const baseUrl = runtimeEnv().API_BASE_URL || "/api/v1/pangpuriye";
  return String(baseUrl).replace(/\/+$/, "");
}

function authHeaders() {
  const env = runtimeEnv();
  const h = env.API_AUTH_HEADER;
  const v = env.API_AUTH_VALUE;
  return h && v ? { [h]: v } : {};
}

async function readApi(endpoint, query = "") {
  const response = await fetch(`${apiBaseUrl()}${endpoint}${query}`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${endpoint}${query} HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json && typeof json === "object" && "code" in json && String(json.code) !== "0") {
    throw new Error(`API request failed: ${endpoint}${query} ${json.message || json.code}`);
  }

  return json.data ?? json.items ?? json;
}

async function readApiList(endpoint, query = "") {
  try {
    const data = await readApi(endpoint, query);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`[api] ${endpoint}${query} unavailable`, error);
    return [];
  }
}

function titleCaseWords(value = "") {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeUrl(value) {
  if (!value || typeof value !== "string") return null;
  const url = value.trim();
  if (!url || url === "#") return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^www\./i.test(url)) return `https://${url}`;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(url)) return `https://${url}`;
  return null;
}

function isMockMember(member) {
  const fields = [member.aiat_id, member.fullname, member.nickname, member.slogan].map(
    (v) => String(v || "").toLowerCase().trim(),
  );
  return (
    !/^\d{6}$/.test(member.aiat_id) ||
    fields.includes("fullname") ||
    fields.includes("nickname") ||
    fields.includes("slogan") ||
    member.aiat_id === "000000"
  );
}

function normalizeMember(member) {
  return {
    id: member.id,
    aiat_id: member.aiat_id || "",
    role: member.role || null,
    fullname: titleCaseWords(member.fullname || ""),
    fullname_en: member.fullname_en,
    nickname: titleCaseWords(member.nickname || ""),
    nickname_en: member.nickname_en,
    slogan: member.slogan || "",
    ai_skill: member.ai_skill || "",
    interesting: Array.isArray(member.interesting)
      ? member.interesting.flatMap((tag) =>
          tag ? tag.split("-n").map((t) => t.trim()).filter(Boolean) : [],
        )
      : [],
    other_skills: member.other_skills || "",
    image: member.image || null,
    gmail: Array.isArray(member.gmail) ? member.gmail : [],
    call: member.call || null,
    video_links: Array.isArray(member.video_links)
      ? member.video_links.map(normalizeUrl).filter(Boolean)
      : [],
    github_url: normalizeUrl(member.github_url),
    linkedin_url: normalizeUrl(member.linkedin_url),
  };
}

function normalizeGalleryItem(item) {
  const categories = Array.isArray(item.category) ? item.category : [];
  return {
    id: item.id || "",
    title: item.title || "Untitled",
    description: item.description || "",
    images: Array.isArray(item.images) ? item.images : [],
    date: item.date || "",
    category: categories,
    category_ids: Array.isArray(item.category_ids)
      ? item.category_ids
      : categories.map((category) => category.id).filter(Boolean),
    video_links: Array.isArray(item.video_links)
      ? item.video_links.map(normalizeUrl).filter(Boolean)
      : [],
  };
}

export async function loadSiteData() {
  const [hero, about, members, redWall, categories, gallery, recognition, others, footer] =
    await Promise.all([
      readJson(`./data/${files.hero}`),
      readJson(`./data/${files.about}`),
      readApiList("/member", "?limit=30"),
      readJson(`./data/${files.redWall}`),
      readApiList("/media/category"),
      readApiList("/media/gallery", "?limit=100"),
      readJson(`./data/${files.recognition}`),
      readJson(`./data/${files.others}`),
      readJson(`./data/${files.footer}`),
    ]);

  return {
    hero,
    about,
    members: members.map(normalizeMember).filter((member) => !isMockMember(member)),
    redWall,
    categories,
    gallery: gallery.map(normalizeGalleryItem),
    recognition,
    others,
    footer,
  };
}
