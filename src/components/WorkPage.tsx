import { Link } from "react-router-dom";
import { ArrowUpRight, Network } from "lucide-react";
import { profileUrl, workTiers } from "../data/work";
import { RepoCard } from "./RepoCard";

export function WorkPage() {
  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">Learning by doing</span>
          <h1>Small repositories, one idea each.</h1>
        </div>
        <p>This site is the entry point. The work itself lives next door — two domain pillars, a handful of builds, and the notebooks I keep in the open.</p>
      </section>

      <div className="work-page">
        {workTiers.map((tier) => (
          <section className={`work-tier work-tier--${tier.id}`} key={tier.id} aria-labelledby={`tier-${tier.id}`}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">{tier.eyebrow}</span>
                <h2 id={`tier-${tier.id}`}>{tier.title}</h2>
              </div>
              <p>{tier.blurb}</p>
            </div>
            <div className="repo-grid">
              {tier.repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} feature={tier.id === "pillars"} />
              ))}
            </div>
          </section>
        ))}

        <aside className="work-outro">
          <p>Everything here is built in the open, in small repositories that each hold one idea.</p>
          <div className="work-outro-links">
            <Link to="/knowledge">
              <Network size={14} aria-hidden="true" /> Knowledge map
            </Link>
            <a href={profileUrl} target="_blank" rel="noreferrer">
              All repositories <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
