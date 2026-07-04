# RASHINBAN LP — Astro + Sveltia CMS clone

Design for rebuilding the rashinban_lp static site (Parcel + posthtml-include + LESS)
as an Astro site whose content pages are editable through Sveltia CMS.

## Decisions (made 2026-07-05)

- **SSG: Astro.** Pure static HTML/CSS/JS output, works on GitHub Pages. Content
  collections map 1:1 onto Sveltia collections. HTML/LESS ports nearly verbatim.
- **Location: new sibling repo** (`rashinban_cms`), keeping `rashinban_lp` untouched
  as reference. Sveltia commits content into this repo.
- **Hosting: GitHub Pages** via GitHub Actions (`withastro/action`).
- **Content model: structured where it fits** (user was away for this question;
  chosen as recommended — revisit if undesired):
  - `news` — Markdown folder collection. Frontmatter: `title`, `date`,
    `description?`, `link?` (external/internal URL for link-only items with no
    article body). Drives `/news/` index and homepage NEWS section (top 3).
  - `interviews` — Markdown folder collection. Frontmatter: `name`, `title`, `photo`.
  - `players` — YAML data collection (one file per player): `name`, `title`
    (e.g. 予選第1回 優勝), `photo`, `description`, `interview?` (slug), `order`.
    Rendered into the two-column `/players/` page.
  - `staff` — same pattern as players.
  - `pages` — singleton Markdown files for about / tournament / tickets / meta.
- **Main page (`/`) stays hand-coded** as Astro components ported from
  `src/sections/*.html`, except the NEWS section which reads the `news` collection.

## Architecture

```
rashinban_cms/
├── astro.config.mjs        # static output, site URL
├── src/
│   ├── content.config.ts   # zod schemas for collections
│   ├── content/            # ← everything Sveltia edits lives here
│   │   ├── news/*.md
│   │   ├── interviews/*.md
│   │   ├── players/*.yaml
│   │   ├── staff/*.yaml
│   │   └── pages/*.md
│   ├── layouts/
│   │   ├── Base.astro      # head meta/OGP, nav, footer, main.js
│   │   └── Article.astro   # .article/.container wrapper for content pages
│   ├── components/         # Nav, Footer + homepage sections
│   ├── pages/
│   │   ├── index.astro
│   │   ├── news/index.astro, news/[slug].astro
│   │   ├── interviews/[slug].astro
│   │   ├── players.astro, staff.astro
│   │   └── [slug].astro    # pages collection (about, tournament, tickets, meta)
│   ├── styles/*.less       # ported verbatim
│   └── scripts/main.js     # ported verbatim
├── public/
│   ├── admin/index.html    # Sveltia CMS (loaded from CDN)
│   ├── admin/config.yml    # collections config (Japanese labels)
│   └── assets/…            # images, rulebook.pdf, favicon
└── .github/workflows/deploy.yml
```

## Sveltia CMS auth on GitHub Pages

GitHub Pages cannot host the OAuth token handler Sveltia needs for the GitHub
backend. Two supported paths:

1. **Local editing (zero setup):** run `npx astro dev`, open
   `http://localhost:4321/admin/`, click "Work with Local Repository"
   (Chrome/Edge File System Access API). Commit + push manually.
2. **Remote editing:** deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   to a free Cloudflare Worker, register a GitHub OAuth app, set
   `base_url` in `config.yml` to the worker URL.

The config ships with the GitHub backend configured; README documents both paths.

## Porting notes

- posthtml `<include src>` → Astro component imports.
- Asset URLs `/src/assets/…` → `/assets/…` (served from `public/`).
- LESS: Astro supports `.less` via the `less` package; `main.less` imported in `Base.astro`.
- External CDN links (bootstrap-icons, typekit, Google Fonts preconnect) kept as-is.
- `scripts/main.js` behavior (drawer nav, smooth scroll, live tab toggle, deadline
  tooltips) is DOM-driven and framework-free; loaded unchanged from Base layout.
- News items that are pure links (e.g. 大会情報公開 → Twitter) become entries with
  `link` set and empty body; the index renders them as external links and no page
  is generated.
