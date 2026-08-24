import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileText, Maximize2 } from "lucide-react";
import { buildGraph, specForDomain } from "../data/graph";
import { createGraphEngine, type GraphEngine, type ScreenPoint } from "../graph/engine";
import type { GraphTheme } from "../graph/styles";
import type { GraphNode } from "../graph/types";
import type { ContentDocument } from "../lib/content";
import { ConceptPopup } from "./ConceptPopup";

type KnowledgeGraphProps = {
  domain: string;
  documents: ContentDocument[];
  onOpen: (slug: string) => void;
};

type PopupPosition = { x: number; y: number; flip: boolean };

function readTheme(): GraphTheme {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const mode = root.dataset.theme === "dark" ? "dark" : "light";
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  // Canvas cannot resolve CSS custom properties itself, so the design tokens are
  // read off :root here and handed to the renderer as concrete colours.
  return {
    mode,
    ink: read("--text-strong", mode === "dark" ? "#f6f7fa" : "#22262f"),
    inkSoft: read("--text-muted", mode === "dark" ? "#a9b0bd" : "#6c7381"),
    line: read("--border-default", mode === "dark" ? "#3d434f" : "#d5d8de"),
    veil: read("--surface-veil", mode === "dark" ? "#14161d" : "#fafafb"),
  };
}

export function KnowledgeGraph({ domain, documents, onOpen }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GraphEngine | null>(null);

  const spec = useMemo(() => specForDomain(domain), [domain]);
  const graph = useMemo(() => (spec ? buildGraph(spec) : null), [spec]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const [hover, setHover] = useState<{ node: GraphNode; x: number; y: number } | null>(null);

  const toLocal = useCallback((point: ScreenPoint): PopupPosition => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return { x: point.x, y: point.y, flip: false };
    const x = point.x - rect.left;
    const y = point.y - rect.top;
    const flip = x > rect.width * 0.56;
    return {
      x: Math.max(14, Math.min(rect.width - 14, x + (flip ? -20 : 20))),
      y: Math.max(12, Math.min(Math.max(12, rect.height - 130), y - 46)),
      flip,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createGraphEngine(canvas, {
      onSelect: (node, anchor) => {
        setSelectedId(node?.id ?? null);
        setPopupPosition(node && anchor ? toLocal(anchor) : null);
      },
      onHover: (node, anchor) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        setHover(node && anchor && rect ? { node, x: anchor.x - rect.left, y: anchor.y - rect.top } : null);
      },
    });
    engineRef.current = engine;
    engine.setTheme(readTheme());

    const observer = new MutationObserver(() => engine.setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [toLocal]);

  useEffect(() => {
    if (!graph) return;
    engineRef.current?.setGraph(graph);
    setSelectedId(null);
    setPopupPosition(null);
    setHover(null);
  }, [graph]);

  const selected = graph?.nodes.find((node) => node.id === selectedId) ?? null;

  const related = useMemo(() => {
    if (!graph || !selected) return [];
    return graph.edges
      .filter((edge) => edge.source.id === selected.id || edge.target.id === selected.id)
      .map((edge) => ({
        node: edge.source.id === selected.id ? edge.target : edge.source,
        weight: edge.weight,
        note: edge.note,
      }))
      .sort((a, b) => b.weight - a.weight);
  }, [graph, selected]);

  const selectNode = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      engineRef.current?.setSelection(id);
      if (!id) {
        setPopupPosition(null);
        return;
      }
      const anchor = engineRef.current?.anchorFor(id);
      setPopupPosition(anchor ? toLocal(anchor) : null);
    },
    [toLocal],
  );

  const close = useCallback(() => selectNode(null), [selectNode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedId) close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, close]);

  const concepts = graph?.nodes.filter((node) => node.kind === "concept") ?? [];
  const notes = graph?.nodes.filter((node) => node.kind === "note") ?? [];

  return (
    <div className="graph-shell">
      <div className="graph-topline">
        <div>
          <span className="eyebrow">Weighted map</span>
          <h2>{graph?.title ?? domain}</h2>
          {graph?.tagline && <p className="graph-tagline">{graph.tagline}</p>}
        </div>
        <div className="graph-legend">
          {graph?.clusters.map((cluster) => (
            <span key={cluster.id} title={cluster.summary}>
              <i style={{ background: cluster.accent }} />
              {cluster.label}
            </span>
          ))}
          <span className="graph-count">{concepts.length} concepts · {notes.length} notes</span>
        </div>
      </div>

      <div className="graph-canvas" ref={wrapperRef}>
        <canvas ref={canvasRef} className="graph-surface" />

        {hover && !selected && (
          <div className="graph-tooltip" style={{ left: hover.x, top: hover.y }}>
            <strong>{hover.node.label}</strong>
            <span>{hover.node.kind === "note" ? "field note" : `${hover.node.tier} · ${hover.node.cluster.label}`}</span>
          </div>
        )}

        {selected && (
          <ConceptPopup
            node={selected}
            related={related}
            position={popupPosition}
            onOpen={onOpen}
            onSelect={selectNode}
            onClose={close}
          />
        )}

        <button className="graph-reset" onClick={() => engineRef.current?.resetView()} title="Fit the map to view">
          <Maximize2 size={14} /> Fit
        </button>

        {!graph ? (
          <div className="graph-empty">
            <FileText size={22} />
            No weighted map authored for {domain} yet — add a JSON file in src/data/graph.
          </div>
        ) : documents.length === 0 ? (
          <div className="graph-empty">
            <FileText size={22} />
            The concept map is live; add a Markdown note in this domain to hang writing off it.
          </div>
        ) : null}
      </div>

      {/* Keyboard path into the canvas: every concept stays reachable without a pointer. */}
      <ul className="graph-a11y-list">
        {concepts.map((node) => (
          <li key={node.id}>
            <button onClick={() => selectNode(node.id)}>
              {node.label} — {node.tier} concept in {node.cluster.label}
            </button>
          </li>
        ))}
        {notes.map((node) => (
          <li key={node.id}>
            <button onClick={() => node.slug && onOpen(node.slug)}>Read {node.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
