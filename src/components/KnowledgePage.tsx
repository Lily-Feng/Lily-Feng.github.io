import { lazy, Suspense, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { briefHistories } from "../data/histories";

// The graph engine and its data load only when the disclosure is opened.
const KnowledgeMap = lazy(() => import("./KnowledgeMap"));

export function KnowledgePage() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">Taste of the Past</span>
          <h1>Brief histories.</h1>
        </div>
        <p>Learn a little history. Find inspiration for what comes next.</p>
      </section>

      <ul className="history-grid" aria-label="Brief histories">
        {briefHistories.map((history) => (
          <li key={history.id}>
            <a className="history-link" href={history.url}>
              <span className="history-link__symbol" aria-hidden="true">{history.symbol}</span>
              <h2>{history.label}</h2>
              <p>{history.summary}</p>
              <span className="history-link__action">Explore the timeline <ArrowUpRight size={14} aria-hidden="true" /></span>
            </a>
          </li>
        ))}
      </ul>

      <details className="knowledge-disclosure" onToggle={(event) => setMapOpen(event.currentTarget.open)}>
        <summary>Knowledge map</summary>
        {mapOpen && (
          <Suspense fallback={<p className="route-loading" role="status">Loading the map…</p>}>
            <KnowledgeMap />
          </Suspense>
        )}
      </details>
    </>
  );
}

export default KnowledgePage;
