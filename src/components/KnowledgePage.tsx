import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { documents } from "../lib/content";
import { graphSpecs } from "../data/graph";
import { documentPath } from "../lib/format";
import { KnowledgeGraph } from "./KnowledgeGraph";

/**
 * The knowledge map. Reached from /work rather than the main nav.
 *
 * This module is the lazy boundary — src/graph/ and src/data/graph/ load only
 * when someone opens this page.
 */
export function KnowledgePage() {
  const navigate = useNavigate();
  const [activeDomain, setActiveDomain] = useState(graphSpecs[0]?.domain ?? "Knowledge");

  const graphDocuments = useMemo(
    () => documents.filter((item) => item.domain === activeDomain),
    [activeDomain],
  );

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">Knowledge map</span>
          <h1>How the ideas connect.</h1>
        </div>
        <p>A weighted map of the concepts behind the writing. Notes attach themselves to concepts through their topics, so publishing grows the map.</p>
      </section>

      <section className="knowledge-section">
        <div className="domain-tabs" role="tablist" aria-label="Knowledge domains">
          {graphSpecs.map(({ domain }) => (
            <button
              key={domain}
              className={domain === activeDomain ? "active" : ""}
              onClick={() => setActiveDomain(domain)}
              role="tab"
              aria-selected={domain === activeDomain}
            >
              {domain}
            </button>
          ))}
        </div>
        <KnowledgeGraph
          domain={activeDomain}
          documents={graphDocuments}
          onOpen={(slug) => navigate(documentPath(slug))}
        />
        <div className="graph-help">
          <span>Click</span> a concept for key knowledge and links · <span>Drag</span> to pan · <span>Scroll</span> to zoom once engaged · <span>Tab</span> reveals a keyboard list
        </div>
      </section>
    </>
  );
}

export default KnowledgePage;
