import { escapeHtml, icon, qs, setModalOpen, youtubeId } from "./utils.js";

let siteData;
let galleryState = { items: [], index: 0, item: null };

function isExpiredAwsUrl(src) {
  if (!src || !src.includes("X-Amz-Date=") || !src.includes("X-Amz-Expires=")) {
    return false;
  }
  const url = new URL(src);
  const date = url.searchParams.get("X-Amz-Date");
  const expires = Number(url.searchParams.get("X-Amz-Expires") || "0");
  if (!date || !expires) return false;
  const match = date.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!match) return false;
  const [, year, month, day, hour, minute, second] = match.map(Number);
  const issuedAt = Date.UTC(year, month - 1, day, hour, minute, second);
  return Date.now() > issuedAt + expires * 1000;
}

function assetPath(src, seed = "") {
  if (!src) return "";
  if (isExpiredAwsUrl(src)) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) return `.${src}`;
  return src;
}

function img(src, alt = "", className = "") {
  const path = assetPath(src, alt);
  if (!path) return "";
  return `<img src="${escapeHtml(path)}" alt="${escapeHtml(alt)}" class="${className}" loading="lazy" decoding="async" onerror="this.remove()">`;
}

function contactLinks(member) {
  const links = [];
  if (member.gmail?.[0]) {
    links.push({ href: `mailto:${member.gmail[0]}`, label: "Email", name: "mail" });
  }
  if (member.call) {
    links.push({ href: `tel:${member.call.replace(/\s+/g, "")}`, label: "Call", name: "phone" });
  }
  if (member.video_links?.[0]) {
    links.push({ href: member.video_links[0], label: "Intro video", name: "play", external: true });
  }
  if (member.github_url) {
    links.push({ href: member.github_url, label: "GitHub", name: "github", external: true });
  }
  if (member.linkedin_url) {
    links.push({ href: member.linkedin_url, label: "LinkedIn", name: "linkedin", external: true });
  }

  return links
    .map(
      (link) => `
        <a class="icon-btn" href="${escapeHtml(link.href)}" aria-label="${link.label}" title="${link.label}" ${
          link.external ? 'target="_blank" rel="noopener noreferrer"' : ""
        }>${icon(link.name)}</a>
      `,
    )
    .join("");
}

function roleLabel(role) {
  const normalized = (role || "").toLowerCase();
  if (normalized === "chairman") return "Captain";
  if (normalized === "vice-chairman") return "Vice";
  return "Member";
}

function renderHero(hero) {
  qs("#home").innerHTML = `
    <div class="hero-grid">
      <div>
        <p class="eyebrow" data-anim="hero-eyebrow">${escapeHtml(hero.eyebrow)}</p>
        <h1 data-anim="hero-title">
          ${hero.title_line_1 ? `<span>${escapeHtml(hero.title_line_1)}</span>` : ""}
          <span class="red">${escapeHtml(hero.title_line_2)}</span>
          ${hero.title_line_3 ? `<span>${escapeHtml(hero.title_line_3)}</span>` : ""}
        </h1>
        <p class="hero-motto" data-anim="hero-motto">${escapeHtml(hero.motto)}</p>
        <div class="btn-row">
          <a class="btn btn-primary" data-magnetic data-anim="hero-cta" href="${escapeHtml(hero.cta_primary.href)}">${escapeHtml(hero.cta_primary.label)}</a>
          <a class="btn btn-ghost" data-magnetic data-anim="hero-cta" href="${escapeHtml(hero.cta_secondary.href)}">${escapeHtml(hero.cta_secondary.label)}</a>
        </div>
      </div>
      <div class="hero-logo" data-anim="hero-photo">
        <img src="./images/logo.svg" alt="Pangpuriye logo">
      </div>
    </div>
  `;
}

