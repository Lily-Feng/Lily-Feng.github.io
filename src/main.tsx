import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

/** Translate pre-BrowserRouter `/#/...` links so old shares still resolve. */
function redeemLegacyHashLink() {
  const hash = window.location.hash;
  if (!hash.startsWith("#/")) return;

  const legacyPath = hash.slice(1);
  const rewritten = legacyPath.startsWith("/read/")
    ? legacyPath.replace("/read/", "/blogs/")
    : legacyPath;

  window.history.replaceState(null, "", rewritten + window.location.search);
}

/** public/404.html stashes the requested path here before bouncing to `/`. */
function redeemPagesRedirect() {
  try {
    const target = sessionStorage.getItem("spa-redirect");
    if (!target) return;
    sessionStorage.removeItem("spa-redirect");
    window.history.replaceState(null, "", target);
  } catch {
    /* private browsing — the visitor just stays on the home page */
  }
}

redeemLegacyHashLink();
redeemPagesRedirect();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
