import { useState, useEffect } from "react";
import { HotspotSightings } from "../components/EBirdPanel";
import { TAB_COLORS } from "../constants";

const COLOR = TAB_COLORS.camping;

const SORT_OPTIONS = [
  { value: "distance", label: "Distance" },
  { value: "elevation", label: "Elevation" },
  { value: "price", label: "Price" },
];

const AMENITY_FILTERS = [
  { key: "tentOk", label: "🏕 Tent" },
  { key: "rvOk", label: "🚐 RV" },
  { key: "hasWater", label: "💧 Water" },
  { key: "hasShowers", label: "🚿 Showers" },
  { key: "hasElectric", label: "⚡ Electric" },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CampCard({ camp, expanded, onExpand }) {
  const isManual = camp.reservationType === "manual";
  const color = isManual ? "#8f6a3a" : COLOR;

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `2px solid ${expanded ? color : "#e0d8cc"}`, boxShadow: expanded ? `0 4px 20px ${color}25` : "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden", transition: "all 0.2s" }}>
      <div onClick={() => onExpand(camp.id)} style={{ padding: "16px 18px", cursor: "pointer", background: expanded ? `${color}0d` : "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>{isManual ? "🏞️" : "⛺"}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#fff", background: color, borderRadius: 20, padding: "2px 8px" }}>{camp.agency}</span>
              {camp.kidFriendly && <span style={{ fontSize: 10, color: "#4a7c59", fontWeight: 700 }}>👨‍👩‍👧 Kid Friendly</span>}
            </div>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, color: "#1a2a1a", fontWeight: 700 }}>{camp.name}</h3>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6a7a6a", flexWrap: "wrap" }}>
              <span>📍 {camp.distanceMiles} mi</span>
              <span>🚗 {camp.driveMinutes} min</span>
              <span>⛰️ {camp.elevation.toLocaleString()} ft</span>
              <span>💰 ${camp.pricePerNight}/night</span>
            </div>
          </div>
          <div style={{ fontSize: 20 }}>{expanded ? "▲" : "▼"}</div>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
          {AMENITY_FILTERS.map(f => camp[f.key] && (
            <span key={f.key} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${color}15`, color, fontWeight: 600 }}>{f.label}</span>
          ))}
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${color}20`, padding: "16px 18px" }}>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#4a5a4a", lineHeight: 1.6 }}>{camp.highlights}</p>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8a7a6a", marginBottom: 8 }}>Nearby Trails</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {camp.trails.map(t => (
                <div key={t.name} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: `1px solid ${color}40`, background: `${color}08`, color: "#3a3028" }}>
                  {t.name} · {t.distance} · {t.difficulty}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8a7a6a", marginBottom: 8 }}>Featured Birds</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {camp.birds.map(b => (
                <a key={b.name}
                  href={`https://www.audubon.org/field-guide/bird/${b.name.toLowerCase().replace(/['']/g, "").replace(/\s+/g, "-")}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "#1a3a6a", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                  🐦 {b.name}
                </a>
              ))}
            </div>
          </div>

          <HotspotSightings hotspotId={camp.eBirdHotspot} hotspotUrl={camp.eBirdUrl} color={color} />

          <a href={camp.reservationUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", padding: "10px 20px", borderRadius: 25, background: color, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            {isManual ? "🔗 Check Availability →" : "🏕 Reserve on Recreation.gov →"}
          </a>
        </div>
      )}
    </div>
  );
}

export default function CampingTab() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetch("/campgrounds.json")
      .then(r => r.json())
      .then(data => { setCamps(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleFilter = key => setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  const handleExpand = id => setExpanded(prev => prev === id ? null : id);

  const filtered = camps.filter(c => Object.entries(filters).every(([k, active]) => !active || c[k]));
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "distance") return a.distanceMiles - b.distanceMiles;
    if (sortBy === "elevation") return b.elevation - a.elevation;
    if (sortBy === "price") return a.pricePerNight - b.pricePerNight;
    return 0;
  });

  return (
    <div>
      {/* Sort & Filter */}
      <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${COLOR}30`, padding: "12px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#8a7a6a", letterSpacing: 1, textTransform: "uppercase" }}>Sort:</span>
          {SORT_OPTIONS.map(o => (
            <button key={o.value} onClick={() => setSortBy(o.value)}
              style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${sortBy === o.value ? COLOR : "#d0c8b8"}`, background: sortBy === o.value ? COLOR : "#faf8f3", color: sortBy === o.value ? "#fff" : "#3a3028", cursor: "pointer", fontWeight: sortBy === o.value ? 700 : 400 }}>
              {o.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#8a7a6a", letterSpacing: 1, textTransform: "uppercase" }}>Filter:</span>
          {AMENITY_FILTERS.map(f => (
            <button key={f.key} onClick={() => toggleFilter(f.key)}
              style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${filters[f.key] ? "#4a7c59" : "#d0c8b8"}`, background: filters[f.key] ? "#4a7c59" : "#faf8f3", color: filters[f.key] ? "#fff" : "#3a3028", cursor: "pointer", fontWeight: filters[f.key] ? 700 : 400 }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#8a7a6a", marginBottom: 10 }}>
        ⛺ Recreation.gov sites — click Reserve button for live availability &nbsp;·&nbsp; 🏞️ OC Parks — manual reservation link
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#8a7a6a" }}>Loading campgrounds…</div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#8a7a6a" }}>No campgrounds match your filters.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.map(c => <CampCard key={c.id} camp={c} expanded={expanded === c.id} onExpand={handleExpand} />)}
        </div>
      )}
    </div>
  );
}
