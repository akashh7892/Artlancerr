import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Star,
  Briefcase,
  MessageSquare,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import HirerSidebar from "./HirerSidebar";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  borderHover: "rgba(201,169,97,0.4)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  goldBg: "rgba(201,169,97,0.12)",
  text: "#ffffff",
  muted: "#9ca3af",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ARTISTS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Lead Actor",
    location: "Los Angeles, CA",
    experience: "8 years",
    rating: 4.9,
    reviews: 127,
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&fit=crop",
    skills: ["Drama", "Comedy", "Theater"],
    category: "Acting",
    available: true,
    bio: "Award-winning actor with extensive film and theater experience.",
    projects: 45,
    responseTime: "Within 2 hours",
    dailyRate: "$800",
    weeklyRate: "$4,500",
  },
  {
    id: 2,
    name: "Marcus Lee",
    role: "Choreographer",
    location: "New York, NY",
    experience: "6 years",
    rating: 4.8,
    reviews: 89,
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&fit=crop",
    skills: ["Contemporary", "Hip Hop", "Ballroom"],
    category: "Dance",
    available: true,
    bio: "Professional choreographer who has worked with top music artists worldwide.",
    projects: 38,
    responseTime: "Within 4 hours",
    dailyRate: "$600",
    weeklyRate: "$3,200",
  },
  {
    id: 3,
    name: "Alex Rivera",
    role: "Cinematographer",
    location: "Atlanta, GA",
    experience: "10 years",
    rating: 5.0,
    reviews: 203,
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&fit=crop",
    skills: ["Color Grading", "Lighting", "Steadicam"],
    category: "Cinematography",
    available: false,
    bio: "Award-winning cinematographer specializing in narrative storytelling.",
    projects: 72,
    responseTime: "Within 1 day",
    dailyRate: "$1,200",
    weeklyRate: "$6,000",
  },
  {
    id: 4,
    name: "Emma Chen",
    role: "Makeup Artist",
    location: "San Francisco, CA",
    experience: "5 years",
    rating: 4.7,
    reviews: 156,
    photo:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&fit=crop",
    skills: ["Special Effects", "Period", "Beauty"],
    category: "Makeup",
    available: true,
    bio: "Specialist in character and special effects makeup for film and TV.",
    projects: 61,
    responseTime: "Within 3 hours",
    dailyRate: "$500",
    weeklyRate: "$2,800",
  },
  {
    id: 5,
    name: "Jordan Miles",
    role: "Music Composer",
    location: "Nashville, TN",
    experience: "7 years",
    rating: 4.9,
    reviews: 94,
    photo:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&fit=crop",
    skills: ["Film Scoring", "Orchestral", "Electronic"],
    category: "Music",
    available: true,
    bio: "Film composer with credits on 30+ independent and studio projects.",
    projects: 33,
    responseTime: "Within 2 hours",
    dailyRate: "$700",
    weeklyRate: "$3,800",
  },
  {
    id: 6,
    name: "Priya Patel",
    role: "Film Editor",
    location: "Los Angeles, CA",
    experience: "9 years",
    rating: 4.8,
    reviews: 178,
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&fit=crop",
    skills: ["Avid", "Premiere Pro", "Color Correction"],
    category: "Acting",
    available: false,
    bio: "Experienced editor who has worked on documentaries, shorts and features.",
    projects: 55,
    responseTime: "Within 6 hours",
    dailyRate: "$900",
    weeklyRate: "$4,800",
  },
];

const FILTERS = ["All", "Acting", "Dance", "Cinematography", "Makeup", "Music"];

