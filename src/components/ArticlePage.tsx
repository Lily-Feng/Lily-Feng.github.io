import DOMPurify from "dompurify";
import { marked } from "marked";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { getDocument, getRelated } from "../lib/content";
import { documentPath, formatArticleDate } from "../lib/format";
import { NotFound } from "./NotFound";

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const document = slug ? getDocument(slug) : undefined;

  if (!document) return <NotFound />;

  const related = getRelated(document);
  const html = DOMPurify.sanitize(marked.parse(document.body) as string);

  return (
    <main className="article-page">
      <Link className="back-button" to="/blogs">
        <ArrowLeft size={17} aria-hidden="true" /> Back to writing
      </Link>

      <article>
        <header className="article-header">
          <span className="article-domain">{document.domain}</span>
          <h1>{document.title}</h1>
          <p>{document.summary}</p>
          <div className="article-meta">
            {document.date && (
              <time dateTime={document.date}>{formatArticleDate(document.date)}</time>
            )}
            <span><Clock3 size={14} aria-hidden="true" /> {document.readingMinutes} min read</span>
          </div>
          <div className="topic-row">
            {document.topics.map((topic) => <span key={topic}>{topic}</span>)}
          </div>

          {document.syndicated.length > 0 && (
            <p className="article-syndication">
              Also on{" "}
              {document.syndicated.map((copy, index) => (
                <span key={copy.url}>
                  {index > 0 && " · "}
                  <a href={copy.url} target="_blank" rel="noreferrer">
                    {copy.label} <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </span>
              ))}
            </p>
          )}
        </header>

        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {related.length > 0 && (
        <section className="related-section">
          <span className="eyebrow">Keep reading</span>
          <h2>Connected notes</h2>
          <div className="related-grid">
            {related.map((item) => (
              <Link key={item.slug} to={documentPath(item.slug)}>
                <span>{item.domain}</span>
                <strong>{item.title}</strong>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
