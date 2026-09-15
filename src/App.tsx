import { lazy, Suspense, useEffect, useState } from "react";
import { Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { AboutPage } from "./components/AboutPage";
import { ArticlePage } from "./components/ArticlePage";
import { BlogsPage } from "./components/BlogsPage";
import { HomePage } from "./components/HomePage";
import { JianghuPage } from "./components/JianghuPage";
import { NotFound } from "./components/NotFound";
import { WorkPage } from "./components/WorkPage";

// Lazy: keeps the graph code and data out of every other page's bundle.
const KnowledgePage = lazy(() => import("./components/KnowledgePage"));

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

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close the mobile drawer and return to the top on every navigation.
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const isEaster = location.pathname === "/easter";
    document.documentElement.lang = isEaster ? "zh-CN" : "en";
    const themeColor = isEaster
      ? "#eee8d9"
      : getComputedStyle(document.documentElement).getPropertyValue("--surface-page").trim();
    if (themeColor) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  }, [location.pathname]);

  if (location.pathname === "/easter") {
    return <JianghuPage onBack={() => navigate("/about")} />;
  }

  return (
    <div className="site-shell">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} theme={theme} setTheme={setTheme} />

      <Routes>
        {/* An article owns its own <main>. */}
        <Route path="/blogs/:slug" element={<ArticlePage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/about" element={<AboutPage onOpenJianghu={() => navigate("/easter")} />} />
          <Route
            path="/knowledge"
            element={
              <Suspense fallback={<div className="route-loading">Loading the map…</div>}>
                <KnowledgePage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

function MainLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

type HeaderProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-direct${isActive ? " active" : ""}`;

function Header({ menuOpen, setMenuOpen, theme, setTheme }: HeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Lily Feng — home">
        <span>LF</span><strong>Lily Feng</strong>
      </Link>

      <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
        <NavLink className={navLinkClass} to="/work">Work</NavLink>
        <NavLink className={navLinkClass} to="/blogs">Writing</NavLink>
        <NavLink className={navLinkClass} to="/about">About</NavLink>
      </nav>

      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>
        <a
          className="github-link"
          href="https://github.com/Lily-Feng"
          target="_blank"
          rel="noreferrer"
          aria-label="Lily Feng on GitHub"
        >
          <GitHubLogo /><span>GitHub</span>
        </a>
      </div>

      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div><span className="brand-mark">LF</span><p>Built in the open, one repository at a time.</p></div>
      <p>Markdown in Git · Static on GitHub Pages · No tracking</p>
      <a href="https://github.com/Lily-Feng/Lily-Feng.github.io" target="_blank" rel="noreferrer">
        View source <ArrowRight size={14} aria-hidden="true" />
      </a>
    </footer>
  );
}

export default App;
