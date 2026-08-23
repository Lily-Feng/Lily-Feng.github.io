/**
 * Weighted knowledge-graph schema.
 *
 * Everything in this file is plain JSON-serializable data: the authored graphs
 * in src/data/graph/*.json are the shared contract, so another renderer (for
 * example the vanilla Patternbook atlas) can consume the same files.
 * See docs/knowledge-graph-schema.md for the authoring guide.
 */

export type StyleId = "galaxy" | "orbit" | "tile";
export type LayoutId = "force" | "orbit";
export type EdgeKind = "supports" | "prerequisite" | "contrasts" | "applies";
export type NodeTier = "major" | "core" | "supporting" | "minor";
export type ResourceType = "article" | "practice" | "project" | "external" | "reference";

/** A link shown in the concept popup. `slug` resolves to a local Markdown note; `href` leaves the site. */
export type GraphResource = {
  type: ResourceType;
  label: string;
  slug?: string;
  href?: string;
  note?: string;
};

export type GraphNodeSpec = {
  id: string;
  label: string;
  cluster: string;
  /** Importance, 0–1. Drives radius, tier, label size, and layout ring. */
  weight: number;
  summary: string;
  /** The three-to-five things worth remembering about this concept. */
  keyPoints?: string[];
  /** Markdown notes carrying any of these topics attach to this concept automatically. */
  topics?: string[];
  /** Overrides the cluster/domain style pack for this node only. */
  style?: StyleId;
  resources?: GraphResource[];
};

export type GraphClusterSpec = {
  id: string;
  label: string;
  accent: string;
  summary?: string;
  /** Overrides the domain style pack for every node in this cluster. */
  style?: StyleId;
};

export type GraphEdgeSpec = {
  source: string;
  target: string;
  /** Relationship strength, 0–1. Drives line weight and related-concept ordering. */
  weight?: number;
  kind?: EdgeKind;
  note?: string;
};

export type DomainGraphSpec = {
  id: string;
  /** Must match the `domain` front-matter value used by the Markdown notes. */
  domain: string;
  title: string;
  tagline?: string;
  style: StyleId;
  layout?: LayoutId;
  clusters: GraphClusterSpec[];
  nodes: GraphNodeSpec[];
  edges: GraphEdgeSpec[];
};

// ── Runtime shapes (built from the spec + the Markdown corpus) ───────────────

export type ResolvedResource = GraphResource & { internal: boolean };

export type GraphNode = {
  id: string;
  label: string;
  kind: "concept" | "note";
  cluster: GraphClusterSpec;
  weight: number;
  tier: NodeTier;
  summary: string;
  keyPoints: string[];
  style: StyleId;
  resources: ResolvedResource[];
  /** Slug of the Markdown note behind a `note` node. */
  slug?: string;
  radius: number;
  x: number;
  y: number;
  /** 0–1 entrance progress, written by the engine. */
  progress: number;
};

export type GraphEdge = {
  source: GraphNode;
  target: GraphNode;
  weight: number;
  kind: EdgeKind;
  note?: string;
};

export type ResolvedGraph = {
  id: string;
  domain: string;
  title: string;
  tagline?: string;
  style: StyleId;
  layout: LayoutId;
  clusters: GraphClusterSpec[];
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export const TIER_ORDER: NodeTier[] = ["major", "core", "supporting", "minor"];

export function tierFor(weight: number): NodeTier {
  if (weight >= 0.75) return "major";
  if (weight >= 0.45) return "core";
  if (weight >= 0.2) return "supporting";
  return "minor";
}

/** Weight → drawn radius. Deliberately non-linear so minor nodes stay legible. */
export function radiusFor(weight: number, kind: GraphNode["kind"]): number {
  if (kind === "note") return 7 + weight * 5;
  return 13 + Math.pow(Math.max(0, Math.min(1, weight)), 0.72) * 40;
}
