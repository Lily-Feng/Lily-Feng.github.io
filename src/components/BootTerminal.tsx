import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { documents, isExternal } from "../lib/content";
import { documentPath } from "../lib/format";
import { profile } from "../data/resume";
import { terminalCommand } from "../data/terminalCommands";

/**
 * Recent achievements and writing. Credential and content entries are real
 * links; credentials awaiting a URL remain plain text.
 */
type Line =
  | { kind: "log"; tag: string; text: string; tone?: "ok" | "dim" }
  | { kind: "head"; text: string }
  | { kind: "entry"; to?: string; href?: string; label: string; meta: string }
  | { kind: "prompt" };

function buildLines(): Line[] {
  const posts = documents.filter((document) => document.kind !== "note");
  const notes = documents.filter((document) => document.kind === "note");

  return [
    { kind: "head", text: "latest achievements" },
    { kind: "entry", href: "https://www.credly.com/badges/f05563fe-19bb-42b8-8c97-3c3fba108300", label: "Claude Certified Architect — Professional", meta: "Credly" },
    { kind: "log", tag: "earned", text: "Databricks Certified Data Engineer — Professional (credential link to be added)", tone: "ok" },
    { kind: "head", text: "recent from /blogs" },
    ...posts.slice(0, 3).map((document): Line => (
      isExternal(document)
        ? { kind: "entry", href: document.url, label: document.title, meta: document.source ?? "external" }
        : { kind: "entry", to: documentPath(document.slug), label: document.title, meta: `${document.readingMinutes} min` }
    )),
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

      <div className="terminal-body" ref={bodyRef} tabIndex={0} aria-label="Latest achievements and recent entries">
        {lines.slice(0, shown).map((line, index) => {
          if (line.kind === "head") {
            return <p className="term-head" key={index}>{line.text}</p>;
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
              ? <a className="term-entry" href={line.href} target="_blank" rel="noreferrer" key={index}>{body}</a>
              : <Link className="term-entry" to={line.to!} key={index}>{body}</Link>;
          }
          if (line.kind === "prompt") {
            return (
              <div key={index}>
                <div className="term-prompt">
                  <span>sys@workbench:~$</span>{" "}
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
                {!executed && <p className="term-hint">Click the command or focus it and press Enter.</p>}
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
