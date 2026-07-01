import { useState, useEffect } from "react";
import { BirdGridCard, BirdDetailPanel } from "../components/BirdCard";
import { HotspotSightings } from "../components/EBirdPanel";
import { DIFFICULTY_COLOR, TAB_COLORS } from "../constants";

const COLOR = TAB_COLORS.hikes;

const hikes = [
  {
    id: 1, name: "San Joaquin Wildlife Sanctuary", location: "Irvine",
    duration: "45 min – 2 hrs", distance: "1–4 mi (your choice)", difficulty: "Easy",
    highlight: "OC's #1 birding hotspot. 325+ species recorded. Sea & Sage Audubon HQ on site. Flat, stroller-friendly paths around managed ponds.",
    terrain: "Paved & dirt, stroller-friendly", parking: "Free",
    color: "#2d6a8f", emoji: "🦆", eBirdHotspot: "L109339", eBirdUrl: "https://ebird.org/hotspot/L109339",
    birds: [
      { name: "Great Blue Heron", sciName: "Ardea herodias", photoKey: "great-blue-heron", note: "Standing nearly 4 ft tall, hard to miss along the pond edges.", audubon: "https://www.audubon.org/field-guide/bird/great-blue-heron" },
      { name: "Black-necked Stilt", sciName: "Himantopus mexicanus", photoKey: "black-necked-stilt", note: "Unmistakable pied bird on absurdly long pink legs. Noisily defends its nest.", audubon: "https://www.audubon.org/field-guide/bird/black-necked-stilt" },
      { name: "American Avocet", sciName: "Recurvirostra americana", photoKey: "american-avocet", note: "Elegant shorebird with a long upturned bill it sweeps side-to-side.", audubon: "https://www.audubon.org/field-guide/bird/american-avocet" },
      { name: "Snowy Egret", sciName: "Egretta thula", photoKey: "snowy-egret", note: "Bright white with yellow feet it uses to stir up fish.", audubon: "https://www.audubon.org/field-guide/bird/snowy-egret" },
      { name: "Osprey", sciName: "Pandion haliaetus", photoKey: "osprey", note: "Fish-hunting raptor that hovers then plunge-dives feet-first into water.", audubon: "https://www.audubon.org/field-guide/bird/osprey" },
      { name: "Least Bell's Vireo", sciName: "Vireo bellii pusillus", photoKey: "least-bells-vireo", note: "Federally endangered. Arrives each May to nest in willows.", audubon: "https://www.audubon.org/field-guide/bird/bells-vireo" },
    ],
  },
  {
    id: 2, name: "Bommer Canyon Preserve", location: "Irvine",
    duration: "30–90 min", distance: "2 mi easy loop or 4.8 mi full", difficulty: "Easy–Moderate",
    highlight: "CA's first National Natural Landmark. Ancient oak & sycamore groves. Roadrunners and Quail sightings common.",
    terrain: "Hard-packed dirt, some gentle hills", parking: "Free at trailhead",
    color: "#8f6a3a", emoji: "🌳", eBirdHotspot: "L757113", eBirdUrl: "https://ebird.org/hotspot/L757113",
    birds: [
      { name: "California Quail", sciName: "Callipepla californica", photoKey: "california-quail", note: "CA state bird! Look for coveys trotting along the trail.", audubon: "https://www.audubon.org/field-guide/bird/california-quail" },
      { name: "Greater Roadrunner", sciName: "Geococcyx californianus", photoKey: "greater-roadrunner", note: "Runs up to 20 mph and eats rattlesnakes. Kids love this one.", audubon: "https://www.audubon.org/field-guide/bird/greater-roadrunner" },
      { name: "Acorn Woodpecker", sciName: "Melanerpes formicivorus", photoKey: "acorn-woodpecker", note: "Clown-faced woodpecker with a raucous waka-waka call.", audubon: "https://www.audubon.org/field-guide/bird/acorn-woodpecker" },
      { name: "White-tailed Kite", sciName: "Elanus leucurus", photoKey: "white-tailed-kite", note: "Ghost-white raptor that hovers like a tiny helicopter over open meadows.", audubon: "https://www.audubon.org/field-guide/bird/white-tailed-kite" },
      { name: "Wrentit", sciName: "Chamaea fasciata", photoKey: "wrentit", note: "Heard far more than seen — its bouncing-ball song defines California chaparral.", audubon: "https://www.audubon.org/field-guide/bird/wrentit" },
    ],
  },
  {
    id: 3, name: "Crystal Cove State Park", location: "Newport Coast",
    duration: "45 min – 2 hrs", distance: "2.2 mi (Moro Canyon loop) or longer", difficulty: "Easy–Moderate",
    highlight: "OC's largest open space with 2,400 acres. Moro Canyon is the best kid-friendly route — creek, oaks, wildlife and ocean views at the top.",
    terrain: "Dirt canyon trail, some incline", parking: "$15/vehicle",
    color: "#4a7c59", emoji: "🌊", eBirdHotspot: "L210238", eBirdUrl: "https://ebird.org/hotspot/L210238",
    birds: [
      { name: "California Towhee", sciName: "Melozone crissalis", photoKey: "california-towhee", note: "Chunky brown bird that scratches loudly in leaf litter.", audubon: "https://www.audubon.org/field-guide/bird/california-towhee" },
      { name: "Anna's Hummingbird", sciName: "Calypte anna", photoKey: "annas-hummingbird", note: "Males flash iridescent magenta-rose heads. Year-round resident.", audubon: "https://www.audubon.org/field-guide/bird/annas-hummingbird" },
      { name: "California Gnatcatcher", sciName: "Polioptila californica", photoKey: "california-gnatcatcher", note: "Federally threatened. Moro Canyon is prime protected habitat.", audubon: "https://www.audubon.org/field-guide/bird/california-gnatcatcher" },
      { name: "Peregrine Falcon", sciName: "Falco peregrinus", photoKey: "peregrine-falcon", note: "World's fastest animal. Nests on coastal cliffs here.", audubon: "https://www.audubon.org/field-guide/bird/peregrine-falcon" },
      { name: "Brown Pelican", sciName: "Pelecanus occidentalis", photoKey: "brown-pelican", note: "Squadrons fly in formation along the coast — visible from the upper ridge.", audubon: "https://www.audubon.org/field-guide/bird/brown-pelican" },
      { name: "Nuttall's Woodpecker", sciName: "Dryobates nuttallii", photoKey: "nuttalls-woodpecker", note: "CA-endemic woodpecker with a rattling call in the canyon oaks.", audubon: "https://www.audubon.org/field-guide/bird/nuttalls-woodpecker" },
    ],
  },
  {
    id: 4, name: "Peters Canyon Regional Park", location: "Orange / Tustin",
    duration: "45–90 min", distance: "2.5 mi (North Loop)", difficulty: "Easy",
    highlight: "54-acre reservoir draws 100+ migratory species. OC Parks hosts free guided birdwatching hikes seasonally.",
    terrain: "Dirt trail, flat to gentle", parking: "$3/vehicle",
    color: "#6a4a8f", emoji: "🏞️", eBirdHotspot: "L285193", eBirdUrl: "https://ebird.org/hotspot/L285193",
    birds: [
      { name: "Cactus Wren", sciName: "Campylorhynchus brunneicapillus", photoKey: "cactus-wren", note: "Largest US wren — loud rattling call. Year-round resident.", audubon: "https://www.audubon.org/field-guide/bird/cactus-wren" },
      { name: "Red-tailed Hawk", sciName: "Buteo jamaicensis", photoKey: "red-tailed-hawk", note: "Watch for its brick-red tail as it soars over the reservoir.", audubon: "https://www.audubon.org/field-guide/bird/red-tailed-hawk" },
      { name: "Western Bluebird", sciName: "Sialia mexicana", photoKey: "western-bluebird", note: "Stunning cobalt blue with rusty chest. Perches on fence posts.", audubon: "https://www.audubon.org/field-guide/bird/western-bluebird" },
      { name: "American Coot", sciName: "Fulica americana", photoKey: "american-coot", note: "Comical black waterbird with white beak. Seen with fuzzy chicks in spring.", audubon: "https://www.audubon.org/field-guide/bird/american-coot" },
      { name: "Cooper's Hawk", sciName: "Accipiter cooperii", photoKey: "coopers-hawk", note: "Fast, nimble hawk seen darting through eucalyptus groves.", audubon: "https://www.audubon.org/field-guide/bird/coopers-hawk" },
    ],
  },
  {
    id: 5, name: "Quail Hill Loop Trail", location: "Irvine",
    duration: "30–60 min", distance: "2.7 mi loop", difficulty: "Easy",
    highlight: "Open space preserve in the heart of Irvine. Great 360° views of city and mountains. Easy wide path, frequent quail sightings.",
    terrain: "Paved & hard-packed dirt, open hills", parking: "Free at Quail Hill Community Park",
    color: "#8f7a2d", emoji: "🌾", eBirdHotspot: "L632002", eBirdUrl: "https://ebird.org/hotspot/L632002",
    birds: [
      { name: "California Quail", sciName: "Callipepla californica", photoKey: "california-quail", note: "The trail is named for these birds — large coveys year-round.", audubon: "https://www.audubon.org/field-guide/bird/california-quail" },
      { name: "Say's Phoebe", sciName: "Sayornis saya", photoKey: "says-phoebe", note: "Tawny-bellied flycatcher on fence posts, bobs its tail.", audubon: "https://www.audubon.org/field-guide/bird/says-phoebe" },
      { name: "White-crowned Sparrow", sciName: "Zonotrichia leucophrys", photoKey: "white-crowned-sparrow", note: "Bold black-and-white striped head. Winters here in large flocks.", audubon: "https://www.audubon.org/field-guide/bird/white-crowned-sparrow" },
      { name: "Northern Harrier", sciName: "Circus hudsonius", photoKey: "northern-harrier", note: "Low-flying hawk with a white rump patch, hunts by sound.", audubon: "https://www.audubon.org/field-guide/bird/northern-harrier" },
      { name: "Loggerhead Shrike", sciName: "Lanius ludovicianus", photoKey: "loggerhead-shrike", note: "Songbird that hunts like a hawk. Nicknamed 'butcherbird.'", audubon: "https://www.audubon.org/field-guide/bird/loggerhead-shrike" },
    ],
  },
  {
    id: 6, name: "Laguna Coast Wilderness", location: "Laguna Beach / Irvine",
    duration: "45 min – 1.5 hrs", distance: "2–3.5 mi", difficulty: "Easy–Moderate",
    highlight: "One of the last intact coastal sage scrub ecosystems in SoCal. Free Saturday naturalist-led walks.",
    terrain: "Dirt trail, some rocky sections", parking: "Free at Nix Nature Center (weekends)",
    color: "#5a8f3a", emoji: "🦋", eBirdHotspot: "L3135598", eBirdUrl: "https://ebird.org/hotspot/L3135598",
    birds: [
      { name: "Wrentit", sciName: "Chamaea fasciata", photoKey: "wrentit", note: "The voice of the chaparral. Almost never leaves dense brush.", audubon: "https://www.audubon.org/field-guide/bird/wrentit" },
      { name: "Costa's Hummingbird", sciName: "Calypte costae", photoKey: "costas-hummingbird", note: "Male has a stunning purple gorget that flares like a mustache.", audubon: "https://www.audubon.org/field-guide/bird/costas-hummingbird" },
      { name: "Rufous-crowned Sparrow", sciName: "Aimophila ruficeps", photoKey: "rufous-crowned-sparrow", note: "Shy sparrow of rocky slopes. Rusty cap and 'dear dear dear' call.", audubon: "https://www.audubon.org/field-guide/bird/rufous-crowned-sparrow" },
      { name: "California Gnatcatcher", sciName: "Polioptila californica", photoKey: "california-gnatcatcher", note: "Federally threatened. One of its last strongholds in OC.", audubon: "https://www.audubon.org/field-guide/bird/california-gnatcatcher" },
      { name: "Greater Roadrunner", sciName: "Geococcyx californianus", photoKey: "greater-roadrunner", note: "Spotted regularly trotting along trail edges. Eats lizards and snakes.", audubon: "https://www.audubon.org/field-guide/bird/greater-roadrunner" },
    ],
  },
  {
    id: 7, name: "O'Neill Regional Park", location: "Trabuco Canyon",
    duration: "30 min – 2 hrs", distance: "1–3.5 mi (your choice)", difficulty: "Easy",
    highlight: "Closest canyon park to Irvine. Riparian oak woodland along Trabuco Creek — excellent for birding the creek corridor. Shaded, family-friendly trails.",
    terrain: "Dirt trail, flat to gentle", parking: "$3/vehicle",
    color: "#3a7a8f", emoji: "🌲", eBirdHotspot: "L374421", eBirdUrl: "https://ebird.org/hotspot/L374421",
    birds: [
      { name: "Yellow Warbler", sciName: "Setophaga petechia", photoKey: "yellow-warbler", note: "Bright lemon-yellow songbird that favors streamside willows. Summer breeder along Trabuco Creek.", audubon: "https://www.audubon.org/field-guide/bird/yellow-warbler" },
      { name: "Black Phoebe", sciName: "Sayornis nigricans", photoKey: "black-phoebe", note: "Sooty black-and-white flycatcher near water, constantly flicking its tail.", audubon: "https://www.audubon.org/field-guide/bird/black-phoebe" },
      { name: "Hooded Oriole", sciName: "Icterus cucullatus", photoKey: "hooded-oriole", note: "Vivid orange-and-black oriole drawn to palm trees and riparian groves.", audubon: "https://www.audubon.org/field-guide/bird/hooded-oriole" },
      { name: "California Towhee", sciName: "Melozone crissalis", photoKey: "california-towhee", note: "Plain brown bird scratching loudly in leaf litter near trailheads.", audubon: "https://www.audubon.org/field-guide/bird/california-towhee" },
      { name: "Bewick's Wren", sciName: "Thryomanes bewickii", photoKey: "bewickss-wren", note: "Energetic little wren with a bold white eyebrow stripe and complex song.", audubon: "https://www.audubon.org/field-guide/bird/bewicks-wren" },
    ],
  },
];

