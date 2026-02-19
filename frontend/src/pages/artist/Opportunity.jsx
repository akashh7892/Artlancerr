import { useEffect, useRef, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

// ─── Color tokens ─────────────────────────────────────────────
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

// ─── 21 Categories ────────────────────────────────────────────
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

const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    title: "Lead Cinematographer – Feature Film",
    company: "Sunrise Studios",
    location: "Los Angeles, CA",
    budget: "$8,000 – $12,000",
    duration: "4 weeks",
    posted: "2 days ago",
    type: "Film & TV Production",
  },
  {
    id: 2,
    title: "Director of Photography for TV Pilot",
    company: "Paramount Network",
    location: "Atlanta, GA",
    budget: "$10,000 – $15,000",
    duration: "3 weeks",
    posted: "1 day ago",
    type: "Film & TV Production",
  },
  {
    id: 3,
    title: "Videographer for Nike Campaign",
    company: "BBDO Advertising",
    location: "New York, NY",
    budget: "$5,000 – $8,000",
    duration: "1 week",
    posted: "3 days ago",
    type: "Advertising & Commercial Shoots",
  },
  {
    id: 4,
    title: "Commercial Shoot – Auto Brand",
    company: "Grey Global Group",
    location: "Detroit, MI",
    budget: "$6,000 – $9,000",
    duration: "5 days",
    posted: "5 days ago",
    type: "Advertising & Commercial Shoots",
  },
  {
    id: 5,
    title: "Music Video Director",
    company: "Rhythm Productions",
    location: "New York, NY",
    budget: "$3,000 – $5,000",
    duration: "1 week",
    posted: "5 days ago",
    type: "Music Videos",
  },
  {
    id: 6,
    title: "Cinematographer for Hip-Hop Video",
    company: "Def Jam Recordings",
    location: "Los Angeles, CA",
    budget: "$4,000 – $6,000",
    duration: "3 days",
    posted: "2 days ago",
    type: "Music Videos",
  },
  {
    id: 7,
    title: "Event Videographer – Tech Summit",
    company: "TechWorld Events",
    location: "San Francisco, CA",
    budget: "$2,000 – $3,500",
    duration: "2 days",
    posted: "1 day ago",
    type: "Event Videography",
  },
  {
    id: 8,
    title: "Multi-Camera Operator – Awards Gala",
    company: "Prestige Events Co.",
    location: "Chicago, IL",
    budget: "$1,500 – $2,500",
    duration: "1 day",
    posted: "4 days ago",
    type: "Event Videography",
  },
  {
    id: 9,
    title: "Wedding Cinematographer – Luxury Package",
    company: "Golden Vows Films",
    location: "Miami, FL",
    budget: "$3,500 – $5,000",
    duration: "2 days",
    posted: "3 days ago",
    type: "Wedding Cinematography",
  },
  {
    id: 10,
    title: "Second Shooter – Destination Wedding",
    company: "Forever Films Studio",
    location: "Santorini, Greece",
    budget: "$2,000 – $3,000",
    duration: "3 days",
    posted: "1 week ago",
    type: "Wedding Cinematography",
  },
  {
    id: 11,
    title: "Cinematographer for Feature Documentary",
    company: "True Vision Films",
    location: "San Francisco, CA",
    budget: "$7,000 – $10,000",
    duration: "4 weeks",
    posted: "1 week ago",
    type: "Documentary Production",
  },
  {
    id: 12,
    title: "Field Director – Social Justice Doc",
    company: "Impact Media",
    location: "Washington, D.C.",
    budget: "$5,000 – $8,000",
    duration: "3 weeks",
    posted: "6 days ago",
    type: "Documentary Production",
  },
  {
    id: 13,
    title: "DoP for Netflix Original Series",
    company: "Netflix Originals",
    location: "Remote / LA",
    budget: "$12,000 – $18,000",
    duration: "6 weeks",
    posted: "2 days ago",
    type: "Streaming Content Production",
  },
  {
    id: 14,
    title: "Camera Operator – Amazon Prime Show",
    company: "Amazon Studios",
    location: "Seattle, WA",
    budget: "$9,000 – $13,000",
    duration: "5 weeks",
    posted: "4 days ago",
    type: "Streaming Content Production",
  },
  {
    id: 15,
    title: "Video Editor for Tech YouTube Channel",
    company: "Linus Media Group",
    location: "Remote",
    budget: "$2,000 – $3,500/mo",
    duration: "Ongoing",
    posted: "Today",
    type: "YouTubers Hiring Editors",
  },
  {
    id: 16,
    title: "Short-form Editor – 500K Sub Channel",
    company: "Creator Hub",
    location: "Remote",
    budget: "$1,500 – $2,500/mo",
    duration: "Ongoing",
    posted: "1 day ago",
    type: "YouTubers Hiring Editors",
  },
  {
    id: 17,
    title: "Videographer for Lifestyle Influencer",
    company: "Nova Creative Agency",
    location: "Los Angeles, CA",
    budget: "$1,800 – $3,000",
    duration: "1 week/mo",
    posted: "2 days ago",
    type: "Influencers Hiring Videographers",
  },
  {
    id: 18,
    title: "Travel Content Videographer",
    company: "WanderlustMedia",
    location: "Remote / Travel",
    budget: "$2,500 – $4,000",
    duration: "2 weeks/mo",
    posted: "3 days ago",
    type: "Influencers Hiring Videographers",
  },
  {
    id: 19,
    title: "Podcast Video Editor",
    company: "The Daily Grind Podcast",
    location: "Remote",
    budget: "$800 – $1,500/mo",
    duration: "Ongoing",
    posted: "Today",
    type: "Podcast Production Teams",
  },
  {
    id: 20,
    title: "Live Podcast A/V Technician",
    company: "Speak Easy Studios",
    location: "Austin, TX",
    budget: "$1,200 – $2,000/mo",
    duration: "Ongoing",
    posted: "2 days ago",
    type: "Podcast Production Teams",
  },
  {
    id: 21,
    title: "Reels & TikTok Editor",
    company: "Viral Content Studio",
    location: "Remote",
    budget: "$1,500 – $2,800/mo",
    duration: "Ongoing",
    posted: "Today",
    type: "Social Media Content Studios",
  },
  {
    id: 22,
    title: "Social Content Videographer",
    company: "Hype Creative Co.",
    location: "New York, NY",
    budget: "$2,000 – $3,200/mo",
    duration: "Ongoing",
    posted: "1 day ago",
    type: "Social Media Content Studios",
  },
  {
    id: 23,
    title: "Brand Story Videographer",
    company: "Glossier",
    location: "New York, NY",
    budget: "$3,500 – $5,500",
    duration: "2 weeks",
    posted: "3 days ago",
    type: "Brand Creator Collaborations",
  },
  {
    id: 24,
    title: "UGC Creator Partner",
    company: "Notion Inc.",
    location: "Remote",
    budget: "$1,000 – $2,000/mo",
    duration: "Ongoing",
    posted: "5 days ago",
    type: "Brand Creator Collaborations",
  },
  {
    id: 25,
    title: "Cinematic Cutscene Director",
    company: "Epic Games",
    location: "Cary, NC",
    budget: "$15,000 – $25,000",
    duration: "6 weeks",
    posted: "1 week ago",
    type: "Game Cinematics",
  },
  {
    id: 26,
    title: "In-Game Trailer Cinematographer",
    company: "CD Projekt Red",
    location: "Remote / Poland",
    budget: "$12,000 – $20,000",
    duration: "4 weeks",
    posted: "4 days ago",
    type: "Game Cinematics",
  },
  {
    id: 27,
    title: "MoCap Technician – AAA Title",
    company: "Ubisoft",
    location: "Montreal, Canada",
    budget: "$8,000 – $13,000",
    duration: "3 weeks",
    posted: "6 days ago",
    type: "Motion Capture Crews",
  },
  {
    id: 28,
    title: "Performance Capture Operator",
    company: "Weta Digital",
    location: "Wellington, NZ",
    budget: "$10,000 – $15,000",
    duration: "4 weeks",
    posted: "1 week ago",
    type: "Motion Capture Crews",
  },
  {
    id: 29,
    title: "Senior 3D Animator",
    company: "Pixar Animation Studios",
    location: "Emeryville, CA",
    budget: "$9,000 – $14,000",
    duration: "2 months",
    posted: "3 days ago",
    type: "3D Animation Teams",
  },
  {
    id: 30,
    title: "Freelance 3D Character Animator",
    company: "DreamWorks Animation",
    location: "Remote",
    budget: "$5,000 – $9,000",
    duration: "1 month",
    posted: "5 days ago",
    type: "3D Animation Teams",
  },
  {
    id: 31,
    title: "Virtual Production Supervisor",
    company: "Industrial Light & Magic",
    location: "San Francisco, CA",
    budget: "$18,000 – $28,000",
    duration: "2 months",
    posted: "2 days ago",
    type: "Virtual Production Specialists",
  },
  {
    id: 32,
    title: "LED Volume Operator",
    company: "Orbital Studios",
    location: "Los Angeles, CA",
    budget: "$10,000 – $16,000",
    duration: "3 weeks",
    posted: "1 week ago",
    type: "Virtual Production Specialists",
  },
  {
    id: 33,
    title: "Unreal Engine 5 Environment Artist",
    company: "Lumen Studios",
    location: "Remote",
    budget: "$7,000 – $12,000",
    duration: "1 month",
    posted: "Today",
    type: "Unreal Engine Artists",
  },
  {
    id: 34,
    title: "UE5 Cinematic Lighting Artist",
    company: "Forge Creative",
    location: "Remote",
    budget: "$6,000 – $10,000",
    duration: "3 weeks",
    posted: "2 days ago",
    type: "Unreal Engine Artists",
  },
  {
    id: 35,
    title: "Corporate Videographer – Annual Report",
    company: "Deloitte Media",
    location: "New York, NY",
    budget: "$4,000 – $6,500",
    duration: "2 weeks",
    posted: "4 days ago",
    type: "Corporate Video Production",
  },
  {
    id: 36,
    title: "Executive Interview Videographer",
    company: "Goldman Sachs",
    location: "New York, NY",
    budget: "$3,000 – $5,000",
    duration: "1 week",
    posted: "1 day ago",
    type: "Corporate Video Production",
  },
  {
    id: 37,
    title: "eLearning Video Producer",
    company: "Coursera",
    location: "Remote",
    budget: "$2,500 – $4,500/mo",
    duration: "Ongoing",
    posted: "3 days ago",
    type: "Training Content Creation",
  },
  {
    id: 38,
    title: "Instructional Video Creator",
    company: "LinkedIn Learning",
    location: "Remote",
    budget: "$2,000 – $3,500/mo",
    duration: "Ongoing",
    posted: "6 days ago",
    type: "Training Content Creation",
  },
  {
    id: 39,
    title: "Marketing Video Strategist",
    company: "HubSpot",
    location: "Remote",
    budget: "$5,000 – $8,000",
    duration: "1 month",
    posted: "2 days ago",
    type: "Marketing Media Teams",
  },
  {
    id: 40,
    title: "Product Launch Videographer",
    company: "Shopify",
    location: "Remote / Toronto",
    budget: "$4,500 – $7,000",
    duration: "2 weeks",
    posted: "5 days ago",
    type: "Marketing Media Teams",
  },
  {
    id: 41,
    title: "Internal Comms Video Producer",
    company: "Google",
    location: "Mountain View, CA",
    budget: "$5,000 – $8,000/mo",
    duration: "Ongoing",
    posted: "1 day ago",
    type: "Internal Communication Studios",
  },
  {
    id: 42,
    title: "Town Hall & All-Hands Video Lead",
    company: "Meta",
    location: "Menlo Park, CA",
    budget: "$4,000 – $6,500/mo",
    duration: "Ongoing",
    posted: "3 days ago",
    type: "Internal Communication Studios",
  },
];

