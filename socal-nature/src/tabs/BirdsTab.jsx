import { useState, useEffect } from "react";
import { NearbyBirdSightings } from "../components/EBirdPanel";
import { BirdGridCard, BirdDetailPanel } from "../components/BirdCard";
import ZipSearch from "../components/ZipSearch";
import { TAB_COLORS, DEFAULT_ZIP, DEFAULT_LAT, DEFAULT_LNG, DEFAULT_RADIUS_MILES, ZIP_COORDS, EBIRD_KEY } from "../constants";

const COLOR = TAB_COLORS.birds;

export default function BirdsTab() {
  const [birdLibrary, setBirdLibrary] = useState({});
  const [searchParams, setSearchParams] = useState({
    lat: DEFAULT_LAT, lng: DEFAULT_LNG,
    city: ZIP_COORDS[DEFAULT_ZIP].city,
    radius: DEFAULT_RADIUS_MILES, zip: DEFAULT_ZIP,
  });
  const [activeBird, setActiveBird] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [viewMode, setViewMode] = useState("nearby"); // "nearby" | "library"

  // Load curated bird library
  useEffect(() => {
    fetch("/birds.json")
      .then(r => r.json())
      .then(data => {
        const lib = {};
        for (const [key, val] of Object.entries(data)) {
          if (key !== "_readme") lib[key] = val;
        }
        setBirdLibrary(lib);
      })
      .catch(() => {});
  }, []);

  // Fetch nearby eBird sightings
  const { sightings, loading, fetched } = NearbyBirdSightings({
    lat: searchParams.lat,
    lng: searchParams.lng,
    radiusMiles: searchParams.radius,
  });

  // Deduplicate sightings by species
  const uniqueSightings = [];
  const seen = new Set();
  for (const s of sightings) {
    if (!seen.has(s.speciesCode)) {
      seen.add(s.speciesCode);
      uniqueSightings.push(s);
    }
  }

  // Match eBird sightings to library
  const libraryNames = new Set(
    Object.values(birdLibrary).map(b => b.commonName?.toLowerCase())
  );

  const inLibrary = uniqueSightings.filter(s => libraryNames.has(s.comName?.toLowerCase()));
  const notInLibrary = uniqueSightings.filter(s => !libraryNames.has(s.comName?.toLowerCase()));

  // Library browse — all curated birds filtered by search
  const libraryEntries = Object.entries(birdLibrary).filter(([, val]) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return val.commonName?.toLowerCase().includes(q) || val.sciName?.toLowerCase().includes(q);
  });

  function getBirdFromLibraryBySighting(sighting) {
    const entry = Object.entries(birdLibrary).find(
      ([, val]) => val.commonName?.toLowerCase() === sighting.comName?.toLowerCase()
    );
    if (!entry) return null;
    const [key, val] = entry;
    return { key, ...val };
  }

  return (
    <div>
      {/* Search */}
      <ZipSearch
        color={COLOR}
        loading={loading}
        onSearch={params => { setSearchParams(params); setActiveBird(null); }}
      />

      {/* View toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["nearby", "📍 Nearby Sightings"], ["library", "📚 Browse Library"]].map(([mode, label]) => (
          <button key={mode} onClick={() => { setViewMode(mode); setActiveBird(null); }}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 20, border: `2px solid ${viewMode === mode ? COLOR : "#d0c8b8"}`, background: viewMode === mode ? COLOR : "#faf8f3", color: viewMode === mode ? "#fff" : "#3a3028", cursor: "pointer", fontWeight: viewMode === mode ? 700 : 400, fontSize: 12 }}>
            {label}
          </button>
        ))}
      </div>

      {/* NEARBY VIEW */}
      {viewMode === "nearby" && (
        <div>
          {!EBIRD_KEY && (
            <div style={{ background: "#fff8e8", border: "1.5px solid #c07a2a", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#7a5a00", marginBottom: 12 }}>
              ⚠️ Add <strong>REACT_APP_EBIRD_KEY</strong> on Vercel to enable live nearby sightings.
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: 30, color: "#8a7a6a", fontSize: 13 }}>
              Searching for birds near {searchParams.city}…
            </div>
          )}

          {fetched && !loading && uniqueSightings.length === 0 && (
            <div style={{ textAlign: "center", padding: 30, color: "#8a7a6a", fontSize: 13 }}>
              No sightings found in the last 14 days within {searchParams.radius} miles of {searchParams.city}.
            </div>
          )}

          {fetched && uniqueSightings.length > 0 && (
            <div>
              <div style={{ fontSize: 12, color: "#6a7a6a", marginBottom: 14 }}>
                <strong>{uniqueSightings.length} species</strong> spotted within {searchParams.radius} mi of {searchParams.city} in the last 14 days
                · <span style={{ color: COLOR }}>{inLibrary.length} in your library</span>
                · <span style={{ color: "#c07a2a" }}>{notInLibrary.length} not yet in library</span>
              </div>

              {/* In library */}
              {inLibrary.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8a7a6a", marginBottom: 10 }}>
                    In Your Library ({inLibrary.length})
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
                    {inLibrary.map(s => {
                      const lib = getBirdFromLibraryBySighting(s);
                      const photoKey = lib ? Object.keys(birdLibrary).find(k => birdLibrary[k].commonName?.toLowerCase() === s.comName?.toLowerCase()) : null;
                      const photos = photoKey ? (birdLibrary[photoKey]?.photos || []) : [];
                      const bird = { name: s.comName, sciName: s.sciName, speciesCode: s.speciesCode };
                      return (
                        <BirdGridCard key={s.speciesCode} bird={bird} photos={photos} color={COLOR}
                          selected={activeBird?.speciesCode === s.speciesCode}
                          onClick={() => setActiveBird(activeBird?.speciesCode === s.speciesCode ? null : { ...bird, photos })}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Not in library */}
              {notInLibrary.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8a7a6a", marginBottom: 10 }}>
                    Not Yet in Library — flag to add ({notInLibrary.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {notInLibrary.map(s => (
                      <button key={s.speciesCode}
                        onClick={() => setActiveBird(activeBird?.speciesCode === s.speciesCode ? null : { name: s.comName, sciName: s.sciName, speciesCode: s.speciesCode, photos: [] })}
                        style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${activeBird?.speciesCode === s.speciesCode ? "#c07a2a" : "#e0d8cc"}`, background: activeBird?.speciesCode === s.speciesCode ? "#c07a2a15" : "#faf8f3", color: "#3a3028", cursor: "pointer", fontWeight: 600 }}>
                        🐦 {s.comName}
                        <span style={{ fontSize: 9, background: "#f0c040", color: "#7a5a00", borderRadius: 8, padding: "1px 5px", marginLeft: 5, fontWeight: 700 }}>+ Add</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Detail panel */}
              {activeBird && (
                <div style={{ marginTop: 14 }}>
                  <BirdDetailPanel
                    bird={activeBird}
                    photos={activeBird.photos || []}
                    color={COLOR}
                    inLibrary={libraryNames.has(activeBird.name?.toLowerCase())}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LIBRARY VIEW */}
      {viewMode === "library" && (
        <div>
          <input
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search by name or scientific name…"
            style={{ width: "100%", padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${COLOR}40`, fontSize: 13, marginBottom: 14, boxSizing: "border-box" }}
          />
          {libraryEntries.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "#8a7a6a", fontSize: 13 }}>No birds match your search.</div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, marginBottom: 14 }}>
                {libraryEntries.map(([key, val]) => {
                  const bird = { name: val.commonName, sciName: val.sciName };
                  return (
                    <BirdGridCard key={key} bird={bird} photos={val.photos || []} color={COLOR}
                      selected={activeBird?.name === val.commonName}
                      onClick={() => setActiveBird(activeBird?.name === val.commonName ? null : { ...bird, note: val.note })}
                    />
                  );
                })}
              </div>
              {activeBird && (
                <BirdDetailPanel
                  bird={activeBird}
                  photos={birdLibrary[Object.keys(birdLibrary).find(k => birdLibrary[k].commonName === activeBird.name)]?.photos || []}
                  color={COLOR}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
