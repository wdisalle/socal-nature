// ─── API KEYS ────────────────────────────────────────────────────────────────
/* global process */
export const EBIRD_KEY = (() => {
  try { return process.env.REACT_APP_EBIRD_KEY || ""; } catch { return ""; }
})();

// ─── DEFAULTS ────────────────────────────────────────────────────────────────
export const DEFAULT_ZIP = "92614";
export const DEFAULT_LAT = 33.6846;
export const DEFAULT_LNG = -117.8265;
export const DEFAULT_RADIUS_MILES = 25;

// ─── ZIP CODE → COORDS ───────────────────────────────────────────────────────
// Covers major SoCal zip codes. Expand as needed.
export const ZIP_COORDS = {
  "92614": { lat: 33.6846, lng: -117.8265, city: "Irvine" },
  "92612": { lat: 33.6459, lng: -117.8426, city: "Irvine" },
  "92618": { lat: 33.6231, lng: -117.7368, city: "Irvine" },
  "92620": { lat: 33.7214, lng: -117.7631, city: "Irvine" },
  "92660": { lat: 33.6189, lng: -117.8747, city: "Newport Beach" },
  "92651": { lat: 33.5427, lng: -117.7854, city: "Laguna Beach" },
  "92653": { lat: 33.5755, lng: -117.7325, city: "Laguna Hills" },
  "92630": { lat: 33.6839, lng: -117.6895, city: "Lake Forest" },
  "92675": { lat: 33.5028, lng: -117.6625, city: "San Juan Capistrano" },
  "92672": { lat: 33.4300, lng: -117.6119, city: "San Clemente" },
  "92868": { lat: 33.7879, lng: -117.8531, city: "Orange" },
  "92780": { lat: 33.8353, lng: -117.8228, city: "Tustin" },
  "92821": { lat: 33.9178, lng: -117.9045, city: "Brea" },
  "90210": { lat: 34.0901, lng: -118.4065, city: "Beverly Hills" },
  "90025": { lat: 34.0498, lng: -118.4445, city: "West LA" },
  "90291": { lat: 33.9850, lng: -118.4695, city: "Venice" },
  "91101": { lat: 34.1478, lng: -118.1445, city: "Pasadena" },
  "92101": { lat: 32.7270, lng: -117.1598, city: "San Diego" },
  "92103": { lat: 32.7461, lng: -117.1711, city: "Mission Hills" },
  "91942": { lat: 32.7782, lng: -117.0228, city: "La Mesa" },
  "92506": { lat: 33.9425, lng: -117.3961, city: "Riverside" },
  "92354": { lat: 34.0456, lng: -117.2945, city: "Loma Linda" },
  "93001": { lat: 34.2746, lng: -119.2290, city: "Ventura" },
  "93105": { lat: 34.4349, lng: -119.7527, city: "Santa Barbara" },
};

// ─── COLORS ──────────────────────────────────────────────────────────────────
export const TAB_COLORS = {
  hikes:      "#4a7c59",
  camping:    "#2d6a8f",
  birds:      "#1a3a6a",
  wildflowers:"#8f3a6a",
};

// ─── DIFFICULTY COLORS ───────────────────────────────────────────────────────
export const DIFFICULTY_COLOR = {
  "Easy":           "#4a7c59",
  "Easy / Flat":    "#4a7c59",
  "Easy–Moderate":  "#c07a2a",
  "Moderate":       "#c0392b",
};