const LOCATIONS = [
  "All locations",
  "Los Angeles, CA",
  "New York, NY",
  "San Francisco, CA",
  "Atlanta, GA",
  "Remote",
  "Austin, TX",
  "Chicago, IL",
  "Miami, FL",
  "Seattle, WA",
];
const DURATIONS = [
  "Any duration",
  "Less than 1 week",
  "1–4 weeks",
  "1+ months",
  "Ongoing",
];
const POSTED = ["Any time", "Last 24 hours", "Last week", "Last month"];

// ─────────────────────────────────────────────────────────────
// StyledSelect
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// FilterTabs  ← THIS IS THE MISSING COMPONENT THAT CAUSED THE ERROR
// ─────────────────────────────────────────────────────────────
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
      {/* Left arrow */}
      <button
        onClick={() => scroll(-1)}
        className="flex items-center justify-center w-8 h-8 rounded-xl border-0 outline-none"
        style={arrowStyle(canLeft)}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex items-center gap-2 overflow-x-auto flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hide webkit scrollbar via inline style tag */}
        <style>{`
          .ft-no-scroll::-webkit-scrollbar { display: none; }
        `}</style>
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

      {/* Right arrow */}
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

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
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
  if (filter === "1–4 weeks") return t.includes("week");
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

// ─────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────
export default function Opportunities() {
  const navigate = useNavigate();

  // Use local state — API fetches into this, falls back to mock
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
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

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Try API, silently fall back to mock on failure
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
        params.set("minBudget", String(budgetMin));
        params.set("maxBudget", String(budgetMax));

        const res = await fetch(
          `${apiBaseUrl}/api/opportunities${params.toString() ? `?${params}` : ""}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setOpportunities(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.opportunities)
              ? data.opportunities
              : MOCK_OPPORTUNITIES,
        );
      } catch (err) {
        if (err.name === "AbortError") return;
        // API unavailable — keep showing mock data, no error banner
        setOpportunities(MOCK_OPPORTUNITIES);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [
    apiBaseUrl,
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
      const res = await fetch(`${apiBaseUrl}/api/applications`, {
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
    } catch (err) {
      setError(err.message || "Could not submit application");
    } finally {
      setApplyingId(null);
    }
  };

  // Local filter (works on both API data and mock data)
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

        .detail-btn { transition: border-color 0.18s, color 0.18s; }
        .detail-btn:hover {
          border-color: rgba(179,169,97,0.5) !important;
          color: #b3a961 !important;
        }

        .filter-tab {
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          white-space: nowrap;
        }

        .sheet-panel   { animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        .sheet-overlay { animation: fadeInBg 0.25s ease both; }

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
            {/* Sheet header */}
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

            {/* Sheet body */}
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
                    ${budgetMin.toLocaleString()} – $
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

            {/* Sheet footer */}
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

          {/* ── Filter Tabs (scrollable with arrows) ── */}
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

          {/* Opportunity Cards */}
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
                    {opp.posted || getPostedLabel(opp.createdAt)}
                  </span>
                </div>

                <p className="text-[13px] mb-4" style={{ color: C.lightText }}>
                  {opp.company}
                </p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { Icon: MapPin, val: opp.location },
                    { Icon: DollarSign, val: opp.budget },
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

                {/* Action buttons */}
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
