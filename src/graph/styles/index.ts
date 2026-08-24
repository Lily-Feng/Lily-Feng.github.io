/**
 * Style packs.
 *
 * A pack owns every pixel of a node: its body, its label, its edges, and
 * optionally the backdrop behind the whole canvas. Packs are resolved per node
 * (node.style → cluster.style → domain.style), so one canvas can mix a galaxy
 * cluster with a square-tile cluster.
 *
 * To add a style: write a pack, register it in STYLE_PACKS, then reference its
 * id from a graph JSON file. Nothing else needs to change.
 */
import type { GraphEdge, GraphNode, StyleId } from "../types";
import { galaxy } from "./galaxy";
import { orbit } from "./orbit";
import { tile } from "./tile";

export type GraphTheme = {
  mode: "light" | "dark";
  ink: string;
  inkSoft: string;
  line: string;
  veil: string;
};

/** How a node relates to the current focus. Packs use this instead of raw booleans. */
export type NodeState = "idle" | "focus" | "related" | "dim";

export type DrawEnv = {
  ctx: CanvasRenderingContext2D;
  theme: GraphTheme;
  scale: number;
  time: number;
};

export type NodeEnv = DrawEnv & { state: NodeState; alpha: number; accent: string };
export type EdgeEnv = DrawEnv & { alpha: number; accent: string; emphasis: boolean };
/** `origin`/`width`/`height` describe the visible world rect; `center`/`unit` describe the laid-out graph itself. */
export type BackdropEnv = DrawEnv & {
  width: number;
  height: number;
  originX: number;
  originY: number;
  center: { x: number; y: number };
  unit: number;
};

export type Rect = { x: number; y: number; w: number; h: number };

export type StylePack = {
  id: StyleId;
  hit: "circle" | "rect";
  /** Half-extent used for hit testing and rectangle drawing. */
  box(node: GraphNode): { hw: number; hh: number };
  backdrop?(env: BackdropEnv): void;
  drawEdge(edge: GraphEdge, env: EdgeEnv): void;
  drawNode(node: GraphNode, env: NodeEnv): void;
  drawLabel(node: GraphNode, env: NodeEnv): void;
  /**
   * World-space box the label will occupy, so the engine can drop labels that
   * would collide. `null` means the label lives inside the node body and is
   * always safe to draw.
   */
  labelBounds(node: GraphNode, ctx: CanvasRenderingContext2D): Rect | null;
};

export const STYLE_PACKS: Record<StyleId, StylePack> = { galaxy, orbit, tile };

export function stylePack(id: StyleId): StylePack {
  return STYLE_PACKS[id] ?? galaxy;
}

// ── Shared drawing helpers ──────────────────────────────────────────────────

export function withAlpha(color: string, alpha: number) {
  const clamped = Math.max(0, Math.min(1, alpha));
  if (color.startsWith("#") && color.length === 7) {
    const hex = Math.round(clamped * 255).toString(16).padStart(2, "0");
    return `${color}${hex}`;
  }
  if (color.startsWith("rgb(")) return color.replace("rgb(", "rgba(").replace(")", `, ${clamped})`);
  return color;
}

export function labelSize(node: GraphNode) {
  if (node.kind === "note") return 9;
  return node.tier === "major" ? 15 : node.tier === "core" ? 12.5 : node.tier === "supporting" ? 11 : 10;
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  let used = 0;
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    } else {
      current = candidate;
    }
    used++;
  }
  if (lines.length < maxLines && current) {
    lines.push(current);
    used = words.length;
  }
  const last = lines.length - 1;
  if (last < 0) return lines;
  while (ctx.measureText(lines[last]).width > maxWidth && lines[last].length > 2) {
    lines[last] = lines[last].slice(0, -2);
  }
  // Say so when the label did not fit, rather than stopping mid-phrase.
  if (used < words.length || ctx.measureText(lines[last]).width > maxWidth) {
    lines[last] = `${lines[last].replace(/[\s,;:.]+$/, "")}…`;
  }
  return lines;
}

function labelLines(node: GraphNode, ctx: CanvasRenderingContext2D) {
  const size = labelSize(node);
  ctx.font = `${node.tier === "major" ? 650 : 550} ${size}px Inter, system-ui, sans-serif`;
  const width = Math.max(96, node.radius * 4.2);
  return { size, width, lines: wrapText(ctx, node.label, width, node.kind === "note" ? 2 : 3) };
}

/** Box claimed by a below-the-node label, used for label collision. */
export function labelBelowBounds(node: GraphNode, ctx: CanvasRenderingContext2D, offset: number): Rect {
  const { size, lines } = labelLines(node, ctx);
  const measured = Math.max(...lines.map((line) => ctx.measureText(line).width), 0);
  const height = lines.length * (size * 1.22);
  return {
    x: node.x - measured / 2 - 4,
    y: node.y + node.radius + offset - size * 0.8,
    w: measured + 8,
    h: height + 4,
  };
}

/** Label drawn under the node body — shared by the round style packs. */
export function drawLabelBelow(node: GraphNode, env: NodeEnv, offset: number) {
  const { ctx } = env;
  ctx.save();
  ctx.globalAlpha = env.alpha * (node.kind === "note" ? 0.78 : 1);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const { size, lines } = labelLines(node, ctx);
  // A short halo in the page colour keeps text readable where it crosses a glow.
  ctx.lineWidth = 3;
  ctx.strokeStyle = withAlpha(env.theme.veil, 0.75);
  ctx.lineJoin = "round";
  ctx.fillStyle = env.state === "dim" ? env.theme.inkSoft : env.theme.ink;
  lines.forEach((line, index) => {
    const y = node.y + node.radius + offset + index * (size * 1.22);
    ctx.strokeText(line, node.x, y);
    ctx.fillText(line, node.x, y);
  });
  ctx.restore();
}

/** Blend two colours; used to tone accents for the light theme. */
export function mix(hex: string, target: string, amount: number) {
  const parse = (value: string) => [1, 3, 5].map((index) => parseInt(value.slice(index, index + 2), 16));
  if (hex.length !== 7 || target.length !== 7) return hex;
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(target);
  const channel = (a: number, b: number) => Math.round(a + (b - a) * amount).toString(16).padStart(2, "0");
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
}
