import DOMPurify from "dompurify";
import { marked } from "marked";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import type { ContentDocument } from "../lib/content";

type ArticlePageProps = {
  document: ContentDocument;
  related: ContentDocument[];
  onBack: () => void;
  onOpen: (slug: string) => void;
};

export function ArticlePage({ document, related, onBack, onOpen }: ArticlePageProps) {
  const html = DOMPurify.sanitize(marked.parse(document.body) as string);

  return (
    <main className="article-page">
      <button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back to the garden</button>
      <article>
        <header className="article-header">
          <span className="article-domain">{document.domain}</span>
          <h1>{document.title}</h1>
          <p>{document.summary}</p>
          <div className="article-meta">
            {document.date && <time dateTime={document.date}>{new Date(`${document.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>}
            <span><Clock3 size={14} /> {document.readingMinutes} min read</span>
          </div>
          <div className="topic-row">
            {document.topics.map((topic) => <span key={topic}>{topic}</span>)}
          </div>
        </header>

        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {related.length > 0 && (
        <section className="related-section">
          <span className="eyebrow">Keep exploring</span>
          <h2>Connected notes</h2>
          <div className="related-grid">
            {related.map((item) => (
              <button key={item.slug} onClick={() => onOpen(item.slug)}>
                <span>{item.domain}</span>
                <strong>{item.title}</strong>
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
