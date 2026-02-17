import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Filter,
  MessageSquare,
  CheckCircle,
  Users,
  Briefcase,
  Clock,
  ChevronDown,
  Settings,
  Search,
  Star,
  X,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

// ─── Color tokens ──────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#22252e",
  panel: "#1e2129",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#c9a961",
  goldDim: "rgba(201,169,97,0.12)",
  border: "rgba(201,169,97,0.10)",
  inputBorder: "rgba(255,255,255,0.08)",
  muted: "#5a6e7d",
};

const NEARBY_ARTISTS = [
  {
    id: 1,
    name: "Marcus Lee",
    photo:
      "https://images.unsplash.com/photo-1699269266070-97882aaf9fec?w=600&q=80",
    primarySkill: "Choreographer",
    specialties: ["Contemporary", "Hip Hop", "Ballroom"],
    distance: 2.3,
    availability: "Available Now",
    rating: 4.8,
    projectsCompleted: 24,
    responseTime: "Within 2 hours",
    bio: "Professional choreographer specializing in contemporary fusion with 8+ years in theater and film productions.",
    location: "Los Angeles, CA",
  },
  {
    id: 2,
    name: "Alex Rivera",
    photo:
      "https://images.unsplash.com/photo-1768885511762-4f8a888b0a6f?w=600&q=80",
    primarySkill: "Cinematographer",
    specialties: ["Color Grading", "Lighting", "Drone"],
    distance: 4.7,
    availability: "Available Now",
    rating: 5.0,
    projectsCompleted: 56,
    responseTime: "Within 1 hour",
    bio: "Award-winning cinematographer with 10+ years experience crafting visual narratives for top studios.",
    location: "Los Angeles, CA",
  },
  {
    id: 3,
    name: "Emma Chen",
    photo:
      "https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?w=600&q=80",
    primarySkill: "Makeup Artist",
    specialties: ["Special Effects", "Period", "Beauty"],
    distance: 5.2,
    availability: "Available This Week",
    rating: 4.7,
    projectsCompleted: 42,
    responseTime: "Within 4 hours",
    bio: "Versatile makeup artist for film and theater productions. Skilled in transformative FX.",
    location: "Los Angeles, CA",
  },
  {
    id: 4,
    name: "Jordan White",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    primarySkill: "Film Director",
    specialties: ["Indie Films", "Documentaries", "Music Videos"],
    distance: 6.8,
    availability: "Booking Ahead",
    rating: 4.9,
    projectsCompleted: 31,
    responseTime: "Within 8 hours",
    bio: "Independent filmmaker passionate about authentic storytelling and human connection.",
    location: "Los Angeles, CA",
  },
  {
    id: 5,
    name: "Sofia Martinez",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    primarySkill: "Singer",
    specialties: ["Jazz", "Soul", "R&B"],
    distance: 7.5,
    availability: "Available Now",
    rating: 4.8,
    projectsCompleted: 38,
    responseTime: "Within 3 hours",
    bio: "Professional vocalist for studio recordings and live performances across multiple genres.",
    location: "Los Angeles, CA",
  },
  {
    id: 6,
    name: "David Kim",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    primarySkill: "Sound Designer",
    specialties: ["Post Production", "Foley", "Mixing"],
    distance: 8.9,
    availability: "Available This Week",
    rating: 4.9,
    projectsCompleted: 47,
    responseTime: "Within 2 hours",
    bio: "Sound design specialist for film and television with credits on major streaming productions.",
    location: "Los Angeles, CA",
  },
  {
    id: 7,
    name: "Rachel Green",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
    primarySkill: "Costume Designer",
    specialties: ["Period Costumes", "Contemporary", "Fantasy"],
    distance: 9.3,
    availability: "Available Now",
    rating: 4.7,
    projectsCompleted: 29,
    responseTime: "Within 6 hours",
    bio: "Creative costume designer with theatrical background and extensive period production experience.",
    location: "Los Angeles, CA",
  },
  {
    id: 8,
    name: "Michael Chen",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    primarySkill: "Film Editor",
    specialties: ["Narrative", "Documentary", "Color Correction"],
    distance: 11.2,
    availability: "Booking Ahead",
    rating: 4.8,
    projectsCompleted: 52,
    responseTime: "Within 12 hours",
    bio: "Post-production editor with expertise in narrative storytelling and documentary crafts.",
    location: "Los Angeles, CA",
  },
];

