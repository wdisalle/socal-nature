import { useState, useEffect } from "react";
import ZipSearch from "../components/ZipSearch";
import { TAB_COLORS, DEFAULT_ZIP, DEFAULT_LAT, DEFAULT_LNG, DEFAULT_RADIUS_MILES, ZIP_COORDS } from "../constants";

const COLOR = TAB_COLORS.wildflowers;

// iNaturalist API — no key required, CORS-friendly
async function fetchNearbyWildflowers(lat, lng, radiusMiles) {
  try {
    const radiusKm = Math.round(radiusMiles * 1.60934);
    const res = await fetch(
      `https://api.inaturalist.org/v1/observations?` +
      `taxon_id=47219&` +          // taxon 47219 = flowering plants
      `lat=${lat}&lng=${lng}&` +
      `radius=${radiusKm}&` +
      `quality_grade=research&` +
      `photos=true&` +
      `order=desc&order_by=observed_on&` +
      `per_page=60&` +
      `d1=${getDateDaysAgo(30)}`   // last 30 days
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().substring(0, 10);
}

function formatObsDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Deduplicate by taxon (species), keep most recent + best photo
function deduplicateBySpecies(observations) {
  const map = new Map();
  for (const obs of observations) {
    const key = obs.taxon?.id;
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, obs);
    }
  }
  return Array.from(map.values());
}

function FlowerCard({ obs, selected, onClick }) {
  const name = obs.taxon?.preferred_common_name || obs.taxon?.name || "Unknown";
  const sciName = obs.taxon?.name || "";
  const photo = obs.taxon?.default_photo?.medium_url || obs.photos?.[0]?.url?.replace("square", "medium");
  const place = obs.place_guess || "";
  const date = formatObsDate(obs.observed_on);

  return (
    <button onClick={onClick}
      style={{ border: `2px solid ${selected ? COLOR : "#e0d8cc"}`, borderRadius: 10, overflow: "hidden", background: selected ? `${COLOR}12` : "#faf8f3", cursor: "pointer", padding: 0, textAlign: "left", transition: "all 0.15s" }}>
      <div style={{ width: "100%", height: 90, overflow: "hidden", background: "#f0e8f0" }}>
        {photo ? (
          <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🌸</div>
        )}
      </div>
      <div style={{ padding: "7px 9px" }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: "#1a2a1a", lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontSize: 9, color: "#8a7a6a", fontStyle: "italic", marginTop: 2 }}>{sciName}</div>
        {date && <div style={{ fontSize: 9, color: COLOR, marginTop: 2 }}>Seen {date}</div>}
      </div>
    </button>
  );
}

function FlowerDetail({ obs }) {
  const name = obs.taxon?.preferred_common_name || obs.taxon?.name || "Unknown";
  const sciName = obs.taxon?.name || "";
  const photo = obs.taxon?.default_photo?.medium_url || obs.photos?.[0]?.url?.replace("square", "medium");
  const place = obs.place_guess || "";
  const date = formatObsDate(obs.observed_on);
  const iNatUrl = `https://www.inaturalist.org/observations/${obs.id}`;
  const taxonUrl = obs.taxon?.id ? `https://www.inaturalist.org/taxa/${obs.taxon.id}` : null;
  const wikiUrl = obs.taxon?.wikipedia_url;

  return (
    <div style={{ background: `${COLOR}0d`, border: `1.5px solid ${COLOR}40`, borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start", marginTop: 14 }}>
      <div style={{ flexShrink: 0, width: 90, height: 80, borderRadius: 8, overflow: "hidden", background: "#f0e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {photo ? <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} /> : <span style={{ fontSize: 28 }}>🌸</span>}
      </div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a2a1a" }}>{name}</div>
        <div style={{ fontSize: 11, fontStyle: "italic", color: "#6a7a6a", marginBottom: 6 }}>{sciName}</div>
        {place && <div style={{ fontSize: 12, color: "#6a7a6a", marginBottom: 4 }}>📍 {place}</div>}
        {date && <div style={{ fontSize: 12, color: COLOR, marginBottom: 10 }}>Last seen {date}</div>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {taxonUrl && (
            <a href={taxonUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: COLOR, color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
              🌸 iNaturalist →
            </a>
          )}
          {wikiUrl && (
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#555", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
              📖 Wikipedia →
            </a>
          )}
          <a href={iNatUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#fff", border: `1px solid ${COLOR}60`, color: COLOR, padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
            View Observation →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function WildflowersTab() {
  const [searchParams, setSearchParams] = useState({
    lat: DEFAULT_LAT, lng: DEFAULT_LNG,
    city: ZIP_COORDS[DEFAULT_ZIP].city,
    radius: DEFAULT_RADIUS_MILES, zip: DEFAULT_ZIP,
  });
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    setFetched(false);
    setSelected(null);
    fetchNearbyWildflowers(searchParams.lat, searchParams.lng, searchParams.radius)
      .then(results => {
        setObservations(deduplicateBySpecies(results));
        setLoading(false);
        setFetched(true);
      });
  }, [searchParams.lat, searchParams.lng, searchParams.radius]);

  const filtered = observations.filter(obs => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    const name = obs.taxon?.preferred_common_name || "";
    const sci = obs.taxon?.name || "";
    return name.toLowerCase().includes(q) || sci.toLowerCase().includes(q);
  });

  return (
    <div>
      <ZipSearch color={COLOR} loading={loading} onSearch={params => setSearchParams(params)} />

      {loading && (
        <div style={{ textAlign: "center", padding: 30, color: "#8a7a6a", fontSize: 13 }}>
          Searching for wildflowers near {searchParams.city}…
        </div>
      )}

      {fetched && !loading && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, color: "#6a7a6a" }}>
              <strong>{observations.length} species</strong> observed within {searchParams.radius} mi of {searchParams.city} in the last 30 days
            </div>
            <input
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter by name…"
              style={{ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${COLOR}40`, fontSize: 12, flex: 1, minWidth: 150 }}
            />
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "#8a7a6a", fontSize: 13 }}>
              {observations.length === 0
                ? `No wildflower observations found near ${searchParams.city} in the last 30 days. Try expanding the radius.`
                : "No flowers match your filter."}
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
                {filtered.map(obs => (
                  <FlowerCard key={obs.id} obs={obs}
                    selected={selected?.id === obs.id}
                    onClick={() => setSelected(selected?.id === obs.id ? null : obs)}
                  />
                ))}
              </div>
              {selected && <FlowerDetail obs={selected} />}
            </div>
          )}

          <div style={{ marginTop: 16, fontSize: 11, color: "#8a7a6a", textAlign: "center" }}>
            Observation data from <a href="https://www.inaturalist.org" target="_blank" rel="noopener noreferrer" style={{ color: COLOR }}>iNaturalist</a> · Research-grade observations only
          </div>
        </div>
      )}
    </div>
  );
}
