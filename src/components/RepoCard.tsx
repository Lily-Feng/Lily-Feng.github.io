import { ArrowUpRight, Code2, Lock } from "lucide-react";
import { statusLabels, type WorkRepo } from "../data/work";

/** One repository. `feature` is the heavier treatment used for a pillar. */
export function RepoCard({ repo, feature }: { repo: WorkRepo; feature?: boolean }) {
  const primary = repo.siteUrl ?? repo.repoUrl;

  return (
    <article className={`repo-card${feature ? " repo-card--feature" : ""}`}>
      <div className="repo-card-top">
        <h3>
          {primary ? (
            <a href={primary} target="_blank" rel="noreferrer">
              {repo.name}
              <ArrowUpRight size={feature ? 18 : 15} aria-hidden="true" />
            </a>
          ) : (
            repo.name
          )}
        </h3>
        <span className={`repo-status repo-status--${repo.status}`}>
          {repo.status === "unpublished" && <Lock size={11} aria-hidden="true" />}
          {statusLabels[repo.status]}
        </span>
      </div>

      <strong className="repo-tagline">{repo.tagline}</strong>
      <p>{repo.description}</p>

      <div className="repo-card-foot">
        <div className="repo-topics">
          {repo.topics.map((topic) => (
            <span className="u-chip" key={topic}>{topic}</span>
          ))}
        </div>
        <div className="repo-links">
          {repo.siteUrl && (
            <a href={repo.siteUrl} target="_blank" rel="noreferrer">
              Visit site <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
          {repo.repoUrl && (
            <a href={repo.repoUrl} target="_blank" rel="noreferrer">
              <Code2 size={13} aria-hidden="true" /> Source
            </a>
          )}
          {!primary && <span className="repo-links-note">Link goes up once it is published.</span>}
        </div>
      </div>
    </article>
  );
}