function renderAbout(about) {
  const cards = [
    ["ASSET: LOGO", "House Logo"],
    ["ASSET: SYMBOL", "House Symbol"],
    ["ASSET: UNIFORM", about.uniform_name],
    ["DOC: SYS_REV", about.sys_rev],
  ];

  qs("#about").innerHTML = `
    <div class="container" data-reveal-scope>
      <div class="about-grid">
        <div class="about-copy">
          <p class="eyebrow" data-anim="reveal-eyebrow">ABOUT</p>
          <h2 class="section-title" data-anim="reveal-title">About Pang</h2>
          <div class="lead" data-anim="reveal-body" style="margin-top:24px">
            <p>${escapeHtml(about.dna_paragraph_1)}</p>
            <p style="margin-top:24px">${escapeHtml(about.dna_paragraph_2)}</p>
          </div>
          <p class="quote-line" data-anim="reveal-body" style="margin-top:48px">${escapeHtml(about.motto)}</p>
        </div>
        <aside class="asset-grid">
          ${cards
            .map(
              ([label, title]) => `
                <article class="asset-card" data-anim="reveal-item">
                  <p>${escapeHtml(label)}</p>
                  <strong>${escapeHtml(title)}</strong>
                </article>
              `,
            )
            .join("")}
        </aside>
      </div>
      ${renderJourney()}
      <div class="info-grid">
        <article class="info-card" data-anim="reveal-item">
          <p>Our Mission</p>
          <h3 style="margin-top:12px">Innovate &amp; Solve</h3>
          <p style="margin-top:12px;color:var(--fg-soft)">Build AI systems that address real problems — not demos that live only in notebooks.</p>
        </article>
        <article class="info-card dark-card" data-anim="reveal-item">
          <p>Our Vision</p>
          <h3 style="margin-top:12px">Lasting Legacy</h3>
          <p style="margin-top:12px;opacity:.76">A house that engineers remember — because what we shipped actually mattered.</p>
        </article>
      </div>
    </div>
  `;
}

function renderJourney() {
  const steps = [
    {
      date: "March 2026",
      title: "Level 1",
      desc: "Foundation of AI engineering — algorithms, models, and the first lines we called our own.",
      side: "left",
      dot: "red",
    },
    {
      date: "May 2026",
      title: "Level 2",
      desc: "Advanced model development. Peer review. Real industry briefs.",
      side: "right",
      dot: "gold",
    },
    {
      date: "May 2026",
      title: "Level 3",
      desc: "Industry-level challenges, partner organisations, production deployments.",
      side: "left",
      dot: "red",
    },
    {
      date: "Now",
      title: "First hackathon win",
      desc: "Coming soon.",
      side: "right",
      dot: "now",
    },
  ];

  return `
    <div class="journey" data-anim="reveal-item">
      <div class="journey-head">
        <p class="eyebrow">Timeline</p>
        <h3>Pang's Journey</h3>
      </div>
      <div class="journey-body">
        <div class="journey-spine" aria-hidden="true"></div>
        <ol class="journey-list">
          ${steps
            .map((step) => {
              const card = `
                <article class="journey-card ${step.side === "left" ? "is-left" : ""} ${step.dot === "gold" ? "is-gold" : ""} ${step.dot === "now" ? "is-now" : ""}">
                  <p class="eyebrow" style="color:${step.dot === "gold" ? "var(--gold)" : step.dot === "now" ? "var(--fg)" : "var(--red)"}">${escapeHtml(step.date)}</p>
                  <h4 style="margin:6px 0 0;font-size:16px;line-height:1.2">${escapeHtml(step.title)}</h4>
                  <p style="margin-top:4px;color:var(--fg-soft);font-size:14px">${escapeHtml(step.desc)}</p>
                </article>
              `;
              return `
                <li>
                  <div style="${step.side === "left" ? "padding-right:32px" : ""}">${step.side === "left" ? card : ""}</div>
                  <div class="journey-dot-wrap"><span class="journey-dot ${step.dot === "gold" ? "is-gold" : ""} ${step.dot === "now" ? "is-now" : ""}"></span></div>
                  <div style="${step.side === "right" ? "padding-left:32px" : ""}">${step.side === "right" ? card : ""}</div>
                </li>
              `;
            })
            .join("")}
        </ol>
      </div>
    </div>
  `;
}

