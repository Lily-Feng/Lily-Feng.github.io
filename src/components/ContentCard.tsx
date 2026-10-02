import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BrainCircuit, Database, Network, ShieldCheck } from "lucide-react";
import { isExternal, type ContentDocument } from "../lib/content";
import { documentPath, formatCardDate } from "../lib/format";

const topicIcons = { ai: BrainCircuit, data: Database, architecture: Network, security: ShieldCheck };

/** One document card, shared by the home page, the archive, and search. */
export function ContentCard({ document }: { document: ContentDocument }) {
  const external = isExternal(document);
  const Icon = document.icon ? topicIcons[document.icon] : undefined;
  const visual = Boolean(document.cover || document.logo || Icon || document.color);

  const inner = (
    <>
      {visual && <div className="card-visual" data-color={document.color}>
        {document.cover && <img className="card-cover" src={document.cover} alt={document.coverAlt ?? ""} loading="lazy" decoding="async" />}
        {(document.logo || Icon) && <div className="card-visual-badge">
          {document.logo
            ? <img className="card-logo" src={document.logo} alt={document.logoAlt ?? ""} loading="lazy" decoding="async" />
            : Icon && <Icon size={32} aria-hidden="true" />}
        </div>}
      </div>}
      <div className="card-meta">
        <span>{external && document.source ? document.source : document.domain}</span>
        <time dateTime={document.date || undefined}>{formatCardDate(document.date)}</time>
      </div>
      <h3>{document.title}</h3>
      <p>{document.summary}</p>
      <div className="card-footer">
        <div>{document.topics.slice(0, 2).map((topic) => <span key={topic}>{topic}</span>)}</div>
        {external
          ? <ArrowUpRight size={18} aria-hidden="true" />
          : <ArrowRight size={18} aria-hidden="true" />}
      </div>
    </>
  );

  return (
    <article className={`content-card${external ? " content-card--external" : ""}`}>
      {external ? (
        <a href={document.url} target="_blank" rel="noreferrer">{inner}</a>
      ) : (
        <Link to={documentPath(document.slug)}>{inner}</Link>
      )}
    </article>
  );
}
