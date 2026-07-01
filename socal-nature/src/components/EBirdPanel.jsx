import { useState, useEffect } from "react";
import { EBIRD_KEY } from "../constants";

function daysAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  return `${diff}d ago`;
}

// Sightings at a specific hotspot
export function HotspotSightings({ hotspotId, hotspotUrl, color, label = "Recent eBird Sightings" }) {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show || !EBIRD_KEY || !hotspotId) return;
    setLoading(true);
    fetch(`https://api.ebird.org/v2/data/obs/${hotspotId}/recent?back=14&maxResults=30`, {
      headers: { "X-eBirdApiToken": EBIRD_KEY }
    })
      .then(r => r.json())
      .then(data => { setSightings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [show, hotspotId]);

  if (!EBIRD_KEY) return null;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: show ? 8 : 0 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8a7a6a" }}>{label}</div>
        <button onClick={() => setShow(v => !v)}
          style={{ fontSize: 10, padding: "2px 10px", borderRadius: 20, border: "none", background: show ? color : `${color}20`, color: show ? "#fff" : color, cursor: "pointer", fontWeight: 700 }}>
          {show ? "Hide" : "🔴 Show Live"}
        </button>
      </div>
      {show && (
        loading ? (
          <div style={{ fontSize: 12, color: "#8a7a6a" }}>Loading…</div>
        ) : sightings.length === 0 ? (
          <div style={{ fontSize: 12, color: "#8a7a6a" }}>No recent sightings at this hotspot.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {sightings.map((s, i) => (
              <span key={i} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: `${color}15`, color, fontWeight: 600 }}>
                {s.comName}{s.howMany ? ` ×${s.howMany}` : ""} <span style={{ opacity: 0.7 }}>· {daysAgo(s.obsDt)}</span>
              </span>
            ))}
            {hotspotUrl && (
              <a href={hotspotUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "#fff", border: `1px solid ${color}40`, color, fontWeight: 700, textDecoration: "none" }}>
                Full hotspot →
              </a>
            )}
          </div>
        )
      )}
    </div>
  );
}

// Nearby sightings by lat/lng radius — used in Birds and Wildflowers tabs
export function NearbyBirdSightings({ lat, lng, radiusMiles, color }) {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!EBIRD_KEY || !lat || !lng) return;
    setLoading(true);
    setFetched(false);
    // eBird nearby recent observations
    fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&dist=${Math.min(radiusMiles, 50)}&back=14&maxResults=100&includeProvisional=true`,
      { headers: { "X-eBirdApiToken": EBIRD_KEY } }
    )
      .then(r => r.json())
      .then(data => {
        setSightings(Array.isArray(data) ? data : []);
        setLoading(false);
        setFetched(true);
      })
      .catch(() => { setLoading(false); setFetched(true); });
  }, [lat, lng, radiusMiles]);

  return { sightings, loading, fetched };
}
