/**
 * Loads the authored graph JSON and merges it with the Markdown corpus.
 *
 * Concepts, weights, and links are curated in the JSON files. Notes attach
 * themselves: any Markdown file whose `topics` overlap a concept's `topics`
 * becomes a satellite node and shows up in that concept's popup.
 */
import { documents, getDocument, type ContentDocument } from "../../lib/content";
import type {
  DomainGraphSpec,
  GraphEdge,
  GraphNode,
  ResolvedGraph,
  ResolvedResource,
  StyleId,
} from "../../graph/types";
import { radiusFor, tierFor } from "../../graph/types";

const files = import.meta.glob("./*.json", { eager: true, import: "default" }) as Record<string, DomainGraphSpec>;

export const graphSpecs: DomainGraphSpec[] = Object.values(files).sort((a, b) => a.title.localeCompare(b.title));

export function specForDomain(domain: string) {
  return graphSpecs.find((spec) => spec.domain === domain);
}

function resolveResources(
  resources: DomainGraphSpec["nodes"][number]["resources"],
  attached: ContentDocument[],
): ResolvedResource[] {
  const seen = new Set<string>();
  const out: ResolvedResource[] = [];

  for (const resource of resources ?? []) {
    if (resource.slug) {
      const document = getDocument(resource.slug);
      if (!document) continue; // never render a link to a note that no longer exists
      seen.add(resource.slug);
      out.push({ ...resource, label: resource.label || document.title, internal: true });
    } else if (resource.href) {
      out.push({ ...resource, internal: false });
    }
  }

  for (const document of attached) {
    if (seen.has(document.slug)) continue;
    seen.add(document.slug);
    out.push({
      type: document.kind === "project" ? "project" : "article",
      label: document.title,
      slug: document.slug,
      note: document.summary,
      internal: true,
    });
  }

  return out;
}

export function buildGraph(spec: DomainGraphSpec): ResolvedGraph {
  const clusters = new Map(spec.clusters.map((cluster) => [cluster.id, cluster]));
  const fallbackCluster = spec.clusters[0];
  const styleFor = (nodeStyle: StyleId | undefined, clusterId: string): StyleId =>
    nodeStyle ?? clusters.get(clusterId)?.style ?? spec.style;

  const domainDocuments = documents.filter((document) => document.domain === spec.domain);
  const attachments = new Map<string, ContentDocument[]>();
  const attachedTo = new Map<string, string[]>();

  // How many concepts claim each topic: a topic used by one concept is a much
  // stronger signal than a topic sprinkled across half the map.
  const topicSpread = new Map<string, number>();
  for (const node of spec.nodes) {
    for (const topic of node.topics ?? []) topicSpread.set(topic, (topicSpread.get(topic) ?? 0) + 1);
  }

  for (const document of domainDocuments) {
    const matches = spec.nodes
      .map((node) => ({
        node,
        score: (node.topics ?? [])
          .filter((topic) => document.topics.includes(topic))
          .reduce((total, topic) => total + 1 / (topicSpread.get(topic) ?? 1), 0),
      }))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score || b.node.weight - a.node.weight)
      .slice(0, 2)
      .map((match) => match.node);
    const owners = matches.length
      ? matches
      : [[...spec.nodes].sort((a, b) => b.weight - a.weight)[0]].filter(Boolean);
    for (const owner of owners) {
      if (!attachments.has(owner.id)) attachments.set(owner.id, []);
      attachments.get(owner.id)!.push(document);
    }
    attachedTo.set(
      document.slug,
      owners.map((owner) => owner.id),
    );
  }

  const nodes: GraphNode[] = spec.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    kind: "concept",
    cluster: clusters.get(node.cluster) ?? fallbackCluster,
    weight: node.weight,
    tier: tierFor(node.weight),
    summary: node.summary,
    keyPoints: node.keyPoints ?? [],
    style: styleFor(node.style, node.cluster),
    resources: resolveResources(node.resources, attachments.get(node.id) ?? []),
    radius: radiusFor(node.weight, "concept"),
    x: 0,
    y: 0,
    progress: 0,
  }));

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges: GraphEdge[] = [];

  for (const edge of spec.edges) {
    const source = byId.get(edge.source);
    const target = byId.get(edge.target);
    if (!source || !target) continue;
    edges.push({ source, target, weight: edge.weight ?? 0.5, kind: edge.kind ?? "supports", note: edge.note });
  }

  for (const document of domainDocuments) {
    const owners = attachedTo.get(document.slug) ?? [];
    if (!owners.length) continue;
    const anchor = byId.get(owners[0]);
    if (!anchor) continue;
    const weight = document.featured ? 0.2 : 0.14;
    const noteNode: GraphNode = {
      id: `note:${document.slug}`,
      label: document.title,
      kind: "note",
      cluster: anchor.cluster,
      weight,
      tier: "minor",
      summary: document.summary,
      keyPoints: [],
      style: anchor.style,
      slug: document.slug,
      resources: [
        {
          type: document.kind === "project" ? "project" : "article",
          label: `Read “${document.title}”`,
          slug: document.slug,
          note: `${document.readingMinutes} min · ${document.topics.slice(0, 3).join(", ")}`,
          internal: true,
        },
      ],
      radius: radiusFor(weight, "note"),
      x: 0,
      y: 0,
      progress: 0,
    };
    nodes.push(noteNode);
    byId.set(noteNode.id, noteNode);
    for (const ownerId of owners) {
      const owner = byId.get(ownerId);
      if (owner) edges.push({ source: owner, target: noteNode, weight: 0.75, kind: "applies" });
    }
  }

  return {
    id: spec.id,
    domain: spec.domain,
    title: spec.title,
    tagline: spec.tagline,
    style: spec.style,
    layout: spec.layout ?? "force",
    clusters: spec.clusters,
    nodes,
    edges,
  };
}

/** Domains that have an authored graph, in the order the tabs should show them. */
export const graphDomains = graphSpecs.map((spec) => spec.domain);
