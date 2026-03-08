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
  IndianRupee,
  Package,
  ExternalLink,
  CheckCircle,
  UserCircle,
  Film,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  cardDeep: "#22252e",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  borderHover: "rgba(201,169,97,0.4)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  goldBg: "rgba(201,169,97,0.12)",
  goldDim: "rgba(201,169,97,0.08)",
  text: "#ffffff",
  muted: "#9ca3af",
  mutedLight: "#6b7280",
  danger: "#f87171",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.12)",
};

// ─── Role → Category map (covers all PostRequirement roles) ──────────────────
const ROLE_CATEGORY_MAP = {
  // Acting
  Actor: "Acting",
  "Lead Actor": "Acting",
  "Supporting Actor": "Acting",
  "Background Artist": "Acting",
  "Voice Artist": "Acting",
  "Stunt Coordinator": "Acting",
  // Dance
  Dancer: "Dance",
  Choreographer: "Dance",
  // Cinematography
  Cinematographer: "Cinematography",
  "Camera Operator": "Cinematography",
  Colorist: "Cinematography",
  // Direction
  Director: "Direction",
  "Assistant Director": "Direction",
  Producer: "Direction",
  "Art Director": "Direction",
  "Production Designer": "Direction",
  "Casting Director": "Direction",
  // Writing
  Screenwriter: "Writing",
  "Dialogue Writer": "Writing",
  Lyricist: "Writing",
  Writer: "Writing",
  // Makeup
  "Makeup Artist": "Makeup",
  "Costume Designer": "Makeup",
  // Sound
  "Sound Designer": "Sound",
  // Music
  "Music Composer": "Music",
  // Editing
  "Film Editor": "Editing",
  // Lighting
  "Lighting Director": "Lighting",
  // VFX / Tech
  "VFX Artist": "VFX",
  "3D Animation Teams": "VFX",
  "Game Cinematics": "VFX",
  "Motion Capture Crews": "VFX",
  "Virtual Production Specialists": "VFX",
  "Unreal Engine Artists": "VFX",
  // Production
  "Film & TV Production": "Production",
  "Advertising & Commercial Shoots": "Production",
  "Music Videos": "Production",
  "Event Videography": "Production",
  "Wedding Cinematography": "Production",
  "Documentary Production": "Production",
  "Streaming Content Production": "Production",
  "Corporate Video Production": "Production",
  "Training Content Creation": "Production",
  "Marketing Media Teams": "Production",
  "Internal Communication Studios": "Production",
  // Creator Economy
  "YouTubers Hiring Editors": "Creator",
  "Influencers Hiring Videographers": "Creator",
  "Podcast Production Teams": "Creator",
  "Social Media Content Studios": "Creator",
  "Brand Creator Collaborations": "Creator",
};

const categoryFromArt = (a = "") => {
  if (ROLE_CATEGORY_MAP[a]) return ROLE_CATEGORY_MAP[a];
  const v = a.toLowerCase();
  if (
    v.includes("actor") ||
    v.includes("voice") ||
    v.includes("stunt") ||
    v.includes("background")
  )
    return "Acting";
  if (v.includes("danc") || v.includes("choreograph")) return "Dance";
  if (v.includes("cinemat") || v.includes("camera") || v.includes("colorist"))
    return "Cinematography";
  if (v.includes("makeup") || v.includes("costume")) return "Makeup";
  if (v.includes("composer") || v.includes("music") || v.includes("lyricist"))
    return "Music";
  if (
    v.includes("writer") ||
    v.includes("screenwriter") ||
    v.includes("dialogue") ||
    v.includes("casting")
  )
    return "Writing";
  if (
    v.includes("vfx") ||
    v.includes("animation") ||
    v.includes("unreal") ||
    v.includes("motion capture") ||
    v.includes("3d")
  )
    return "VFX";
  if (
    v.includes("director") ||
    v.includes("producer") ||
    v.includes("production designer")
  )
    return "Direction";
  if (v.includes("sound") || v.includes("audio")) return "Sound";
  if (v.includes("edit")) return "Editing";
  if (v.includes("light")) return "Lighting";
  if (
    v.includes("youtube") ||
    v.includes("influencer") ||
    v.includes("social media") ||
    v.includes("creator") ||
    v.includes("podcast") ||
    v.includes("brand")
  )
    return "Creator";
  if (
    v.includes("film") ||
    v.includes("production") ||
    v.includes("commercial") ||
    v.includes("wedding") ||
    v.includes("documentary") ||
    v.includes("streaming") ||
    v.includes("corporate") ||
    v.includes("training") ||
    v.includes("marketing")
  )
    return "Production";
  return "Acting";
};

// ─── Category filter chips (scrollable row) ───────────────────────────────────
const CATEGORY_FILTERS = [
  { label: "All", value: "All" },
  { label: " Acting", value: "Acting" },
  { label: " Dance", value: "Dance" },
  { label: "Cinema", value: "Cinematography" },
  { label: "Direction", value: "Direction" },
  { label: "Makeup", value: "Makeup" },
  { label: "Music", value: "Music" },
  { label: " Writing", value: "Writing" },
  { label: " VFX", value: "VFX" },
  { label: " Sound", value: "Sound" },
  { label: " Editing", value: "Editing" },
  { label: " Lighting", value: "Lighting" },
  { label: " Creator", value: "Creator" },
  { label: " Production", value: "Production" },
];

// ─── All individual roles from PostRequirement (for Role filter in drawer) ────
const ALL_ROLES = [
  // Performing Arts
  "Actor",
  "Lead Actor",
  "Supporting Actor",
  "Background Artist",
  "Voice Artist",
  "Dancer",
  "Choreographer",
  "Stunt Coordinator",
  // Film Crew
  "Director",
  "Assistant Director",
  "Cinematographer",
  "Camera Operator",
  "Lighting Director",
  "Colorist",
  "Film Editor",
  "Sound Designer",
  // Writing & Creative
  "Screenwriter",
  "Dialogue Writer",
  "Lyricist",
  "Writer",
  "Casting Director",
  "Producer",
  "Art Director",
  "Production Designer",
  "Costume Designer",
  "Makeup Artist",
  // Digital & Tech
  "VFX Artist",
  "3D Animation Teams",
  "Game Cinematics",
  "Motion Capture Crews",
  "Virtual Production Specialists",
  "Unreal Engine Artists",
  "Music Composer",
  // Production Types
  "Film & TV Production",
  "Advertising & Commercial Shoots",
  "Music Videos",
  "Event Videography",
  "Wedding Cinematography",
  "Documentary Production",
  "Streaming Content Production",
  "Corporate Video Production",
  "Training Content Creation",
  "Marketing Media Teams",
  "Internal Communication Studios",
  // Creator Economy
  "YouTubers Hiring Editors",
  "Influencers Hiring Videographers",
  "Podcast Production Teams",
  "Social Media Content Studios",
  "Brand Creator Collaborations",
];

