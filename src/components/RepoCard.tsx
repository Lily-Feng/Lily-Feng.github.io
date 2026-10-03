import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Lock } from "lucide-react";
import { statusLabels, type WorkRepo } from "../data/work";

/** One repository. `feature` is the heavier treatment used for a pillar. */
export function RepoCard({ repo, feature }: { repo: WorkRepo; feature?: boolean }) {
  const primary = repo.articlePath ?? repo.siteUrl ?? repo.repoUrl;

  return (
    <article className={`repo-card${feature ? " repo-card--feature" : ""}`}>
      <div className="repo-preview">
        {repo.cover ? <img src={repo.cover} alt={repo.coverAlt} loading="lazy" /> : (
          <svg viewBox="0 0 480 240" role="img" aria-label={`${repo.name}: ${repo.topics.slice(0, 3).join(", ")} connected in a concept diagram`}>
            <path className="preview-connector" d="M100 70 L240 165 L380 70 M100 70 H380" />
            {repo.topics.slice(0, 3).map((topic, index) => {
              const x = [100, 240, 380][index];
              const y = [70, 165, 70][index];
              return <g key={topic}><circle className={`preview-node preview-node--${index}`} cx={x} cy={y} r="28" /><text x={x} y={y + 48} textAnchor="middle">{topic}</text></g>;
            })}
          </svg>
        )}
      </div>
      <div className="repo-card-top">
        <h3>
          {repo.articlePath ? (
            <Link to={repo.articlePath}>{repo.name}<ArrowUpRight size={15} aria-hidden="true" /></Link>
          ) : primary ? (
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
          {repo.articlePath ? "Notebook" : statusLabels[repo.status]}
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
          {repo.articlePath && <Link to={repo.articlePath}>Read the notebook <ArrowUpRight size={13} aria-hidden="true" /></Link>}
          {repo.siteUrl && (
            <a href={repo.siteUrl} target="_blank" rel="noreferrer">
              Play Demo <ArrowUpRight size={13} aria-hidden="true" />
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
