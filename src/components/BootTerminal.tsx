import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { documents, domains } from "../lib/content";
import { documentPath } from "../lib/format";
import { profile } from "../data/resume";
import { workTiers } from "../data/work";

/**
 * The boot log. Every line reports something true about this site, and the
 * entry lines are real links — the terminal is the fastest route into the
 * newest writing, not set dressing.
 */
type Line =
  | { kind: "log"; tag: string; text: string; tone?: "ok" | "dim" }
  | { kind: "head"; text: string }
  | { kind: "entry"; to: string; label: string; meta: string }
  | { kind: "prompt" };

function buildLines(): Line[] {
  const repos = workTiers.reduce((total, tier) => total + tier.repos.length, 0);
  const posts = documents.filter((document) => document.kind !== "note");
  const notes = documents.filter((document) => document.kind === "note");

  return [
    { kind: "log", tag: "boot", text: "lily's workbench — static, no tracking" },
    { kind: "log", tag: "load", text: `work.ts — ${repos} repositories` },
    { kind: "log", tag: "load", text: `content/ — ${posts.length + notes.length} documents, ${domains.length} domains` },
    { kind: "head", text: "recent from /blogs" },
    ...posts.slice(0, 3).map((document): Line => ({
      kind: "entry",
      to: documentPath(document.slug),
      label: document.title,
      meta: `${document.readingMinutes} min`,
    })),
    { kind: "head", text: "latest notes" },
    ...notes.slice(0, 3).map((document): Line => ({
      kind: "entry",
      to: documentPath(document.slug),
      label: document.title,
      meta: document.domain,
    })),
    { kind: "log", tag: "now", text: profile.now, tone: "ok" },
    { kind: "prompt" },
  ];
}

const lines = buildLines();

function prefersReducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BootTerminal() {
  // Reduced motion (and anyone who has already seen it) gets the whole log at once.
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? lines.length : 0));
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shown >= lines.length) return;
    const line = lines[shown];
    // Entries land quickly; log lines pause just long enough to read.
    const delay = line.kind === "entry" ? 110 : 260;
    const timer = window.setTimeout(() => setShown((count) => count + 1), delay);
    return () => window.clearTimeout(timer);
  }, [shown]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [shown]);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="terminal-dots"><i /><i /><i /></span>
        <span className="terminal-name">workbench.log</span>
        <span className="terminal-live"><i />live</span>
      </div>

      <div className="terminal-body" ref={bodyRef} tabIndex={0} aria-label="Site boot log and recent entries">
        {lines.slice(0, shown).map((line, index) => {
          if (line.kind === "head") {
            return <p className="term-head" key={index}>{line.text}</p>;
          }
          if (line.kind === "entry") {
            return (
              <Link className="term-entry" to={line.to} key={index}>
                <span className="term-bullet">→</span>
                <span className="term-label">{line.label}</span>
                <span className="term-meta">{line.meta}</span>
              </Link>
            );
          }
          if (line.kind === "prompt") {
            return (
              <p className="term-prompt" key={index}>
                <span>sys@workbench:~$</span> ready<i className="term-caret" />
              </p>
            );
          }
          return (
            <p className={`term-log${line.tone === "ok" ? " term-log--ok" : ""}`} key={index}>
              <span className="term-tag">[{line.tag}]</span> {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
