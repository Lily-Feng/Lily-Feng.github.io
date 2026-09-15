import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { documents, searchDocuments } from "../lib/content";
import { ContentCard } from "./ContentCard";

/** The archive, with search. */
export function BlogsPage() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && query) setQuery("");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [query]);

  const results = useMemo(() => searchDocuments(query).slice(0, 12), [query]);
  // Notes belong to the knowledge map, not the archive.
  const posts = documents.filter((item) => item.kind !== "note");

  return (
    <>
      <section className="page-intro">
        <div>
          <span className="eyebrow">Writing</span>
          <h1>Notes from the work.</h1>
        </div>
        <p>Essays, implementation notes, and practical frameworks — published when an idea becomes useful enough to share.</p>
      </section>

      <section className="discovery-bar discovery-bar--compact" aria-label="Search the writing">
        <Search size={20} aria-hidden="true" />
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes, topics, and projects…"
          aria-label="Search notes, topics, and projects"
        />
        {query
          ? <button onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button>
          : <kbd>/</kbd>}
      </section>

      {query ? (
        <section className="results-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Search</span>
              <h2>{results.length} result{results.length === 1 ? "" : "s"} for “{query}”</h2>
            </div>
          </div>
          {results.length ? (
            <div className="content-grid">
              {results.map((item) => <ContentCard key={item.slug} document={item} />)}
            </div>
          ) : (
            <div className="empty-state">Nothing matches that yet. Try a broader topic such as “AI,” “strategy,” or “data.”</div>
          )}
        </section>
      ) : (
        <section className="writing-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Latest</span>
              <h2>Browse the archive</h2>
            </div>
            <p>{posts.length} published piece{posts.length === 1 ? "" : "s"}.</p>
          </div>
          <div className="content-grid">
            {posts.map((item) => <ContentCard key={item.slug} document={item} />)}
          </div>
        </section>
      )}
    </>
  );
}