function memberCard(member, index) {
  const tags = member.interesting
    .slice(0, 6)
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join("");

  return `
    <li class="member-card" data-anim="reveal-item" data-member-index="${index}">
      <button class="member-open" type="button" data-open-member="${index}" aria-label="Open detail for ${escapeHtml(member.fullname)}"></button>
      <div class="member-role">${escapeHtml(roleLabel(member.role))}</div>
      <div class="member-photo">${img(member.image, member.fullname)}</div>
      <div class="member-body">
        <h3>${escapeHtml(member.fullname)}</h3>
        <p class="mono" style="color:var(--fg-soft)">${escapeHtml(member.nickname)}</p>
        <p style="font-size:14px;font-style:italic;line-height:1.35;color:var(--fg-soft)">${escapeHtml(member.slogan)}</p>
        ${
          member.ai_skill
            ? `<div><p class="member-tagline">AI Skill</p><p class="mono" style="color:var(--red);font-weight:700">${escapeHtml(member.ai_skill)}</p></div>`
            : ""
        }
        <div><p class="member-tagline">AI Interests</p><ul class="tag-list">${tags}</ul></div>
        ${member.other_skills ? `<p class="mono" style="font-size:12px;color:var(--fg-soft)">OTHER ${escapeHtml(member.other_skills)}</p>` : ""}
        <div class="contact-row" data-stop-card>${contactLinks(member)}</div>
      </div>
    </li>
  `;
}

function renderMembers(members) {
  const looped = [...members, ...members];
  qs("#members").innerHTML = `
    <div class="container" style="padding-bottom:16px" data-reveal-scope>
      <p class="eyebrow" data-anim="reveal-eyebrow">MEMBERS</p>
      <h2 class="section-title" data-anim="reveal-title">Cohort Roster</h2>
      <p class="mono" data-anim="reveal-body" style="margin-top:8px;color:var(--fg-soft)">${members.length} members</p>
    </div>
    <div class="members-track-wrap" data-reveal-scope>
      <ul class="members-track" data-members-track>
        ${looped.map((member, index) => memberCard(member, index % members.length)).join("")}
      </ul>
    </div>
    <div class="carousel-controls">
      <button class="icon-btn" type="button" data-carousel="left" aria-label="Scroll left">←</button>
      <button class="icon-btn" type="button" data-carousel="right" aria-label="Scroll right">→</button>
    </div>
  `;
}

function renderRedWall(redWall) {
  qs(".red-wall").innerHTML = `
    <blockquote data-reveal-scope data-reveal-start="top 90%">
      <p data-anim="reveal-title">&ldquo;${escapeHtml(redWall.quote)}&rdquo;</p>
      <cite data-anim="reveal-body">— ${escapeHtml(redWall.attribution)}</cite>
    </blockquote>
  `;
}

function categoryImage(items) {
  return items.flatMap((item) => item.images || []).find(Boolean) || "";
}

