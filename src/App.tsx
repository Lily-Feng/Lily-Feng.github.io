import { useEffect, useMemo, useRef, useState } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Menu,
  Moon,
  Network,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { AboutPage } from "./components/AboutPage";
import { ArticlePage } from "./components/ArticlePage";
import { KnowledgeGraph } from "./components/KnowledgeGraph";
import { JianghuPage } from "./components/JianghuPage";
import { documents, domains, getDocument, getRelated, searchDocuments, type ContentDocument } from "./lib/content";

type View = "knowledge" | "blogs" | "about";
type Theme = "light" | "dark";

function GitHubLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.68 0-1.25.45-2.28 1.2-3.08-.12-.3-.52-1.47.11-3.05 0 0 .97-.31 3.17 1.18a10.96 10.96 0 0 1 5.78 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.58.23 2.76.11 3.05.74.8 1.2 1.83 1.2 3.08 0 4.4-2.7 5.38-5.28 5.67.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* private browsing — fall through to the OS preference */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getView(pathname: string): View {
  if (pathname === "/knowledge") return "knowledge";
  if (pathname === "/blogs" || pathname === "/writing") return "blogs";
  return "about";
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
  const location = useLocation();
  const routerNavigate = useNavigate();
  const view = getView(location.pathname);
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [activeDomain, setActiveDomain] = useState(domains[0] ?? "Knowledge");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* private browsing — the theme just will not persist */
    }
    // Keep the browser chrome in step with the design token rather than a literal.
    const surface = getComputedStyle(root).getPropertyValue("--surface-page").trim();
    if (surface) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", surface);
  }, [theme]);

  useEffect(() => {
    const isJianghu = location.pathname === "/jianghu";
    document.documentElement.lang = isJianghu ? "zh-CN" : "en";
    document.title = isJianghu
      ? "江湖传说 · Lily Feng"
      : "Lily Feng — Field Notes & Knowledge Graph";
    const themeColor = isJianghu
      ? "#eee8d9"
      : getComputedStyle(document.documentElement).getPropertyValue("--surface-page").trim();
    if (themeColor) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  }, [location.pathname]);

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

  const articleSlug = matchPath("/read/:slug", location.pathname)?.params.slug;
  const activeDocument = articleSlug ? getDocument(articleSlug) : undefined;
  const graphDocuments = useMemo(() => documents.filter((document) => document.domain === activeDomain), [activeDomain]);
  const searchResults = useMemo(() => searchDocuments(query).slice(0, 12), [query]);
  const blogs = documents.filter((document) => document.kind === "post" || document.kind === "project");

  const openDocument = (slug: string) => {
    routerNavigate(`/read/${encodeURIComponent(slug)}`);
    setQuery("");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (nextView: View) => {
    routerNavigate(`/${nextView}`);
    setQuery("");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToDomain = (domain: string) => {
    setActiveDomain(domain);
    navigate("knowledge");
  };

  if (location.pathname === "/jianghu") {
    return <JianghuPage onBack={() => routerNavigate("/about")} />;
  }

  if (activeDocument) {
    return (
      <div className="site-shell">
        <Header view={view} onNavigate={navigate} onOpen={openDocument} onSelectDomain={navigateToDomain} menuOpen={menuOpen} setMenuOpen={setMenuOpen} theme={theme} setTheme={setTheme} />
        <ArticlePage document={activeDocument} related={getRelated(activeDocument)} onOpen={openDocument} onBack={() => navigate("knowledge")} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell">
      <Header view={view} onNavigate={navigate} onOpen={openDocument} onSelectDomain={navigateToDomain} menuOpen={menuOpen} setMenuOpen={setMenuOpen} theme={theme} setTheme={setTheme} />

      <main>
        {view === "knowledge" ? (
          <section className="hero">
            <div className="hero-copy">
              <span className="hero-kicker"><span /> Digital garden · Open notebook</span>
              <h1>A map of what I’m learning—and <em>how it connects.</em></h1>
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
        ) : view === "blogs" ? (
          <section className="page-intro page-intro--writing">
            <div className="page-number">02</div>
            <div>
              <span className="eyebrow">Blogs</span>
              <h1>Field notes from the work.</h1>
            </div>
            <p>Essays, implementation notes, and practical frameworks—published when an idea becomes useful enough to share.</p>
          </section>
        ) : (
          <AboutPage onOpenJianghu={() => routerNavigate("/jianghu")} />
        )}

        {view !== "about" && (
          <section className={`discovery-bar${view === "blogs" ? " discovery-bar--compact" : ""}`} aria-label="Search the knowledge garden">
            <Search size={20} />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={view === "blogs" ? "Search the blogs…" : "Search notes, topics, and projects…"}
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
            <div className="graph-help"><span>Click</span> a concept for key knowledge and links · <span>Drag</span> to pan · <span>Scroll</span> to zoom once engaged · <span>Tab</span> reveals a keyboard list</div>
          </section>
        ) : view === "blogs" ? (
          <section className="writing-section">
            <div className="section-heading">
              <div><span className="eyebrow">Latest</span><h2>Browse the archive</h2></div>
              <p>{blogs.length} published piece{blogs.length === 1 ? "" : "s"}. Every post also becomes a node in the knowledge graph.</p>
            </div>
            <div className="content-grid">{blogs.map((document) => <ContentCard key={document.slug} document={document} onOpen={openDocument} />)}</div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

type HeaderProps = {
  view: View;
  onNavigate: (view: View) => void;
  onOpen: (slug: string) => void;
  onSelectDomain: (domain: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

function Header({ view, onNavigate, onOpen, onSelectDomain, menuOpen, setMenuOpen, theme, setTheme }: HeaderProps) {
  const [openFlyout, setOpenFlyout] = useState<"explore" | "blogs" | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const latestPosts = documents.filter((document) => document.kind === "post").slice(0, 3);

  useEffect(() => {
    const closeFlyouts = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenFlyout(null);
    };
    window.addEventListener("pointerdown", closeFlyouts);
    return () => window.removeEventListener("pointerdown", closeFlyouts);
  }, []);

  const chooseView = (nextView: View) => {
    setOpenFlyout(null);
    onNavigate(nextView);
  };

  return (
    <header className="site-header" ref={headerRef}>
      <button className="brand" onClick={() => chooseView("about")} aria-label="Lily Feng home"><span>LF</span><strong>Lily Feng</strong></button>
      <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
        <div className="nav-item" onMouseEnter={() => setOpenFlyout("explore")} onMouseLeave={() => setOpenFlyout(null)}>
          <button className={`nav-trigger${view === "knowledge" ? " active" : ""}`} onClick={() => setOpenFlyout(openFlyout === "explore" ? null : "explore")} aria-expanded={openFlyout === "explore"}>
            <Network size={16} /> Explore <ChevronDown size={13} />
          </button>
          <div className={`nav-flyout explore-flyout${openFlyout === "explore" ? " open" : ""}`}>
            <button className="flyout-feature" onClick={() => chooseView("knowledge")}>
              <span className="flyout-icon"><Network size={18} /></span>
              <span><strong>Knowledge map</strong><small>Trace ideas across AI, data, and strategy.</small></span>
              <ArrowRight size={16} />
            </button>
            <div className="flyout-label">Browse a trail</div>
            <div className="domain-links">
              {domains.map((domain, index) => <button key={domain} onClick={() => { setOpenFlyout(null); onSelectDomain(domain); }}><span>0{index + 1}</span>{domain}</button>)}
            </div>
          </div>
        </div>
        <div className="nav-item" onMouseEnter={() => setOpenFlyout("blogs")} onMouseLeave={() => setOpenFlyout(null)}>
          <button className={`nav-trigger${view === "blogs" ? " active" : ""}`} onClick={() => setOpenFlyout(openFlyout === "blogs" ? null : "blogs")} aria-expanded={openFlyout === "blogs"}>
            <BookOpen size={16} /> Blogs <ChevronDown size={13} />
          </button>
          <div className={`nav-flyout blogs-flyout${openFlyout === "blogs" ? " open" : ""}`}>
            <div className="flyout-heading"><div><span>Fresh from the garden</span><strong>Latest field notes</strong></div><button onClick={() => chooseView("blogs")}>View all <ArrowRight size={14} /></button></div>
            <div className="post-preview-list">
              {latestPosts.map((post) => (
                <button key={post.slug} onClick={() => { setOpenFlyout(null); onOpen(post.slug); }}>
                  <span>{post.domain}</span><strong>{post.title}</strong><small>{post.readingMinutes} min read</small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className={`nav-direct${view === "about" ? " active" : ""}`} onClick={() => chooseView("about")}><Sparkles size={16} /> About Me</button>
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>
        <a className="github-link" href="https://github.com/Lily-Feng" target="_blank" rel="noreferrer" aria-label="Lily Feng on GitHub"><GitHubLogo /><span>GitHub</span></a>
      </div>
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