const SKILL_FILTERS = [
  "All Skills",
  "Actor",
  "Dancer",
  "Singer",
  "Choreographer",
  "Cinematographer",
  "Film Director",
  "Makeup Artist",
  "Costume Designer",
  "Sound Designer",
  "Film Editor",
  "Videographer",
];

const AVAILABILITY_OPTIONS = [
  "All",
  "Available Now",
  "Available This Week",
  "Booking Ahead",
];

const AVAIL_STYLE = {
  "Available Now": {
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.22)",
    color: "#22c55e",
  },
  "Available This Week": {
    bg: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.22)",
    color: "#3b82f6",
  },
  "Booking Ahead": {
    bg: "rgba(234,179,8,0.10)",
    border: "rgba(234,179,8,0.22)",
    color: "#eab308",
  },
};

// ── Custom Toggle ──────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 border-0 outline-none cursor-pointer transition-all duration-300"
      style={{
        width: 42,
        height: 24,
        borderRadius: 9999,
        background: checked ? C.gold : "rgba(255,255,255,0.10)",
      }}
    >
      <span
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full"
        style={{
          background: "#fff",
          left: checked ? "21px" : "3px",
          transition: "left 0.22s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

// ── Custom Select ──────────────────────────────────────────────
function NativeSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl text-[13.5px] appearance-none cursor-pointer outline-none"
        style={{
          background: C.bg,
          border: `1px solid ${C.inputBorder}`,
          color: C.darkText,
          padding: "10px 36px 10px 14px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,97,0.4)")}
        onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#1e2129" }}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: C.lightText }}
      />
    </div>
  );
}

// ── Privacy Modal ──────────────────────────────────────────────
function PrivacyModal({ privacy, setPrivacy, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center px-4"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        background: "rgba(10,12,16,0.60)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl p-7"
        style={{
          background: "#22252e",
          border: `1px solid rgba(201,169,97,0.18)`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          animation: "modalIn 0.28s cubic-bezier(0.34,1.3,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)", color: C.lightText }}
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <h2
          className="text-[19px] font-bold mb-1"
          style={{ color: C.darkText }}
        >
          Privacy Settings
        </h2>
        <p className="text-[13px] mb-6" style={{ color: C.muted }}>
          Control how you appear to other artists
        </p>
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 20,
          }}
        />

        {[
          {
            key: "showLocation",
            label: "Show My Location",
            desc: "Allow other artists to see your approximate location",
          },
          {
            key: "showOnlineStatus",
            label: "Show Online Status",
            desc: "Display when you're active on the platform",
          },
          {
            key: "allowConnectionRequests",
            label: "Allow Connection Requests",
            desc: "Let other artists send you connection requests",
          },
        ].map(({ key, label, desc }, i) => (
          <div
            key={key}
            className={`flex items-center justify-between gap-4 ${i < 2 ? "mb-5" : "mb-6"}`}
          >
            <div>
              <p
                className="text-[14px] font-semibold mb-[2px]"
                style={{ color: C.darkText }}
              >
                {label}
              </p>
              <p className="text-[12.5px]" style={{ color: C.muted }}>
                {desc}
              </p>
            </div>
            <Toggle
              checked={privacy[key]}
              onChange={(v) => setPrivacy((p) => ({ ...p, [key]: v }))}
            />
          </div>
        ))}

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 16,
          }}
        />
        <p className="text-[12px] mb-5" style={{ color: C.muted }}>
          These settings help you control your visibility. Your exact address is
          never shared.
        </p>
        <button
          onClick={onClose}
          className="w-full py-[12px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${C.gold}, #d4b96e)`,
            color: "#1a1d24",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