const fmtRate = (v, fb) => {
  if (!v) return fb;
  const s = String(v).trim();
  return s.startsWith("$") || s.startsWith("₹") ? s : `₹${s}`;
};

const mapArtist = (a) => ({
  id: a._id,
  _id: a._id,
  name: a.name || "Artist",
  role: a.artCategory || "Artist",
  location: a.location || "Unknown",
  experience: a.experience || "",
  // Use REAL rating from DB — null if not present (no dummy)
  rating:
    typeof a.rating === "number" && a.rating > 0
      ? Number(a.rating.toFixed(1))
      : null,
  reviewCount:
    typeof a.reviewCount === "number"
      ? a.reviewCount
      : Array.isArray(a.reviews)
        ? a.reviews.length
        : 0,
  photo: a.profileImage || a.avatar || "",
  skills: [a.artCategory || "Artist"].filter(Boolean),
  category: categoryFromArt(a.artCategory),
  available:
    Array.isArray(a?.availability?.freeDates) &&
    a.availability.freeDates.length > 0
      ? true
      : !Array.isArray(a?.availability?.blockedDates),
  bio: a.bio || "",
  email: a.email || "",
  phone: a.phone || "",
  portfolio: a.portfolio || a.portfolioUrl || "",
  dailyRate: fmtRate(a?.rates?.daily, null),
  weeklyRate: fmtRate(a?.rates?.weekly, null),
  projectRate: a?.rates?.project || null,
  experienceYears: parseInt(a.experience) || 0,
  blockedDates: Array.isArray(a?.availability?.blockedDates)
    ? a.availability.blockedDates
    : [],
  freeDates: Array.isArray(a?.availability?.freeDates)
    ? a.availability.freeDates
    : [],
  equipment: Array.isArray(a?.equipment) ? a.equipment : [],
  instagram: a.instagram || a.instagramUrl || "",
  youtube: a.youtube || a.youtubeUrl || "",
  website: a.website || a.websiteUrl || "",
  twitter: a.twitter || a.twitterUrl || "",
  responseTime: a.responseTime || "",
  _raw: a,
});

const countActiveFilters = (f) =>
  [
    f.location !== "all",
    f.experience !== "all",
    f.availability !== "all",
    f.rateRange !== "all",
    f.selectedCategory !== "All",
    f.role !== "all",
  ].filter(Boolean).length;

// ─── FilterSelect ─────────────────────────────────────────────────────────────
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
          borderRadius: 10,
          padding: "12px 36px 12px 14px",
          fontSize: 15,
          outline: "none",
          background: C.input,
          border: `1px solid ${focused ? C.gold : C.border}`,
          color: C.text,
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          boxSizing: "border-box",
          boxShadow: focused ? `0 0 0 3px ${C.goldGlow}` : "none",
          transition: "border-color .2s,box-shadow .2s",
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
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: C.muted,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── FilterChip ───────────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        background: C.goldDim,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        fontSize: 12,
        color: C.gold,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 0 0 2px",
          display: "flex",
          color: C.gold,
          touchAction: "manipulation",
        }}
      >
        <X size={11} />
      </button>
    </span>
  );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────
