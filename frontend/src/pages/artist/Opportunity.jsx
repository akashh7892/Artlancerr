import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

// ─── Color tokens ────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#22252e",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#b3a961",
  goldDim: "rgba(179,169,97,0.12)",
  border: "rgba(179,169,97,0.10)",
  inputBg: "#1a1d24",
  inputBorder: "rgba(255,255,255,0.08)",
  panelBg: "#1e2129",
};

const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    title: "Lead Actor for Indie Film",
    company: "Sunrise Studios",
    location: "Los Angeles, CA",
    budget: "$5,000 - $8,000",
    duration: "3 weeks",
    posted: "2 days ago",
    type: "Acting",
  },
  {
    id: 2,
    title: "Choreographer for Music Video",
    company: "Rhythm Productions",
    location: "New York, NY",
    budget: "$3,000 - $5,000",
    duration: "1 week",
    posted: "5 days ago",
    type: "Dance",
  },
  {
    id: 3,
    title: "Cinematographer for Documentary",
    company: "True Vision Films",
    location: "San Francisco, CA",
    budget: "$7,000 - $10,000",
    duration: "4 weeks",
    posted: "1 week ago",
    type: "Cinematography",
  },
  {
    id: 4,
    title: "Costume Designer for Period Drama",
    company: "Epic Pictures",
    location: "Atlanta, GA",
    budget: "$4,000 - $6,000",
    duration: "2 weeks",
    posted: "3 days ago",
    type: "Costume Design",
  },
];

const FILTERS = [
  "All",
  "Acting",
  "Dance",
  "Cinematography",
  "Costume Design",
  "Music",
];
const LOCATIONS = [
  "All locations",
  "Los Angeles, CA",
  "New York, NY",
  "San Francisco, CA",
  "Atlanta, GA",
];
const DURATIONS = [
  "Any duration",
  "Less than 1 week",
  "1–4 weeks",
  "1+ months",
];
const POSTED = ["Any time", "Last 24 hours", "Last week", "Last month"];

