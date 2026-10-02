#!/usr/bin/env node
/**
 * Validate every authored Markdown file before the build.
 *
 * src/lib/content.ts parses front matter in the browser, so a malformed file
 * would otherwise pass CI and render a blank page. Run: node scripts/check-content.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const contentDir = join(root, "content");

const KINDS = ["post", "note", "project", "link"];
const FRONT_MATTER = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

const problems = [];
const slugs = new Map();
const documents = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".md")) check(full);
  }
}

function fail(file, message) {
  problems.push(`${relative(root, file)}: ${message}`);
}

function check(file) {
  const raw = readFileSync(file, "utf8");
  const match = raw.match(FRONT_MATTER);

  if (!match) {
    fail(file, "missing front matter (the file must open with a --- block)");
    return;
  }

  let meta;
  try {
    meta = parse(match[1]);
  } catch (error) {
    fail(file, `front matter is not valid YAML — ${error.message.split("\n")[0]}`);
    return;
  }

  if (!meta || typeof meta !== "object") {
    fail(file, "front matter did not parse to a mapping");
    return;
  }

  for (const field of ["title", "summary", "domain"]) {
    if (!meta[field]) fail(file, `missing required field: ${field}`);
  }

  const folder = file.split("/").at(-2);
  const kind = meta.kind ?? (folder === "posts" ? "post" : folder === "projects" ? "project" : "note");

  if (!KINDS.includes(kind)) {
    fail(file, `unknown kind "${kind}" — expected one of ${KINDS.join(", ")}`);
  }

  if (kind === "link" && !meta.url) {
    fail(file, "kind: link requires a url (there is no local page to render)");
  }
  if (meta.url && !/^https?:\/\//.test(meta.url)) {
    fail(file, `url must be absolute: ${meta.url}`);
  }

  for (const [key, value] of Object.entries(meta.syndicated ?? {})) {
    if (typeof value !== "string" || !/^https?:\/\//.test(value)) {
      fail(file, `syndicated.${key} must be an absolute URL`);
    }
  }

  for (const field of ["topics", "connections"]) {
    if (meta[field] !== undefined && !Array.isArray(meta[field])) {
      fail(file, `${field} must be a list`);
    }
  }

  for (const [field, choices] of Object.entries({
    icon: ["ai", "data", "architecture", "security"],
    color: ["data", "ai", "architecture"],
  })) {
    if (meta[field] !== undefined && !choices.includes(meta[field])) {
      fail(file, `${field} must be one of ${choices.join(", ")}`);
    }
  }
  const publicRoot = join(root, "public");
  for (const field of ["cover", "logo"]) {
    if (meta[field] === undefined) continue;
    const value = meta[field];
    const asset = typeof value === "string" ? resolve(publicRoot, `.${value}`) : "";
    if (typeof value !== "string" || !/^\/(?!\/)[\w/.-]+\.(png|jpe?g|webp|avif|svg)$/i.test(value)
      || !asset.startsWith(publicRoot + sep) || !existsSync(asset) || !statSync(asset).isFile()) {
      fail(file, `${field} must reference an existing local image under public/`);
    }
    if (typeof meta[`${field}Alt`] !== "string" || !meta[`${field}Alt`].trim()) {
      fail(file, `${field} requires descriptive ${field}Alt text`);
    }
  }
  for (const field of ["coverAlt", "logoAlt"]) {
    if (meta[field] !== undefined && (typeof meta[field] !== "string" || !meta[field].trim())) {
      fail(file, `${field} must be non-empty text`);
    }
    if (meta[field] !== undefined && meta[field.replace("Alt", "")] === undefined) {
      fail(file, `${field} requires its image field`);
    }
  }

  if (meta.date !== undefined) {
    const date = meta.date instanceof Date ? meta.date.toISOString().slice(0, 10) : String(meta.date).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(file, `date must be YYYY-MM-DD, got "${meta.date}"`);
  }

  const filename = file.split("/").pop().replace(/\.md$/, "");
  const slug = meta.slug ?? filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");

  if (slugs.has(slug)) {
    fail(file, `duplicate slug "${slug}" — already used by ${relative(root, slugs.get(slug))}`);
  } else {
    slugs.set(slug, file);
  }

  documents.push({ file, slug, connections: Array.isArray(meta.connections) ? meta.connections : [] });
}

walk(contentDir);

// Only checkable once every slug is known.
for (const document of documents) {
  for (const target of document.connections) {
    if (!slugs.has(target)) {
      fail(document.file, `connections references "${target}", which is not a known slug`);
    }
  }
}

if (problems.length) {
  console.error(`\n✗ ${problems.length} content problem${problems.length === 1 ? "" : "s"}:\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ content OK — ${documents.length} files, ${slugs.size} slugs`);
