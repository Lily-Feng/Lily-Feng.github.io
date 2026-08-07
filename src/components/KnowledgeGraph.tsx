import { useMemo, useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import type { ContentDocument } from "../lib/content";

type GraphNode = {
  id: string;
  label: string;
  type: "core" | "topic" | "document";
  x: number;
  y: number;
  document?: ContentDocument;
};

type GraphLink = { source: string; target: string };

type KnowledgeGraphProps = {
  domain: string;
  documents: ContentDocument[];
  onOpen: (slug: string) => void;
};

const width = 880;
const height = 620;
const center = { x: width / 2, y: height / 2 };

function makeGraph(domain: string, documents: ContentDocument[]) {
  const topics = Array.from(new Set(documents.flatMap((document) => document.topics))).slice(0, 8);
  const nodes: GraphNode[] = [{ id: "core", label: domain, type: "core", ...center }];
  const links: GraphLink[] = [];

  topics.forEach((topic, index) => {
    const angle = (index / Math.max(topics.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const x = center.x + Math.cos(angle) * 170;
    const y = center.y + Math.sin(angle) * 170;
    nodes.push({ id: `topic:${topic}`, label: topic, type: "topic", x, y });
    links.push({ source: "core", target: `topic:${topic}` });
  });

  documents.forEach((document, index) => {
    const primaryTopic = document.topics.find((topic) => topics.includes(topic));
    const topicIndex = Math.max(0, topics.indexOf(primaryTopic ?? topics[0]));
    const baseAngle = (topicIndex / Math.max(topics.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const siblings = documents.filter((candidate) => candidate.topics[0] === primaryTopic);
    const siblingIndex = Math.max(0, siblings.findIndex((candidate) => candidate.slug === document.slug));
    const offset = (siblingIndex - (siblings.length - 1) / 2) * 0.18;
    const angle = baseAngle + offset;
    const radius = 270 + (index % 2) * 34;
    nodes.push({
      id: `doc:${document.slug}`,
      label: document.title,
      type: "document",
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      document,
    });

    document.topics.filter((topic) => topics.includes(topic)).forEach((topic) => {
      links.push({ source: `topic:${topic}`, target: `doc:${document.slug}` });
    });
  });

  return { nodes, links };
}

function shortLabel(label: string, limit: number) {
  return label.length > limit ? `${label.slice(0, limit - 1)}…` : label;
}

export function KnowledgeGraph({ domain, documents, onOpen }: KnowledgeGraphProps) {
  const graph = useMemo(() => makeGraph(domain, documents), [domain, documents]);
  const [activeNode, setActiveNode] = useState("core");
  const active = graph.nodes.find((node) => node.id === activeNode) ?? graph.nodes[0];
  const connected = new Set(
    graph.links
      .filter((link) => link.source === activeNode || link.target === activeNode)
      .flatMap((link) => [link.source, link.target]),
  );

  const activate = (node: GraphNode) => {
    setActiveNode(node.id);
    if (node.document) onOpen(node.document.slug);
  };

  return (
    <div className="graph-shell">
      <div className="graph-topline">
        <div>
          <span className="eyebrow">Live map</span>
          <h2>{domain}</h2>
        </div>
        <span className="graph-count">{documents.length} notes · {graph.nodes.filter((node) => node.type === "topic").length} topics</span>
      </div>

      <div className="graph-canvas">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Knowledge graph for ${domain}`}>
          <g className="graph-links">
            {graph.links.map((link) => {
              const source = graph.nodes.find((node) => node.id === link.source)!;
              const target = graph.nodes.find((node) => node.id === link.target)!;
              const isActive = !activeNode || (connected.has(source.id) && connected.has(target.id));
              return (
                <line
                  key={`${link.source}-${link.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={isActive ? "is-active" : "is-muted"}
                />
              );
            })}
          </g>

          {graph.nodes.map((node) => {
            const isActive = node.id === activeNode;
            const isMuted = activeNode !== "core" && !connected.has(node.id) && !isActive;
            const radius = node.type === "core" ? 57 : node.type === "topic" ? 34 : 20;
            return (
              <g
                key={node.id}
                className={`graph-node graph-node--${node.type}${isActive ? " is-active" : ""}${isMuted ? " is-muted" : ""}`}
                transform={`translate(${node.x} ${node.y})`}
                tabIndex={0}
                role="button"
                aria-label={node.document ? `Read ${node.label}` : `Explore ${node.label}`}
                onMouseEnter={() => setActiveNode(node.id)}
                onFocus={() => setActiveNode(node.id)}
                onClick={() => activate(node)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") activate(node);
                }}
              >
                <circle className="node-pulse" r={radius + 9} />
                <circle className="node-body" r={radius} />
                <text className="node-label" textAnchor="middle" y={node.type === "document" ? 37 : 4}>
                  {shortLabel(node.label, node.type === "core" ? 22 : node.type === "topic" ? 18 : 25)}
                </text>
              </g>
            );
          })}
        </svg>

        <aside className="graph-inspector" aria-live="polite">
          <span className="inspector-type">{active.type}</span>
          <strong>{active.label}</strong>
          {active.document ? (
            <>
              <p>{active.document.summary}</p>
              <button onClick={() => onOpen(active.document!.slug)}>Read note <ArrowUpRight size={15} /></button>
            </>
          ) : (
            <p>{active.type === "core" ? "Choose a topic or note to trace the connections." : "This topic connects the surrounding field notes."}</p>
          )}
        </aside>

        {!documents.length && (
          <div className="graph-empty">
            <FileText size={22} />
            Add a Markdown note in this domain to grow the graph.
          </div>
        )}
      </div>
    </div>
  );
}
