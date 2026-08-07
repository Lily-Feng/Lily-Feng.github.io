import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  GitBranch,
  Menu,
  Network,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { ArticlePage } from "./components/ArticlePage";
import { KnowledgeGraph } from "./components/KnowledgeGraph";
import { documents, domains, getDocument, getRelated, searchDocuments, type ContentDocument } from "./lib/content";

type View = "knowledge" | "writing" | "about";

function getHashRoute() {
  const match = window.location.hash.match(/^#\/read\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function formatDate(date: string) {
  if (!date) return "Living note";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ContentCard({ document, onOpen }: { document: ContentDocument; onOpen: (slug: string) => void }) {
  return (
    <article className="content-card">
      <button onClick={() => onOpen(document.slug)} aria-label={`Read ${document.title}`}>
        <div className="card-meta"><span>{document.domain}</span><time>{formatDate(document.date)}</time></div>
        <h3>{document.title}</h3>
        <p>{document.summary}</p>
        <div className="card-footer">
          <div>{document.topics.slice(0, 2).map((topic) => <span key={topic}>{topic}</span>)}</div>
          <ArrowRight size={18} />
        </div>
      </button>
    </article>
  );
}

function App() {
  const [view, setView] = useState<View>("knowledge");
  const [activeDomain, setActiveDomain] = useState(domains[0] ?? "Knowledge");
  const [query, setQuery] = useState("");
  const [articleSlug, setArticleSlug] = useState<string | null>(() => getHashRoute());
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onHashChange = () => setArticleSlug(getHashRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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

  const activeDocument = articleSlug ? getDocument(articleSlug) : undefined;
  const graphDocuments = useMemo(() => documents.filter((document) => document.domain === activeDomain), [activeDomain]);
  const searchResults = useMemo(() => searchDocuments(query).slice(0, 12), [query]);
  const writing = documents.filter((document) => document.kind === "post" || document.kind === "project");

  const openDocument = (slug: string) => {
    window.location.hash = `/read/${encodeURIComponent(slug)}`;
    setArticleSlug(slug);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (nextView: View) => {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    setArticleSlug(null);
    setView(nextView);
    setQuery("");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeDocument) {
    return (
      <div className="site-shell">
        <Header view={view} onNavigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <ArticlePage document={activeDocument} related={getRelated(activeDocument)} onOpen={openDocument} onBack={() => navigate("knowledge")} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell">
      <Header view={view} onNavigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        {view === "knowledge" ? (
          <section className="hero">
            <div className="hero-copy">
              <span className="hero-kicker"><span /> Digital garden · Open notebook</span>
              <h1>Ideas are more useful when you can see <em>how they connect.</em></h1>
              <p>I’m Lily Feng. I explore the space between enterprise data, applied AI, and business strategy—and publish what I learn as connected field notes.</p>
            </div>

            <div className="hero-aside">
              <div className="signal-card">
                <Sparkles size={18} />
                <span>Currently exploring</span>
                <strong>Making enterprise AI systems useful, governable, and legible.</strong>
              </div>
              <a href="https://github.com/Lily-Feng" target="_blank" rel="noreferrer">Follow the work on GitHub <ArrowRight size={16} /></a>
            </div>
          </section>
        ) : view === "writing" ? (
          <section className="page-intro page-intro--writing">
            <div className="page-number">02</div>
            <div>
              <span className="eyebrow">Writing</span>
              <h1>Field notes from the work.</h1>
            </div>
            <p>Essays, implementation notes, and practical frameworks—published when an idea becomes useful enough to share.</p>
          </section>
        ) : (
          <section className="page-intro page-intro--about">
            <div className="page-number">03</div>
            <div>
              <span className="eyebrow">About Me</span>
              <h1>I work between technical depth and business direction.</h1>
            </div>
            <p>I’m Lily Feng. I translate complex systems into decisions, roadmaps, and products that people can understand and use.</p>
          </section>
        )}

        {view !== "about" && (
          <section className={`discovery-bar${view === "writing" ? " discovery-bar--compact" : ""}`} aria-label="Search the knowledge garden">
            <Search size={20} />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={view === "writing" ? "Search the writing…" : "Search notes, topics, and projects…"}
              aria-label="Search notes, topics, and projects"
            />
            {query ? <button onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button> : <kbd>/</kbd>}
          </section>
        )}

        {query ? (
          <section className="results-section">
            <div className="section-heading">
              <div><span className="eyebrow">Search</span><h2>{searchResults.length} result{searchResults.length === 1 ? "" : "s"} for “{query}”</h2></div>
            </div>
            {searchResults.length ? (
              <div className="content-grid">{searchResults.map((document) => <ContentCard key={document.slug} document={document} onOpen={openDocument} />)}</div>
            ) : (
              <div className="empty-state">No connected note matches that yet. Try a broader topic such as “AI,” “strategy,” or “data.”</div>
            )}
          </section>
        ) : view === "knowledge" ? (
          <section className="knowledge-section">
            <div className="domain-tabs" role="tablist" aria-label="Knowledge domains">
              {domains.map((domain, index) => (
                <button
                  key={domain}
                  className={domain === activeDomain ? "active" : ""}
                  onClick={() => setActiveDomain(domain)}
                  role="tab"
                  aria-selected={domain === activeDomain}
                >
                  <span>0{index + 1}</span>{domain}
                </button>
              ))}
            </div>
            <KnowledgeGraph domain={activeDomain} documents={graphDocuments} onOpen={openDocument} />
            <div className="graph-help"><span>Hover</span> to trace connections · <span>Click</span> a note to read · <span>Tab + Enter</span> works too</div>
          </section>
        ) : view === "writing" ? (
          <section className="writing-section">
            <div className="section-heading">
              <div><span className="eyebrow">Latest</span><h2>Browse the archive</h2></div>
              <p>{writing.length} published piece{writing.length === 1 ? "" : "s"}. Every post also becomes a node in the knowledge graph.</p>
            </div>
            <div className="content-grid">{writing.map((document) => <ContentCard key={document.slug} document={document} onOpen={openDocument} />)}</div>
          </section>
        ) : (
          <section className="about-section">
            <div className="about-intro">
              <span className="eyebrow">How I think</span>
              <h2>Useful work makes the complex feel navigable.</h2>
              <p>My work sits at the intersection of technical architecture and business execution. I use this space to make hard-won knowledge easier to find, understand, and reuse—not to make complexity look impressive.</p>
              <a href="https://github.com/Lily-Feng" target="_blank" rel="noreferrer">See what I’m building <ArrowRight size={16} /></a>
            </div>
            <div className="focus-grid">
              <div><Network /><span>01</span><h3>AI & Data Architecture</h3><p>Designing governed, scalable foundations for analytics, machine learning, and LLM applications.</p></div>
              <div><BriefcaseBusiness /><span>02</span><h3>Product & Strategy</h3><p>Turning ambiguous business goals into clear technical bets, roadmaps, and measurable outcomes.</p></div>
              <div><BrainCircuit /><span>03</span><h3>Applied ML</h3><p>Prototyping and evaluating AI systems to learn quickly before investing at enterprise scale.</p></div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Header({ view, onNavigate, menuOpen, setMenuOpen }: { view: View; onNavigate: (view: View) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => onNavigate("knowledge")} aria-label="Lily Feng home"><span>LF</span><strong>Lily Feng</strong></button>
      <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
        <button className={view === "knowledge" ? "active" : ""} onClick={() => onNavigate("knowledge")}><Network size={16} /> Knowledge</button>
        <button className={view === "writing" ? "active" : ""} onClick={() => onNavigate("writing")}><BookOpen size={16} /> Writing</button>
        <button className={view === "about" ? "active" : ""} onClick={() => onNavigate("about")}><Sparkles size={16} /> About Me</button>
      </nav>
      <a className="github-link" href="https://github.com/Lily-Feng" target="_blank" rel="noreferrer" aria-label="Lily Feng on GitHub"><GitBranch size={18} /><span>GitHub</span></a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div><span className="brand-mark">LF</span><p>A living map of ideas, built in public.</p></div>
      <p>Markdown in Git · Static on GitHub Pages · No tracking</p>
      <a href="https://github.com/Lily-Feng/Lily-Feng.github.io" target="_blank" rel="noreferrer">View source <ArrowRight size={14} /></a>
    </footer>
  );
}

export default App;
