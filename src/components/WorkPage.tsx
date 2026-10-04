import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, History } from "lucide-react";
import { profileUrl, workTiers } from "../data/work";
import { RepoCard } from "./RepoCard";

export function WorkPage() {
  const [selectedTier, setSelectedTier] = useState("builds");

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % workTiers.length;
    else if (event.key === "ArrowLeft") next = (index + workTiers.length - 1) % workTiers.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = workTiers.length - 1;
    else return;
    event.preventDefault();
    setSelectedTier(workTiers[next].id);
    document.getElementById(`tab-${workTiers[next].id}`)?.focus();
  }

  return (
    <>
      <div className="work-section-links" role="tablist" aria-label="Project gallery sections">
        {workTiers.map((tier, index) => (
          <button
            key={tier.id}
            id={`tab-${tier.id}`}
            type="button"
            role="tab"
            aria-selected={selectedTier === tier.id}
            aria-controls={`panel-${tier.id}`}
            tabIndex={selectedTier === tier.id ? 0 : -1}
            onClick={() => setSelectedTier(tier.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >{tier.title}</button>
        ))}
      </div>
      <div className="work-page">
        {workTiers.map((tier) => (
          <section className={`work-tier work-tier--${tier.id}`} key={tier.id} id={`panel-${tier.id}`} role="tabpanel" aria-labelledby={`tab-${tier.id}`} hidden={selectedTier !== tier.id} tabIndex={0}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">{tier.eyebrow}</span>
                <h1 id={`tier-${tier.id}`}>{tier.title}</h1>
              </div>
              <p>{tier.blurb}</p>
            </div>
            {tier.id === "builds" ? (
              <div className="project-groups">
                {(["active", "concluded"] as const).map((development) => (
                  <section className="project-group" key={development} aria-labelledby={`projects-${development}`}>
                    <h2 id={`projects-${development}`}>
                      {development === "active" ? "Active" : "Concluded projects"}
                    </h2>
                    <div className="repo-grid">
                      {tier.repos.filter((repo) => repo.development === development).map((repo) => (
                        <RepoCard key={repo.id} repo={repo} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : <div className="repo-grid">
              {tier.repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} feature={tier.id === "pillars"} />
              ))}
            </div>}
          </section>
        ))}

        <aside className="work-outro">
          <p>Follow a project into its source, or explore the histories behind the work.</p>
          <div className="work-outro-links">
            <Link to="/knowledge">
              <History size={14} aria-hidden="true" /> Brief histories
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
