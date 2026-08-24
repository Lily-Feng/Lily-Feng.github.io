import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { ArrowRight, MapPin, MousePointer2, X } from "lucide-react";
import { categoryColors, categoryLabels, journeyLocations, type JourneyLocation, type ResumeCategory } from "../data/resume";

/**
 * Scene colours are deliberately fixed rather than themed: `.globe-shell` renders
 * a night-side Earth in both light and dark mode (see src/styles/resume.css), so
 * the atmosphere and arcs are constants of the scene, not of the page palette.
 */
const ATMOSPHERE_COLOR = "#60a5fa";
const ARC_COLOR = "rgba(203,213,225,.55)";

type RouteArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

export default function ExperienceGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const shellRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 900, height: 650 });
  const [selected, setSelected] = useState<JourneyLocation | null>(null);

  const routes = useMemo<RouteArc[]>(() => journeyLocations.slice(1).map((entry, index) => ({
    startLat: journeyLocations[index].lat,
    startLng: journeyLocations[index].lng,
    endLat: entry.lat,
    endLng: entry.lng,
  })), []);

  useEffect(() => {
    if (!shellRef.current) return;
    const resize = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setSize({ width, height: Math.max(560, Math.min(720, width * .72)) });
    });
    resize.observe(shellRef.current);
    return () => resize.disconnect();
  }, []);

  const focusEntry = (entry: JourneyLocation) => {
    setSelected(entry);
    globeRef.current?.pointOfView({ lat: entry.lat, lng: entry.lng, altitude: .95 }, 900);
  };

  return (
    <section className="globe-experience" aria-label="Verified places from the resume timeline">
      <div className="globe-copy">
        <span className="eyebrow">A geographic timeline</span>
        <h2>My journey, mapped.</h2>
        <p>Explore verified professional and education locations across the timeline.</p>
        <div className="globe-instruction"><MousePointer2 size={14} /> Drag to rotate, scroll to zoom, or select a location below.</div>
      </div>

      <div className="globe-shell" ref={shellRef}>
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereColor={ATMOSPHERE_COLOR}
          atmosphereAltitude={.17}
          pointsData={journeyLocations}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={.035}
          pointRadius={.32}
          pointColor={(item) => categoryColors[(item as JourneyLocation).category]}
          pointLabel={(item) => `<strong>${(item as JourneyLocation).location}</strong><br/>${(item as JourneyLocation).role}`}
          onPointClick={(item) => focusEntry(item as JourneyLocation)}
          ringsData={journeyLocations}
          ringLat="lat"
          ringLng="lng"
          ringColor={(item: object) => () => categoryColors[(item as JourneyLocation).category]}
          ringMaxRadius={2.7}
          ringPropagationSpeed={1.25}
          ringRepeatPeriod={1300}
          arcsData={routes}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={() => ARC_COLOR}
          arcStroke={.35}
          arcDashLength={.45}
          arcDashGap={.25}
          arcDashAnimateTime={2800}
          onGlobeReady={() => {
            globeRef.current?.pointOfView({ lat: 38, lng: -97, altitude: .72 }, 0);
            const controls = globeRef.current?.controls();
            if (controls) {
              controls.autoRotate = false;
              controls.enableDamping = true;
              controls.dampingFactor = .08;
            }
          }}
        />

        <div className="globe-legend" aria-label="Map legend">
          {(Object.keys(categoryLabels) as ResumeCategory[]).map((category) => (
            <span key={category}><i style={{ background: categoryColors[category] }} />{categoryLabels[category]}</span>
          ))}
        </div>

        {selected && <article className="globe-detail-card" role="dialog" aria-label={`${selected.role} in ${selected.location}`} aria-live="polite">
          <button className="globe-detail-close" onClick={() => setSelected(null)} aria-label="Close location details"><X size={15} /></button>
          <div className="globe-detail-meta"><span style={{ color: categoryColors[selected.category] }}>{categoryLabels[selected.category]}</span><time>{selected.period}</time></div>
          <h3>{selected.role}</h3>
          <div className="globe-detail-location"><MapPin size={13} /> {selected.organization} · {selected.location}</div>
          <p>{selected.summary}</p>
          <div className="globe-detail-skills">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </article>}
      </div>

      <div className="journey-list">
        {journeyLocations.map((entry) => (
          <button key={entry.id} className={selected?.id === entry.id ? "active" : ""} onClick={() => focusEntry(entry)}>
            <i style={{ background: categoryColors[entry.category] }} />
            <span><strong>{entry.location}</strong><small>{entry.role}</small></span>
            <ArrowRight size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}
