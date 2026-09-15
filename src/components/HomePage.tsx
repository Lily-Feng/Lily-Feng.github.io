import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Network, UserRound, Wrench } from "lucide-react";
import { profile } from "../data/resume";
import { workTiers } from "../data/work";
import { documents, domains } from "../lib/content";

function GitHubMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.68 0-1.25.45-2.28 1.2-3.08-.12-.3-.52-1.47.11-3.05 0 0 .97-.31 3.17 1.18a10.96 10.96 0 0 1 5.78 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.58.23 2.76.11 3.05.74.8 1.2 1.83 1.2 3.08 0 4.4-2.7 5.38-5.28 5.67.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

type Station = {
  id: string;
  icon: ReactNode;
  title: string;
  detail: string;
  to?: string;
  href?: string;
};

function StationTile({ station }: { station: Station }) {
  const inner = (
    <>
      <span className="station-icon">{station.icon}</span>
      <span className="station-text">
        <strong>{station.title}</strong>
        <small>{station.detail}</small>
      </span>
      {station.href && <ArrowUpRight className="station-out" size={15} aria-hidden="true" />}
    </>
  );

  return station.to
    ? <Link className="station" to={station.to}>{inner}</Link>
    : <a className="station" href={station.href} target="_blank" rel="noreferrer">{inner}</a>;
}

export function HomePage() {
  const repoCount = workTiers.reduce((total, tier) => total + tier.repos.length, 0);
  const posts = documents.filter((document) => document.kind !== "note").length;
  const notes = documents.filter((document) => document.kind === "note").length;

  const stations: Station[] = [
    {
      id: "work",
      icon: <Wrench size={20} aria-hidden="true" />,
      title: "Learning by doing",
      detail: `${repoCount} repositories — pillars, prototypes, notebooks`,
      to: "/work",
    },
    {
      id: "blog",
      icon: <BookOpen size={20} aria-hidden="true" />,
      title: "My Blog",
      detail: `${posts} ${posts === 1 ? "piece" : "pieces"} written up from the building`,
      to: "/blogs",
    },
    {
      id: "map",
      icon: <Network size={20} aria-hidden="true" />,
      title: "Knowledge map",
      detail: `${domains.length} domains, ${notes} connected notes`,
      to: "/knowledge",
    },
    {
      id: "about",
      icon: <UserRound size={20} aria-hidden="true" />,
      title: "About me",
      detail: "Where I have worked, and how I got here",
      to: "/about",
    },
    {
      id: "github",
      icon: <GitHubMark />,
      title: "GitHub",
      detail: "Everything, at source",
      href: profile.links.github,
    },
    {
      id: "linkedin",
      icon: <LinkedInMark />,
      title: "LinkedIn",
      detail: "The formal version",
      href: profile.links.linkedin,
    },
  ];

  return (
    <div className="home-page">
      <section className="bench-intro">
        <span className="bench-kicker">{profile.name}</span>
        <h1>A workbench, not a portfolio.</h1>
        <p>
          I build data and AI systems, take them apart to see why they work, and write
          down what the building taught me. Everything on the bench is made in the open.
        </p>
      </section>

      <nav className="bench-grid" aria-label="Sections of this site">
        {stations.map((station) => <StationTile key={station.id} station={station} />)}
      </nav>

      <p className="bench-now">
        <span>Now</span>
        {profile.now}
      </p>
    </div>
  );
}