// ─── Filter Drawer ────────────────────────────────────────────────────────────
function FilterDrawer({
  open,
  onClose,
  location,
  setLocation,
  experience,
  setExperience,
  availability,
  setAvailability,
  onApply,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(0,0,0,0.6)",
            }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: "clamp(280px, 90vw, 380px)",
              background: C.card,
              borderLeft: `1px solid ${C.border}`,
              zIndex: 51,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: C.text,
                  }}
                >
                  Advanced Filters
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "13px",
                    color: C.muted,
                  }}
                >
                  Refine your search
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.muted,
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                padding: "24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
            >
              {/* Location */}
              <FilterField label="Location">
                <FilterSelect
                  value={location}
                  onChange={setLocation}
                  options={[
                    { value: "all", label: "All Locations" },
                    { value: "Los Angeles, CA", label: "Los Angeles, CA" },
                    { value: "New York, NY", label: "New York, NY" },
                    { value: "Atlanta, GA", label: "Atlanta, GA" },
                    { value: "San Francisco, CA", label: "San Francisco, CA" },
                    { value: "Nashville, TN", label: "Nashville, TN" },
                  ]}
                />
              </FilterField>

              {/* Experience */}
              <FilterField label="Experience Level">
                <FilterSelect
                  value={experience}
                  onChange={setExperience}
                  options={[
                    { value: "all", label: "Any Experience" },
                    { value: "0-3", label: "0–3 years" },
                    { value: "4-7", label: "4–7 years" },
                    { value: "8+", label: "8+ years" },
                  ]}
                />
              </FilterField>

              {/* Availability */}
              <FilterField label="Availability">
                <FilterSelect
                  value={availability}
                  onChange={setAvailability}
                  options={[
                    { value: "all", label: "Any Availability" },
                    { value: "available", label: "Available Now" },
                    { value: "busy", label: "Currently Busy" },
                  ]}
                />
              </FilterField>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "20px 24px",
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: "10px",
                  color: C.text,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onApply();
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
                  border: "none",
                  borderRadius: "10px",
                  color: "#1a1d24",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterField({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: C.muted,
          marginBottom: "8px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          borderRadius: "10px",
          padding: "11px 36px 11px 14px",
          fontSize: "14px",
          outline: "none",
          background: C.input,
          border: `1px solid ${focused ? C.gold : C.border}`,
          color: C.text,
          appearance: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: focused ? `0 0 0 3px ${C.goldGlow}` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxSizing: "border-box",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: C.card }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: C.muted,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Artist Card ──────────────────────────────────────────────────────────────
function ArtistCard({ artist, index, onView, onMessage }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(201,169,97,0.15)` }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderHover)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      {/* Photo */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          maxHeight: "260px",
          overflow: "hidden",
        }}
      >
        {imgErr ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: C.input,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={40} color={C.muted} />
          </div>
        ) : (
          <img
            src={artist.photo}
            alt={artist.name}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }}
        />

        {/* Rating badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            background: "rgba(26,29,36,0.85)",
            backdropFilter: "blur(8px)",
            borderRadius: "20px",
            border: `1px solid ${C.border}`,
          }}
        >
          <Star size={13} fill={C.gold} color={C.gold} />
          <span style={{ color: C.text, fontSize: "13px", fontWeight: "600" }}>
            {artist.rating}
          </span>
        </div>

        {/* Availability dot */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            background: artist.available
              ? "rgba(74,222,128,0.15)"
              : "rgba(156,163,175,0.15)",
            backdropFilter: "blur(8px)",
            borderRadius: "20px",
            border: `1px solid ${artist.available ? "rgba(74,222,128,0.3)" : "rgba(156,163,175,0.2)"}`,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: artist.available ? "#4ade80" : C.muted,
            }}
          />
          <span
            style={{
              color: artist.available ? "#4ade80" : C.muted,
              fontSize: "11px",
              fontWeight: "600",
            }}
          >
            {artist.available ? "Available" : "Busy"}
          </span>
        </div>

        {/* Name overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            right: "14px",
          }}
        >
          <h3
            style={{
              margin: "0 0 3px",
              fontSize: "17px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            {artist.name}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {artist.role}
          </p>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "16px" }}>
        {/* Location + Experience */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: C.muted,
              fontSize: "13px",
            }}
          >
            <MapPin size={13} />
            <span>{artist.location}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: C.muted,
              fontSize: "13px",
            }}
          >
            <Briefcase size={13} />
            <span>{artist.experience}</span>
          </div>
        </div>

        {/* Skills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "14px",
          }}
        >
          {artist.skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                padding: "3px 10px",
                background: C.goldBg,
                color: C.gold,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600",
                border: `1px solid ${C.border}`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Reviews row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "14px",
            color: C.muted,
            fontSize: "12px",
          }}
        >
          <Star size={12} fill={C.gold} color={C.gold} />
          <span style={{ color: C.text, fontWeight: "600" }}>
            {artist.rating}
          </span>
          <span>({artist.reviews} reviews)</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onView(artist)}
            style={{
              flex: 1,
              padding: "9px",
              background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
              border: "none",
              borderRadius: "9px",
              color: "#1a1d24",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            View Profile
          </motion.button>
          <motion.button
            whileHover={{ borderColor: C.gold, color: C.gold }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onMessage(artist)}
            style={{
              padding: "9px 12px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: "9px",
              color: C.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            <MessageSquare size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BrowseArtist() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [location, setLocation] = useState("all");
  const [experience, setExperience] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredArtists = MOCK_ARTISTS.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedFilter === "All" || a.category === selectedFilter;
    const matchLocation = location === "all" || a.location === location;
    const matchAvailability =
      availability === "all" ||
      (availability === "available" && a.available) ||
      (availability === "busy" && !a.available);
    const matchExp = (() => {
      if (experience === "all") return true;
      const yrs = parseInt(a.experience);
      if (experience === "0-3") return yrs <= 3;
      if (experience === "4-7") return yrs >= 4 && yrs <= 7;
      if (experience === "8+") return yrs >= 8;
      return true;
    })();
    return (
      matchSearch &&
      matchCategory &&
      matchLocation &&
      matchAvailability &&
      matchExp
    );
  });

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.bg }}>
      <HirerSidebar />

      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto">
          <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px)",
              }}
            >
              {/* ── Header ──────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: "28px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      flex: 1,
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.08, backgroundColor: C.card }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/hirer/post-requirement")}
                      style={{
                        padding: "9px",
                        borderRadius: "9px",
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        color: C.text,
                        display: "flex",
                        alignItems: "center",
                        transition: "background 0.2s",
                        flexShrink: 0,
                        marginTop: "5px",
                      }}
                    >
                      <ArrowLeft size={17} />
                    </motion.button>
                    <div>
                      <h1
                        style={{
                          fontSize: "clamp(22px, 3.5vw, 32px)",
                          fontWeight: "700",
                          margin: "0 0 6px",
                          color: C.text,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Browse Artists
                      </h1>
                      <p
                        style={{ margin: 0, color: C.muted, fontSize: "14px" }}
                      >
                        Discover talented professionals for your projects
                      </p>
                    </div>
                  </div>

                  {/* Advanced Filters button */}
                  <motion.button
                    whileHover={{ borderColor: C.gold, color: C.gold }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDrawerOpen(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 18px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: "10px",
                      color: C.text,
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "border-color 0.2s, color 0.2s",
                      alignSelf: "flex-start",
                      marginTop: "5px",
                    }}
                  >
                    <SlidersHorizontal size={15} />
                    Advanced Filters
                  </motion.button>
                </div>
              </motion.div>

              {/* ── Search ──────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                style={{ marginBottom: "20px", position: "relative" }}
              >
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: searchFocused ? C.gold : C.muted,
                    transition: "color 0.2s",
                    pointerEvents: "none",
                  }}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search artists by name or role..."
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    background: C.card,
                    border: `1px solid ${searchFocused ? C.gold : C.border}`,
                    borderRadius: "12px",
                    color: C.text,
                    fontSize: "14px",
                    outline: "none",
                    boxShadow: searchFocused
                      ? `0 0 0 3px ${C.goldGlow}`
                      : "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </motion.div>

              {/* ── Filter Tabs ──────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                  marginBottom: "28px",
                }}
              >
                {FILTERS.map((f) => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedFilter(f)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "10px",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: `1px solid ${selectedFilter === f ? C.gold : C.border}`,
                      background:
                        selectedFilter === f
                          ? `linear-gradient(135deg, ${C.gold}, #a8863d)`
                          : C.card,
                      color: selectedFilter === f ? "#1a1d24" : C.text,
                    }}
                  >
                    {f}
                  </motion.button>
                ))}
              </motion.div>

              {/* ── Grid ─────────────────────────────────────── */}
              {filteredArtists.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "center",
                    padding: "80px 20px",
                    color: C.muted,
                    fontSize: "15px",
                  }}
                >
                  No artists found matching your criteria.
                </motion.div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "22px",
                  }}
                >
                  {filteredArtists.map((artist, i) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      index={i}
                      onView={(a) =>
                        navigate(`/hirer/browse-artists/${a.id}`, {
                          state: { artist: a },
                        })
                      }
                      onMessage={(a) =>
                        navigate("/hirer/messages", { state: { artist: a } })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Advanced Filter Drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        location={location}
        setLocation={setLocation}
        experience={experience}
        setExperience={setExperience}
        availability={availability}
        setAvailability={setAvailability}
        onApply={() => {}}
      />

      <style>{`
        input::placeholder { color: #6b7280; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.2); border-radius: 3px; }
      `}</style>
    </div>
  );
}
