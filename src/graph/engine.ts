/**
 * Canvas renderer for a resolved knowledge graph.
 *
 * Framework-free on purpose: it takes a canvas and a graph, and reports hover
 * and selection back through callbacks. React (or any other shell) owns the
 * popup, the domain tabs, and routing.
 */
import { fitTransform, layoutGraph } from "./layout";
import type { BackdropEnv, GraphTheme, NodeEnv, NodeState, Rect, StylePack } from "./styles";
import { mix, STYLE_PACKS, stylePack, withAlpha } from "./styles";
import type { GraphNode, ResolvedGraph } from "./types";

export type ScreenPoint = { x: number; y: number };

export type EngineOptions = {
  onSelect: (node: GraphNode | null, anchor: ScreenPoint | null) => void;
  onHover: (node: GraphNode | null, anchor: ScreenPoint | null) => void;
};

type Transform = { x: number; y: number; k: number };

const ENTRANCE_STEP = 70;
const ENTRANCE_DURATION = 520;

export function createGraphEngine(canvas: HTMLCanvasElement, options: EngineOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d canvas context unavailable");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let graph: ResolvedGraph | null = null;
  let theme: GraphTheme = { mode: "dark", ink: "#e8edf6", inkSoft: "#8896aa", line: "#213047", veil: "#080d18" };
  let transform: Transform = { x: 0, y: 0, k: 1 };
  let width = 0;
  let height = 0;
  let hovered: GraphNode | null = null;
  let selectedId: string | null = null;
  let relatedOf = "";
  let related = new Set<string>();
  let layoutBox = { width: 0, height: 0 };
  let interacted = false;
  let entranceStart = performance.now();
  let frame: number | null = null;
  let running = true;
  let dragging = false;
  let dragMoved = false;
  let dragOrigin = { x: 0, y: 0 };

  function packFor(node: GraphNode): StylePack {
    return stylePack(node.style);
  }

  /** Accents are authored for the dark canvas; deepen them on a light page. */
  function accentFor(node: GraphNode) {
    return theme.mode === "light" ? mix(node.cluster.accent, "#0b1424", 0.3) : node.cluster.accent;
  }

  function overlaps(a: Rect, b: Rect) {
    return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  function relayout() {
    if (!graph || !width || !height) return;
    layoutBox = { width, height };
    layoutGraph(
      graph.nodes,
      graph.edges,
      { width, height },
      graph.layout,
      graph.clusters.map((cluster) => cluster.id),
    );
    transform = fitTransform(graph.nodes, { width, height });
  }

  /** Neighbours of the focused node — recomputed only when the focus changes. */
  function computeRelated(id: string | null) {
    if (relatedOf === (id ?? "")) return;
    relatedOf = id ?? "";
    related = new Set<string>();
    if (!graph || !id) return;
    for (const edge of graph.edges) {
      if (edge.source.id === id) related.add(edge.target.id);
      if (edge.target.id === id) related.add(edge.source.id);
    }
  }

  function focusNode(): GraphNode | null {
    if (!graph) return null;
    if (selectedId) return graph.nodes.find((node) => node.id === selectedId) ?? null;
    return hovered;
  }

  function stateOf(node: GraphNode, focus: GraphNode | null): NodeState {
    if (!focus) return "idle";
    if (node.id === focus.id) return "focus";
    return related.has(node.id) ? "related" : "dim";
  }

  function entranceProgress(node: GraphNode, now: number) {
    if (reduceMotion || !graph) return 1;
    const rank = graph.nodes.indexOf(node);
    const elapsed = now - entranceStart - rank * ENTRANCE_STEP * 0.35;
    if (elapsed <= 0) return 0;
    if (elapsed >= ENTRANCE_DURATION) return 1;
    const t = elapsed / ENTRANCE_DURATION;
    return 1 - Math.pow(1 - t, 3);
  }

  function toGraph(point: ScreenPoint) {
    return { x: (point.x - transform.x) / transform.k, y: (point.y - transform.y) / transform.k };
  }

  function nodeAt(point: ScreenPoint): GraphNode | null {
    if (!graph) return null;
    const { x, y } = toGraph(point);
    const slack = 6 / transform.k;
    for (let i = graph.nodes.length - 1; i >= 0; i--) {
      const node = graph.nodes[i];
      const pack = packFor(node);
      const { hw, hh } = pack.box(node);
      if (pack.hit === "circle") {
        if (Math.hypot(node.x - x, node.y - y) <= hw + slack) return node;
      } else if (Math.abs(node.x - x) <= hw + slack && Math.abs(node.y - y) <= hh + slack) {
        return node;
      }
    }
    return null;
  }

  function labelVisible(node: GraphNode, state: NodeState) {
    if (state === "focus" || state === "related") return true;
    if (state === "dim") return false;
    if (node.kind === "note") return transform.k > 1.45;
    return node.tier !== "minor" || transform.k > 0.9;
  }

  /** Priority for label collision: focus first, then the heaviest concepts. */
  function labelRank(node: GraphNode, focus: GraphNode | null) {
    if (focus && node.id === focus.id) return 2;
    if (focus && related.has(node.id)) return 1.5;
    return node.weight;
  }

  function render(now: number) {
    if (!graph || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const focus = focusNode();
    computeRelated(focus?.id ?? null);
    for (const node of graph.nodes) node.progress = entranceProgress(node, now);

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    const view = {
      originX: -transform.x / transform.k,
      originY: -transform.y / transform.k,
      width: width / transform.k,
      height: height / transform.k,
    };
    const base = { ctx, theme, scale: transform.k, time: now };

    STYLE_PACKS[graph.style].backdrop?.({
      ...base,
      ...view,
      center: { x: layoutBox.width / 2, y: layoutBox.height / 2 },
      unit: Math.min(layoutBox.width, layoutBox.height),
    } as BackdropEnv);

    // Quiet layer: every edge that is not attached to the focused concept
    for (const edge of graph.edges) {
      if (focus && (edge.source.id === focus.id || edge.target.id === focus.id)) continue;
      const alpha = Math.min(edge.source.progress, edge.target.progress) * (focus ? 0.25 : 1);
      packFor(edge.source).drawEdge(edge, { ...base, alpha, accent: accentFor(edge.source), emphasis: false });
    }

    // Dim veil so the focused neighbourhood reads first
    if (focus) {
      ctx.save();
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = theme.veil;
      ctx.fillRect(view.originX, view.originY, view.width, view.height);
      ctx.restore();

      for (const edge of graph.edges) {
        if (edge.source.id !== focus.id && edge.target.id !== focus.id) continue;
        packFor(focus).drawEdge(edge, { ...base, alpha: 1, accent: accentFor(focus), emphasis: true });
      }
    }

    // Dimmed nodes sit under the focused neighbourhood, faint but still readable as shape.
    if (focus) {
      for (const node of graph.nodes) {
        if (node.progress <= 0 || stateOf(node, focus) !== "dim") continue;
        packFor(node).drawNode(node, {
          ...base,
          state: "dim",
          alpha: node.progress * 0.22,
          accent: accentFor(node),
        });
      }
    }

    const labelQueue: { node: GraphNode; env: NodeEnv }[] = [];
    for (const node of graph.nodes) {
      if (node.progress <= 0) continue;
      const state = stateOf(node, focus);
      if (state === "dim") continue;
      const env = { ...base, state, alpha: node.progress, accent: accentFor(node) };
      packFor(node).drawNode(node, env);
      if (labelVisible(node, state)) labelQueue.push({ node, env });
    }

    // Labels last, heaviest first. Every node body is already spoken for, so a
    // label either finds clear space below its node, flips above it, or is
    // dropped until the reader hovers or selects that node.
    const claimed: Rect[] = graph.nodes
      .filter((node) => node.progress > 0 && stateOf(node, focus) !== "dim")
      .map((node) => {
        const { hw, hh } = packFor(node).box(node);
        return { x: node.x - hw - 2, y: node.y - hh - 2, w: hw * 2 + 4, h: hh * 2 + 4 };
      });

    labelQueue.sort((a, b) => labelRank(b.node, focus) - labelRank(a.node, focus));
    for (const { node, env } of labelQueue) {
      const pack = packFor(node);
      const bounds = pack.labelBounds(node, ctx);
      if (!bounds || labelRank(node, focus) >= 1.5) {
        pack.drawLabel(node, env);
        if (bounds) claimed.push(bounds);
        continue;
      }
      const above = -(bounds.h + node.radius * 2 + 26);
      const fits = [0, above].find(
        (dy) => !claimed.some((rect) => overlaps(rect, { ...bounds, y: bounds.y + dy })),
      );
      // A crowded minor label is dropped; a major or core one is always drawn,
      // because an unlabelled headline concept is worse than a tight fit.
      if (fits === undefined && node.tier !== "major" && node.tier !== "core") continue;
      const choice = fits ?? 0;
      claimed.push({ ...bounds, y: bounds.y + choice });
      ctx.save();
      ctx.translate(0, choice);
      pack.drawLabel(node, env);
      ctx.restore();
    }

    ctx.restore();
  }

  function loop(now: number) {
    if (!running) return;
    render(now);
    frame = requestAnimationFrame(loop);
  }

  // ── Pointer handling ──────────────────────────────────────────────────────

  function localPoint(event: PointerEvent | WheelEvent): ScreenPoint {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  const onPointerDown = (event: PointerEvent) => {
    dragging = true;
    interacted = true;
    dragMoved = false;
    const point = localPoint(event);
    dragOrigin = { x: point.x - transform.x, y: point.y - transform.y };
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    const point = localPoint(event);
    if (dragging) {
      const nextX = point.x - dragOrigin.x;
      const nextY = point.y - dragOrigin.y;
      if (Math.abs(nextX - transform.x) + Math.abs(nextY - transform.y) > 2) dragMoved = true;
      transform = { ...transform, x: nextX, y: nextY };
      return;
    }
    const node = nodeAt(point);
    canvas.style.cursor = node ? "pointer" : "grab";
    if (node !== hovered) {
      hovered = node;
      options.onHover(node, node ? { x: event.clientX, y: event.clientY } : null);
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
    if (dragMoved) return;
    const node = nodeAt(localPoint(event));
    selectedId = node?.id ?? null;
    computeRelated(selectedId);
    options.onSelect(node, node ? { x: event.clientX, y: event.clientY } : null);
  };

  const onPointerLeave = () => {
    if (!hovered) return;
    hovered = null;
    options.onHover(null, null);
  };

  const onWheel = (event: WheelEvent) => {
    // The map only takes the wheel once the reader has engaged with it, so
    // scrolling past the section never gets trapped.
    if (!interacted && !event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const point = localPoint(event);
    const factor = Math.exp(-event.deltaY * 0.0016);
    const k = Math.max(0.32, Math.min(3.4, transform.k * factor));
    transform = {
      k,
      x: point.x - ((point.x - transform.x) / transform.k) * k,
      y: point.y - ((point.y - transform.y) / transform.k) * k,
    };
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  const resizeObserver = new ResizeObserver(() => {
    const previous = { width, height };
    resize();
    if (previous.width !== width || previous.height !== height) relayout();
  });
  resizeObserver.observe(canvas);

  const visibility = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting);
    if (visible && !frame) frame = requestAnimationFrame(loop);
    if (!visible && frame) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  });
  visibility.observe(canvas);

  resize();
  frame = requestAnimationFrame(loop);

  return {
    setGraph(next: ResolvedGraph) {
      graph = next;
      selectedId = null;
      hovered = null;
      related = new Set();
      entranceStart = performance.now();
      relatedOf = "\u0000";
      resize();
      relayout();
    },
    setTheme(next: GraphTheme) {
      theme = next;
    },
    /** Select from outside the canvas (accessible node list, deep link, related-concept click). */
    setSelection(id: string | null) {
      selectedId = id;
      computeRelated(id);
    },
    /** Screen position of a node, for anchoring the popup. */
    anchorFor(id: string): ScreenPoint | null {
      const node = graph?.nodes.find((item) => item.id === id);
      if (!node) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: rect.left + node.x * transform.k + transform.x,
        y: rect.top + node.y * transform.k + transform.y,
      };
    },
    resetView() {
      relayout();
    },
    destroy() {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
    },
  };
}

export type GraphEngine = ReturnType<typeof createGraphEngine>;
export { withAlpha };
