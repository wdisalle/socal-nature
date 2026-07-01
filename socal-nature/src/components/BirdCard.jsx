import { useState } from "react";

function PhotoVariants({ photos, color, height = 80 }) {
  const [idx, setIdx] = useState(0);
  if (!photos || photos.length === 0) {
    return (
      <div style={{ width: "100%", height, background: "#e8e0d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 28 }}>🐦</span>
      </div>
    );
  }
  const photo = photos[idx];
  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <img src={photo.url} alt={photo.label}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={e => { e.target.style.display = "none"; }} />
      {photos.length > 1 && (
        <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
          {photos.map((p, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
              style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, border: "none", background: i === idx ? color : "rgba(255,255,255,0.8)", color: i === idx ? "#fff" : "#333", cursor: "pointer", fontWeight: i === idx ? 700 : 400 }}>
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Grid card — compact, used in grids
export function BirdGridCard({ bird, photos, color, onClick, selected }) {
  return (
    <button onClick={onClick}
      style={{ border: `2px solid ${selected ? color : "#e0d8cc"}`, borderRadius: 10, overflow: "hidden", background: selected ? `${color}12` : "#faf8f3", cursor: "pointer", padding: 0, textAlign: "left", transition: "all 0.15s" }}>
      <div style={{ width: "100%", height: 80, overflow: "hidden" }}>
        <PhotoVariants photos={photos} color={color} height={80} />
      </div>
      <div style={{ padding: "7px 9px" }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: "#1a2a1a", lineHeight: 1.2 }}>{bird.name}</div>
        <div style={{ fontSize: 9, color: "#8a7a6a", fontStyle: "italic", marginTop: 2 }}>{bird.sciName}</div>
        {photos.length > 1 && <div style={{ fontSize: 8, color, marginTop: 2 }}>↕ {photos.length} photos</div>}
      </div>
    </button>
  );
}

// Detail panel — expanded view when a bird is selected
export function BirdDetailPanel({ bird, photos, color, inLibrary = true }) {
  const [idx, setIdx] = useState(0);
  const photo = photos?.[idx];

  const audubonSlug = bird.name.toLowerCase().replace(/['']/g, "").replace(/\s+/g, "-");

  return (
    <div style={{ background: `${color}0d`, border: `1.5px solid ${color}40`, borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
      {/* Photo */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ width: 90, height: 72, borderRadius: 8, overflow: "hidden", background: "#e8e0d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {photo ? (
            <img src={photo.url} alt={photo.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
          ) : (
            <span style={{ fontSize: 28 }}>🐦</span>
          )}
        </div>
        {photos?.length > 1 && (
          <div style={{ display: "flex", gap: 3, marginTop: 5, flexWrap: "wrap", maxWidth: 90 }}>
            {photos.map((p, i) => (
              <button key={i} onClick={() => setIdx(i)}
                style={{ fontSize: 9, padding: "2px 5px", borderRadius: 8, border: `1px solid ${i === idx ? color : "#ccc"}`, background: i === idx ? color : "#fff", color: i === idx ? "#fff" : "#555", cursor: "pointer" }}>
                {p.label}
              </button>
            ))}
          </div>
        )}
        {photo?.credit && <div style={{ fontSize: 8, color: "#aaa", marginTop: 3, maxWidth: 90 }}>{photo.credit}</div>}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1a2a1a" }}>{bird.name}</div>
          {!inLibrary && (
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "#f0c040", color: "#7a5a00", fontWeight: 700 }}>
              + Add to Library
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, fontStyle: "italic", color: "#6a7a6a", marginBottom: 7 }}>{bird.sciName}</div>
        {bird.note && <p style={{ margin: "0 0 12px", fontSize: 13, color: "#3a3a3a", lineHeight: 1.6 }}>{bird.note}</p>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href={`https://www.audubon.org/field-guide/bird/${audubonSlug}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: color, color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
            🔍 Audubon Guide →
          </a>
          <a href={`https://ebird.org/species/${bird.speciesCode || ""}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#2d6a8f", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
            📊 eBird →
          </a>
        </div>
      </div>
    </div>
  );
}
