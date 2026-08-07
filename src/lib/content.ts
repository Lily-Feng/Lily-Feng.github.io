import { parse } from "yaml";

export type ContentKind = "post" | "note" | "project";

export type ContentDocument = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  domain: string;
  topics: string[];
  connections: string[];
  kind: ContentKind;
  featured: boolean;
  body: string;
  readingMinutes: number;
};

type FrontMatter = {
  slug?: string;
  title?: string;
  date?: string | Date;
  summary?: string;
  domain?: string;
  topics?: string[];
  connections?: string[];
  kind?: ContentKind;
  featured?: boolean;
};

const markdownFiles = import.meta.glob("../../content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function readMarkdown(path: string, raw: string): ContentDocument {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing front matter in ${path}`);
  }

  const metadata = parse(match[1]) as FrontMatter;
  const body = match[2].trim();
  const filename = path.split("/").pop()?.replace(/\.md$/, "") ?? "untitled";
  const fallbackSlug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const folder = path.split("/").at(-2);
  const inferredKind: ContentKind = folder === "posts" ? "post" : folder === "projects" ? "project" : "note";

  if (!metadata.title || !metadata.summary || !metadata.domain) {
    throw new Error(`title, summary, and domain are required in ${path}`);
  }

  const plainWords = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\-[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    slug: metadata.slug ?? fallbackSlug,
    title: metadata.title,
    date: metadata.date instanceof Date
      ? metadata.date.toISOString().slice(0, 10)
      : metadata.date
        ? String(metadata.date).slice(0, 10)
        : "",
    summary: metadata.summary,
    domain: metadata.domain,
    topics: Array.isArray(metadata.topics) ? metadata.topics : [],
    connections: Array.isArray(metadata.connections) ? metadata.connections : [],
    kind: metadata.kind ?? inferredKind,
    featured: metadata.featured ?? false,
    body,
    readingMinutes: Math.max(1, Math.ceil(plainWords / 220)),
  };
}

export const documents = Object.entries(markdownFiles)
  .map(([path, raw]) => readMarkdown(path, raw))
  .sort((a, b) => (b.date || "0000").localeCompare(a.date || "0000"));

export const domains = Array.from(new Set(documents.map((document) => document.domain))).sort();

export function getDocument(slug: string) {
  return documents.find((document) => document.slug === slug);
}

export function getRelated(document: ContentDocument, limit = 3) {
  return documents
    .filter((candidate) => candidate.slug !== document.slug)
    .map((candidate) => {
      const explicit = document.connections.includes(candidate.slug) || candidate.connections.includes(document.slug);
      const sharedTopics = candidate.topics.filter((topic) => document.topics.includes(topic)).length;
      const sameDomain = candidate.domain === document.domain;
      return { candidate, score: (explicit ? 10 : 0) + sharedTopics * 2 + (sameDomain ? 1 : 0) };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function searchDocuments(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return documents;

  return documents
    .map((document) => {
      const title = document.title.toLowerCase();
      const topics = document.topics.join(" ").toLowerCase();
      const haystack = `${document.summary} ${document.body} ${document.domain}`.toLowerCase();
      const score = terms.reduce(
        (total, term) => total + (title.includes(term) ? 6 : 0) + (topics.includes(term) ? 4 : 0) + (haystack.includes(term) ? 1 : 0),
        0,
      );
      return { document, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ document }) => document);
}
