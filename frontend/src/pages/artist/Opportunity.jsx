import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  Users,
  Tag,
  CheckCircle2,
  AlertCircle,
  Send,
  ExternalLink,
  Star,
  Layers,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

// Color tokens
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
  panelBg2: "#191c23",
};

// 21 Categories
const FILTERS = [
  "All",
  "Film & TV Production",
  "Advertising & Commercial Shoots",
  "Music Videos",
  "Event Videography",
  "Wedding Cinematography",
  "Documentary Production",
  "Streaming Content Production",
  "YouTubers Hiring Editors",
  "Influencers Hiring Videographers",
  "Podcast Production Teams",
  "Social Media Content Studios",
  "Brand Creator Collaborations",
  "Game Cinematics",
  "Motion Capture Crews",
  "3D Animation Teams",
  "Virtual Production Specialists",
  "Unreal Engine Artists",
  "Corporate Video Production",
  "Training Content Creation",
  "Marketing Media Teams",
  "Internal Communication Studios",
];

const LOCATIONS = [
  "All locations",
  "Remote",
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Chandigarh, Punjab",
  "Kochi, Kerala",
  "Bhopal, Madhya Pradesh",
  "Indore, Madhya Pradesh",
  "Nagpur, Maharashtra",
  "Visakhapatnam, Andhra Pradesh",
  "Surat, Gujarat",
  "Vadodara, Gujarat",
  "Coimbatore, Tamil Nadu",
  "Guwahati, Assam",
  "Patna, Bihar",
  "Bhubaneswar, Odisha",
  "Thiruvananthapuram, Kerala",
  "Dehradun, Uttarakhand",
  "Ranchi, Jharkhand",
  "Amritsar, Punjab",
  "Mysuru, Karnataka",
  "Mangaluru, Karnataka",
  "Noida, Uttar Pradesh",
  "Gurugram, Haryana",
  "Faridabad, Haryana",
  "Ghaziabad, Uttar Pradesh",
  "Agra, Uttar Pradesh",
  "Varanasi, Uttar Pradesh",
];
const DURATIONS = [
  "Any duration",
  "Less than 1 week",
  "1-4 weeks",
  "1+ months",
  "Ongoing",
];
const POSTED = ["Any time", "Last 24 hours", "Last week", "Last month"];

// StyledSelect
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