// ── Connect Modal ──────────────────────────────────────────────
function ConnectModal({ artist, onClose, onSend }) {
  const [msg, setMsg] = useState("");
  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center px-4"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        background: "rgba(10,12,16,0.60)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px] rounded-2xl p-7"
        style={{
          background: "#22252e",
          border: `1px solid rgba(201,169,97,0.18)`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          animation: "modalIn 0.28s cubic-bezier(0.34,1.3,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)", color: C.lightText }}
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <h2
          className="text-[19px] font-bold mb-1"
          style={{ color: C.darkText }}
        >
          Send Connection Request
        </h2>
        <p className="text-[13px] mb-5" style={{ color: C.muted }}>
          Introduce yourself to {artist.name}
        </p>

        {/* Artist preview */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-5"
          style={{ background: C.bg }}
        >
          <img
            src={artist.photo}
            alt={artist.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <p
              className="text-[14px] font-semibold"
              style={{ color: C.darkText }}
            >
              {artist.name}
            </p>
            <p className="text-[12.5px]" style={{ color: C.gold }}>
              {artist.primarySkill}
            </p>
          </div>
        </div>

        <label
          className="block text-[12.5px] font-semibold mb-2"
          style={{ color: C.lightText }}
        >
          Message{" "}
          <span style={{ color: C.muted, fontWeight: 400 }}>(Optional)</span>
        </label>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={4}
          placeholder="Hi! I'd love to connect and explore collaboration opportunities..."
          className="w-full rounded-xl text-[13.5px] resize-none outline-none mb-2"
          style={{
            background: C.bg,
            border: `1px solid ${C.inputBorder}`,
            color: C.darkText,
            padding: "11px 14px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(201,169,97,0.45)")
          }
          onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
        />
        <p className="text-[12px] mb-5" style={{ color: C.muted }}>
          A thoughtful message increases your chances of connecting
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onSend();
              onClose();
            }}
            className="py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, #d4b96e)`,
              color: "#1a1d24",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Send Request
          </button>
          <button
            onClick={onClose}
            className="py-[11px] rounded-xl text-[13.5px] font-semibold border-0 outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${C.inputBorder}`,
              color: C.darkText,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArtistNearby() {
  const navigate = useNavigate();
  const [distanceRadius, setDistanceRadius] = useState(15);
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectArtist, setConnectArtist] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacy, setPrivacy] = useState({
    showLocation: true,
    showOnlineStatus: true,
    allowConnectionRequests: true,
  });

  const filtered = NEARBY_ARTISTS.filter((a) => {
    const matchDist = a.distance <= distanceRadius;
    const matchSkill =
      skillFilter === "All Skills" || a.primarySkill === skillFilter;
    const matchAvail =
      availabilityFilter === "All" || a.availability === availabilityFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.primarySkill.toLowerCase().includes(q) ||
      a.specialties.some((s) => s.toLowerCase().includes(q));
    return matchDist && matchSkill && matchAvail && matchSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .nb-card { animation: fadeUp 0.3s ease both; transition: border-color 0.2s, box-shadow 0.2s; }
        .nb-card:hover { border-color: rgba(201,169,97,0.30) !important; box-shadow: 0 6px 28px rgba(0,0,0,0.3); }
        .nb-btn-primary { transition: opacity 0.15s, transform 0.15s; }
        .nb-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .nb-btn-outline { transition: border-color 0.15s, color 0.15s; }
        .nb-btn-outline:hover { border-color: rgba(201,169,97,0.45) !important; color: #c9a961 !important; }
        .range-input { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:9999px; background: linear-gradient(to right, #c9a961 0%, #c9a961 var(--val), rgba(255,255,255,0.10) var(--val), rgba(255,255,255,0.10) 100%); outline:none; cursor:pointer; }
        .range-input::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#c9a961; cursor:pointer; box-shadow:0 1px 6px rgba(0,0,0,0.4); }
        .range-input::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#c9a961; cursor:pointer; border:none; }
      `}</style>

      <Sidebar />

      {connectArtist && (
        <ConnectModal
          artist={connectArtist}
          onClose={() => setConnectArtist(null)}
          onSend={() => {}}
        />
      )}
      {showPrivacy && (
        <PrivacyModal
          privacy={privacy}
          setPrivacy={setPrivacy}
          onClose={() => setShowPrivacy(false)}
        />
      )}

      <div
        className="lg:ml-[248px] min-h-screen"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="px-8 py-8 max-w-[1100px]">
          {/* ── Header ── */}
          <div
            className="flex items-center gap-4 mb-7"
            style={{ animation: "fadeUp 0.3s ease both" }}
          >
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="flex items-center justify-center w-9 h-9 rounded-xl border-0 outline-none cursor-pointer transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: C.darkText,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <div className="flex-1">
              <h1
                className="text-[28px] font-bold leading-tight"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Nearby Artists
              </h1>
              <p
                className="text-[13.5px] mt-[2px]"
                style={{ color: C.lightText }}
              >
                Connect with artists in your area for collaboration
                opportunities
              </p>
            </div>
            <button
              onClick={() => setShowPrivacy(true)}
              className="nb-btn-outline flex items-center gap-2 px-4 py-[9px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
              style={{
                background: C.card,
                border: `1px solid ${C.inputBorder}`,
                color: C.darkText,
              }}
            >
              <Settings size={15} strokeWidth={2} />
              Privacy
            </button>
          </div>

          {/* ── Filters ── */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              animation: "fadeUp 0.32s 0.04s ease both",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Filter size={16} style={{ color: C.gold }} />
              <h2
                className="text-[15px] font-bold"
                style={{ color: C.darkText }}
              >
                Filters
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12.5px] font-semibold"
                  style={{ color: C.lightText }}
                >
                  Search
                </label>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: C.lightText }}
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name or skill..."
                    className="w-full rounded-xl text-[13.5px] outline-none"
                    style={{
                      background: C.bg,
                      border: `1px solid ${C.inputBorder}`,
                      color: C.darkText,
                      padding: "10px 14px 10px 36px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(201,169,97,0.4)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
                  />
                </div>
              </div>
              {/* Skill */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12.5px] font-semibold"
                  style={{ color: C.lightText }}
                >
                  Primary Skill
                </label>
                <NativeSelect
                  value={skillFilter}
                  onChange={setSkillFilter}
                  options={SKILL_FILTERS}
                />
              </div>
              {/* Availability */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12.5px] font-semibold"
                  style={{ color: C.lightText }}
                >
                  Availability
                </label>
                <NativeSelect
                  value={availabilityFilter}
                  onChange={setAvailabilityFilter}
                  options={AVAILABILITY_OPTIONS}
                />
              </div>
              {/* Distance */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12.5px] font-semibold"
                  style={{ color: C.lightText }}
                >
                  Distance:{" "}
                  <span style={{ color: C.gold }}>{distanceRadius} miles</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={distanceRadius}
                  onChange={(e) => setDistanceRadius(Number(e.target.value))}
                  className="range-input mt-1"
                  style={{ "--val": `${(distanceRadius / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Count ── */}
          <p
            className="text-[13px] mb-5"
            style={{
              color: C.lightText,
              animation: "fadeUp 0.34s 0.08s ease both",
            }}
          >
            Found{" "}
            <span style={{ color: C.darkText, fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            artists nearby
          </p>

          {/* ── Artist Cards ── */}
          <div className="flex flex-col gap-4">
            {filtered.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <Users
                  size={40}
                  strokeWidth={1.2}
                  className="mx-auto mb-3"
                  style={{ color: "rgba(201,169,97,0.25)" }}
                />
                <p
                  className="text-[15px] font-semibold mb-1"
                  style={{ color: C.darkText }}
                >
                  No artists found
                </p>
                <p className="text-[13px] mb-5" style={{ color: C.lightText }}>
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={() => {
                    setSkillFilter("All Skills");
                    setAvailabilityFilter("All");
                    setDistanceRadius(15);
                    setSearchQuery("");
                  }}
                  className="px-5 py-[9px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: `1px solid ${C.inputBorder}`,
                    color: C.darkText,
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filtered.map((artist, i) => {
                const avail = AVAIL_STYLE[artist.availability] || {};
                return (
                  <div
                    key={artist.id}
                    className="nb-card rounded-2xl overflow-hidden flex flex-col md:flex-row"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      animationDelay: `${0.08 + i * 0.05}s`,
                    }}
                  >
                    {/* Photo */}
                    <div
                      className="relative w-full md:w-[200px] flex-shrink-0"
                      style={{ minHeight: 200 }}
                    >
                      <img
                        src={artist.photo}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        style={{ minHeight: 200 }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
                        }}
                      />
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-[11.5px] font-medium"
                          style={{
                            background: "rgba(0,0,0,0.6)",
                            backdropFilter: "blur(6px)",
                            color: "#fff",
                          }}
                        >
                          <MapPin size={11} />
                          {artist.distance.toFixed(1)} mi away
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3
                              className="text-[18px] font-bold"
                              style={{ color: C.darkText }}
                            >
                              {artist.name}
                            </h3>
                            {artist.rating >= 4.8 && (
                              <span
                                className="flex items-center gap-1 px-2 py-[2px] rounded-full text-[11px] font-semibold"
                                style={{
                                  background: C.goldDim,
                                  color: C.gold,
                                  border: `1px solid rgba(201,169,97,0.22)`,
                                }}
                              >
                                <CheckCircle size={11} /> Top Rated
                              </span>
                            )}
                          </div>
                          <p
                            className="text-[13.5px] font-semibold mb-2"
                            style={{ color: C.gold }}
                          >
                            {artist.primarySkill}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {artist.specialties.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-[10px] py-[3px] rounded-full text-[11.5px]"
                                style={{
                                  background: "rgba(255,255,255,0.05)",
                                  border: `1px solid ${C.inputBorder}`,
                                  color: C.lightText,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span
                          className="flex-shrink-0 px-3 py-[4px] rounded-full text-[11.5px] font-semibold border"
                          style={{
                            background: avail.bg,
                            borderColor: avail.border,
                            color: avail.color,
                          }}
                        >
                          {artist.availability}
                        </span>
                      </div>

                      <p
                        className="text-[13px] mb-4 line-clamp-2"
                        style={{ color: C.lightText }}
                      >
                        {artist.bio}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 mb-5">
                        <div
                          className="flex items-center gap-1.5 text-[12.5px]"
                          style={{ color: C.lightText }}
                        >
                          <Star size={13} style={{ color: C.gold }} />
                          <span style={{ color: C.darkText, fontWeight: 600 }}>
                            {artist.rating}
                          </span>{" "}
                          rating
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-[12.5px]"
                          style={{ color: C.lightText }}
                        >
                          <Briefcase size={13} />
                          {artist.projectsCompleted} projects
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-[12.5px]"
                          style={{ color: C.lightText }}
                        >
                          <Clock size={13} />
                          {artist.responseTime}
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-[12.5px]"
                          style={{ color: C.lightText }}
                        >
                          <MapPin size={13} />
                          {artist.location}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setConnectArtist(artist)}
                          className="nb-btn-primary flex items-center gap-2 px-5 py-[9px] rounded-xl text-[13px] font-bold border-0 outline-none cursor-pointer"
                          style={{
                            background: `linear-gradient(135deg, ${C.gold}, #d4b96e)`,
                            color: "#1a1d24",
                          }}
                        >
                          <Users size={14} strokeWidth={2.2} /> Connect
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/artist/messages?userId=${artist.id}`)
                          }
                          className="nb-btn-outline flex items-center gap-2 px-5 py-[9px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
                          style={{
                            background: "transparent",
                            border: `1px solid ${C.inputBorder}`,
                            color: C.darkText,
                          }}
                        >
                          <MessageSquare size={14} /> Message
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/artist/near-by-artists/${artist.id}`)
                          }
                          className="nb-btn-outline flex items-center gap-2 px-5 py-[9px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
                          style={{
                            background: "transparent",
                            border: `1px solid ${C.inputBorder}`,
                            color: C.darkText,
                          }}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
