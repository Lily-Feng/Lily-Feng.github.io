import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { documents, isExternal } from "../lib/content";
import { documentPath } from "../lib/format";
import { workTiers } from "../data/work";
import { terminalCommand } from "../data/terminalCommands";

/**
 * Recent achievements, writing, and active work, with real links to each entry.
 */
type SectionTone = "achievement" | "writing" | "work" | "learning";

type Line =
  | { kind: "log"; tag: string; text: string; tone?: "ok" | "dim" }
  | { kind: "head"; text: string; tone: SectionTone }
  | { kind: "entry"; to?: string; href?: string; label: string; meta: string; tone: SectionTone }
  | { kind: "prompt" };

function buildLines(): Line[] {
  const posts = documents.filter((document) => document.kind !== "note");
  const activeProjects = workTiers.flatMap((tier) => tier.repos)
    .filter((repo) => repo.development === "active" && repo.repoUrl);
  const reinforcementLearning = workTiers.find((tier) => tier.id === "notes")?.repos
    .find((repo) => repo.id === "reinforcement-learning");
  const learning: Line[] = [];

  if (reinforcementLearning?.siteUrl) {
    learning.push({ kind: "entry", href: reinforcementLearning.siteUrl, label: reinforcementLearning.name, meta: "simulations", tone: "learning" });
  }

  return [
    { kind: "head", text: "latest achievements", tone: "achievement" },
    { kind: "entry", href: "https://www.credly.com/badges/f05563fe-19bb-42b8-8c97-3c3fba108300", label: "Claude Certified Architect — Professional", meta: "Credly", tone: "achievement" },
    { kind: "entry", href: "https://credentials.databricks.com/2e2529b8-37b7-44ce-a4e2-b7234fe47208#acc.6KT9qkrz", label: "Databricks Certified Data Engineer — Professional", meta: "Databricks", tone: "achievement" },
    { kind: "head", text: "recent from /blogs", tone: "writing" },
    ...posts.slice(0, 3).map((document): Line => (
      isExternal(document)
        ? { kind: "entry", href: document.url, label: document.title, meta: document.source ?? "external", tone: "writing" }
        : { kind: "entry", to: documentPath(document.slug), label: document.title, meta: `${document.readingMinutes} min`, tone: "writing" }
    )),
    { kind: "head", text: "active open source", tone: "work" },
    ...activeProjects.map((repo): Line => ({
      kind: "entry",
      href: repo.repoUrl,
      label: repo.name,
      meta: "GitHub",
      tone: "work",
    })),
    { kind: "head", text: "active learning", tone: "learning" },
    ...learning,
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
  const [executed, setExecuted] = useState(false);

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
  }, [shown, executed]);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="terminal-dots"><i /><i /><i /></span>
        <span className="terminal-name">workbench.log</span>
        <span className="terminal-live"><i />live</span>
      </div>

      <div
        className="terminal-body"
        ref={bodyRef}
        tabIndex={0}
        aria-label="Latest achievements, writing, active open source, and active learning"
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.target === event.currentTarget && shown >= lines.length) {
            event.preventDefault();
            setExecuted(true);
          }
        }}
      >
        {lines.slice(0, shown).map((line, index) => {
          if (line.kind === "head") {
            const label = line.tone === "achievement"
              ? <><span className="term-star" aria-hidden="true">·:*:·</span>{" "}{line.text}{" "}<span className="term-star" aria-hidden="true">·:*:·</span></>
              : line.text;
            return <p className="term-head" data-tone={line.tone} key={index}>{label}</p>;
          }
          if (line.kind === "entry") {
            const body = (
              <>
                <span className="term-bullet">{line.href ? "↗" : "→"}</span>
                <span className="term-label">{line.label}</span>
                <span className="term-meta">{line.meta}</span>
              </>
            );
            return line.href
              ? <a className="term-entry" data-tone={line.tone} href={line.href} target="_blank" rel="noreferrer" key={index}>{body}</a>
              : <Link className="term-entry" data-tone={line.tone} to={line.to!} key={index}>{body}</Link>;
          }
          if (line.kind === "prompt") {
            return (
              <div key={index}>
                <div className="term-prompt">
                  <span>guest@workbench:~$</span>{" "}
                  <button
                    className="term-command"
                    type="button"
                    onClick={() => setExecuted(true)}
                    aria-label={`Run ${terminalCommand.command}`}
                    aria-expanded={executed}
                    aria-controls="terminal-response"
                  >
                    {terminalCommand.command}
                    {!executed && <i className="term-caret" aria-hidden="true" />}
                  </button>
                </div>
                {!executed && <p className="term-hint">Click the command, or focus the terminal and press Enter.</p>}
                <div id="terminal-response" role="status" aria-live="polite">
                  {executed && <>
                    <pre className="term-art" aria-hidden="true">{terminalCommand.art}</pre>
                    <p className="term-response">{terminalCommand.message}</p>
                  </>}
                </div>
              </div>
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
