import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profile } from "../data/resume";
import { featuredRepos } from "../data/work";
import { documents } from "../lib/content";
import { ContentCard } from "./ContentCard";
import { RepoCard } from "./RepoCard";

export function HomePage() {
  const recent = documents.filter((document) => document.kind !== "note").slice(0, 3);

  return (
    <div className="home-page">
      <section className="home-intro">
        <p className="home-name">{profile.name}</p>
        <h1>{profile.title}</h1>
        <p className="home-summary">{profile.summary}</p>
        <div className="home-actions">
          <Link className="home-action home-action--primary" to="/about">
            Résumé and career <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="home-now" aria-label="What I am working on now">
        <span className="u-eyebrow">Now</span>
        <p>{profile.now}</p>
      </section>

      <section className="home-section" aria-labelledby="home-work">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 id="home-work">Built in the open</h2>
          </div>
          <Link className="section-more" to="/work">
            All work <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="repo-grid repo-grid--home">
          {featuredRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="home-section" aria-labelledby="home-writing">
          <div className="section-heading">
            <div>
              <span className="eyebrow">My Blog</span>
              <h2 id="home-writing">Notes from the work</h2>
            </div>
            <Link className="section-more" to="/blogs">
              Read the blog <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="content-grid">
            {recent.map((document) => <ContentCard key={document.slug} document={document} />)}
          </div>
        </section>
      )}
    </div>
  );
}