// ── Reusable styled select ───────────────────────────────────
function StyledSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl text-[13.5px] outline-none appearance-none cursor-pointer"
        style={{
          background: C.inputBg,
          border: `1px solid ${C.inputBorder}`,
          color: C.darkText,
          padding: "10px 36px 10px 14px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(179,169,97,0.4)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = C.inputBorder;
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
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

export default function Opportunities() {
  const navigate = useNavigate();
  const [opportunities] = useState(MOCK_OPPORTUNITIES);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [durationFilter, setDurationFilter] = useState("Any duration");
  const [postedFilter, setPostedFilter] = useState("Any time");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(15000);

  const filtered = opportunities.filter((o) => {
    const matchType = selectedFilter === "All" || o.type === selectedFilter;
    const matchSearch =
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeInBg {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .opp-header { animation: fadeUp 0.3s ease both; }
        .opp-search { animation: fadeUp 0.32s 0.04s ease both; }
        .opp-filters{ animation: fadeUp 0.34s 0.08s ease both; }

        .opp-card { animation: fadeUp 0.32s ease both; transition: border-color 0.2s, box-shadow 0.2s; }
        .opp-card:nth-child(1){ animation-delay:0.12s; }
        .opp-card:nth-child(2){ animation-delay:0.18s; }
        .opp-card:nth-child(3){ animation-delay:0.24s; }
        .opp-card:nth-child(4){ animation-delay:0.30s; }
        .opp-card:hover {
          border-color: rgba(179,169,97,0.35) !important;
          box-shadow: 0 6px 28px rgba(0,0,0,0.28);
        }

        .apply-btn { transition: filter 0.18s, transform 0.18s; }
        .apply-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .apply-btn:active { transform: scale(0.97); }

        .detail-btn { transition: border-color 0.18s, color 0.18s; }
        .detail-btn:hover { border-color: rgba(179,169,97,0.5) !important; color: #b3a961 !important; }

        .filter-tab { transition: background 0.18s, color 0.18s, border-color 0.18s; }

        .sheet-panel { animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        .sheet-overlay { animation: fadeInBg 0.25s ease both; }

        .adv-btn-close { transition: background 0.15s, transform 0.2s; }
        .adv-btn-close:hover { background: rgba(255,255,255,0.1) !important; transform: rotate(90deg); }

        .range-track { position:relative; height:4px; border-radius:9999px; cursor:pointer; }
        .range-thumb {
          -webkit-appearance: none; appearance: none;
          width:100%; height:4px; background:transparent;
          outline:none; position:absolute; top:0; left:0; pointer-events:none;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance:none; appearance:none;
          width:16px; height:16px; border-radius:50%;
          background:#b3a961; cursor:pointer; pointer-events:all;
          box-shadow:0 1px 6px rgba(0,0,0,0.4);
        }
        .range-thumb::-moz-range-thumb {
          width:16px; height:16px; border-radius:50%;
          background:#b3a961; cursor:pointer; border:none;
          box-shadow:0 1px 6px rgba(0,0,0,0.4);
        }

        .back-btn-opp { transition: background 0.15s, color 0.15s; }
        .back-btn-opp:hover { background: rgba(255,255,255,0.07) !important; color: #b3a961 !important; }
      `}</style>

      <Sidebar />

      {/* ── Advanced Filters Sheet ── */}
      {sheetOpen && (
        <>
          {/* Overlay */}
          <div
            className="sheet-overlay fixed inset-0 z-[1500] bg-black/40"
            onClick={() => setSheetOpen(false)}
          />
          {/* Panel */}
          <div
            className="sheet-panel fixed top-0 right-0 h-screen z-[1600] flex flex-col w-[360px]"
            style={{
              background: C.panelBg,
              borderLeft: `1px solid ${C.border}`,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-start justify-between px-6 pt-6 pb-4"
              style={{ borderBottom: `1px solid ${C.inputBorder}` }}
            >
              <div>
                <h2
                  className="text-[17px] font-bold mb-1"
                  style={{ color: C.darkText }}
                >
                  Advanced Filters
                </h2>
                <p className="text-[12.5px]" style={{ color: C.lightText }}>
                  Refine your search to find the perfect opportunity
                </p>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                className="adv-btn-close flex items-center justify-center w-7 h-7 rounded-full border-0 outline-none cursor-pointer flex-shrink-0 mt-0.5"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: C.lightText,
                }}
              >
                <X size={15} strokeWidth={2.2} />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Location */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[13px] font-semibold"
                  style={{ color: C.darkText }}
                >
                  Location
                </label>
                <StyledSelect
                  value={locationFilter}
                  onChange={setLocationFilter}
                  options={LOCATIONS}
                />
              </div>

              {/* Budget Range */}
              <div className="flex flex-col gap-3">
                <label
                  className="text-[13px] font-semibold"
                  style={{ color: C.darkText }}
                >
                  Budget Range:{" "}
                  <span style={{ color: C.gold }}>
                    ${budgetMin.toLocaleString()} – $
                    {budgetMax.toLocaleString()}
                  </span>
                </label>
                <div
                  className="range-track"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  {/* Filled portion */}
                  <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${(budgetMin / 15000) * 100}%`,
                      right: `${100 - (budgetMax / 15000) * 100}%`,
                      background: C.gold,
                    }}
                  />
                  {/* Min thumb */}
                  <input
                    type="range"
                    min={0}
                    max={15000}
                    step={500}
                    value={budgetMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val < budgetMax) setBudgetMin(val);
                    }}
                    className="range-thumb"
                    style={{ zIndex: budgetMin > 7000 ? 5 : 3 }}
                  />
                  {/* Max thumb */}
                  <input
                    type="range"
                    min={0}
                    max={15000}
                    step={500}
                    value={budgetMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > budgetMin) setBudgetMax(val);
                    }}
                    className="range-thumb"
                    style={{ zIndex: 4 }}
                  />
                </div>
              </div>

              {/* Project Duration */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[13px] font-semibold"
                  style={{ color: C.darkText }}
                >
                  Project Duration
                </label>
                <StyledSelect
                  value={durationFilter}
                  onChange={setDurationFilter}
                  options={DURATIONS}
                />
              </div>

              {/* Posted Within */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[13px] font-semibold"
                  style={{ color: C.darkText }}
                >
                  Posted Within
                </label>
                <StyledSelect
                  value={postedFilter}
                  onChange={setPostedFilter}
                  options={POSTED}
                />
              </div>
            </div>

            {/* Apply button */}
            <div
              className="px-6 pb-6 pt-4"
              style={{ borderTop: `1px solid ${C.inputBorder}` }}
            >
              <button
                onClick={() => setSheetOpen(false)}
                className="apply-btn w-full py-[12px] rounded-xl text-[14px] font-bold border-0 outline-none cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                  color: "#1a1d24",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div
        className="min-h-screen lg:ml-[248px]"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="px-8 py-8 max-w-[1100px]">
          {/* Header */}
          <div className="opp-header flex items-center gap-4 mb-7">
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="back-btn-opp flex items-center justify-center w-9 h-9 rounded-xl border-0 outline-none cursor-pointer flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: C.darkText,
              }}
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <div className="flex-1">
              <h1
                className="text-[28px] font-bold leading-tight mb-1"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Browse Opportunities
              </h1>
              <p className="text-[13.5px]" style={{ color: C.lightText }}>
                Find your next creative project
              </p>
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-2 px-4 py-[9px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer transition-all"
              style={{
                background: C.card,
                border: `1px solid ${C.inputBorder}`,
                color: C.darkText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(179,169,97,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.inputBorder;
              }}
            >
              <SlidersHorizontal size={16} strokeWidth={2} />
              Advanced Filters
            </button>
          </div>

          {/* Search */}
          <div className="opp-search relative mb-5">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: C.lightText }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities by title or company..."
              className="w-full rounded-xl text-[13.5px] outline-none"
              style={{
                background: C.card,
                border: `1px solid ${C.inputBorder}`,
                color: C.darkText,
                padding: "11px 14px 11px 42px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(179,169,97,0.4)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.inputBorder;
              }}
            />
          </div>

          {/* Filter tabs */}
          <div
            className="opp-filters flex items-center gap-2 mb-7 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {FILTERS.map((f) => {
              const active = selectedFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className="filter-tab px-4 py-[8px] rounded-xl text-[13px] font-semibold whitespace-nowrap border-0 outline-none cursor-pointer flex-shrink-0"
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${C.gold}, #cfc060)`
                      : C.card,
                    color: active ? "#1a1d24" : C.lightText,
                    border: active ? "none" : `1px solid ${C.inputBorder}`,
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Opportunity cards */}
          <div className="flex flex-col gap-4">
            {filtered.map((opp, i) => (
              <div
                key={opp.id}
                className="opp-card rounded-2xl p-6"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  animationDelay: `${0.1 + i * 0.07}s`,
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3
                      className="text-[17px] font-bold"
                      style={{ color: C.darkText }}
                    >
                      {opp.title}
                    </h3>
                    <span
                      className="text-[11.5px] font-semibold px-[10px] py-[3px] rounded-full flex-shrink-0"
                      style={{
                        background: C.goldDim,
                        color: C.gold,
                        border: `1px solid rgba(179,169,97,0.2)`,
                      }}
                    >
                      {opp.type}
                    </span>
                  </div>
                  <span
                    className="text-[12.5px] flex-shrink-0"
                    style={{ color: C.lightText }}
                  >
                    {opp.posted}
                  </span>
                </div>

                {/* Company */}
                <p className="text-[13px] mb-4" style={{ color: C.lightText }}>
                  {opp.company}
                </p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={14}
                      strokeWidth={1.8}
                      style={{ color: C.lightText, flexShrink: 0 }}
                    />
                    <span
                      className="text-[12.5px]"
                      style={{ color: C.lightText }}
                    >
                      {opp.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign
                      size={14}
                      strokeWidth={1.8}
                      style={{ color: C.lightText, flexShrink: 0 }}
                    />
                    <span
                      className="text-[12.5px]"
                      style={{ color: C.lightText }}
                    >
                      {opp.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock
                      size={14}
                      strokeWidth={1.8}
                      style={{ color: C.lightText, flexShrink: 0 }}
                    />
                    <span
                      className="text-[12.5px]"
                      style={{ color: C.lightText }}
                    >
                      {opp.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={14}
                      strokeWidth={1.8}
                      style={{ color: C.lightText, flexShrink: 0 }}
                    />
                    <span
                      className="text-[12.5px]"
                      style={{ color: C.lightText }}
                    >
                      ASAP
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    className="apply-btn px-5 py-[9px] rounded-xl text-[13px] font-bold border-0 outline-none cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                      color: "#1a1d24",
                    }}
                  >
                    Apply Now
                  </button>
                  <button
                    className="detail-btn px-5 py-[9px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.inputBorder}`,
                      color: C.darkText,
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div
                className="text-center py-16 rounded-2xl"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <Search
                  size={36}
                  strokeWidth={1.2}
                  className="mx-auto mb-3"
                  style={{ color: "rgba(139,163,144,0.3)" }}
                />
                <p
                  className="text-[15px] font-semibold mb-1"
                  style={{ color: C.darkText }}
                >
                  No opportunities found
                </p>
                <p className="text-[13px]" style={{ color: C.lightText }}>
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
