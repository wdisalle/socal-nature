import { useState } from "react";
import HikesTab from "./tabs/HikesTab";
import CampingTab from "./tabs/CampingTab";
import BirdsTab from "./tabs/BirdsTab";
import WildflowersTab from "./tabs/WildflowersTab";
import { TAB_COLORS } from "./constants";

const TABS = [
  { id: "hikes",       label: "Hikes",       emoji: "🥾", color: TAB_COLORS.hikes },
  { id: "camping",     label: "Camping",     emoji: "⛺", color: TAB_COLORS.camping },
  { id: "birds",       label: "Birds",       emoji: "🐦", color: TAB_COLORS.birds },
  { id: "wildflowers", label: "Wildflowers", emoji: "🌸", color: TAB_COLORS.wildflowers },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("hikes");
  const tab = TABS.find(t => t.id === activeTab);

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh", background: "linear-gradient(160deg,#f5f0e8 0%,#e8f0e8 50%,#e8eaf5 100%)", paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#2d5a3d 60%,#1a2a3a 100%)", padding: "24px 20px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "12px 12px" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#a8c8a8", textTransform: "uppercase", marginBottom: 5 }}>Southern California</div>
          <h1 style={{ margin: 0, fontSize: "clamp(22px,5vw,34px)", fontWeight: 400, color: "#f0ede0", lineHeight: 1.2, fontStyle: "italic" }}>
            SoCal <span style={{ fontStyle: "normal", fontWeight: 700, color: tab.color === TAB_COLORS.hikes ? "#7fc99a" : tab.color === TAB_COLORS.camping ? "#7ab8d4" : tab.color === TAB_COLORS.birds ? "#7a9fd4" : "#d47ab8" }}>Nature</span>
          </h1>
          <p style={{ margin: "6px 0 0", color: "#8ab88a", fontSize: 11, letterSpacing: 1 }}>
            Hikes · Camping · Birds · Wildflowers
          </p>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1.5px solid #e0d8cc", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: "12px 4px 10px", border: "none", borderBottom: `3px solid ${activeTab === t.id ? t.color : "transparent"}`,
                background: "transparent", cursor: "pointer", transition: "all 0.15s",
                color: activeTab === t.id ? t.color : "#8a7a6a",
              }}>
              <div style={{ fontSize: 20 }}>{t.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: activeTab === t.id ? 700 : 400, marginTop: 2, letterSpacing: 0.5 }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 14px" }}>
        {activeTab === "hikes"       && <HikesTab />}
        {activeTab === "camping"     && <CampingTab />}
        {activeTab === "birds"       && <BirdsTab />}
        {activeTab === "wildflowers" && <WildflowersTab />}
      </div>

      <style>{`* { box-sizing: border-box; } button:hover { opacity: 0.88; }`}</style>
    </div>
  );
}