function FilterDrawer({ open, onClose, filters, setFilter, onReset }) {
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
              zIndex: 200,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(3px)",
            }}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="ba-filter-drawer"
          >
            {/* Drag handle */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px 0 4px",
              }}
            >
              <div className="ba-drawer-handle" />
            </div>

            {/* Header */}
            <div
              style={{
                padding: "14px 20px 12px",
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
                    fontSize: 17,
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  Filters
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: C.muted }}>
                  Refine your search
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "none",
                  cursor: "pointer",
                  color: C.muted,
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "manipulation",
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Filter options */}
            <div
              style={{
                flex: 1,
                padding: "18px 20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 8,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Role Category
                </label>
                <FilterSelect
                  value={filters.selectedCategory}
                  onChange={(v) => setFilter("selectedCategory", v)}
                  options={CATEGORY_FILTERS.map((f) => ({
                    value: f.value,
                    label: f.label,
                  }))}
                />
              </div>

              {/* Specific Role — all PostRequirement roles */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 8,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Specific Role
                </label>
                <FilterSelect
                  value={filters.role}
                  onChange={(v) => setFilter("role", v)}
                  options={[
                    { value: "all", label: "All Roles" },
                    // Performing Arts
                    { value: "__group__", label: "── Performing Arts ──" },
                    ...[
                      "Actor",
                      "Lead Actor",
                      "Supporting Actor",
                      "Background Artist",
                      "Voice Artist",
                      "Dancer",
                      "Choreographer",
                      "Stunt Coordinator",
                    ].map((r) => ({ value: r, label: r })),
                    // Film Crew
                    { value: "__group2__", label: "── Film Crew ──" },
                    ...[
                      "Director",
                      "Assistant Director",
                      "Cinematographer",
                      "Camera Operator",
                      "Lighting Director",
                      "Colorist",
                      "Film Editor",
                      "Sound Designer",
                    ].map((r) => ({ value: r, label: r })),
                    // Writing & Creative
                    { value: "__group3__", label: "── Writing & Creative ──" },
                    ...[
                      "Screenwriter",
                      "Dialogue Writer",
                      "Lyricist",
                      "Writer",
                      "Casting Director",
                      "Producer",
                      "Art Director",
                      "Production Designer",
                      "Costume Designer",
                      "Makeup Artist",
                    ].map((r) => ({ value: r, label: r })),
                    // Digital & Tech
                    { value: "__group4__", label: "── Digital & Tech ──" },
                    ...[
                      "VFX Artist",
                      "3D Animation Teams",
                      "Game Cinematics",
                      "Motion Capture Crews",
                      "Virtual Production Specialists",
                      "Unreal Engine Artists",
                      "Music Composer",
                    ].map((r) => ({ value: r, label: r })),
                    // Production Types
                    { value: "__group5__", label: "── Production Types ──" },
                    ...[
                      "Film & TV Production",
                      "Advertising & Commercial Shoots",
                      "Music Videos",
                      "Event Videography",
                      "Wedding Cinematography",
                      "Documentary Production",
                      "Streaming Content Production",
                      "Corporate Video Production",
                      "Training Content Creation",
                      "Marketing Media Teams",
                      "Internal Communication Studios",
                    ].map((r) => ({ value: r, label: r })),
                    // Creator Economy
                    { value: "__group6__", label: "── Creator Economy ──" },
                    ...[
                      "YouTubers Hiring Editors",
                      "Influencers Hiring Videographers",
                      "Podcast Production Teams",
                      "Social Media Content Studios",
                      "Brand Creator Collaborations",
                    ].map((r) => ({ value: r, label: r })),
                  ]}
                />
              </div>

              {/* Location */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 8,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Location
                </label>
                <FilterSelect
                  value={filters.location}
                  onChange={(v) => setFilter("location", v)}
                  options={[
                    { value: "all", label: "All Locations" },
                    { value: "Mumbai", label: "Mumbai" },
                    { value: "Delhi", label: "Delhi" },
                    { value: "Bengaluru", label: "Bengaluru" },
                    { value: "Hyderabad", label: "Hyderabad" },
                    { value: "Chennai", label: "Chennai" },
                    { value: "Kolkata", label: "Kolkata" },
                    { value: "Pune", label: "Pune" },
                    { value: "Ahmedabad", label: "Ahmedabad" },
                    { value: "Jaipur", label: "Jaipur" },
                    { value: "Surat", label: "Surat" },
                    { value: "Lucknow", label: "Lucknow" },
                    { value: "Kanpur", label: "Kanpur" },
                    { value: "Nagpur", label: "Nagpur" },
                    { value: "Indore", label: "Indore" },
                    { value: "Thane", label: "Thane" },
                    { value: "Bhopal", label: "Bhopal" },
                    { value: "Visakhapatnam", label: "Visakhapatnam" },
                    { value: "Patna", label: "Patna" },
                    { value: "Vadodara", label: "Vadodara" },
                    { value: "Ghaziabad", label: "Ghaziabad" },
                    { value: "Ludhiana", label: "Ludhiana" },
                    { value: "Agra", label: "Agra" },
                    { value: "Nashik", label: "Nashik" },
                    { value: "Faridabad", label: "Faridabad" },
                    { value: "Meerut", label: "Meerut" },
                    { value: "Rajkot", label: "Rajkot" },
                    { value: "Kalyan", label: "Kalyan" },
                    { value: "Vasai", label: "Vasai" },
                    { value: "Varanasi", label: "Varanasi" },
                    { value: "Srinagar", label: "Srinagar" },
                    { value: "Aurangabad", label: "Aurangabad" },
                    { value: "Dhanbad", label: "Dhanbad" },
                    { value: "Amritsar", label: "Amritsar" },
                    { value: "Navi Mumbai", label: "Navi Mumbai" },
                    { value: "Allahabad", label: "Allahabad" },
                    { value: "Ranchi", label: "Ranchi" },
                    { value: "Howrah", label: "Howrah" },
                    { value: "Coimbatore", label: "Coimbatore" },
                    { value: "Jabalpur", label: "Jabalpur" },
                    { value: "Gwalior", label: "Gwalior" },
                    { value: "Vijayawada", label: "Vijayawada" },
                    { value: "Jodhpur", label: "Jodhpur" },
                    { value: "Madurai", label: "Madurai" },
                    { value: "Raipur", label: "Raipur" },
                    { value: "Kota", label: "Kota" },
                    { value: "Chandigarh", label: "Chandigarh" },
                    { value: "Guwahati", label: "Guwahati" },
                    { value: "Solapur", label: "Solapur" },
                    { value: "Hubli", label: "Hubli" },
                    { value: "Mysore", label: "Mysore" },
                    { value: "Tiruchirappalli", label: "Tiruchirappalli" },
                    { value: "Bareilly", label: "Bareilly" },
                    { value: "Aligarh", label: "Aligarh" },
                    { value: "Tiruppur", label: "Tiruppur" },
                    { value: "Moradabad", label: "Moradabad" },
                    { value: "Jalandhar", label: "Jalandhar" },
                    { value: "Bhubaneswar", label: "Bhubaneswar" },
                    { value: "Salem", label: "Salem" },
                    { value: "Warangal", label: "Warangal" },
                    { value: "Guntur", label: "Guntur" },
                    { value: "Bhiwandi", label: "Bhiwandi" },
                    { value: "Saharanpur", label: "Saharanpur" },
                    { value: "Gorakhpur", label: "Gorakhpur" },
                    { value: "Bikaner", label: "Bikaner" },
                    { value: "Amravati", label: "Amravati" },
                    { value: "Noida", label: "Noida" },
                    { value: "Jamshedpur", label: "Jamshedpur" },
                    { value: "Bhilai", label: "Bhilai" },
                    { value: "Cuttack", label: "Cuttack" },
                    { value: "Firozabad", label: "Firozabad" },
                    { value: "Kochi", label: "Kochi" },
                    { value: "Nellore", label: "Nellore" },
                    { value: "Bhavnagar", label: "Bhavnagar" },
                    { value: "Dehradun", label: "Dehradun" },
                    { value: "Durgapur", label: "Durgapur" },
                    { value: "Asansol", label: "Asansol" },
                    { value: "Rourkela", label: "Rourkela" },
                    { value: "Nanded", label: "Nanded" },
                    { value: "Kolhapur", label: "Kolhapur" },
                    { value: "Ajmer", label: "Ajmer" },
                    { value: "Akola", label: "Akola" },
                    { value: "Gulbarga", label: "Gulbarga" },
                    { value: "Jamnagar", label: "Jamnagar" },
                    { value: "Ujjain", label: "Ujjain" },
                    { value: "Loni", label: "Loni" },
                    { value: "Siliguri", label: "Siliguri" },
                    { value: "Jhansi", label: "Jhansi" },
                    { value: "Ulhasnagar", label: "Ulhasnagar" },
                    { value: "Jammu", label: "Jammu" },
                    { value: "Sangli", label: "Sangli" },
                    { value: "Mangalore", label: "Mangalore" },
                    { value: "Erode", label: "Erode" },
                    { value: "Belgaum", label: "Belgaum" },
                    { value: "Ambattur", label: "Ambattur" },
                    { value: "Tirunelveli", label: "Tirunelveli" },
                    { value: "Malegaon", label: "Malegaon" },
                    { value: "Gaya", label: "Gaya" },
                    { value: "Udaipur", label: "Udaipur" },
                    { value: "Maheshtala", label: "Maheshtala" },
                  ]}
                />
              </div>

              {/* Experience */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 8,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Experience
                </label>
                <FilterSelect
                  value={filters.experience}
                  onChange={(v) => setFilter("experience", v)}
                  options={[
                    { value: "all", label: "Any Experience" },
                    { value: "0-2", label: "0–2 yrs (Fresher)" },
                    { value: "3-5", label: "3–5 yrs (Mid-level)" },
                    { value: "6-10", label: "6–10 yrs (Senior)" },
                    { value: "10+", label: "10+ yrs (Veteran)" },
                  ]}
                />
              </div>

              {/* Availability */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 8,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Availability
                </label>
                <FilterSelect
                  value={filters.availability}
                  onChange={(v) => setFilter("availability", v)}
                  options={[
                    { value: "all", label: "Any" },
                    { value: "available", label: "✅ Available Now" },
                    { value: "busy", label: "🔴 Currently Busy" },
                  ]}
                />
              </div>

              {/* Daily Rate */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 8,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Daily Rate
                </label>
                <FilterSelect
                  value={filters.rateRange}
                  onChange={(v) => setFilter("rateRange", v)}
                  options={[
                    { value: "all", label: "Any Rate" },
                    { value: "0-1000", label: "Under ₹1,000/day" },
                    { value: "1000-3000", label: "₹1,000–₹3,000/day" },
                    { value: "3000-7000", label: "₹3,000–₹7,000/day" },
                    { value: "7000+", label: "₹7,000+/day" },
                  ]}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                gap: 10,
              }}
            >
              <button
                onClick={onReset}
                style={{
                  flex: 1,
                  padding: 13,
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.muted,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  touchAction: "manipulation",
                  fontFamily: "inherit",
                }}
              >
                Reset
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  flex: 2,
                  padding: 13,
                  background: `linear-gradient(135deg,${C.gold},#a8863d)`,
                  border: "none",
                  borderRadius: 10,
                  color: "#1a1d24",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  touchAction: "manipulation",
                  fontFamily: "inherit",
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

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value, gold }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 0",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: C.goldDim,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={14} style={{ color: C.gold }} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: 11,
            color: C.muted,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            color: gold ? C.gold : C.text,
            fontWeight: gold ? 600 : 400,
            wordBreak: "break-word",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Mini Availability Calendar ───────────────────────────────────────────────
function MiniCalendar({ blockedDates = [], freeDates = [] }) {
  const today = new Date();
  const year = today.getFullYear(),
    month = today.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const blockedSet = new Set(blockedDates);
  const freeSet = new Set(freeDates);
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const cells = Array.from({ length: startDay + totalDays }, (_, i) =>
    i < startDay ? null : i - startDay + 1,
  );
  while (cells.length % 7 !== 0) cells.push(null);
  const fmtKey = (d) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 13,
          fontWeight: 600,
          color: C.text,
        }}
      >
        {MONTHS[month]} {year}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 3,
          marginBottom: 8,
        }}
      >
        {DAYS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 700,
              color: C.muted,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 3,
        }}
      >
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const k = fmtKey(d);
          const isBlocked = blockedSet.has(k),
            isFree = freeSet.has(k),
            isToday = d === today.getDate();
          return (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: isToday ? 700 : 400,
                background: isBlocked
                  ? "rgba(248,113,113,0.18)"
                  : isFree
                    ? "rgba(74,222,128,0.12)"
                    : "rgba(255,255,255,0.04)",
                color: isBlocked ? C.danger : isFree ? C.success : C.muted,
                border: isToday
                  ? `1px solid ${C.gold}`
                  : "1px solid transparent",
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
        {[
          { bg: "rgba(74,222,128,0.25)", label: "Free" },
          { bg: "rgba(248,113,113,0.25)", label: "Blocked" },
        ].map(({ bg, label }) => (
          <span
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: C.muted,
            }}
          >
            <div
              style={{ width: 10, height: 10, borderRadius: 3, background: bg }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Artist Detail Modal (bottom-sheet on mobile, centered card on desktop) ───
function ArtistDetailModal({ artist, onClose, onNavigate, onMessage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "rates", label: "Rates" },
    { key: "availability", label: "Availability" },
    { key: "equipment", label: "Equipment" },
  ];
  const CAT_COLORS = {
    Camera: "#60a5fa",
    Lens: "#a78bfa",
    Lighting: "#fbbf24",
    Audio: "#34d399",
    Grip: "#f97316",
  };
  const equipList = Array.isArray(artist.equipment) ? artist.equipment : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
        className="ad-overlay"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="ad-sheet"
        >
          {/* Drag handle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0 4px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                background: "rgba(255,255,255,0.13)",
                borderRadius: 4,
              }}
            />
          </div>

          {/* Hero */}
          <div className="ad-hero">
            {/* Avatar — click → full profile page */}
            <div
              onClick={onNavigate}
              style={{ cursor: "pointer", flexShrink: 0 }}
              title="View full profile"
            >
              {artist.photo ? (
                <img
                  src={artist.photo}
                  alt={artist.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${C.gold}`,
                    display: "block",
                    transition: "transform .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${C.gold},#a8863d)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `3px solid ${C.gold}`,
                  }}
                >
                  <Users size={28} color="#1a1d24" />
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      margin: "0 0 2px",
                      fontSize: "clamp(16px,3vw,20px)",
                      fontWeight: 700,
                      color: C.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {artist.name}
                  </h2>
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 13,
                      color: C.gold,
                      fontWeight: 600,
                    }}
                  >
                    {artist.role}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 12,
                        color: C.muted,
                      }}
                    >
                      <MapPin size={11} />
                      {artist.location}
                    </span>
                    {artist.experience && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 12,
                          color: C.muted,
                        }}
                      >
                        <Briefcase size={11} />
                        {artist.experience}
                      </span>
                    )}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 12,
                        color: artist.available ? C.success : C.muted,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: artist.available ? C.success : C.muted,
                        }}
                      />
                      {artist.available ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "none",
                    cursor: "pointer",
                    color: C.muted,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    touchAction: "manipulation",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats row — only show rating if real data exists */}
          <div
            style={{
              padding: "0 18px 12px",
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {artist.rating !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  background: C.goldDim,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                }}
              >
                <Star size={12} fill={C.gold} color={C.gold} />
                <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>
                  {artist.rating}
                </span>
                {artist.reviewCount > 0 && (
                  <span style={{ color: C.muted, fontSize: 12 }}>
                    ({artist.reviewCount})
                  </span>
                )}
              </div>
            )}
            {artist.dailyRate && (
              <div
                style={{
                  padding: "6px 12px",
                  background: C.goldDim,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                }}
              >
                <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>
                  {artist.dailyRate}/day
                </span>
              </div>
            )}
            {artist.responseTime && (
              <div
                style={{
                  padding: "6px 12px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                }}
              >
                <span style={{ color: C.muted, fontSize: 12 }}>
                  ⏱ {artist.responseTime}
                </span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: `1px solid ${C.border}`,
              flexShrink: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
              padding: "0 18px",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: activeTab === t.key ? C.gold : C.muted,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  borderBottom:
                    activeTab === t.key
                      ? `2px solid ${C.gold}`
                      : "2px solid transparent",
                  transition: "color .2s",
                  touchAction: "manipulation",
                  marginBottom: "-1px",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 18px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {activeTab === "overview" && (
              <div>
                {artist.bio && (
                  <div style={{ marginBottom: 16 }}>
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.muted,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      About
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13.5,
                        color: C.text,
                        lineHeight: 1.65,
                        background: "rgba(255,255,255,0.03)",
                        padding: 12,
                        borderRadius: 10,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {artist.bio}
                    </p>
                  </div>
                )}
                <DetailRow
                  icon={UserCircle}
                  label="Full Name"
                  value={artist.name}
                />
                <DetailRow
                  icon={Film}
                  label="Primary Role"
                  value={artist.role}
                  gold
                />
                <DetailRow
                  icon={Briefcase}
                  label="Experience"
                  value={artist.experience}
                />
                <DetailRow
                  icon={MapPin}
                  label="Location"
                  value={artist.location}
                />
                {artist.email && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: C.goldDim,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ExternalLink size={14} style={{ color: C.gold }} />
                    </div>
                    <div>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: 11,
                          color: C.muted,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Email
                      </p>
                      <a
                        href={`mailto:${artist.email}`}
                        style={{
                          color: C.gold,
                          fontSize: 13.5,
                          textDecoration: "none",
                        }}
                      >
                        {artist.email}
                      </a>
                    </div>
                  </div>
                )}
                {artist.portfolio && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: C.goldDim,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ExternalLink size={14} style={{ color: C.gold }} />
                    </div>
                    <div>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: 11,
                          color: C.muted,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Portfolio
                      </p>
                      <a
                        href={artist.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: C.gold,
                          fontSize: 13.5,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        View Portfolio <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "rates" && (
              <div>
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Pricing
                </p>
                {[
                  { label: "Daily Rate", value: artist.dailyRate },
                  { label: "Weekly Rate", value: artist.weeklyRate },
                  { label: "Project Rate", value: artist.projectRate },
                ].map(({ label, value }) =>
                  value ? (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${C.border}`,
                        borderRadius: 10,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: C.goldDim,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IndianRupee size={15} style={{ color: C.gold }} />
                        </div>
                        <span style={{ fontSize: 13.5, color: C.text }}>
                          {label}
                        </span>
                      </div>
                      <span
                        style={{ fontSize: 15, fontWeight: 700, color: C.gold }}
                      >
                        {value}
                      </span>
                    </div>
                  ) : null,
                )}
                {!artist.dailyRate &&
                  !artist.weeklyRate &&
                  !artist.projectRate && (
                    <p
                      style={{
                        color: C.muted,
                        fontSize: 13,
                        textAlign: "center",
                        padding: "24px 0",
                      }}
                    >
                      No rate information available.
                    </p>
                  )}
                <p
                  style={{
                    margin: "16px 0 0",
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  Rates are indicative. Final pricing subject to project scope.
                </p>
              </div>
            )}

            {activeTab === "availability" && (
              <div>
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Availability This Month
                </p>
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: 14,
                  }}
                >
                  <MiniCalendar
                    blockedDates={artist.blockedDates}
                    freeDates={artist.freeDates}
                  />
                </div>
                {artist.freeDates.length > 0 && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 14px",
                      background: C.successBg,
                      border: "1px solid rgba(74,222,128,0.2)",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <CheckCircle
                      size={15}
                      style={{ color: C.success, flexShrink: 0 }}
                    />
                    <p style={{ margin: 0, fontSize: 13, color: C.success }}>
                      <strong>{artist.freeDates.length}</strong> free day
                      {artist.freeDates.length !== 1 ? "s" : ""} this month
                    </p>
                  </div>
                )}
                {artist.blockedDates.length === 0 &&
                  artist.freeDates.length === 0 && (
                    <p
                      style={{
                        margin: "12px 0 0",
                        fontSize: 13,
                        color: C.muted,
                        textAlign: "center",
                      }}
                    >
                      No availability data provided yet.
                    </p>
                  )}
              </div>
            )}

            {activeTab === "equipment" && (
              <div>
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Equipment for Rent
                </p>
                {equipList.filter((e) => e.rentalOn).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "28px 0" }}>
                    <Package
                      size={32}
                      style={{
                        color: "rgba(156,163,175,0.18)",
                        margin: "0 auto 10px",
                        display: "block",
                      }}
                    />
                    <p style={{ color: C.muted, fontSize: 13.5, margin: 0 }}>
                      No equipment listed for rent
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {equipList
                      .filter((e) => e.rentalOn)
                      .map((eq, i) => {
                        const catColor = CAT_COLORS[eq.category] || C.gold;
                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: 12,
                              background: "rgba(255,255,255,0.03)",
                              border: `1px solid ${C.border}`,
                              borderRadius: 12,
                              alignItems: "center",
                            }}
                          >
                            {eq.img ? (
                              <img
                                src={eq.img}
                                alt={eq.name}
                                style={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: 8,
                                  objectFit: "cover",
                                  flexShrink: 0,
                                  border: `1px solid ${C.border}`,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: 8,
                                  background: "rgba(255,255,255,0.05)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Package size={20} style={{ color: C.muted }} />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 6,
                                  marginBottom: 2,
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: 13.5,
                                    fontWeight: 600,
                                    color: C.text,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {eq.name}
                                </p>
                                <span
                                  style={{
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    padding: "2px 7px",
                                    borderRadius: 20,
                                    background: `${catColor}18`,
                                    color: catColor,
                                    border: `1px solid ${catColor}30`,
                                    flexShrink: 0,
                                  }}
                                >
                                  {eq.category}
                                </span>
                              </div>
                              {eq.model && (
                                <p
                                  style={{
                                    margin: "0 0 4px",
                                    fontSize: 12,
                                    color: C.muted,
                                  }}
                                >
                                  {eq.model}
                                </p>
                              )}
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: C.gold,
                                }}
                              >
                                ₹{eq.rental}/day
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA footer */}
          <div
            style={{
              padding: "12px 18px 16px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onNavigate}
              style={{
                flex: 1,
                padding: 12,
                background: `linear-gradient(135deg,${C.gold},#a8863d)`,
                border: "none",
                borderRadius: 10,
                color: "#1a1d24",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                touchAction: "manipulation",
                fontFamily: "inherit",
              }}
            >
              View Full Profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onMessage}
              style={{
                padding: "12px 16px",
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                color: C.text,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                touchAction: "manipulation",
                fontFamily: "inherit",
              }}
            >
              <MessageSquare size={15} /> Message
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Artist Card ──────────────────────────────────────────────────────────────
function ArtistCard({ artist, index, onViewDetails, onNavigate, onMessage }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.35) }}
      whileHover={{
        y: -3,
        boxShadow: `0 10px 36px rgba(201,169,97,0.14)`,
        borderColor: C.borderHover,
      }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "border-color .2s,box-shadow .2s",
      }}
    >
      {/* Photo — click → navigate to full profile */}
      <div
        onClick={onNavigate}
        style={{
          position: "relative",
          aspectRatio: "3/4",
          maxHeight: 280,
          overflow: "hidden",
          cursor: "pointer",
        }}
        title="View full profile"
      >
        {imgErr || !artist.photo ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: 160,
              background: C.input,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={36} color={C.muted} strokeWidth={1.2} />
          </div>
        ) : (
          <img
            src={artist.photo}
            alt={artist.name}
            onError={() => setImgErr(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform .3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.08) 55%,transparent 100%)",
          }}
        />

        {/* Hover hint */}
        <div className="photo-hint">
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ExternalLink size={11} /> View Profile
          </span>
        </div>

        {/* Rating badge — only shown if real rating exists */}
        {artist.rating !== null && (
          <div
            style={{
              position: "absolute",
              top: 9,
              right: 9,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              background: "rgba(26,29,36,0.9)",
              backdropFilter: "blur(8px)",
              borderRadius: 20,
              border: `1px solid ${C.border}`,
            }}
          >
            <Star size={11} fill={C.gold} color={C.gold} />
            <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>
              {artist.rating}
            </span>
          </div>
        )}

        {/* Availability badge */}
        <div
          style={{
            position: "absolute",
            top: 9,
            left: 9,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 8px",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            background: artist.available
              ? "rgba(74,222,128,0.18)"
              : "rgba(156,163,175,0.15)",
            border: `1px solid ${artist.available ? "rgba(74,222,128,0.35)" : "rgba(156,163,175,0.2)"}`,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: artist.available ? C.success : C.muted,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: artist.available ? C.success : C.muted,
              fontSize: 10.5,
              fontWeight: 600,
            }}
          >
            {artist.available ? "Available" : "Busy"}
          </span>
        </div>

        {/* Name overlay */}
        <div style={{ position: "absolute", bottom: 11, left: 11, right: 11 }}>
          <h3
            style={{
              margin: "0 0 2px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {artist.name}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {artist.role}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              color: C.muted,
              fontSize: 11.5,
              overflow: "hidden",
            }}
          >
            <MapPin size={11} style={{ flexShrink: 0 }} />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {artist.location}
            </span>
          </span>
          {artist.experience && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                color: C.muted,
                fontSize: 11.5,
                flexShrink: 0,
              }}
            >
              <Briefcase size={11} />
              {artist.experience}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {artist.dailyRate && (
            <span
              style={{
                padding: "3px 9px",
                background: C.goldBg,
                color: C.gold,
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid ${C.border}`,
              }}
            >
              {artist.dailyRate}/day
            </span>
          )}
          {/* Real rating only — no dummy */}
          {artist.rating !== null && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                color: C.muted,
                fontSize: 11,
              }}
            >
              <Star size={10} fill={C.gold} color={C.gold} />
              {artist.rating}
              {artist.reviewCount > 0 ? ` (${artist.reviewCount})` : ""}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 7 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onViewDetails}
            style={{
              flex: 1,
              padding: "10px 6px",
              background: `linear-gradient(135deg,${C.gold},#a8863d)`,
              border: "none",
              borderRadius: 9,
              color: "#1a1d24",
              fontWeight: 700,
              fontSize: 12.5,
              cursor: "pointer",
              touchAction: "manipulation",
              fontFamily: "inherit",
            }}
          >
            View Details
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onMessage}
            style={{
              padding: "10px 11px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 9,
              color: C.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "manipulation",
            }}
          >
            <MessageSquare size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "3/4",
          maxHeight: 280,
          background: "rgba(255,255,255,0.04)",
        }}
        className="ba-pulse"
      />
      <div style={{ padding: 12 }}>
        {[70, 50, 80].map((w, i) => (
          <div
            key={i}
            className="ba-pulse"
            style={{
              height: 11,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 6,
              marginBottom: 10,
              width: `${w}%`,
            }}
          />
        ))}
        <div
          className="ba-pulse"
          style={{
            height: 34,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 9,
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function BrowseArtist() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [filters, setFilters] = useState({
    selectedCategory: "All",
    role: "all",
    location: "all",
    experience: "all",
    availability: "all",
    rateRange: "all",
  });

  const setFilter = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const resetFilters = () =>
    setFilters({
      selectedCategory: "All",
      role: "all",
      location: "all",
      experience: "all",
      availability: "all",
      rateRange: "all",
    });
  const filterCount = countActiveFilters(filters);

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await hirerAPI.getArtists();
        const list = Array.isArray(data?.artists)
          ? data.artists
          : Array.isArray(data)
            ? data
            : [];
        if (m) setArtists(list.map(mapArtist));
      } catch (e) {
        console.error(e);
      } finally {
        if (m) setIsLoading(false);
      }
    })();
    return () => {
      m = false;
    };
  }, []);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = artists.filter((a) => {
    const q = searchQuery.toLowerCase();
    if (
      q &&
      !a.name.toLowerCase().includes(q) &&
      !a.role.toLowerCase().includes(q) &&
      !a.location.toLowerCase().includes(q)
    )
      return false;
    if (
      filters.selectedCategory !== "All" &&
      a.category !== filters.selectedCategory
    )
      return false;
    if (filters.role !== "all" && a.role !== filters.role) return false;
    if (
      filters.location !== "all" &&
      !a.location.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (filters.availability === "available" && !a.available) return false;
    if (filters.availability === "busy" && a.available) return false;
    if (filters.experience !== "all") {
      const y = a.experienceYears;
      if (filters.experience === "0-2" && y > 2) return false;
      if (filters.experience === "3-5" && (y < 3 || y > 5)) return false;
      if (filters.experience === "6-10" && (y < 6 || y > 10)) return false;
      if (filters.experience === "10+" && y <= 10) return false;
    }
    if (filters.rateRange !== "all") {
      const r = parseInt(String(a.dailyRate || "").replace(/[₹$,]/g, "")) || 0;
      if (filters.rateRange === "0-1000" && r >= 1000) return false;
      if (filters.rateRange === "1000-3000" && (r < 1000 || r > 3000))
        return false;
      if (filters.rateRange === "3000-7000" && (r < 3000 || r > 7000))
        return false;
      if (filters.rateRange === "7000+" && r <= 7000) return false;
    }
    return true;
  });

  const handleNavigate = (a) => {
    setSelectedArtist(null);
    navigate(`/hirer/browse-artists/${a.id || a._id}`, {
      state: { artist: a },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: C.bg,
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      <HirerSidebar />

      <div className="ba-main">
        <div className="ba-page">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 18 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => navigate("/hirer/post-requirement")}
                  style={{
                    padding: 9,
                    borderRadius: 9,
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    cursor: "pointer",
                    color: C.text,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    touchAction: "manipulation",
                  }}
                >
                  <ArrowLeft size={17} />
                </motion.button>
                <div style={{ minWidth: 0 }}>
                  <h1 className="ba-title">Browse Artists</h1>
                  <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>
                    {isLoading
                      ? "Loading…"
                      : `${filtered.length} artist${filtered.length !== 1 ? "s" : ""} found`}
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  flexShrink: 0,
                  background: filterCount > 0 ? C.goldDim : "transparent",
                  border: `1px solid ${filterCount > 0 ? C.gold : C.border}`,
                  borderRadius: 10,
                  color: filterCount > 0 ? C.gold : C.text,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  touchAction: "manipulation",
                  transition: "all .2s",
                  fontFamily: "inherit",
                }}
              >
                <SlidersHorizontal size={15} />
                <span className="ba-filter-txt">Filters</span>
                {filterCount > 0 && (
                  <span
                    style={{
                      background: C.gold,
                      color: "#1a1d24",
                      borderRadius: 10,
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "1px 7px",
                    }}
                  >
                    {filterCount}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* ── Search ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            style={{ position: "relative", marginBottom: 14 }}
          >
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: searchFocused ? C.gold : C.muted,
                transition: "color .2s",
                pointerEvents: "none",
              }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search by name, role or location…"
              style={{
                width: "100%",
                padding: "12px 38px 12px 40px",
                background: C.card,
                border: `1px solid ${searchFocused ? C.gold : C.border}`,
                borderRadius: 12,
                color: C.text,
                fontSize: 15,
                outline: "none",
                boxShadow: searchFocused ? `0 0 0 3px ${C.goldGlow}` : "none",
                transition: "border-color .2s,box-shadow .2s",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.muted,
                  padding: 4,
                  display: "flex",
                  touchAction: "manipulation",
                }}
              >
                <X size={15} />
              </button>
            )}
          </motion.div>

          {/* ── Category chips row — SCROLLABLE ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.11 }}
            className="ba-chips-row"
          >
            {CATEGORY_FILTERS.map((f) => (
              <motion.button
                key={f.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("selectedCategory", f.value)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                  touchAction: "manipulation",
                  transition: "all .2s",
                  border: `1px solid ${filters.selectedCategory === f.value ? C.gold : C.border}`,
                  background:
                    filters.selectedCategory === f.value
                      ? `linear-gradient(135deg,${C.gold},#a8863d)`
                      : C.card,
                  color:
                    filters.selectedCategory === f.value ? "#1a1d24" : C.text,
                  fontFamily: "inherit",
                }}
              >
                {f.label}
              </motion.button>
            ))}
          </motion.div>

          {/* ── Active filter chips ── */}
          <AnimatePresence>
            {filterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 14,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 11.5, color: C.muted, flexShrink: 0 }}>
                  Active:
                </span>
                {filters.selectedCategory !== "All" && (
                  <FilterChip
                    label={filters.selectedCategory}
                    onRemove={() => setFilter("selectedCategory", "All")}
                  />
                )}
                {filters.role !== "all" && (
                  <FilterChip
                    label={`🎭 ${filters.role}`}
                    onRemove={() => setFilter("role", "all")}
                  />
                )}
                {filters.location !== "all" && (
                  <FilterChip
                    label={`📍 ${filters.location}`}
                    onRemove={() => setFilter("location", "all")}
                  />
                )}
                {filters.experience !== "all" && (
                  <FilterChip
                    label={`💼 ${filters.experience} yrs`}
                    onRemove={() => setFilter("experience", "all")}
                  />
                )}
                {filters.availability !== "all" && (
                  <FilterChip
                    label={
                      filters.availability === "available"
                        ? "✅ Available"
                        : "🔴 Busy"
                    }
                    onRemove={() => setFilter("availability", "all")}
                  />
                )}
                {filters.rateRange !== "all" && (
                  <FilterChip
                    label={`₹ ${filters.rateRange}`}
                    onRemove={() => setFilter("rateRange", "all")}
                  />
                )}
                <button
                  onClick={resetFilters}
                  style={{
                    fontSize: 12,
                    color: C.danger,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "3px 4px",
                    fontFamily: "inherit",
                    touchAction: "manipulation",
                  }}
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Grid ── */}
          {isLoading ? (
            <div className="ba-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "52px 24px",
                textAlign: "center",
              }}
            >
              <Users
                size={38}
                style={{
                  color: "rgba(156,163,175,0.18)",
                  margin: "0 auto 12px",
                  display: "block",
                }}
              />
              <p
                style={{
                  color: C.text,
                  fontSize: 15,
                  fontWeight: 600,
                  margin: "0 0 6px",
                }}
              >
                No artists found
              </p>
              <p style={{ color: C.muted, fontSize: 13, margin: "0 0 18px" }}>
                Try adjusting filters or search
              </p>
              <button
                onClick={resetFilters}
                style={{
                  padding: "10px 22px",
                  background: `linear-gradient(135deg,${C.gold},#a8863d)`,
                  border: "none",
                  borderRadius: 9,
                  color: "#1a1d24",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  touchAction: "manipulation",
                  fontFamily: "inherit",
                }}
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div className="ba-grid">
              {filtered.map((artist, i) => (
                <ArtistCard
                  key={artist.id || artist._id}
                  artist={artist}
                  index={i}
                  onViewDetails={() => setSelectedArtist(artist)}
                  onNavigate={() => handleNavigate(artist)}
                  onMessage={() =>
                    navigate("/hirer/messages", { state: { artist } })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        setFilter={setFilter}
        onReset={resetFilters}
      />

      {/* Detail modal */}
      {selectedArtist && (
        <ArtistDetailModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
          onNavigate={() => handleNavigate(selectedArtist)}
          onMessage={() => {
            setSelectedArtist(null);
            navigate("/hirer/messages", { state: { artist: selectedArtist } });
          }}
        />
      )}

      <style>{`
        /* ── Layout ── */
        .ba-main  { flex:1; overflow-x:hidden; }
        .ba-page  { max-width:1100px; margin:0 auto; padding:18px 14px 70px; }
        @media(min-width:480px)  { .ba-page { padding:22px 18px 70px; } }
        @media(min-width:768px)  { .ba-page { padding:28px 24px 60px; } }
        @media(min-width:1024px) { .ba-main { margin-left:288px; } .ba-page { padding:36px 32px 60px; } }

        /* ── Title ── */
        .ba-title { margin:0 0 3px; font-weight:700; color:#fff; letter-spacing:-0.02em;
          line-height:1.2; font-size:clamp(20px,4vw,30px); }
        .ba-filter-txt { display:none; }
        @media(min-width:380px) { .ba-filter-txt { display:inline; } }

        /* ── Category chips — PROPERLY SCROLLABLE ── */
        .ba-chips-row {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 14px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(201,169,97,0.3) transparent;
          /* CRITICAL: don't let children wrap — force horizontal scroll */
          flex-wrap: nowrap;
        }
        .ba-chips-row::-webkit-scrollbar { height: 3px; }
        .ba-chips-row::-webkit-scrollbar-track { background: transparent; }
        .ba-chips-row::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.3); border-radius: 3px; }

        /* ── Grid ── */
        .ba-grid { display:grid; gap:11px; grid-template-columns:repeat(2,1fr); }
        @media(min-width:480px)  { .ba-grid { grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:14px; } }
        @media(min-width:768px)  { .ba-grid { grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:18px; } }
        @media(min-width:1024px) { .ba-grid { grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:22px; } }

        /* ── Photo hover hint ── */
        .photo-hint { position:absolute; bottom:44px; left:0; right:0;
          display:flex; justify-content:center; opacity:0; transition:opacity .2s;
          pointer-events:none; }
        .ba-grid > div:hover .photo-hint { opacity:1; }

        /* ── Detail modal ── */
        .ad-overlay { padding:0; }
        @media(min-width:640px) { .ad-overlay { padding:20px; align-items:center !important; } }
        .ad-sheet {
          background:${C.cardDeep}; border-radius:20px 20px 0 0;
          border:1px solid ${C.border}; width:100%; max-height:92vh;
          display:flex; flex-direction:column;
          box-shadow:0 -10px 50px rgba(0,0,0,0.6); overflow:hidden;
        }
        @media(min-width:640px) {
          .ad-sheet { border-radius:16px; max-width:580px; max-height:88vh;
            box-shadow:0 24px 80px rgba(0,0,0,0.65); }
        }
        .ad-hero { padding:4px 18px 14px; display:flex; align-items:flex-start;
          gap:14px; border-bottom:1px solid ${C.border}; }

        /* ── Filter drawer ── */
        .ba-filter-drawer {
          position:fixed; bottom:0; left:0; right:0; z-index:201;
          background:${C.cardDeep}; border-radius:20px 20px 0 0;
          border-top:1px solid ${C.border}; max-height:88vh;
          display:flex; flex-direction:column;
          box-shadow:0 -10px 50px rgba(0,0,0,0.55);
        }
        @media(min-width:640px) {
          .ba-filter-drawer { top:0; bottom:0; right:0; left:auto; width:380px;
            border-radius:0; max-height:100vh; border-top:none;
            border-left:1px solid ${C.border}; box-shadow:-8px 0 40px rgba(0,0,0,0.4); }
        }
        .ba-drawer-handle { width:36px; height:4px; background:rgba(255,255,255,0.15); border-radius:4px; }
        @media(min-width:640px) { .ba-drawer-handle { display:none; } }

        /* ── Skeleton pulse ── */
        @keyframes ba-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ba-pulse { animation:ba-pulse 1.6s ease-in-out infinite; }

        /* ── Global ── */
        * { box-sizing:border-box; }
        input,select,textarea,button { -webkit-tap-highlight-color:transparent; font-family:inherit; }
        input::placeholder { color:#6b7280; }
        select option { background:${C.card}; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,169,97,0.2); border-radius:4px; }
      `}</style>
    </div>
  );
}
