/**
 * Deterministic graph layout — no dependencies, no animation loop.
 *
 * Both modes settle to a fixed arrangement for a given input, so a reload puts
 * every concept back where the reader last saw it.
 */
import type { GraphEdge, GraphNode, LayoutId } from "./types";
import { TIER_ORDER } from "./types";

export type LayoutBox = { width: number; height: number };

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

/**
 * Space a node needs. Tile-styled concepts are drawn as wide rectangles, so
 * they claim more room than their nominal radius.
 */
function extent(node: GraphNode) {
  return node.style === "tile" && node.kind === "concept" ? node.radius * 1.62 : node.radius;
}

function clusterFoci(count: number, box: LayoutBox, rand: () => number) {
  const spread = Math.min(box.width, box.height) * 0.3;
  return Array.from({ length: Math.max(count, 1) }, (_, index) => {
    const angle = (index / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2 + (rand() - 0.5) * 0.35;
    const distance = spread * (0.82 + rand() * 0.36);
    return { x: box.width / 2 + Math.cos(angle) * distance, y: box.height / 2 + Math.sin(angle) * distance };
  });
}

/** Clustered force layout: concepts pull to their cluster focus, notes hang off their concept. */
function forceLayout(nodes: GraphNode[], edges: GraphEdge[], box: LayoutBox, clusterIds: string[]) {
  const rand = seeded(1337);
  const foci = clusterFoci(clusterIds.length, box, rand);
  const focusOf = (node: GraphNode) => foci[Math.max(0, clusterIds.indexOf(node.cluster.id))];

  for (const node of nodes) {
    const focus = focusOf(node);
    const jitter = node.kind === "note" ? 0.5 : 0.32;
    node.x = focus.x + (rand() - 0.5) * box.width * jitter;
    node.y = focus.y + (rand() - 0.5) * box.height * jitter;
  }

  const centerPull = (node: GraphNode) => (node.tier === "major" ? 0.055 : node.tier === "core" ? 0.03 : 0.012);

  for (let step = 0; step < 320; step++) {
    const alpha = 1 - step / 320;

    // Cluster + center attraction
    for (const node of nodes) {
      const focus = focusOf(node);
      const toCluster = node.kind === "note" ? 0.012 : 0.035;
      node.x += (focus.x - node.x) * toCluster * alpha;
      node.y += (focus.y - node.y) * toCluster * alpha;
      node.x += (box.width / 2 - node.x) * centerPull(node) * alpha;
      node.y += (box.height / 2 - node.y) * centerPull(node) * alpha;
    }

    // Edge springs — heavier edges hold their endpoints closer together
    for (const edge of edges) {
      const rest = edge.source.radius + edge.target.radius + 66 - edge.weight * 34;
      const dx = edge.target.x - edge.source.x;
      const dy = edge.target.y - edge.source.y;
      const distance = Math.hypot(dx, dy) || 0.01;
      const pull = ((distance - rest) / distance) * 0.06 * (0.4 + edge.weight) * alpha;
      edge.source.x += dx * pull;
      edge.source.y += dy * pull;
      edge.target.x -= dx * pull;
      edge.target.y -= dy * pull;
    }

    separate(nodes, alpha);
  }

  // Collision-only passes: the springs have had their say, nothing may overlap now.
  for (let pass = 0; pass < 40; pass++) separate(nodes, 0);
}

/** Pairwise repulsion plus a hard non-overlap constraint (n is small enough for O(n²)). */
function separate(nodes: GraphNode[], alpha: number) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 0.01;
      // Concepts carry a label under them, so they need more than body clearance.
      const minimum = extent(a) + extent(b) + (a.kind === "note" || b.kind === "note" ? 18 : 46);
      const overlap = distance < minimum ? ((minimum - distance) / distance) * 0.5 : 0;
      const charge = alpha > 0 ? (((extent(a) + extent(b)) * 90) / (distance * distance * distance)) * alpha : 0;
      const push = overlap + charge;
      if (!push) continue;
      a.x -= dx * push;
      a.y -= dy * push;
      b.x += dx * push;
      b.y += dy * push;
    }
  }
}

/** Orbit layout: rings by tier, angular sectors by cluster. */
function orbitLayout(nodes: GraphNode[], box: LayoutBox, clusterIds: string[]) {
  const rand = seeded(90210);
  const unit = Math.min(box.width, box.height);
  const ringOf: Record<string, number> = { major: 0.13, core: 0.29, supporting: 0.44, minor: 0.56 };
  const sector = (Math.PI * 2) / Math.max(clusterIds.length, 1);
  const perRing = new Map<string, GraphNode[]>();

  for (const node of nodes) {
    const ring = node.kind === "note" ? "note" : node.tier;
    const key = `${node.cluster.id}:${ring}`;
    if (!perRing.has(key)) perRing.set(key, []);
    perRing.get(key)!.push(node);
  }

  for (const [key, members] of perRing) {
    const [clusterId, ring] = key.split(":");
    const clusterIndex = Math.max(0, clusterIds.indexOf(clusterId));
    const radius = unit * (ring === "note" ? 0.66 : ringOf[ring] ?? 0.56);
    members.forEach((node, index) => {
      const spread = sector * 0.86;
      const t = members.length === 1 ? 0.5 : index / (members.length - 1);
      const angle = clusterIndex * sector - Math.PI / 2 + (t - 0.5) * spread + (rand() - 0.5) * 0.05;
      node.x = box.width / 2 + Math.cos(angle) * radius;
      node.y = box.height / 2 + Math.sin(angle) * radius * 0.9;
    });
  }

  // Relax overlaps without leaving the ring structure
  for (let step = 0; step < 120; step++) separate(nodes, 0);
}

export function layoutGraph(nodes: GraphNode[], edges: GraphEdge[], box: LayoutBox, mode: LayoutId, clusterIds: string[]) {
  if (!nodes.length) return;
  // Bigger concepts settle first so smaller ones arrange around them.
  const ordered = [...nodes].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
  if (mode === "orbit") orbitLayout(ordered, box, clusterIds);
  else forceLayout(ordered, edges, box, clusterIds);
}

/** Transform that fits the laid-out graph into the viewport with padding. */
export function fitTransform(nodes: GraphNode[], viewport: LayoutBox, padding = 44) {
  if (!nodes.length) return { x: 0, y: 0, k: 1 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    const reach = extent(node) + (node.kind === "note" ? 46 : 34);
    minX = Math.min(minX, node.x - reach);
    minY = Math.min(minY, node.y - reach);
    maxX = Math.max(maxX, node.x + reach);
    maxY = Math.max(maxY, node.y + reach);
  }
  // Never shrink past the point where labels stop being readable — on a phone
  // the map overflows the frame instead, and the reader pans it.
  const k = Math.max(
    0.62,
    Math.min(
      (viewport.width - padding * 2) / Math.max(maxX - minX, 1),
      (viewport.height - padding * 2) / Math.max(maxY - minY, 1),
      1.35,
    ),
  );
  return {
    k,
    x: viewport.width / 2 - ((minX + maxX) / 2) * k,
    y: viewport.height / 2 - ((minY + maxY) / 2) * k,
  };
}
