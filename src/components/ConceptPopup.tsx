import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight, BookMarked, Boxes, ExternalLink, FileText, Terminal, X } from "lucide-react";
import { RESOURCE_ORDER, RESOURCE_STYLES } from "../graph/resources";
import type { GraphNode, ResolvedResource, ResourceType } from "../graph/types";

const ICONS = {
  "file-text": FileText,
  terminal: Terminal,
  boxes: Boxes,
  "external-link": ExternalLink,
  "book-marked": BookMarked,
};

type ConceptPopupProps = {
  node: GraphNode;
  related: { node: GraphNode; weight: number; note?: string }[];
  position: { x: number; y: number; flip: boolean } | null;
  onOpen: (slug: string) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
};

function ResourceLink({ resource, onOpen }: { resource: ResolvedResource; onOpen: (slug: string) => void }) {
  const style = RESOURCE_STYLES[resource.type];
  const Icon = ICONS[style.icon];
  const className = `res-link res-link--${style.variant}`;
  const body = (
    <>
      <span className="res-link__icon"><Icon size={14} /></span>
      <span className="res-link__body">
        <strong>{resource.label}</strong>
        {resource.note && <small>{resource.note}</small>}
      </span>
      {resource.internal ? <ArrowUpRight size={14} /> : <ExternalLink size={13} />}
    </>
  );

  if (resource.internal && resource.slug) {
    return (
      <button type="button" className={className} onClick={() => onOpen(resource.slug!)}>
        {body}
      </button>
    );
  }
  return (
    <a className={className} href={resource.href} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

export function ConceptPopup({ node, related, position, onOpen, onSelect, onClose }: ConceptPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Anchoring happens before the card is measured, so nudge it back inside the
  // canvas once its real height is known.
  useLayoutEffect(() => {
    const element = ref.current;
    const parent = element?.parentElement;
    if (!element || !parent || !position) return;
    const top = Math.max(10, Math.min(position.y, parent.clientHeight - element.offsetHeight - 10));
    const width = element.offsetWidth;
    const left = position.flip
      ? Math.max(10 + width, Math.min(position.x, parent.clientWidth - 10))
      : Math.max(10, Math.min(position.x, parent.clientWidth - width - 10));
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  }, [position, node.id]);

  const groups = RESOURCE_ORDER.map((type: ResourceType) => ({
    type,
    style: RESOURCE_STYLES[type],
    items: node.resources.filter((resource) => resource.type === type),
  })).filter((group) => group.items.length);

  return (
    <div
      ref={ref}
      className={`concept-popup${position?.flip ? " concept-popup--flip" : ""}`}
      style={position ? { left: position.x, top: position.y } : undefined}
      role="dialog"
      aria-label={node.label}
    >
      <button className="concept-popup__close" onClick={onClose} aria-label="Close concept details">
        <X size={15} />
      </button>

      <header className="concept-popup__head" style={{ "--cluster-accent": node.cluster.accent } as React.CSSProperties}>
        <span className="concept-popup__eyebrow">
          <i />
          {node.cluster.label}
          <em>{node.kind === "note" ? "note" : node.tier}</em>
        </span>
        <h3>{node.label}</h3>
        {node.kind === "concept" && (
          <div className="weight-meter" title={`Emphasis ${Math.round(node.weight * 100)} of 100`}>
            <span style={{ width: `${Math.round(node.weight * 100)}%` }} />
            <small>{Math.round(node.weight * 100)}</small>
          </div>
        )}
        <p>{node.summary}</p>
      </header>

      <div className="concept-popup__scroll">
        {node.keyPoints.length > 0 && (
          <section className="popup-block">
            <h4>Key knowledge</h4>
            <ul className="key-points">
              {node.keyPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="popup-block">
            <h4>Connected concepts</h4>
            <div className="related-chips">
              {related.map(({ node: item, weight, note }) => (
                <button
                  key={item.id}
                  type="button"
                  className="related-chip"
                  style={{ "--cluster-accent": item.cluster.accent } as React.CSSProperties}
                  onClick={() => (item.kind === "note" && item.slug ? onOpen(item.slug) : onSelect(item.id))}
                  title={note ?? item.summary}
                >
                  <i style={{ opacity: 0.35 + weight * 0.65 }} />
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {groups.map((group) => (
          <section className="popup-block" key={group.type}>
            <h4>{group.style.group} <small>{group.style.hint}</small></h4>
            <div className="res-links">
              {group.items.map((resource) => (
                <ResourceLink key={`${resource.type}:${resource.slug ?? resource.href}`} resource={resource} onOpen={onOpen} />
              ))}
            </div>
          </section>
        ))}

        {!groups.length && !node.keyPoints.length && (
          <p className="popup-empty">No linked material yet — this concept is still a placeholder on the map.</p>
        )}
      </div>
    </div>
  );
}
