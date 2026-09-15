# Lily’s Workbench — lily-feng.github.io

The entry point: selected work, writing, and a résumé. A static React +
TypeScript + Vite site deployed to GitHub Pages. Everything lives in this
repository — no database, no CMS, no backend.

Agent instructions and the scope boundary are in [`AGENTS.md`](AGENTS.md).

## Work locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # validates content, typechecks, bundles, prerenders
npm run check    # validation + typecheck only
```

`npm run build` runs `scripts/check-content.mjs` first, so a malformed Markdown
file fails the build with a named error instead of shipping a blank page.

## Publish a post

Add a Markdown file to `content/posts/`:

```md
---
title: A clear, useful title
date: 2026-09-14
summary: One sentence shown on cards and in search results.
domain: Enterprise AI
topics:
  - Data Platforms
  - Governance
connections:
  - another-note-slug
kind: post
featured: false
---

Write the article here using normal Markdown.
```

`title`, `summary`, and `domain` are required. The filename becomes the URL slug
unless a `slug` field is given; a leading `YYYY-MM-DD-` is stripped. Use
`content/knowledge/` for evergreen notes and `content/projects/` for project
write-ups.

Push to `master` and GitHub Actions builds and publishes `dist/`.

### Link to something published elsewhere

A talk, a video, or a piece written for someone else's publication is a
`kind: link`. It appears in the archive and in search with a source badge and
clicks straight out — no page is generated for it.

```md
---
title: Evaluating agent output without fooling yourself
date: 2026-09-10
summary: A walkthrough of the verification gate in front of every agent decision.
domain: Applied Machine Learning
topics: [Evaluation]
kind: link
source: YouTube
url: https://www.youtube.com/watch?v=…
---
```

### Cross-post to Medium

Publish here first, then use Medium's **Import a story** so Medium sets its
canonical tag pointing back at this site. Then record the copy:

```yaml
syndicated:
  medium: https://medium.com/@lilyfeng/…
```

The article page then shows "Also on Medium". This site stays the original —
never the other way round.

## Update the résumé

Edit [`src/data/resume.ts`](src/data/resume.ts) — profile, `now`, experience,
education, expertise, and the journey-map locations all read from it. The
"Download résumé" button on `/about` prints the page; there is no separate PDF to
keep in sync.

## Update the work page

Edit [`src/data/work.ts`](src/data/work.ts). Repositories are grouped into three
tiers (pillars, builds, notes), each with a `status` of `live`, `repo`, or
`unpublished`.

## Edit the knowledge map

The map at `/knowledge` is authored, weighted data — one JSON file per domain in
`src/data/graph/`. Concepts carry a `weight` (0–1), `keyPoints` for the popup,
and typed links. Notes attach themselves to concepts through their `topics`, so
publishing a Markdown file grows the map without editing it.

The field reference, the weight-to-tier table, and how to add a style pack are in
[`docs/knowledge-graph-schema.md`](docs/knowledge-graph-schema.md).

The map is reachable from `/work` rather than the main navigation — it is a
reference room, not the front of the house.

## Design system

One token layer drives colour, type, space, radius, and motion. Rotate
`--hue-accent` in `src/styles/tokens.css` and the whole site recolours
coherently. Component CSS contains no literals. See
[`docs/design-system.md`](docs/design-system.md).
