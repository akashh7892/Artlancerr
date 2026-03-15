import { useEffect, useState } from "react";
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
import { artistAPI } from "../../services/api";

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

/* ─── Instagram-style avatar ─────────────────────────────────────── */
function ArtistAvatar({ src, name, className = "", style = {} }) {
  const [err, setErr] = useState(false);
  const hasImg = src && src.trim() !== "" && !err;
  const combined = {
    display: "block",
    width: "100%",
    height: "100%",
    ...style,
  };

  if (hasImg) {
    return (
      <img
        src={src}
        alt={name}
        className={`object-cover ${className}`}
        style={combined}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...combined, background: "#2c2f3a" }}
    >
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "36%",
          height: "36%",
          borderRadius: "50%",
          background: "#4b5060",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "44%",
          borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
          background: "#4b5060",
        }}
      />
    </div>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 border-0 outline-none cursor-pointer"
      style={{
        width: 42,
        height: 24,
        borderRadius: 9999,
        background: checked ? C.gold : "rgba(255,255,255,0.10)",
        transition: "background 0.25s",
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

/* ─── NativeSelect ───────────────────────────────────────────────── */
function NativeSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl appearance-none cursor-pointer outline-none"
        style={{
          background: C.bg,
          border: `1px solid ${C.inputBorder}`,
          color: C.darkText,
          padding: "10px 36px 10px 14px",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "13.5px",
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

/* ─── Privacy Modal ──────────────────────────────────────────────── */
function PrivacyModal({ privacy, setPrivacy, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center px-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(10,12,16,0.60)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl p-6"
        style={{
          background: "#22252e",
          border: `1px solid rgba(201,169,97,0.18)`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          animation: "modalIn 0.28s cubic-bezier(0.34,1.3,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full border-0 outline-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.07)", color: C.lightText }}
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <h2
          className="text-[18px] font-bold mb-1"
          style={{ color: C.darkText }}
        >
          Privacy Settings
        </h2>
        <p className="text-[12.5px] mb-5" style={{ color: C.muted }}>
          Control how you appear to other artists
        </p>
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 18,
          }}
        />
        {[
          {
            key: "showLocation",
            label: "Show My Location",
            desc: "Allow others to see your approximate location",
          },
          {
            key: "showOnlineStatus",
            label: "Show Online Status",
            desc: "Display when you're active on the platform",
          },
          {
            key: "allowConnectionRequests",
            label: "Allow Connection Requests",
            desc: "Let artists send you connection requests",
          },
        ].map(({ key, label, desc }, i) => (
          <div
            key={key}
            className={`flex items-center justify-between gap-4 ${i < 2 ? "mb-5" : "mb-5"}`}
          >
            <div>
              <p
                className="text-[13.5px] font-semibold mb-[2px]"
                style={{ color: C.darkText }}
              >
                {label}
              </p>
              <p className="text-[12px]" style={{ color: C.muted }}>
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
            marginBottom: 14,
          }}
        />
        <p className="text-[11.5px] mb-4" style={{ color: C.muted }}>
          Your exact address is never shared.
        </p>
        <button
          onClick={onClose}
          className="w-full py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
          style={{
            background: `linear-gradient(135deg,${C.gold},#d4b96e)`,
            color: "#1a1d24",
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* ─── Connect Modal ──────────────────────────────────────────────── */
function ConnectModal({ artist, onClose, onSend }) {
  const [msg, setMsg] = useState("");
  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center px-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(10,12,16,0.60)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px] rounded-2xl p-6"
        style={{
          background: "#22252e",
          border: `1px solid rgba(201,169,97,0.18)`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          animation: "modalIn 0.28s cubic-bezier(0.34,1.3,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full border-0 outline-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.07)", color: C.lightText }}
        >
          <X size={15} strokeWidth={2.2} />
        </button>
        <h2
          className="text-[18px] font-bold mb-1"
          style={{ color: C.darkText }}
        >
          Send Connection Request
        </h2>
        <p className="text-[12.5px] mb-4" style={{ color: C.muted }}>
          Introduce yourself to {artist.name}
        </p>
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-4"
          style={{ background: C.bg }}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <ArtistAvatar
              src={artist.photo}
              name={artist.name}
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div>
            <p
              className="text-[13.5px] font-semibold"
              style={{ color: C.darkText }}
            >
              {artist.name}
            </p>
            <p className="text-[12px]" style={{ color: C.gold }}>
              {artist.primarySkill}
            </p>
          </div>
        </div>
        <label
          className="block text-[12px] font-semibold mb-2"
          style={{ color: C.lightText }}
        >
          Message{" "}
          <span style={{ color: C.muted, fontWeight: 400 }}>(Optional)</span>
        </label>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="Hi! I'd love to connect..."
          className="w-full rounded-xl resize-none outline-none mb-2"
          style={{
            background: C.bg,
            border: `1px solid ${C.inputBorder}`,
            color: C.darkText,
            padding: "10px 14px",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "13px",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(201,169,97,0.45)")
          }
          onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
        />
        <p className="text-[11.5px] mb-4" style={{ color: C.muted }}>
          A thoughtful message increases your chances
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onSend();
              onClose();
            }}
            className="py-[10px] rounded-xl text-[13px] font-bold border-0 outline-none cursor-pointer"
            style={{
              background: `linear-gradient(135deg,${C.gold},#d4b96e)`,
              color: "#1a1d24",
            }}
          >
            Send Request
          </button>
          <button
            onClick={onClose}
            className="py-[10px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${C.inputBorder}`,
              color: C.darkText,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function ArtistNearby() {
  const navigate = useNavigate();

  /*
   * Distance is in km. Default = null (show ALL artists).
   * Max slider = 200 km. User can enable the filter manually.
   */
  const MAX_KM = 200;
  const [distanceKm, setDistanceKm] = useState(null); // null = disabled / show all
  const [distanceEnabled, setDistanceEnabled] = useState(false);
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connectArtist, setConnectArtist] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [privacy, setPrivacy] = useState({
    showLocation: true,
    showOnlineStatus: true,
    allowConnectionRequests: true,
  });

  useEffect(() => {
    let m = true;
    artistAPI
      .getNearbyArtists()
      .then((res) => {
        if (!m) return;
        const list = Array.isArray(res?.artists)
          ? res.artists
          : Array.isArray(res)
            ? res
            : [];
        setArtists(
          list.map((a, idx) => {
            const fd = Array.isArray(a.availability?.freeDates)
              ? a.availability.freeDates
              : [];
            const availability =
              fd.length > 10
                ? "Available Now"
                : fd.length > 0
                  ? "Available This Week"
                  : "Booking Ahead";

            /*
             * Only use real data from the API.
             * rating → only set if API provides a numeric value > 0
             * projectsCompleted → only set if API provides it directly (no fabrication)
             * distance → assign a rough km value based on index (placeholder until real geo is available)
             */
            const realRating =
              typeof a.rating === "number" && a.rating > 0 ? a.rating : null;
            const realProjects =
              typeof a.projectsCompleted === "number" && a.projectsCompleted > 0
                ? a.projectsCompleted
                : null;
            // Approximate distance in km — replace with real geo distance when available
            const distKm =
              a.distanceKm != null
                ? Number(a.distanceKm)
                : Number(((idx + 1) * 2.8).toFixed(1));

            return {
              id: a._id || a.id || `artist-${idx}`,
              name: a.name || "Artist",
              photo: a.avatar || "",
              primarySkill: a.artCategory || "Artist",
              specialties: [a.artCategory, a.experience].filter(Boolean),
              distanceKm,
              availability,
              rating: realRating, // null if no real rating
              projectsCompleted: realProjects, // null if no real data
              responseTime: a.responseTime || null,
              bio: a.bio || "Available for collaboration projects.",
              location: a.location || "",
            };
          }),
        );
      })
      .catch((e) => {
        if (!m) return;
        setError(e.message || "Failed to load");
        setArtists([]);
      })
      .finally(() => {
        if (m) setLoading(false);
      });
    return () => {
      m = false;
    };
  }, []);

  /* Filter logic — distance only applied when user has enabled it */
  const filtered = artists.filter((a) => {
    const q = searchQuery.toLowerCase();
    const passDistance =
      !distanceEnabled || distanceKm == null || a.distanceKm <= distanceKm;
    return (
      passDistance &&
      (skillFilter === "All Skills" || a.primarySkill === skillFilter) &&
      (availabilityFilter === "All" || a.availability === availabilityFilter) &&
      (!q ||
        a.name.toLowerCase().includes(q) ||
        a.primarySkill.toLowerCase().includes(q) ||
        a.specialties.some((s) => s.toLowerCase().includes(q)))
    );
  });

  /* Navigate to that artist's conversation in the messages page */
  const goToMessage = (artist) => {
    navigate(
      `/artist/messages?userId=${artist.id}&name=${encodeURIComponent(artist.name)}`,
    );
  };

  const resetFilters = () => {
    setSkillFilter("All Skills");
    setAvailabilityFilter("All");
    setDistanceEnabled(false);
    setDistanceKm(null);
    setSearchQuery("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn   { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .nb-card  { animation:fadeUp 0.3s ease both; transition:border-color 0.2s,box-shadow 0.2s,transform 0.2s; }
        .nb-card:hover { border-color:rgba(201,169,97,0.30) !important; box-shadow:0 8px 32px rgba(0,0,0,0.32); transform:translateY(-1px); }
        .nb-gold  { transition:opacity 0.15s,transform 0.15s; }
        .nb-gold:hover  { opacity:0.88; transform:translateY(-1px); }
        .nb-gold:active { transform:scale(0.97); }
        .nb-ghost { transition:border-color 0.15s,color 0.15s,background 0.15s; }
        .nb-ghost:hover { border-color:rgba(201,169,97,0.45) !important; color:#c9a961 !important; background:rgba(201,169,97,0.05) !important; }
        .range-input { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:9999px; background:linear-gradient(to right,#c9a961 0%,#c9a961 var(--val),rgba(255,255,255,0.10) var(--val),rgba(255,255,255,0.10) 100%); outline:none; cursor:pointer; }
        .range-input::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#c9a961; cursor:pointer; box-shadow:0 1px 6px rgba(0,0,0,0.4); }
        .range-input::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#c9a961; cursor:pointer; border:none; }
        .filter-panel { animation:slideDown 0.25s ease both; }
        input::placeholder, textarea::placeholder { color:rgba(139,163,144,0.45); }
        .dist-disabled { opacity:0.45; pointer-events:none; }
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
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-7 max-w-[1100px]">
          {/* ── Header ── */}
          <div
            className="flex items-center gap-3 mb-5"
            style={{ animation: "fadeUp 0.3s ease both" }}
          >
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-0 outline-none cursor-pointer flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: C.darkText,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
            >
              <ArrowLeft size={17} strokeWidth={2} />
            </button>
            <div className="flex-1 min-w-0">
              <h1
                className="font-bold leading-tight"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(18px,5vw,26px)",
                }}
              >
                Nearby Artists
              </h1>
              <p
                className="hidden sm:block text-[13px] mt-[2px]"
                style={{ color: C.lightText }}
              >
                Connect with artists in your area
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen((p) => !p)}
                className="sm:hidden nb-ghost flex items-center gap-1.5 px-3 py-[7px] rounded-xl border-0 outline-none cursor-pointer text-[12.5px] font-semibold"
                style={{
                  background: C.card,
                  border: `1px solid ${C.inputBorder}`,
                  color: C.darkText,
                }}
              >
                <Filter size={14} /> Filters
              </button>
              <button
                onClick={() => setShowPrivacy(true)}
                className="nb-ghost flex items-center gap-1.5 px-3 sm:px-4 py-[7px] rounded-xl border-0 outline-none cursor-pointer font-semibold"
                style={{
                  background: C.card,
                  border: `1px solid ${C.inputBorder}`,
                  color: C.darkText,
                  fontSize: "12.5px",
                }}
              >
                <Settings size={14} />
                <span className="hidden sm:inline">Privacy</span>
              </button>
            </div>
          </div>

          {/* ── Filters ── */}
          <div
            className={`${filtersOpen ? "block filter-panel" : "hidden"} sm:block`}
          >
            <div
              className="rounded-2xl p-4 sm:p-5 mb-5"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Filter size={14} style={{ color: C.gold }} />
                <h2
                  className="text-[14px] font-bold"
                  style={{ color: C.darkText }}
                >
                  Filters
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[12px] font-semibold"
                    style={{ color: C.lightText }}
                  >
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: C.lightText }}
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Name or skill..."
                      className="w-full rounded-xl outline-none"
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.inputBorder}`,
                        color: C.darkText,
                        padding: "9px 12px 9px 32px",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: "13px",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "rgba(201,169,97,0.4)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = C.inputBorder)
                      }
                    />
                  </div>
                </div>

                {/* Skill */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[12px] font-semibold"
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
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[12px] font-semibold"
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

                {/* Distance in KM — disabled by default, user must toggle on */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-[12px] font-semibold"
                      style={{ color: C.lightText }}
                    >
                      Distance
                      {distanceEnabled && distanceKm != null ? (
                        <span style={{ color: C.gold }}>
                          {" "}
                          — {distanceKm} km
                        </span>
                      ) : (
                        <span style={{ color: "rgba(139,163,144,0.5)" }}>
                          {" "}
                          — All
                        </span>
                      )}
                    </label>
                    {/* Toggle to enable/disable distance filter */}
                    <Toggle
                      checked={distanceEnabled}
                      onChange={(v) => {
                        setDistanceEnabled(v);
                        if (v && distanceKm == null) setDistanceKm(50); // sensible default when first enabled
                      }}
                    />
                  </div>
                  <div className={distanceEnabled ? "" : "dist-disabled"}>
                    <input
                      type="range"
                      min={5}
                      max={MAX_KM}
                      step={5}
                      value={distanceKm ?? 50}
                      onChange={(e) => setDistanceKm(Number(e.target.value))}
                      className="range-input mt-1"
                      style={{
                        "--val": `${((distanceKm ?? 50) / MAX_KM) * 100}%`,
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <span
                        className="text-[10.5px]"
                        style={{ color: "rgba(139,163,144,0.5)" }}
                      >
                        5 km
                      </span>
                      <span
                        className="text-[10.5px]"
                        style={{ color: "rgba(139,163,144,0.5)" }}
                      >
                        {MAX_KM} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile apply/reset */}
              <div className="sm:hidden mt-4 flex gap-2">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 py-[9px] rounded-xl text-[13px] font-bold border-0 outline-none cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg,${C.gold},#d4b96e)`,
                    color: "#1a1d24",
                  }}
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setFiltersOpen(false);
                  }}
                  className="px-4 py-[9px] rounded-xl text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${C.inputBorder}`,
                    color: C.lightText,
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Count */}
          <p className="text-[12.5px] mb-4" style={{ color: C.lightText }}>
            Showing{" "}
            <span style={{ color: C.darkText, fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "artist" : "artists"}
            {distanceEnabled && distanceKm != null && (
              <span>
                {" "}
                within <span style={{ color: C.gold }}>{distanceKm} km</span>
              </span>
            )}
          </p>

          {error && (
            <p className="text-[12px] mb-3" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          {/* ── Cards ── */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {loading ? (
              <div className="flex justify-center py-14">
                <div className="w-9 h-9 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-14 rounded-2xl"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <Users
                  size={36}
                  strokeWidth={1.2}
                  className="mx-auto mb-3"
                  style={{ color: "rgba(201,169,97,0.25)" }}
                />
                <p
                  className="text-[14px] font-semibold mb-1"
                  style={{ color: C.darkText }}
                >
                  No artists found
                </p>
                <p
                  className="text-[12.5px] mb-4"
                  style={{ color: C.lightText }}
                >
                  Try adjusting your filters or increasing the distance
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-[8px] rounded-xl text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
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
                    className="nb-card rounded-2xl overflow-hidden"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      animationDelay: `${0.05 + i * 0.04}s`,
                    }}
                  >
                    {/* ══ MOBILE ══ */}
                    <div className="flex sm:hidden">
                      <div
                        className="relative flex-shrink-0 overflow-hidden"
                        style={{ width: 108, minHeight: 140 }}
                      >
                        <ArtistAvatar
                          src={artist.photo}
                          name={artist.name}
                          style={{ width: 108, height: "100%", minHeight: 140 }}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to right,transparent 55%,rgba(34,37,46,0.8))",
                          }}
                        />
                        {/* distance badge only if enabled */}
                        {distanceEnabled && (
                          <div className="absolute bottom-2 left-2">
                            <span
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9.5px] font-semibold"
                              style={{
                                background: "rgba(0,0,0,0.7)",
                                backdropFilter: "blur(4px)",
                                color: "#fff",
                              }}
                            >
                              <MapPin size={8} /> {artist.distanceKm} km
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 p-3 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <p
                              className="font-bold text-[14px] leading-snug truncate"
                              style={{ color: C.darkText }}
                            >
                              {artist.name}
                            </p>
                            <p
                              className="text-[11.5px] font-semibold"
                              style={{ color: C.gold }}
                            >
                              {artist.primarySkill}
                            </p>
                          </div>
                          <span
                            className="flex-shrink-0 px-2 py-[2px] rounded-full text-[9px] font-bold border"
                            style={{
                              background: avail.bg,
                              borderColor: avail.border,
                              color: avail.color,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {artist.availability === "Available Now"
                              ? "Now"
                              : artist.availability === "Available This Week"
                                ? "This Week"
                                : "Ahead"}
                          </span>
                        </div>

                        <p
                          className="text-[11.5px] line-clamp-2 mb-2 leading-relaxed"
                          style={{ color: C.lightText }}
                        >
                          {artist.bio}
                        </p>

                        {/* Only show stats that have real values */}
                        <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                          {artist.rating != null && (
                            <span
                              className="flex items-center gap-1 text-[11px]"
                              style={{ color: C.lightText }}
                            >
                              <Star
                                size={10}
                                style={{ color: C.gold }}
                                fill={C.gold}
                              />
                              <span
                                style={{ color: C.darkText, fontWeight: 600 }}
                              >
                                {artist.rating}
                              </span>
                            </span>
                          )}
                          {artist.projectsCompleted != null && (
                            <span
                              className="flex items-center gap-1 text-[11px]"
                              style={{ color: C.lightText }}
                            >
                              <Briefcase size={10} /> {artist.projectsCompleted}{" "}
                              projects
                            </span>
                          )}
                          {artist.location && (
                            <span
                              className="flex items-center gap-1 text-[11px] truncate"
                              style={{ color: C.lightText }}
                            >
                              <MapPin size={10} />{" "}
                              {artist.location.split(",")[0]}
                            </span>
                          )}
                        </div>

                        {/* 3 buttons */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => setConnectArtist(artist)}
                            className="nb-gold py-[7px] rounded-xl text-[10.5px] font-bold border-0 outline-none cursor-pointer flex items-center justify-center gap-1"
                            style={{
                              background: `linear-gradient(135deg,${C.gold},#d4b96e)`,
                              color: "#1a1d24",
                            }}
                          >
                            <Users size={11} strokeWidth={2.2} /> Connect
                          </button>
                          <button
                            onClick={() => goToMessage(artist)}
                            className="nb-ghost py-[7px] rounded-xl text-[10.5px] font-semibold border-0 outline-none cursor-pointer flex items-center justify-center gap-1"
                            style={{
                              background: "transparent",
                              border: `1px solid ${C.inputBorder}`,
                              color: C.darkText,
                            }}
                          >
                            <MessageSquare size={11} /> Message
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/artist/near-by-artists/${artist.id}`)
                            }
                            className="nb-ghost py-[7px] rounded-xl text-[10.5px] font-semibold border-0 outline-none cursor-pointer flex items-center justify-center"
                            style={{
                              background: "transparent",
                              border: `1px solid ${C.inputBorder}`,
                              color: C.darkText,
                            }}
                          >
                            Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ══ DESKTOP ══ */}
                    <div className="hidden sm:flex">
                      <div
                        className="relative flex-shrink-0 overflow-hidden"
                        style={{ width: 180, minHeight: 220 }}
                      >
                        <ArtistAvatar
                          src={artist.photo}
                          name={artist.name}
                          style={{ width: 180, height: "100%", minHeight: 220 }}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 48%)",
                          }}
                        />
                        {/* Distance badge only when filter is enabled */}
                        {distanceEnabled && (
                          <div className="absolute bottom-3 left-3">
                            <span
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                              style={{
                                background: "rgba(0,0,0,0.65)",
                                backdropFilter: "blur(6px)",
                                color: "#fff",
                              }}
                            >
                              <MapPin size={10} /> {artist.distanceKm} km away
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-5 lg:p-6">
                        <div className="flex items-start justify-between mb-2.5 gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3
                                className="font-bold"
                                style={{
                                  color: C.darkText,
                                  fontSize: "clamp(15px,2.5vw,17px)",
                                }}
                              >
                                {artist.name}
                              </h3>
                              {/* Top Rated only if real rating is high enough */}
                              {artist.rating != null &&
                                artist.rating >= 4.8 && (
                                  <span
                                    className="flex items-center gap-1 px-2 py-[2px] rounded-full text-[10.5px] font-semibold"
                                    style={{
                                      background: C.goldDim,
                                      color: C.gold,
                                      border: `1px solid rgba(201,169,97,0.22)`,
                                    }}
                                  >
                                    <CheckCircle size={10} /> Top Rated
                                  </span>
                                )}
                            </div>
                            <p
                              className="text-[13px] font-semibold mb-2"
                              style={{ color: C.gold }}
                            >
                              {artist.primarySkill}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {artist.specialties.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-[9px] py-[3px] rounded-full text-[11px]"
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
                            className="flex-shrink-0 px-2.5 py-[4px] rounded-full text-[11px] font-semibold border"
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
                          className="text-[12.5px] mb-3 line-clamp-2 leading-relaxed"
                          style={{ color: C.lightText }}
                        >
                          {artist.bio}
                        </p>

                        {/* Stats — only real values shown, nothing fabricated */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {artist.rating != null && (
                            <div
                              className="flex items-center gap-1.5 text-[12px]"
                              style={{ color: C.lightText }}
                            >
                              <Star
                                size={12}
                                style={{ color: C.gold }}
                                fill={C.gold}
                              />
                              <span
                                style={{ color: C.darkText, fontWeight: 600 }}
                              >
                                {artist.rating}
                              </span>{" "}
                              rating
                            </div>
                          )}
                          {artist.projectsCompleted != null && (
                            <div
                              className="flex items-center gap-1.5 text-[12px]"
                              style={{ color: C.lightText }}
                            >
                              <Briefcase size={12} /> {artist.projectsCompleted}{" "}
                              projects
                            </div>
                          )}
                          {artist.responseTime && (
                            <div
                              className="flex items-center gap-1.5 text-[12px]"
                              style={{ color: C.lightText }}
                            >
                              <Clock size={12} /> {artist.responseTime}
                            </div>
                          )}
                          {artist.location && (
                            <div
                              className="flex items-center gap-1.5 text-[12px]"
                              style={{ color: C.lightText }}
                            >
                              <MapPin size={12} /> {artist.location}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => setConnectArtist(artist)}
                            className="nb-gold flex items-center gap-1.5 px-4 py-[8px] rounded-xl text-[12.5px] font-bold border-0 outline-none cursor-pointer"
                            style={{
                              background: `linear-gradient(135deg,${C.gold},#d4b96e)`,
                              color: "#1a1d24",
                            }}
                          >
                            <Users size={13} strokeWidth={2.2} /> Connect
                          </button>
                          {/* Message → goes directly to that artist's conversation */}
                          <button
                            onClick={() => goToMessage(artist)}
                            className="nb-ghost flex items-center gap-1.5 px-4 py-[8px] rounded-xl text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
                            style={{
                              background: "transparent",
                              border: `1px solid ${C.inputBorder}`,
                              color: C.darkText,
                            }}
                          >
                            <MessageSquare size={13} /> Message
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/artist/near-by-artists/${artist.id}`)
                            }
                            className="nb-ghost flex items-center gap-1.5 px-4 py-[8px] rounded-xl text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
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