function renderGallery(items, categories) {
  const byCategory = new Map();
  for (const item of items) {
    for (const id of item.category_ids || []) {
      byCategory.set(id, [...(byCategory.get(id) || []), item]);
    }
  }
  const visibleCategories = categories.filter((category) => (byCategory.get(category.id) || []).length > 0);
  const cats = visibleCategories.length ? visibleCategories : categories;
  const root = qs("#gallery");

  function showCategories() {
    root.innerHTML = `
      <div class="container" data-reveal-scope>
        <header class="section-head">
          <div>
            <p class="eyebrow" data-anim="reveal-eyebrow">GALLERY</p>
            <h2 class="section-title" data-anim="reveal-title">House Activities</h2>
          </div>
        </header>
        ${
          cats.length
            ? `<div class="category-grid">${cats
                .map((category, index) => {
                  const categoryItems = byCategory.get(category.id) || [];
                  return `
                    <button class="category-card" data-anim="reveal-item" type="button" data-category="${escapeHtml(category.id)}">
                      <div class="category-preview">${img(categoryImage(categoryItems), "")}</div>
                      <div style="position:relative;z-index:2;padding:24px">
                        <p class="card-kicker">Category ${String(index + 1).padStart(2, "0")}</p>
                        <h3>${escapeHtml(category.name)}</h3>
                        <p class="mono category-count" style="margin-top:10px;color:var(--fg-soft)">${categoryItems.length} items</p>
                      </div>
                    </button>
                  `;
                })
                .join("")}</div>`
            : `<p class="empty-state">No production gallery photos yet.</p>`
        }
      </div>
    `;
  }

  function showItems(categoryId) {
    const category = categories.find((item) => item.id === categoryId);
    const filtered = byCategory.get(categoryId) || [];
    root.innerHTML = `
      <div class="container" data-reveal-scope>
        <header class="section-head">
          <div>
            <p class="eyebrow" data-anim="reveal-eyebrow">GALLERY</p>
            <h2 class="section-title" data-anim="reveal-title">${escapeHtml(category?.name || "Gallery")}</h2>
          </div>
          <button class="mono link" type="button" data-gallery-back>Back to categories</button>
        </header>
        <p class="lead" data-anim="reveal-body" style="margin-top:24px">${escapeHtml(category?.description || "")}</p>
        ${
          filtered.length
            ? `<div class="gallery-grid">${filtered
                .map(
                  (item, index) => `
                    <article class="gallery-card ${index % 3 === 0 ? "wide" : ""}" data-anim="reveal-item">
                      <button class="card-button" type="button" data-open-gallery="${escapeHtml(item.id)}">
                        <figure>
                          <div class="gallery-photo" data-anim="reveal-photo">${img(item.images?.[0], item.title)}</div>
                          <figcaption>${escapeHtml(item.date ? `${item.title} · ${item.date}` : item.title)}</figcaption>
                        </figure>
                      </button>
                    </article>
                  `,
                )
                .join("")}</div>`
            : `<p class="empty-state">No items found for this category.</p>`
        }
      </div>
    `;
  }

  showCategories();
  root.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      showItems(categoryButton.dataset.category);
      window.requestAnimationFrame(() => initLocalReveal(root));
      return;
    }
    if (event.target.closest("[data-gallery-back]")) {
      showCategories();
      window.requestAnimationFrame(() => initLocalReveal(root));
      return;
    }
    const galleryButton = event.target.closest("[data-open-gallery]");
    if (galleryButton) {
      const item = items.find((entry) => entry.id === galleryButton.dataset.openGallery);
      if (item) openGalleryDialog(item);
    }
  });
}

function renderRecognition(recognition) {
  const hasItems = recognition.awards?.length || recognition.milestones?.length;
  qs("#recognition").innerHTML = `
    <div class="container" data-reveal-scope>
      <p class="eyebrow" data-anim="reveal-eyebrow">RECOGNITION</p>
      <h2 class="section-title" data-anim="reveal-title">Recognition Archive</h2>
      <p class="lead" data-anim="reveal-body" data-drop-cap style="margin-top:24px">${escapeHtml(recognition.lead || "")}</p>
      ${
        hasItems
          ? `<div class="recognition-grid">
              <ul class="award-list">
                ${(recognition.awards || [])
                  .map(
                    (award) => `
                      <li class="award-card" data-anim="reveal-item">
                        <p class="eyebrow">${escapeHtml(award.code)}</p>
                        <h3 style="margin-top:8px">${escapeHtml(award.title)}</h3>
                        <p style="margin-top:12px;color:var(--fg-soft)">${escapeHtml(award.description)}</p>
                      </li>
                    `,
                  )
                  .join("")}
              </ul>
              <ol class="milestone-list">
                ${(recognition.milestones || [])
                  .map(
                    (milestone, index) => `
                      <li data-anim="reveal-item">
                        <span>${String(index + 1).padStart(2, "0")}</span>
                        <div><strong>${escapeHtml(milestone.title)}</strong><p style="color:var(--fg-soft)">${escapeHtml(milestone.description)}</p></div>
                      </li>
                    `,
                  )
                  .join("")}
              </ol>
            </div>`
          : `<p class="empty-state" data-anim="reveal-body">Awards &amp; milestones drop at the showcase — check back then.</p>`
      }
    </div>
  `;
}

function extractVideos(members) {
  return members
    .flatMap((member) =>
      (member.video_links || []).map((url) => {
        const id = youtubeId(url);
        return {
          url,
          memberName: member.fullname,
          memberNickname: member.nickname,
          type: id ? "youtube" : url.includes("tiktok.com") ? "tiktok" : "external",
          youtubeId: id,
        };
      }),
    )
    .sort((a, b) => ({ youtube: 0, tiktok: 1, external: 2 }[a.type] - { youtube: 0, tiktok: 1, external: 2 }[b.type]));
}

