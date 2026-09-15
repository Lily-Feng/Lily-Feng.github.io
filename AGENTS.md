# Lily’s Workbench — Agent Guide

This repository is the entry point. It is a React + TypeScript + Vite static site
deployed to GitHub Pages at `https://lily-feng.github.io`, and it exists to be the
front door for a Staff/Principal job search: who Lily is, what she has built, what
she thinks, how to reach her.

The depth lives in sibling repositories — [Calm Data and AI](https://github.com/Lily-Feng/Calm.Data.and.AI)
for data and AI from the software side, the [Enterprise Data & AI Architecture
Atlas](https://github.com/Lily-Feng/Enterprise-Data-AI-Architecture-Atlas) for
infrastructure. This site points at them; it does not duplicate them.

## Scope boundary

**The site grows along exactly three axes.** Everything else is out of scope
unless Lily asks for it by name:

1. **Writing** — blog posts and project write-ups, plus items published
   elsewhere (Medium, YouTube, conference talks).
2. **Work** — the repository constellation on `/work`.
3. **Résumé** — career, education, and expertise on `/about`.

Do not add a CMS, a database, a backend, analytics, tracking pixels, comments, a
newsletter, authentication, or a build-time dependency on any external service.
The site must stay a pile of static files that a plain file server can host.

Do not add a fourth content type. Do not add a nav item. The navigation is three
links — Learning by doing, My Blog, About me — and that is a decision, not an
oversight: the
knowledge map was deliberately demoted out of the primary nav in Sep 2026 because
it is the least load-bearing thing for the site's actual reader.

Keep the visual language quiet. The site had an ambient gradient wash, neon glow
dots, hover flyouts, and magazine-style page numbers; they were removed on
purpose. A new decorative treatment needs a reason beyond looking nice.

The site name lives in exactly two places and must be changed in both:
`src/App.tsx` (header and footer) and `scripts/prerender.mjs` (SITE_NAME and
DEFAULT_TITLE). The home page title keeps "Lily Feng" in it so the site still
ranks for her name.

## Architecture

```
content/          authored Markdown — the only place writing lives
  posts/            kind: post
  projects/         kind: project
  knowledge/        kind: note  (feeds the knowledge map, not the archive)
src/
  data/           hand-maintained data modules: resume.ts, work.ts, graph/
  lib/content.ts  the ONLY content loader — import.meta.glob + front matter
  lib/format.ts   date formatting and documentPath()
  components/     one file per route, plus shared ContentCard / RepoCard
  graph/          the knowledge map engine (lazy — see below)
  styles/         tokens first; see docs/design-system.md
scripts/
  check-content.mjs   front-matter validation; runs before every build
  prerender.mjs       per-route HTML with canonical + OG tags
public/404.html   GitHub Pages SPA fallback
```

### Routing

`BrowserRouter` with real paths, not hashes. Routes live in one `<Routes>` tree
in `src/App.tsx`:

| Path | Component | Note |
| --- | --- | --- |
| `/` | `HomePage` | intro + `BootTerminal` + module row. Fits one screen — do not add a section without checking it still does. The terminal reports real data and its entries are real links; never fake a log line |
| `/work` | `WorkPage` | the repo constellation |
| `/blogs` | `BlogsPage` | archive + search |
| `/blogs/:slug` | `ArticlePage` | owns its own `<main>` |
| `/about` | `AboutPage` | résumé; prints to PDF |
| `/knowledge` | `KnowledgePage` | **lazy**; not in the nav, reached from `/work` |
| `/easter` | `JianghuPage` | no shared header |
| `*` | `NotFound` | a real 404 |

Three things to preserve:

- **`/knowledge` must keep existing.** `Calm.Data.and.AI/README.md` links to it.
  Demoting it from the nav was intentional; deleting the route would break a
  cross-repo link.
- **`KnowledgePage` stays lazy** (`src/App.tsx`). It pulls ~1,800 lines of graph
  code and 710 lines of graph JSON; a static import puts all of that on the
  landing page. `ExperienceGlobe` is lazy for the same reason — 1.9 MB.
- **Navigate with `<Link>`/`<NavLink>`, never a button plus `navigate()`.** Real
  anchors are what make cmd-click, "copy link", and crawling work.

### Content loading

`src/lib/content.ts` is the whole pipeline: `import.meta.glob` over
`content/**/*.md`, front matter parsed with `yaml`. No CMS, no build plugin.

It throws on malformed input at **module-evaluation time in the browser**, which
means a bad file used to pass CI and then render a blank page. That is why
`scripts/check-content.mjs` exists and runs first in `npm run build` and in CI.
**Do not remove that step**, and when you add a front-matter field, teach the
validator about it in the same change.

## Authoring contract

Front matter. `title`, `summary`, and `domain` are required; everything else is
optional.

```yaml
---
title: A clear, useful title
date: 2026-09-14
summary: One sentence shown on cards and in search results.
domain: Enterprise AI
topics: [Data Platforms, Governance]
connections: [another-note-slug]     # must resolve to a real slug
kind: post                            # post | note | project | link
featured: false
syndicated:                           # optional — copies published elsewhere
  medium: https://medium.com/@…
---
```

- The filename becomes the slug, minus any `YYYY-MM-DD-` prefix, unless `slug:`
  is given. `kind` is inferred from the folder when absent.
- **`kind: link`** is content that lives somewhere else — a talk, a video, a
  piece written for someone else's publication. It requires `url:`, takes an
  optional `source:` ("Medium", "YouTube", "Conference") for its badge, and gets
  **no page of its own**. It still joins the archive and the search index.
- **`syndicated:`** is for a post that lives here *and* elsewhere. **This site is
  always the original.** Publish here first, then use Medium's "Import a story"
  so Medium sets its canonical tag pointing back here. Never reverse that.

`scripts/prerender.mjs` writes a real HTML file per route with its own `<title>`,
description, OG tags, and `<link rel="canonical">`. This is load-bearing: Google,
Medium's importer, LinkedIn and Slack do not run JavaScript, so a tag injected by
React is invisible to all of them. `index.html` carries `<!-- head:start -->` /
`<!-- head:end -->` markers — the prerender fails loudly if they go missing.

## Design system contract

`docs/design-system.md` is the reference. The short version:

- Component CSS contains **no colour literals, no raw pixel radii, no raw
  durations**. If you are typing a hex value, the token is missing, not the rule.
- Never restyle a component per theme. A wrong colour in one theme means the
  semantic token is wrong.
- New colour need → a new semantic role in `tokens.css`, not a one-off `rgba()`.
- Two exceptions, both deliberate: `--cluster-accent` is content colour set from
  graph data, and `.globe-shell` / `src/styles/jianghu.css` declare their own
  local scopes because they are separate scenes, not pages.

## Validation

Before finishing any change:

```bash
npm run check          # content validation + typecheck
npm run build          # check-content → tsc → vite → prerender
npm run dev            # then walk the routes
```

Walk `/`, `/work`, `/blogs`, one `/blogs/<slug>`, `/about`, `/knowledge`,
`/easter`, and a junk path (expect the 404, not a silent redirect to About).
Check light and dark, and check 390px — no page may scroll horizontally.

If you touched content handling, break a front-matter block on purpose and
confirm `npm run build` **fails** rather than shipping a blank page.
