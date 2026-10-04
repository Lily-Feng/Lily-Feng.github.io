import { useMemo, useState, type KeyboardEvent } from "react";
import { documents } from "../lib/content";
import { graphSpecs } from "../data/graph";
import { KnowledgeGraph } from "./KnowledgeGraph";

/** Optional map, lazy-loaded from the brief histories page. */
export default function KnowledgeMap() {
  const [activeDomain, setActiveDomain] = useState(graphSpecs[0]?.domain ?? "Knowledge");
  const graphDocuments = useMemo(
    () => documents.filter((item) => item.domain === activeDomain),
    [activeDomain],
  );

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % graphSpecs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + graphSpecs.length - 1) % graphSpecs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = graphSpecs.length - 1;
    else return;
    event.preventDefault();
    setActiveDomain(graphSpecs[next].domain);
    document.getElementById(`knowledge-tab-${next}`)?.focus();
  }

  return (
    <section className="knowledge-section" aria-label="Knowledge map">
      <div className="domain-tabs" role="tablist" aria-label="Knowledge domains">
        {graphSpecs.map(({ domain }, index) => (
          <button
            key={domain}
            id={`knowledge-tab-${index}`}
            type="button"
            className={domain === activeDomain ? "active" : ""}
            onClick={() => setActiveDomain(domain)}
            onKeyDown={(event) => handleTabKey(event, index)}
            role="tab"
            aria-selected={domain === activeDomain}
            aria-controls="knowledge-map-panel"
            tabIndex={domain === activeDomain ? 0 : -1}
          >
            {domain}
          </button>
        ))}
      </div>
      <div id="knowledge-map-panel" role="tabpanel" aria-labelledby={`knowledge-tab-${graphSpecs.findIndex(({ domain }) => domain === activeDomain)}`}>
        <KnowledgeGraph domain={activeDomain} documents={graphDocuments} />
      </div>
      <div className="graph-help">
        <span>Click</span> a concept for key knowledge and links · <span>Drag</span> to pan · <span>Scroll</span> to zoom once engaged · <span>Tab</span> reveals a keyboard list
      </div>
    </section>
  );
}
