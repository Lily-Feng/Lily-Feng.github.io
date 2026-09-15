import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function NotFound() {
  return (
    <section className="not-found">
      <span className="u-eyebrow">404</span>
      <h1>That page isn’t here.</h1>
      <p>The link may be out of date, or the note may have been renamed.</p>
      <div className="not-found-links">
        <Link to="/">Home <ArrowRight size={15} aria-hidden="true" /></Link>
        <Link to="/work">Work <ArrowRight size={15} aria-hidden="true" /></Link>
        <Link to="/blogs">Writing <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