function videoCard(video, index) {
  const featured = index === 0;
  const typeLabel = video.type === "youtube" ? "YouTube" : video.type === "tiktok" ? "TikTok" : "External";
  const media =
    video.type === "youtube"
      ? `<button class="video-play" type="button" data-play-youtube="${escapeHtml(video.youtubeId)}" aria-label="Play ${escapeHtml(video.memberName)} intro">
          <img src="https://img.youtube.com/vi/${escapeHtml(video.youtubeId)}/hqdefault.jpg" alt="">
          <span class="play-badge">${icon("play")}</span>
        </button>`
      : `<a class="video-play" href="${escapeHtml(video.url)}" target="_blank" rel="noopener noreferrer"><span class="play-badge">↗</span></a>`;

  return `
    <article class="video-card ${featured ? "featured" : ""}" data-anim="reveal-item">
      <div class="video-frame">${media}</div>
      <div class="video-body">
        <p class="eyebrow">${featured ? "FEATURED · " : ""}${typeLabel}</p>
        <h3 style="margin-top:6px">${escapeHtml(video.memberName)}</h3>
        <p class="mono" style="color:var(--fg-soft)">${escapeHtml(video.memberNickname)}</p>
      </div>
    </article>
  `;
}

function renderClips(members) {
  const videos = extractVideos(members);
  qs("#clips").innerHTML = `
    <div class="container" data-reveal-scope>
      <p class="eyebrow" data-anim="reveal-eyebrow">MEMBER INTRO</p>
      <h2 class="section-title" data-anim="reveal-title">Intro Videos</h2>
      ${
        videos.length
          ? `<div class="clips-grid">${videos.map(videoCard).join("")}</div>`
          : `<p class="empty-state" data-anim="reveal-body">Member intros drop soon — check back then.</p>`
      }
    </div>
  `;
}

function renderFooter(footer) {
  const html = `
    <div>
      <span class="mono">© 2026 Pangpuriye · Super AI Engineer S6 · AIAT</span>
      <nav class="footer-links mono" aria-label="Contacts">
        <a class="link" href="mailto:${escapeHtml(footer.email)}">Email</a>
        <a class="link" href="${escapeHtml(footer.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="link" href="${escapeHtml(footer.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a class="link" href="${escapeHtml(footer.youtube)}" target="_blank" rel="noopener noreferrer">YouTube</a>
      </nav>
    </div>
  `;
  qs("[data-footer]").innerHTML = html;
  qs("[data-menu-footer]").innerHTML = html;
}

function renderOthers(others) {
  const root = qs("#others");
  if (!others?.enabled) {
    root.hidden = true;
    return;
  }
  root.hidden = false;
  root.innerHTML = `
    <div class="container" data-reveal-scope>
      <p class="eyebrow" data-anim="reveal-eyebrow">OTHERS</p>
      <h2 class="section-title" data-anim="reveal-title">Memes &amp; Brainstorms</h2>
      ${
        others.items?.length
          ? `<div class="others-grid">${others.items
              .map(
                (item) => `
                  <article class="other-card" data-anim="reveal-item">
                    <p class="card-kicker">${escapeHtml(item.type === "meme" ? "MEME" : "BRAINSTORM")}</p>
                    <p style="margin-top:8px;color:var(--fg-soft)">${escapeHtml(item.caption)}</p>
                  </article>
                `,
              )
              .join("")}</div>`
          : ""
      }
    </div>
  `;
}

function openMemberDialog(member) {
  const modal = qs("[data-member-modal]");
  modal.innerHTML = `
    <div class="modal-backdrop" data-close-modal></div>
    <article class="dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(member.fullname)}">
      <button class="dialog-close" type="button" data-close-modal>x Close</button>
      <div class="dialog-grid">
        <div class="dialog-media">
          <div class="dialog-photo corner">${img(member.image, member.fullname)}<span></span></div>
        </div>
        <div class="dialog-copy">
          <p class="dialog-kicker">SPAI.${escapeHtml(member.aiat_id)}</p>
          <h2>${escapeHtml(member.fullname)}</h2>
          <p class="mono" style="margin-top:8px;color:var(--fg-soft);font-style:italic">${escapeHtml(member.nickname)}</p>
          <p style="margin-top:18px;color:var(--fg-soft);font-style:italic">${escapeHtml(member.slogan)}</p>
          ${
            member.ai_skill
              ? `<div style="margin-top:22px"><p class="dialog-kicker">AI Skill</p><p class="mono" style="color:var(--red);font-weight:700">${escapeHtml(member.ai_skill)}</p></div>`
              : ""
          }
          <div style="margin-top:22px"><p class="dialog-kicker">AI Interests</p><ul class="tag-list">${member.interesting
            .map((tag) => `<li>${escapeHtml(tag)}</li>`)
            .join("")}</ul></div>
          ${member.other_skills ? `<div style="margin-top:22px"><p class="dialog-kicker">Other</p><p>${escapeHtml(member.other_skills)}</p></div>` : ""}
          <div class="contact-row" style="margin-top:24px">${contactLinks(member)}</div>
        </div>
      </div>
    </article>
  `;
  setModalOpen(modal, true);
}

