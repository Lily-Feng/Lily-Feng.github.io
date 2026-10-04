import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, History, UserRound, Wrench } from "lucide-react";
import { profile } from "../data/resume";
import { workTiers } from "../data/work";
import { documents } from "../lib/content";
import { briefHistories } from "../data/histories";
import { BootTerminal } from "./BootTerminal";

const COMMAND = "> ./workbench.sh";

function useTypedCommand() {
  const reduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [typed, setTyped] = useState(() => (reduced ? COMMAND.length : 0));

  useEffect(() => {
    if (typed >= COMMAND.length) return;
    const timer = window.setTimeout(() => setTyped((count) => count + 1), 55);
    return () => window.clearTimeout(timer);
  }, [typed]);

  return COMMAND.slice(0, typed);
}

type Module = {
  id: string;
  route: string;
  icon: typeof Wrench;
  title: string;
  meta: string;
  to: string;
};

export function HomePage() {
  const command = useTypedCommand();

  const repos = workTiers.reduce((total, tier) => total + tier.repos.length, 0);
  const posts = documents.filter((document) => document.kind !== "note").length;

  const modules: Module[] = [
    { id: "work", route: "/work", icon: Wrench, title: "Learning by doing", meta: `${repos} repos`, to: "/work" },
    { id: "blogs", route: "/blogs", icon: BookOpen, title: "My Blog", meta: `${posts} published`, to: "/blogs" },
    { id: "knowledge", route: "/knowledge", icon: History, title: "Brief histories", meta: `${briefHistories.length} illustrated timelines`, to: "/knowledge" },
    { id: "about", route: "/about", icon: UserRound, title: "About me", meta: "career", to: "/about" },
  ];

  return (
    <div className="home-page">
      <div className="bench-top">
        <section className="bench-intro">
          <p className="bench-command">
            {command}<i className="bench-caret" />
          </p>
          <h1>A workbench,<br />not a portfolio.</h1>
          <p className="bench-copy">
            I build data and AI systems, take them apart to see why they work, and
            write down what the building taught me — in the open.
          </p>
          <div className="bench-links">
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              github <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              linkedin <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </section>

        <BootTerminal />
      </div>

      <nav className="bench-modules" aria-label="Sections of this site">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link className="module" to={module.to} key={module.id}>
              <span className="module-icon"><Icon size={17} aria-hidden="true" /></span>
              <span className="module-route">{module.route}</span>
              <strong className="module-title">{module.title}</strong>
              <span className="module-meta">{module.meta}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