export default function HikesTab() {
  const [activeHike, setActiveHike] = useState(hikes[0]);
  const [activeBird, setActiveBird] = useState(null);
  const [birdPhotos, setBirdPhotos] = useState({});

  useEffect(() => {
    fetch("/birds.json")
      .then(r => r.json())
      .then(data => {
        const photos = {};
        for (const [key, val] of Object.entries(data)) {
          if (key !== "_readme") photos[key] = val.photos || [];
        }
        setBirdPhotos(photos);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Trail selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {hikes.map(h => (
          <button key={h.id} onClick={() => { setActiveHike(h); setActiveBird(null); }}
            style={{ flex: "1 1 130px", padding: "12px 14px", border: `2px solid ${activeHike.id === h.id ? h.color : "#d0c8b8"}`, borderRadius: 10, background: activeHike.id === h.id ? h.color : "#faf8f3", color: activeHike.id === h.id ? "#fff" : "#3a3028", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
            <div style={{ fontSize: 18, marginBottom: 3 }}>{h.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{h.name}</div>
            <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{h.location}</div>
          </button>
        ))}
      </div>

      {/* Trail card */}
      <div style={{ background: "#fff", borderRadius: 14, border: `2px solid ${activeHike.color}30`, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
        <div style={{ background: `${activeHike.color}15`, borderBottom: `1px solid ${activeHike.color}25`, padding: "18px 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <h2 style={{ margin: "0 0 5px", fontSize: 18, color: "#1a2a1a", fontWeight: 700 }}>{activeHike.emoji} {activeHike.name}</h2>
              <p style={{ margin: 0, fontSize: 13, color: "#4a5a4a", lineHeight: 1.5 }}>{activeHike.highlight}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11 }}>
              {[["⏱", activeHike.duration], ["📍", activeHike.distance], ["🥾", activeHike.terrain], ["🅿️", activeHike.parking]].map(([icon, val]) => (
                <div key={val} style={{ background: "#fff", border: `1px solid ${activeHike.color}40`, borderRadius: 20, padding: "4px 10px", whiteSpace: "nowrap", color: "#3a3028" }}>{icon} {val}</div>
              ))}
              <div style={{ background: DIFFICULTY_COLOR[activeHike.difficulty] || "#888", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{activeHike.difficulty}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "18px 20px" }}>
          {/* eBird sightings */}
          <HotspotSightings hotspotId={activeHike.eBirdHotspot} hotspotUrl={activeHike.eBirdUrl} color={activeHike.color} />

          {/* Bird grid */}
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#8a7a6a", marginBottom: 12 }}>
            Featured Birds ({activeHike.birds.length} species)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
            {activeHike.birds.map(bird => (
              <BirdGridCard key={bird.name} bird={bird}
                photos={birdPhotos[bird.photoKey] || []}
                color={activeHike.color}
                selected={activeBird?.name === bird.name}
                onClick={() => setActiveBird(activeBird?.name === bird.name ? null : bird)}
              />
            ))}
          </div>

          {/* Bird detail */}
          {activeBird && (
            <div style={{ marginTop: 14 }}>
              <BirdDetailPanel bird={activeBird} photos={birdPhotos[activeBird.photoKey] || []} color={activeHike.color} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