// FilterTabs
function FilterTabs({ filters, selected, onSelect }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const arrowStyle = (active) => ({
    background: active ? C.card : "transparent",
    border: `1px solid ${active ? C.inputBorder : "transparent"}`,
    color: active ? C.darkText : "transparent",
    cursor: active ? "pointer" : "default",
    pointerEvents: active ? "auto" : "none",
    flexShrink: 0,
    transition: "all 0.15s",
  });

  return (
    <div className="flex items-center gap-2 mb-7">
      <button
        onClick={() => scroll(-1)}
        className="flex items-center justify-center w-8 h-8 rounded-xl border-0 outline-none"
        style={arrowStyle(canLeft)}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex items-center gap-2 overflow-x-auto flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.ft-no-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div className="ft-no-scroll flex items-center gap-2 w-max">
          {filters.map((f) => {
            const active = selected === f;
            return (
              <button
                key={f}
                onClick={() => onSelect(f)}
                className="filter-tab px-4 py-[8px] rounded-xl text-[12.5px] font-semibold outline-none cursor-pointer flex-shrink-0"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${C.gold}, #cfc060)`
                    : C.card,
                  color: active ? "#1a1d24" : C.lightText,
                  border: active
                    ? "1px solid transparent"
                    : `1px solid ${C.inputBorder}`,
                  whiteSpace: "nowrap",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => scroll(1)}
        className="flex items-center justify-center w-8 h-8 rounded-xl border-0 outline-none"
        style={arrowStyle(canRight)}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── DETAIL PANEL ────────────────────────────────────────────────────────────
function DetailPanel({ opp, onClose, onApply, applyingId }) {
  const [tab, setTab] = useState("overview");
  if (!opp) return null;

  const posted = getPostedLabel(opp.createdAt);

  const requirements = opp.requirements || opp.skills || [];
  const responsibilities = opp.responsibilities || [];
  const perks = opp.perks || [];

  // Only show tabs that have actual content
  const tabs = ["overview"];
  if (requirements.length > 0 || opp.experienceLevel || opp.applicationNote)
    tabs.push("requirements");
  if (
    opp.companyDescription ||
    opp.companySize ||
    opp.industry ||
    opp.founded ||
    opp.totalJobs ||
    opp.website
  )
    tabs.push("about");

  return (
    <>
      {/* Overlay */}
      <div
        className="detail-overlay fixed inset-0 z-[1700] bg-black/50"
        onClick={onClose}
        style={{ backdropFilter: "blur(2px)" }}
      />

      {/* Panel */}
      <div
        className="detail-panel fixed top-0 right-0 h-screen z-[1800] flex flex-col"
        style={{
          width: "clamp(360px, 42vw, 560px)",
          background: C.panelBg2,
          borderLeft: `1px solid ${C.border}`,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: "-12px 0 60px rgba(0,0,0,0.55)",
        }}
      >
        {/* Gradient accent bar */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${C.gold}, #cfc060, transparent)`,
          }}
        />

        {/* Header */}
        <div className="px-7 pt-6 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              {/* Category badge */}
              <span
                className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-3"
                style={{
                  background: C.goldDim,
                  color: C.gold,
                  border: `1px solid rgba(179,169,97,0.2)`,
                }}
              >
                {opp.type}
              </span>
              <h2
                className="text-[22px] font-bold leading-snug mb-1"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {opp.title}
              </h2>
              <p className="text-[13px]" style={{ color: C.lightText }}>
                {opp.company}
              </p>
            </div>
            <button
              onClick={onClose}
              className="adv-btn-close flex items-center justify-center w-8 h-8 rounded-full border-0 outline-none cursor-pointer flex-shrink-0 mt-1"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: C.lightText,
              }}
            >
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          {/* Key stats row */}
          {[
            opp.location && {
              Icon: MapPin,
              label: "Location",
              val: opp.location,
            },
            opp.budget && {
              Icon: IndianRupee,
              label: "Budget",
              val: opp.budget,
            },
            opp.duration && {
              Icon: Clock,
              label: "Duration",
              val: opp.duration,
            },
            opp.createdAt && { Icon: Calendar, label: "Posted", val: posted },
          ].filter(Boolean).length > 0 && (
            <div
              className="grid grid-cols-2 gap-3 p-4 rounded-2xl mb-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.inputBorder}`,
              }}
            >
              {[
                opp.location && {
                  Icon: MapPin,
                  label: "Location",
                  val: opp.location,
                },
                opp.budget && {
                  Icon: IndianRupee,
                  label: "Budget",
                  val: opp.budget,
                },
                opp.duration && {
                  Icon: Clock,
                  label: "Duration",
                  val: opp.duration,
                },
                opp.createdAt && {
                  Icon: Calendar,
                  label: "Posted",
                  val: posted,
                },
              ]
                .filter(Boolean)
                .map(({ Icon, label, val }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 mt-0.5"
                      style={{ background: C.goldDim }}
                    >
                      <Icon
                        size={13}
                        strokeWidth={1.8}
                        style={{ color: C.gold }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-[10.5px] font-semibold uppercase tracking-wide mb-0.5"
                        style={{ color: C.lightText }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: C.darkText }}
                      >
                        {val}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-0"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold capitalize outline-none border-0 cursor-pointer transition-all"
                style={{
                  background: tab === t ? C.card : "transparent",
                  color: tab === t ? C.darkText : C.lightText,
                  boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto px-7 py-5"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${C.border} transparent`,
          }}
        >
          {tab === "overview" && (
            <div className="flex flex-col gap-5">
              {/* Description */}
              {opp.description && (
                <div>
                  <SectionTitle
                    icon={<Layers size={14} />}
                    title="Project Overview"
                  />
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {opp.description}
                  </p>
                </div>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <div>
                  <SectionTitle
                    icon={<Briefcase size={14} />}
                    title="Key Responsibilities"
                  />
                  <ul className="flex flex-col gap-2">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={14}
                          strokeWidth={2}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: C.gold }}
                        />
                        <span
                          className="text-[13px]"
                          style={{ color: C.lightText }}
                        >
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Perks */}
              {perks.length > 0 && (
                <div>
                  <SectionTitle
                    icon={<Star size={14} />}
                    title="What You Get"
                  />
                  <ul className="flex flex-col gap-2">
                    {perks.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: C.gold }}
                        />
                        <span
                          className="text-[13px]"
                          style={{ color: C.lightText }}
                        >
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {opp.tags?.length > 0 && (
                <div>
                  <SectionTitle icon={<Tag size={14} />} title="Tags" />
                  <div className="flex flex-wrap gap-2">
                    {opp.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11.5px] font-medium px-3 py-1 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: C.lightText,
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!opp.description &&
                responsibilities.length === 0 &&
                perks.length === 0 &&
                !opp.tags?.length && (
                  <p
                    className="text-[13px] py-4 text-center"
                    style={{ color: "rgba(139,163,144,0.4)" }}
                  >
                    No additional details provided for this opportunity.
                  </p>
                )}
            </div>
          )}

          {tab === "requirements" && (
            <div className="flex flex-col gap-5">
              <div>
                <SectionTitle
                  icon={<CheckCircle2 size={14} />}
                  title="Requirements"
                />
                <ul className="flex flex-col gap-3">
                  {requirements.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid ${C.inputBorder}`,
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: C.goldDim,
                          border: `1px solid rgba(179,169,97,0.2)`,
                        }}
                      >
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: C.gold }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <span
                        className="text-[13px]"
                        style={{ color: C.lightText }}
                      >
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Experience level */}
              {opp.experienceLevel && (
                <div>
                  <SectionTitle
                    icon={<Users size={14} />}
                    title="Experience Level"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className="text-[12.5px] font-semibold px-4 py-2 rounded-xl"
                      style={{
                        background: C.goldDim,
                        color: C.gold,
                        border: `1px solid rgba(179,169,97,0.2)`,
                      }}
                    >
                      {opp.experienceLevel}
                    </span>
                  </div>
                </div>
              )}

              {/* Application note */}
              {opp.applicationNote && (
                <div
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: "rgba(179,169,97,0.06)",
                    border: `1px solid rgba(179,169,97,0.15)`,
                  }}
                >
                  <AlertCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: C.gold }}
                  />
                  <p
                    className="text-[12.5px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {opp.applicationNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "about" && (
            <div className="flex flex-col gap-5">
              {opp.companyDescription && (
                <div>
                  <SectionTitle
                    icon={<Building2 size={14} />}
                    title="About the Company"
                  />
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {opp.companyDescription}
                  </p>
                </div>
              )}

              {/* Company stats */}
              {[
                opp.companySize && {
                  label: "Company Size",
                  val: opp.companySize,
                },
                opp.industry && { label: "Industry", val: opp.industry },
                opp.founded && { label: "Founded", val: opp.founded },
                opp.totalJobs && {
                  label: "Total Jobs Posted",
                  val: opp.totalJobs,
                },
              ].filter(Boolean).length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    opp.companySize && {
                      label: "Company Size",
                      val: opp.companySize,
                    },
                    opp.industry && { label: "Industry", val: opp.industry },
                    opp.founded && { label: "Founded", val: opp.founded },
                    opp.totalJobs && {
                      label: "Total Jobs Posted",
                      val: opp.totalJobs,
                    },
                  ]
                    .filter(Boolean)
                    .map(({ label, val }) => (
                      <div
                        key={label}
                        className="p-3 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        <p
                          className="text-[10.5px] uppercase tracking-wide font-semibold mb-1"
                          style={{ color: C.lightText }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-[13px] font-semibold"
                          style={{ color: C.darkText }}
                        >
                          {val}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              {/* Website */}
              {opp.website && (
                <a
                  href={opp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] font-semibold"
                  style={{ color: C.gold }}
                >
                  <ExternalLink size={14} />
                  {opp.website}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div
          className="px-7 pb-7 pt-4 flex-shrink-0"
          style={{ borderTop: `1px solid ${C.inputBorder}` }}
        >
          {opp.hasApplied ? (
            <div
              className="flex items-center justify-center gap-2 py-3 rounded-xl"
              style={{
                background: "rgba(179,169,97,0.1)",
                border: `1px solid rgba(179,169,97,0.2)`,
              }}
            >
              <CheckCircle2 size={16} style={{ color: C.gold }} />
              <span className="text-[14px] font-bold" style={{ color: C.gold }}>
                Application Submitted
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                onApply(opp._id);
              }}
              disabled={!opp._id || applyingId === opp._id}
              className="apply-btn w-full py-[13px] rounded-xl text-[14px] font-bold border-0 outline-none cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                color: "#1a1d24",
                opacity: !opp._id ? 0.65 : 1,
              }}
            >
              <Send size={15} strokeWidth={2.2} />
              {applyingId === opp._id
                ? "Submitting Application..."
                : "Apply for this Project"}
            </button>
          )}
          <p
            className="text-center text-[11.5px] mt-2.5"
            style={{ color: "rgba(139,163,144,0.5)" }}
          >
            Your profile will be shared with the poster
          </p>
        </div>
      </div>
    </>
  );
}

// Small section title helper
function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: C.gold }}>{icon}</span>
      <h4
        className="text-[13px] font-bold uppercase tracking-wider"
        style={{ color: C.darkText }}
      >
        {title}
      </h4>
    </div>
  );
}

// Helpers
function getPostedLabel(createdAt) {
  if (!createdAt) return "Recently posted";
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return "Recently posted";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30)
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

function matchesDuration(duration, filter) {
  if (filter === "Any duration") return true;
  const t = String(duration || "").toLowerCase();
  if (filter === "Less than 1 week") return t.includes("day");
  if (filter === "1-4 weeks") return t.includes("week");
  if (filter === "1+ months") return t.includes("month");
  if (filter === "Ongoing") return t.includes("ongoing");
  return true;
}

function matchesPosted(createdAt, filter) {
  if (filter === "Any time" || !createdAt) return true;
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return true;
  const days = (Date.now() - d.getTime()) / 86400000;
  if (filter === "Last 24 hours") return days <= 1;
  if (filter === "Last week") return days <= 7;
  if (filter === "Last month") return days <= 30;
  return true;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Opportunities() {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [durationFilter, setDurationFilter] = useState("Any duration");
  const [postedFilter, setPostedFilter] = useState("Any time");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(30000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const [detailOpp, setDetailOpp] = useState(null); // ← NEW: selected opp for detail panel

  const rawApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(
    /\/+$/,
    "",
  );
  const apiRoot = rawApiBaseUrl
    ? rawApiBaseUrl.endsWith("/api")
      ? rawApiBaseUrl
      : `${rawApiBaseUrl}/api`
    : "/api";

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedFilter !== "All") params.set("type", selectedFilter);
        if (locationFilter !== "All locations")
          params.set("location", locationFilter);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        const budgetFilterChanged = budgetMin > 0 || budgetMax < 30000;
        if (budgetFilterChanged) {
          params.set("minBudget", String(budgetMin));
          params.set("maxBudget", String(budgetMax));
        }
        const res = await fetch(
          `${apiRoot}/opportunities${params.toString() ? `?${params}` : ""}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setOpportunities(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.opportunities)
              ? data.opportunities
              : [],
        );
      } catch (err) {
        if (err.name === "AbortError") return;
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [
    apiRoot,
    budgetMax,
    budgetMin,
    locationFilter,
    searchQuery,
    selectedFilter,
  ]);

  const handleApply = async (opportunityId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/artist/login");
      return;
    }
    setApplyingId(opportunityId);
    try {
      const res = await fetch(`${apiRoot}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ opportunityId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply");
      setOpportunities((prev) =>
        prev.map((o) =>
          o._id === opportunityId ? { ...o, hasApplied: true } : o,
        ),
      );
      // Update detail panel state too
      setDetailOpp((prev) =>
        prev?._id === opportunityId ? { ...prev, hasApplied: true } : prev,
      );
    } catch (err) {
      setError(err.message || "Could not submit application");
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = opportunities.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (selectedFilter === "All" || o.type === selectedFilter) &&
      (locationFilter === "All locations" ||
        (o.location || "").includes(locationFilter.split(",")[0])) &&
      (!q ||
        (o.title || "").toLowerCase().includes(q) ||
        (o.company || "").toLowerCase().includes(q) ||
        (o.type || "").toLowerCase().includes(q)) &&
      matchesDuration(o.duration, durationFilter) &&
      matchesPosted(o.createdAt, postedFilter)
    );
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
          from { transform:translateX(100%); opacity:0; }
          to   { transform:translateX(0);    opacity:1; }
        }
        @keyframes fadeInBg {
          from { opacity:0; } to { opacity:1; }
        }

        .opp-header  { animation: fadeUp 0.3s ease both; }
        .opp-search  { animation: fadeUp 0.32s 0.04s ease both; }
        .opp-card    {
          animation: fadeUp 0.32s ease both;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .opp-card:hover {
          border-color: rgba(179,169,97,0.35) !important;
          box-shadow: 0 6px 28px rgba(0,0,0,0.28);
        }

        .apply-btn { transition: filter 0.18s, transform 0.18s; }
        .apply-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .apply-btn:active { transform: scale(0.97); }

        .detail-btn { transition: border-color 0.18s, color 0.18s, background 0.18s; }
        .detail-btn:hover {
          border-color: rgba(179,169,97,0.5) !important;
          color: #b3a961 !important;
          background: rgba(179,169,97,0.06) !important;
        }

        .filter-tab {
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          white-space: nowrap;
        }

        .sheet-panel   { animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        .sheet-overlay { animation: fadeInBg 0.25s ease both; }
        .detail-panel  { animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        .detail-overlay{ animation: fadeInBg 0.25s ease both; }

        .adv-btn-close { transition: background 0.15s, transform 0.2s; }
        .adv-btn-close:hover {
          background: rgba(255,255,255,0.1) !important;
          transform: rotate(90deg);
        }

        .range-track {
          position: relative;
          height: 4px;
          border-radius: 9999px;
        }
        .range-thumb {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px;
          background: transparent;
          outline: none;
          position: absolute; top: 0; left: 0;
          pointer-events: none;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #b3a961;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
        .range-thumb::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #b3a961;
          cursor: pointer; border: none;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }

        .back-btn-opp { transition: background 0.15s, color 0.15s; }
        .back-btn-opp:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #b3a961 !important;
        }

        .detail-tab-btn { transition: background 0.18s, color 0.18s; }
      `}</style>

      <Sidebar />

      {/* ── Advanced Filters Sheet ── */}
      {sheetOpen && (
        <>
          <div
            className="sheet-overlay fixed inset-0 z-[1500] bg-black/40"
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="sheet-panel fixed top-0 right-0 h-screen z-[1600] flex flex-col w-[360px]"
            style={{
              background: C.panelBg,
              borderLeft: `1px solid ${C.border}`,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
            }}
          >
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
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  className="text-[13px] font-semibold"
                  style={{ color: C.darkText }}
                >
                  Category
                </label>
                <StyledSelect
                  value={selectedFilter}
                  onChange={setSelectedFilter}
                  options={FILTERS}
                />
              </div>
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
              <div className="flex flex-col gap-3">
                <label
                  className="text-[13px] font-semibold"
                  style={{ color: C.darkText }}
                >
                  Budget Range:{" "}
                  <span style={{ color: C.gold }}>
                    ₹{budgetMin.toLocaleString()} - ₹
                    {budgetMax.toLocaleString()}
                  </span>
                </label>
                <div
                  className="range-track"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${(budgetMin / 30000) * 100}%`,
                      right: `${100 - (budgetMax / 30000) * 100}%`,
                      background: C.gold,
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={30000}
                    step={500}
                    value={budgetMin}
                    onChange={(e) => {
                      const v = +e.target.value;
                      if (v < budgetMax) setBudgetMin(v);
                    }}
                    className="range-thumb"
                    style={{ zIndex: budgetMin > 15000 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={30000}
                    step={500}
                    value={budgetMax}
                    onChange={(e) => {
                      const v = +e.target.value;
                      if (v > budgetMin) setBudgetMax(v);
                    }}
                    className="range-thumb"
                    style={{ zIndex: 4 }}
                  />
                </div>
              </div>
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
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Detail Panel ── */}
      <DetailPanel
        opp={detailOpp}
        onClose={() => setDetailOpp(null)}
        onApply={handleApply}
        applyingId={applyingId}
      />

      {/* ── Main Content ── */}
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
              className="flex items-center gap-2 px-4 py-[9px] rounded-xl text-[13px] font-semibold border outline-none cursor-pointer"
              style={{
                background: C.card,
                borderColor: C.inputBorder,
                color: C.darkText,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(179,169,97,0.35)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.inputBorder)
              }
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
              placeholder="Search by title, company, or category..."
              className="w-full rounded-xl text-[13.5px] outline-none"
              style={{
                background: C.card,
                border: `1px solid ${C.inputBorder}`,
                color: C.darkText,
                padding: "11px 14px 11px 42px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(179,169,97,0.4)")
              }
              onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
            />
          </div>

          {/* Filter Tabs */}
          <FilterTabs
            filters={FILTERS}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
          />

          {/* Result count */}
          <p className="text-[12.5px] mb-4" style={{ color: C.lightText }}>
            Showing{" "}
            <span style={{ color: C.gold, fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "opportunity" : "opportunities"}
            {selectedFilter !== "All" && (
              <>
                {" "}
                in <span style={{ color: C.darkText }}>{selectedFilter}</span>
              </>
            )}
          </p>

          {/* Loading */}
          {isLoading && (
            <div
              className="text-center py-10 rounded-2xl mb-4"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <p className="text-[14px]" style={{ color: C.lightText }}>
                Loading opportunities...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="text-center py-4 rounded-2xl mb-4"
              style={{
                background: C.card,
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          {/* Cards */}
          <div className="flex flex-col gap-4">
            {filtered.map((opp, i) => (
              <div
                key={opp._id || opp.id}
                className="opp-card rounded-2xl p-6"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  animationDelay: `${0.05 + i * 0.04}s`,
                }}
              >
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
                    {opp.posted || getPostedLabel(opp.createdAt)}
                  </span>
                </div>

                <p className="text-[13px] mb-4" style={{ color: C.lightText }}>
                  {opp.company}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { Icon: MapPin, val: opp.location },
                    { Icon: IndianRupee, val: opp.budget },
                    { Icon: Clock, val: opp.duration },
                    { Icon: Calendar, val: "ASAP" },
                  ].map(({ Icon, val }, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon
                        size={14}
                        strokeWidth={1.8}
                        style={{ color: C.lightText, flexShrink: 0 }}
                      />
                      <span
                        className="text-[12.5px]"
                        style={{ color: C.lightText }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApply(opp._id)}
                    disabled={
                      !opp._id || applyingId === opp._id || opp.hasApplied
                    }
                    className="apply-btn px-5 py-[9px] rounded-xl text-[13px] font-bold border-0 outline-none cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                      color: "#1a1d24",
                      opacity: !opp._id || opp.hasApplied ? 0.65 : 1,
                    }}
                  >
                    {opp.hasApplied
                      ? "Applied"
                      : applyingId === opp._id
                        ? "Applying..."
                        : "Apply Now"}
                  </button>
                  {/* ← "View Details" now opens detail panel */}
                  <button
                    onClick={() => setDetailOpp(opp)}
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
            {!isLoading && filtered.length === 0 && (
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
