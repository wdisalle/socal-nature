import { useState } from "react";
import { ZIP_COORDS, DEFAULT_ZIP, DEFAULT_RADIUS_MILES } from "../constants";

export default function ZipSearch({ onSearch, color, loading }) {
  const [zip, setZip] = useState(DEFAULT_ZIP);
  const [radius, setRadius] = useState(DEFAULT_RADIUS_MILES);
  const [error, setError] = useState("");
  const [useLocation, setUseLocation] = useState(false);

  function handleZipSearch(e) {
    e.preventDefault();
    setError("");
    const coords = ZIP_COORDS[zip.trim()];
    if (!coords) {
      setError(`Zip code ${zip} not found. Try a major SoCal zip.`);
      return;
    }
    onSearch({ ...coords, radius, zip });
  }

  function handleGeoSearch() {
    setError("");
    setUseLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUseLocation(false);
        onSearch({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          city: "Your Location",
          radius,
          zip: null,
        });
      },
      () => {
        setUseLocation(false);
        setError("Could not get your location. Try entering a zip code.");
      }
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${color}30`, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8a7a6a", marginBottom: 10 }}>
        Search Area
      </div>
      <form onSubmit={handleZipSearch} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: "#6a7a6a", marginBottom: 4 }}>Zip Code</div>
          <input
            value={zip}
            onChange={e => setZip(e.target.value)}
            maxLength={5}
            placeholder="92614"
            style={{ width: 90, padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${color}40`, fontSize: 13, fontFamily: "monospace" }}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6a7a6a", marginBottom: 4 }}>Radius: {radius} mi</div>
          <input
            type="range" min={10} max={100} step={5}
            value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            style={{ width: 120, accentColor: color }}
          />
        </div>
        <button type="submit" disabled={loading}
          style={{ padding: "7px 16px", borderRadius: 20, border: "none", background: color, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          {loading ? "Searching…" : "Search"}
        </button>
        {"geolocation" in navigator && (
          <button type="button" onClick={handleGeoSearch} disabled={useLocation || loading}
            style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${color}`, background: "#fff", color: color, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {useLocation ? "Getting location…" : "📍 Use My Location"}
          </button>
        )}
      </form>
      {error && <div style={{ marginTop: 8, fontSize: 12, color: "#c0392b" }}>{error}</div>}
    </div>
  );
}
