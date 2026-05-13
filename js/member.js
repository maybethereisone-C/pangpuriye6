// js/member.js
// Renders member cards into #member-grid from the ROSTER data array.

const member = (() => {
  // ── roster data ──────────────────────────────────────────────────────────
  // Replace placeholder entries with real member data.
  const ROSTER = [
    {
      id: '000001',
      name: 'First Last',
      nick: 'Nick',
      motto: 'Member motto goes here — replace with the real line.',
      photo: null,
      skill: 'Agentic AI',
      interests: ['Machine Learning', 'Generative AI'],
      other: 'Video editing, running',
    },
    {
      id: '000002',
      name: 'First Last',
      nick: 'Alias',
      motto: 'Ship fast, learn faster.',
      photo: null,
      skill: 'Prompt Engineering',
      interests: ['NLP', 'Fine-tuning'],
      other: 'Photography, chess',
    },
    {
      id: '000003',
      name: 'First Last',
      nick: 'Handle',
      motto: 'Data tells the story — code writes the next chapter.',
      photo: null,
      skill: 'Data Science',
      interests: ['Computer Vision', 'Reinforcement Learning'],
      other: 'Hiking, guitar',
    },
  ];

  // ── placeholder panther SVG (shown when no photo) ─────────────────────────
  const PLACEHOLDER_SVG = `
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#c8291e" stroke-width="0.8">
        <line x1="10" y1="15" x2="30" y2="40"/>
        <line x1="30" y1="40" x2="20" y2="65"/>
        <line x1="20" y1="65" x2="50" y2="75"/>
        <line x1="50" y1="75" x2="80" y2="60"/>
        <line x1="80" y1="60" x2="95" y2="35"/>
        <line x1="95" y1="35" x2="75" y2="15"/>
        <line x1="75" y1="15" x2="50" y2="20"/>
        <line x1="50" y1="20" x2="10" y2="15"/>
        <line x1="50" y1="75" x2="45" y2="105"/>
        <line x1="45" y1="105" x2="35" y2="130"/>
        <line x1="45" y1="105" x2="58" y2="128"/>
      </g>
      <g fill="#c8291e">
        <circle cx="30" cy="40"  r="2"/>
        <circle cx="50" cy="75"  r="2.5"/>
        <circle cx="80" cy="60"  r="2"/>
        <circle cx="95" cy="35"  r="2"/>
        <circle cx="45" cy="105" r="2"/>
      </g>
    </svg>`;

  // ── card builder ─────────────────────────────────────────────────────────
  function buildCard(data) {
    const card = document.createElement('article');
    card.className = 'member-card';

    const photoContent = data.photo
      ? `<img src="${data.photo}" alt="${data.name}" loading="lazy"/>`
      : `<div class="member-card__photo-placeholder">${PLACEHOLDER_SVG}</div>`;

    const tags = data.interests
      .map((t) => `<span class="member-card__tag">${t}</span>`)
      .join('');

    card.innerHTML = `
      <div class="member-card__header">
        <span class="member-card__id">ID: ${data.id}</span>
        <span class="member-card__status">${data.photo ? 'ACTIVE' : 'MOCK'}</span>
      </div>
      <div class="member-card__photo">${photoContent}</div>
      <div class="member-card__body">
        <p class="member-card__name">${data.name}</p>
        <p class="member-card__nick">"${data.nick}"</p>
        <p class="member-card__motto">${data.motto}</p>
        <p class="member-card__field-label">AI Skill</p>
        <p class="member-card__skill">${data.skill}</p>
        <p class="member-card__field-label">AI Interests</p>
        <div class="member-card__tags">${tags}</div>
        <p class="member-card__other"><strong>Other</strong>${data.other}</p>
      </div>`;

    return card;
  }

  function init() {
    const grid = document.getElementById('member-grid');
    if (!grid) return;
    ROSTER.forEach((m) => grid.appendChild(buildCard(m)));
  }

  return { init };
})();
