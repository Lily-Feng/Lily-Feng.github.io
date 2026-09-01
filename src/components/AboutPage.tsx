import { lazy, Suspense, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Globe2, GraduationCap, MapPin, Wrench } from "lucide-react";
import { categoryLabels, profile, resumeEntries } from "../data/resume";

const ExperienceGlobe = lazy(() => import("./ExperienceGlobe"));

export function AboutPage({ onOpenJianghu }: { onOpenJianghu: () => void }) {
  const [section, setSection] = useState<"education" | "experience" | "highlights" | "globe">("highlights");

  return (
    <div className="about-page">
      <header className="resume-hero">
        <div>
          <span className="eyebrow">About me</span>
          <h1>{profile.name}</h1>
          <strong>{profile.title}</strong>
          <p>{profile.summary}</p>
        </div>
        <div className="resume-hero-meta">
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
          <button className="guzheng-entry" onClick={onOpenJianghu} aria-label="轻触古筝，翻开 Lily 的中文江湖传说">
            <span className="guzheng-entry__hint">A Chinese easter egg</span>
            <img src="/guzheng-button.png" alt="" />
            <strong>轻触琴弦 · 入江湖</strong>
          </button>
        </div>
      </header>

      <div className="about-view-tabs" role="tablist" aria-label="About Lily">
        <button className={section === "education" ? "active" : ""} onClick={() => setSection("education")} role="tab" aria-selected={section === "education"}>
          <GraduationCap size={16} /><strong>Education</strong>
        </button>
        <button className={section === "experience" ? "active" : ""} onClick={() => setSection("experience")} role="tab" aria-selected={section === "experience"}>
          <BriefcaseBusiness size={16} /><strong>Past Experience</strong>
        </button>
        <button className={section === "highlights" ? "active" : ""} onClick={() => setSection("highlights")} role="tab" aria-selected={section === "highlights"}>
          <Wrench size={16} /><strong>Recent Focus and Highlights</strong>
        </button>
        <button className={section === "globe" ? "active" : ""} onClick={() => setSection("globe")} role="tab" aria-selected={section === "globe"}>
          <Globe2 size={16} /><strong>Journey map</strong>
        </button>
      </div>

      {section === "education" && <section className="resume-layout" role="tabpanel">
        <div className="resume-content">
          <div className="resume-section-heading"><GraduationCap size={18} /><div><span>{categoryLabels.education}</span><h2>Education</h2></div></div>
          <div className="education-list">
            {resumeEntries.filter((entry) => entry.category === "education").map((entry) => (
              <article className="education-card" key={entry.id}>
                <div>
                  <h3>{entry.organization}</h3>
                  <strong>{entry.role}</strong>
                  {entry.location && <span><MapPin size={12} /> {entry.location}</span>}
                </div>
                <time>{entry.period}</time>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {section === "experience" && <section className="resume-layout" role="tabpanel">
        <div className="resume-content">
          <div className="resume-section-heading"><BriefcaseBusiness size={18} /><div><span>Professional journey</span><h2>Experience</h2></div></div>
          <div className="resume-timeline">
            {resumeEntries.filter((entry) => entry.category === "work").map((entry) => (
              <article key={entry.id}>
                <div className="timeline-rail"><i /><span /></div>
                <div className="resume-entry">
                  <div className="resume-entry-top">
                    <div><h3>{entry.role}</h3>{entry.organization && <strong>{entry.organization}</strong>}</div>
                    <time>{entry.period}</time>
                  </div>
                  {entry.location && <div className="resume-entry-location"><MapPin size={12} /> {entry.location}</div>}
                  {entry.summary && <p>{entry.summary}</p>}
                  {entry.highlights.length > 0 && <ul>{entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
                  {entry.skills.length > 0 && <div className="resume-skills">{entry.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {section === "highlights" && <section className="resume-layout" role="tabpanel">
        <div className="resume-content">
          <div className="resume-section-heading"><Wrench size={18} /><div><span>Capabilities</span><h2>Technical Expertise</h2></div></div>
          <dl className="expertise-list">
            {profile.expertise.map((item) => (
              <div key={item.category}>
                <dt>{item.category}</dt>
                <dd>{item.details}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>}

      {section === "globe" && (
        <Suspense fallback={<div className="globe-loading"><Globe2 size={30} /><span>Preparing the globe…</span></div>}>
          <ExperienceGlobe />
        </Suspense>
      )}
    </div>
  );
}
