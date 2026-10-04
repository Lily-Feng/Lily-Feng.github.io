#!/usr/bin/env node
/**
 * Stamp a real HTML file per route after `vite build`, each with its own title,
 * description, canonical, and OG tags.
 *
 * Crawlers do not run JavaScript, so tags injected by React are invisible to
 * them. Run: node scripts/prerender.mjs   (wired into `npm run build`)
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const contentDir = join(root, "content");

const SITE = "https://lily-feng.github.io";
const SITE_NAME = "Lily’s Workbench";
const DEFAULT_TITLE = "Lily’s Workbench — Lily Feng, Data & AI Platforms";
const DEFAULT_DESCRIPTION =
  "Senior Staff Software Engineer working on enterprise data platforms, applied AI, and agentic systems. Selected work, writing, and an open knowledge map.";

const shell = readFileSync(join(dist, "index.html"), "utf8");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Documents that get a page of their own; external links do not. */
function readDocuments() {
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".md")) {
        const match = readFileSync(full, "utf8").match(/^---\s*\n([\s\S]*?)\n---/);
        if (!match) continue;
        const meta = parse(match[1]) ?? {};
        const folder = full.split("/").at(-2);
        const kind = meta.kind ?? (folder === "posts" ? "post" : folder === "projects" ? "project" : "note");
        if (kind === "link") continue;
        const filename = full.split("/").pop().replace(/\.md$/, "");
        found.push({
          slug: meta.slug ?? filename.replace(/^\d{4}-\d{2}-\d{2}-/, ""),
          title: meta.title,
          summary: meta.summary,
        });
      }
    }
  };
  walk(contentDir);
  return found;
}

const routes = [
  { path: "/", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  {
    path: "/work",
    title: `Learning by doing — ${SITE_NAME}`,
    description: "Domain pillars, builds, and open notebooks — the repositories behind this site.",
  },
  {
    path: "/blogs",
    title: `My Blog — ${SITE_NAME}`,
    description: "Essays, implementation notes, and practical frameworks on enterprise data and applied AI.",
  },
  {
    path: "/about",
    title: `About me — ${SITE_NAME}`,
    description: "Career, education, and technical expertise across data platforms, applied AI, and agentic systems.",
  },
  {
    path: "/knowledge",
    title: `Brief histories — ${SITE_NAME}`,
    description: "Six illustrated timelines of computing, languages, storage, machine learning, reinforcement learning, and infrastructure, with an optional knowledge map.",
  },
  ...readDocuments().map((document) => ({
    path: `/blogs/${document.slug}`,
    title: `${document.title} — ${SITE_NAME}`,
    description: document.summary,
  })),
];

/* GitHub Pages serves dist/<route>/index.html at "/<route>/" and 301s the
   slashless form to it, so the canonical has to name the trailing-slash URL —
   otherwise every page points at a redirect. */
function canonicalFor(path) {
  return path === "/" ? `${SITE}/` : `${SITE}${path}/`;
}

function headFor({ path, title, description }) {
  const canonical = canonicalFor(path);
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:type" content="${path.startsWith("/blogs/") ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${SITE}/og.png" />`,
  ].join("\n    ");
}

let written = 0;
for (const route of routes) {
  const html = shell.replace(
    /<!--\s*head:start\s*-->[\s\S]*?<!--\s*head:end\s*-->/,
    `<!-- head:start -->\n    ${headFor(route)}\n    <!-- head:end -->`,
  );

  if (html === shell) {
    console.error("✗ prerender: the head:start/head:end markers are missing from index.html");
    process.exit(1);
  }

  const dir = route.path === "/" ? dist : join(dist, route.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  written += 1;
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((route) => `  <url><loc>${canonicalFor(route.path)}</loc></url>`),
  "</urlset>",
].join("\n");
writeFileSync(join(dist, "sitemap.xml"), sitemap);

writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`✓ prerendered ${written} routes + sitemap.xml + robots.txt`);
