/**
 * Popup link styling, kept separate from both the renderer and the content.
 *
 * Each resource type gets its own visual treatment: `variant` becomes the CSS
 * class (`.res-link--practice`), `icon` is resolved to a Lucide component in
 * the React layer. Add a type here plus a matching CSS block and every graph
 * can use it immediately.
 */
import type { ResourceType } from "./types";

export type ResourceStyleSpec = {
  /** Heading for the group in the popup. */
  group: string;
  /** One-line explanation of what the reader gets. */
  hint: string;
  icon: "file-text" | "terminal" | "boxes" | "external-link" | "book-marked";
  variant: string;
  order: number;
};

export const RESOURCE_STYLES: Record<ResourceType, ResourceStyleSpec> = {
  article: {
    group: "Read",
    hint: "Field notes written on this site",
    icon: "file-text",
    variant: "article",
    order: 1,
  },
  practice: {
    group: "Practice",
    hint: "Hands-on patterns in the engineering atlas",
    icon: "terminal",
    variant: "practice",
    order: 2,
  },
  project: {
    group: "Build",
    hint: "Projects where the idea is applied",
    icon: "boxes",
    variant: "project",
    order: 3,
  },
  reference: {
    group: "Reference",
    hint: "Definitions and background worth keeping",
    icon: "book-marked",
    variant: "reference",
    order: 4,
  },
  external: {
    group: "Elsewhere",
    hint: "Sources outside the garden",
    icon: "external-link",
    variant: "external",
    order: 5,
  },
};

export const RESOURCE_ORDER = (Object.keys(RESOURCE_STYLES) as ResourceType[]).sort(
  (a, b) => RESOURCE_STYLES[a].order - RESOURCE_STYLES[b].order,
);