function openGalleryDialog(item) {
  galleryState = { items: item.images || [], index: 0, item };
  paintGalleryDialog();
}

function paintGalleryDialog() {
  const { item, items, index } = galleryState;
  const modal = qs("[data-gallery-modal]");
  const active = items[index];
  modal.innerHTML = `
    <div class="modal-backdrop" data-close-modal></div>
    <article class="dialog dialog-wide" role="dialog" aria-modal="true" aria-label="${escapeHtml(item.title)}">
      <button class="dialog-close" type="button" data-close-modal>x Close</button>
      <div class="gallery-main">
        ${active ? img(active, item.title) : '<div class="empty-state" style="display:grid;place-items:center;height:100%">API image unavailable</div>'}
        ${
          items.length > 1
            ? `<div class="gallery-arrows">
                <button type="button" data-gallery-prev aria-label="Previous image">←</button>
                <button type="button" data-gallery-next aria-label="Next image">→</button>
              </div>`
            : ""
        }
      </div>
      ${
        items.length > 1
          ? `<div class="gallery-thumbs">${items
              .map(
                (src, thumbIndex) => `
                  <button type="button" data-gallery-thumb="${thumbIndex}" style="border-color:${thumbIndex === index ? "var(--red)" : "var(--hairline)"}">
                    ${img(src, "")}
                  </button>
                `,
              )
              .join("")}</div>`
          : ""
      }
      <div class="gallery-info">
        <p class="dialog-kicker">${escapeHtml(item.date || "Gallery")}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p style="margin-top:14px;color:var(--fg-soft)">${escapeHtml(item.description)}</p>
      </div>
    </article>
  `;
  setModalOpen(modal, true);
}

function initLocalReveal(root) {
  window.PangReveal?.(root);
}

export function renderSite(data) {
  siteData = data;
  renderHero(data.hero);
  renderAbout(data.about);
  renderMembers(data.members);
  renderRedWall(data.redWall);
  renderGallery(data.gallery, data.categories);
  renderRecognition(data.recognition);
  renderClips(data.members);
  renderOthers(data.others);
  renderFooter(data.footer);

  document.addEventListener("click", (event) => {
    const memberButton = event.target.closest("[data-open-member]");
    if (memberButton) {
      openMemberDialog(siteData.members[Number(memberButton.dataset.openMember)]);
      return;
    }
    if (event.target.closest("[data-close-modal]")) {
      setModalOpen(qs("[data-member-modal]"), false);
      setModalOpen(qs("[data-gallery-modal]"), false);
      return;
    }
    const youtubeButton = event.target.closest("[data-play-youtube]");
    if (youtubeButton) {
      const id = youtubeButton.dataset.playYoutube;
      youtubeButton.parentElement.innerHTML = `<iframe src="https://www.youtube.com/embed/${escapeHtml(id)}?autoplay=1&rel=0" title="Member intro video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      return;
    }
    if (event.target.closest("[data-gallery-prev]")) {
      galleryState.index = (galleryState.index - 1 + galleryState.items.length) % galleryState.items.length;
      paintGalleryDialog();
      return;
    }
    if (event.target.closest("[data-gallery-next]")) {
      galleryState.index = (galleryState.index + 1) % galleryState.items.length;
      paintGalleryDialog();
      return;
    }
    const thumb = event.target.closest("[data-gallery-thumb]");
    if (thumb) {
      galleryState.index = Number(thumb.dataset.galleryThumb);
      paintGalleryDialog();
    }
  });
}
