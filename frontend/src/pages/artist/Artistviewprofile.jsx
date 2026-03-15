import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Briefcase,
  Clock,
  MessageSquare,
  Users,
  CheckCircle,
  Instagram,
  Facebook,
  Linkedin,
  X,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { fetchAPI } from "../../services/api";

const C = {
  bg: "#1a1d24",
  card: "#22252e",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#c9a961",
  goldDim: "rgba(201,169,97,0.12)",
  border: "rgba(201,169,97,0.10)",
  inputBorder: "rgba(255,255,255,0.08)",
  muted: "#5a6e7d",
};
const AVAIL_STYLE = {
  "Available Now": {
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.25)",
    color: "#22c55e",
  },
  "Available This Week": {
    bg: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.25)",
    color: "#3b82f6",
  },
  "Booking Ahead": {
    bg: "rgba(234,179,8,0.10)",
    border: "rgba(234,179,8,0.25)",
    color: "#eab308",
  },
};
const EMPTY_ARTIST = {
  id: "",
  name: "",
  photo: "",
  coverPhoto: "",
  primarySkill: "",
  specialties: [],
  distance: null,
  availability: "Booking Ahead",
  rating: null,
  projectsCompleted: 0,
  responseTime: "",
  location: "",
  about: "",
  experience: [],
  portfolio: [],
  reviews: [],
};
const TABS = ["Overview", "Portfolio", "Reviews"];

/* ─── Instagram-style avatar: real photo OR dark silhouette ───────── */
function ArtistAvatar({
  src,
  name,
  size = 90,
  radius = "16px",
  border = "3px solid rgba(201,169,97,0.35)",
}) {
  const [err, setErr] = useState(false);
  const hasImg = src && src.trim() !== "" && !err;

  const wrap = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: radius,
    overflow: "hidden",
    border,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  };

  if (hasImg) {
    return (
      <div style={wrap}>
        <img
          src={src}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={() => setErr(true)}
        />
      </div>
    );
  }
  return (
    <div style={{ ...wrap, background: "#2c2f3a", position: "relative" }}>
      {/* head */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: "50%",
          background: "#4b5060",
        }}
      />
      {/* body arc */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.7,
          height: size * 0.44,
          borderRadius: `${size * 0.35}px ${size * 0.35}px 0 0`,
          background: "#4b5060",
        }}
      />
    </div>
  );
}

/* ─── Empty cover banner ─────────────────────────────────────────── */
function CoverBanner({ src, height }) {
  const [err, setErr] = useState(false);
  const hasImg = src && src.trim() !== "" && !err;

  if (hasImg) {
    return (
      <div className="relative w-full" style={{ height }}>
        <img
          src={src}
          alt="cover"
          className="w-full h-full object-cover"
          onError={() => setErr(true)}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom,rgba(26,29,36,0.25) 0%,rgba(26,29,36,0.72) 100%)",
          }}
        />
      </div>
    );
  }
  /* No cover → elegant dark patterned placeholder */
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height,
        background:
          "linear-gradient(135deg,#1a1d24 0%,#22252e 50%,#1a1d24 100%)",
      }}
    >
      {/* subtle diagonal grid */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.07,
        }}
      >
        <defs>
          <pattern id="pg" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M48 0L0 0 0 48"
              fill="none"
              stroke="#c9a961"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pg)" />
      </svg>
      {/* faint "no cover" label in centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "rgba(201,169,97,0.22)" }}
        >
          No Cover Photo
        </p>
      </div>
      {/* gold accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg,transparent,#c9a961 40%,transparent)",
        }}
      />
    </div>
  );
}

/* ─── Connect Modal ──────────────────────────────────────────────── */
function ConnectModal({ artist, onClose }) {
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
        className="relative w-full max-w-[460px] rounded-2xl p-6"
        style={{
          background: "#22252e",
          border: "1px solid rgba(201,169,97,0.18)",
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
          <ArtistAvatar
            src={artist.photo}
            name={artist.name}
            size={48}
            radius="50%"
            border="none"
          />
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
          className="block text-[12.5px] font-semibold mb-2"
          style={{ color: C.lightText }}
        >
          Message{" "}
          <span style={{ color: C.muted, fontWeight: 400 }}>(Optional)</span>
        </label>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="Hi! I'd love to connect and explore collaboration opportunities..."
          className="w-full rounded-xl resize-none outline-none mb-2"
          style={{
            background: C.bg,
            border: `1px solid rgba(255,255,255,0.08)`,
            color: C.darkText,
            padding: "10px 14px",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "13px",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(201,169,97,0.45)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
        <p className="text-[12px] mb-4" style={{ color: C.muted }}>
          A thoughtful message increases your chances
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
            style={{
              background: `linear-gradient(135deg,${C.gold},#d4b96e)`,
              color: "#1a1d24",
            }}
          >
            Send Request
          </button>
          <button
            onClick={onClose}
            className="py-[11px] rounded-xl text-[13.5px] font-semibold border-0 outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(255,255,255,0.08)`,
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

/* ─── Main Profile View ──────────────────────────────────────────── */
export default function ArtistProfileView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [artist, setArtist] = useState(EMPTY_ARTIST);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showConnect, setShowConnect] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  useEffect(() => {
    if (!id) return;
    let m = true;
    fetchAPI(`/artist/${id}`)
      .then((data) => {
        if (!m) return;
        setArtist((prev) => ({
          ...prev,
          id: data._id || id,
          name: data.name || prev.name,
          photo: data.avatar || prev.photo,
          coverPhoto: data.coverPhoto || prev.coverPhoto,
          primarySkill: data.artCategory || prev.primarySkill,
          specialties: [data.artCategory, data.experience].filter(Boolean),
          location: data.location || prev.location,
          about: data.bio || prev.about,
          portfolio: Array.isArray(data.portfolio)
            ? data.portfolio.map((p, idx) => ({
                img:
                  p.thumbnailUrl ||
                  p.mediaUrl ||
                  prev.portfolio[idx % prev.portfolio.length]?.img,
                title: p.title || "Portfolio",
              }))
            : prev.portfolio,
        }));
      })
      .catch(() => {});
    return () => {
      m = false;
    };
  }, [id]);

  const avail =
    AVAIL_STYLE[artist.availability] || AVAIL_STYLE["Available Now"];

  /* Responsive cover height */
  const coverH =
    typeof window !== "undefined" && window.innerWidth < 640 ? 180 : 240;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .tab-btn { transition:color 0.15s,border-color 0.15s; }
        .pf-social-btn { transition:background 0.15s,border-color 0.15s; }
        .pf-social-btn:hover { background:rgba(201,169,97,0.10) !important; border-color:rgba(201,169,97,0.35) !important; }
        .pf-outline { transition:border-color 0.15s,color 0.15s; }
        .pf-outline:hover { border-color:rgba(201,169,97,0.45) !important; color:#c9a961 !important; }
        .pf-gold { transition:opacity 0.15s,transform 0.15s; }
        .pf-gold:hover  { opacity:0.88; transform:translateY(-1px); }
        .pf-gold:active { transform:scale(0.97); }
        input::placeholder, textarea::placeholder { color:rgba(139,163,144,0.45); }
      `}</style>

      <Sidebar />

      {showConnect && (
        <ConnectModal artist={artist} onClose={() => setShowConnect(false)} />
      )}

      {/* Portfolio lightbox */}
      {selectedPortfolio && (
        <div
          className="fixed inset-0 z-[3500] flex items-center justify-center px-4"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "rgba(10,12,16,0.88)",
          }}
          onClick={() => setSelectedPortfolio(null)}
        >
          <div
            className="relative rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              background: "#0a0c10",
              border: "1px solid rgba(201,169,97,0.15)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.9)",
              animation: "modalIn 0.3s cubic-bezier(0.34,1.3,0.64,1) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPortfolio(null)}
              className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full border-0 outline-none cursor-pointer z-10"
              style={{ background: "rgba(0,0,0,0.65)", color: "#fff" }}
            >
              <X size={17} strokeWidth={2.5} />
            </button>
            <img
              src={selectedPortfolio.img}
              alt={selectedPortfolio.title}
              className="max-w-full max-h-full object-contain"
            />
            {selectedPortfolio.title && (
              <div
                className="absolute bottom-0 left-0 right-0 p-4 text-center"
                style={{
                  background:
                    "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 100%)",
                }}
              >
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: "#fff" }}
                >
                  {selectedPortfolio.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="lg:ml-[248px] min-h-screen"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        {/* ── Cover ── */}
        <div className="relative">
          <CoverBanner src={artist.coverPhoto} height={coverH} />
          {/* Back button overlaid on cover */}
          <button
            onClick={() => navigate("/artist/near-by-artists")}
            className="absolute flex items-center justify-center w-9 h-9 rounded-xl border-0 outline-none cursor-pointer"
            style={{
              top: 14,
              left: 14,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.45)")
            }
          >
            <ArrowLeft size={17} strokeWidth={2} />
          </button>
        </div>

        {/* ── Profile card: overlaps cover ── */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-4 sm:p-6 -mt-8 sm:-mt-10 relative z-10 mb-4 sm:mb-5"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              animation: "fadeUp 0.3s ease both",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Avatar — sits on top of the card overlap */}
              <div className="flex-shrink-0 -mt-10 sm:-mt-14">
                <ArtistAvatar
                  src={artist.photo}
                  name={artist.name}
                  size={
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? 72
                      : 90
                  }
                  radius="14px"
                />
              </div>

              {/* Info block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1
                      className="font-bold"
                      style={{
                        color: C.darkText,
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(18px,5vw,22px)",
                      }}
                    >
                      {artist.name || "Loading..."}
                    </h1>
                    {artist.rating >= 4.8 && (
                      <span
                        className="flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-semibold"
                        style={{
                          background: C.goldDim,
                          color: C.gold,
                          border: "1px solid rgba(201,169,97,0.22)",
                        }}
                      >
                        <CheckCircle size={10} /> Top Rated
                      </span>
                    )}
                  </div>
                  <span
                    className="flex-shrink-0 px-2.5 py-[3px] rounded-full text-[11px] font-semibold border"
                    style={{
                      background: avail.bg,
                      borderColor: avail.border,
                      color: avail.color,
                    }}
                  >
                    {artist.availability}
                  </span>
                </div>

                {artist.primarySkill && (
                  <p
                    className="text-[13px] sm:text-[14px] font-semibold mb-2"
                    style={{ color: C.gold }}
                  >
                    {artist.primarySkill}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {artist.specialties.map((s, i) => (
                    <span
                      key={i}
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

                {/* Stats — wrap on small screens */}
                <div
                  className="flex flex-wrap gap-3 text-[12px]"
                  style={{ color: C.lightText }}
                >
                  {artist.rating != null && (
                    <span className="flex items-center gap-1.5">
                      <Star size={12} style={{ color: C.gold }} fill={C.gold} />
                      <span style={{ color: C.darkText, fontWeight: 600 }}>
                        {artist.rating}
                      </span>{" "}
                      rating
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={12} />
                    {artist.projectsCompleted} projects
                  </span>
                  {artist.responseTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {artist.responseTime}
                    </span>
                  )}
                  {artist.distance != null && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {artist.distance} mi away
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={() => navigate(`/artist/messages?userId=${artist.id}`)}
                className="pf-gold flex items-center gap-2 px-4 sm:px-5 py-[9px] sm:py-[10px] rounded-xl text-[12.5px] sm:text-[13px] font-bold border-0 outline-none cursor-pointer"
                style={{
                  background: `linear-gradient(135deg,${C.gold},#d4b96e)`,
                  color: "#1a1d24",
                }}
              >
                <MessageSquare size={14} /> Send Message
              </button>
              <button
                onClick={() => setShowConnect(true)}
                className="pf-outline flex items-center gap-2 px-4 sm:px-5 py-[9px] sm:py-[10px] rounded-xl text-[12.5px] sm:text-[13px] font-semibold border-0 outline-none cursor-pointer"
                style={{
                  background: "transparent",
                  border: `1px solid ${C.inputBorder}`,
                  color: C.darkText,
                }}
              >
                <Users size={14} /> Connect
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div
            className="flex items-center gap-0 mb-4 overflow-x-auto"
            style={{
              borderBottom: `1px solid ${C.inputBorder}`,
              scrollbarWidth: "none",
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="tab-btn flex-shrink-0 px-4 sm:px-5 py-[10px] sm:py-[11px] text-[13px] sm:text-[13.5px] font-semibold border-0 outline-none cursor-pointer bg-transparent relative"
                  style={{
                    color: active ? C.gold : C.lightText,
                    borderBottom: active
                      ? `2px solid ${C.gold}`
                      : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* ── Tab content ── */}
          <div
            style={{ animation: "fadeUp 0.25s ease both", paddingBottom: 56 }}
          >
            {/* OVERVIEW */}
            {activeTab === "Overview" && (
              <div className="flex flex-col gap-4">
                {/* About */}
                <div
                  className="rounded-2xl p-4 sm:p-6"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <h2
                    className="text-[15px] font-bold mb-3"
                    style={{ color: C.darkText }}
                  >
                    About
                  </h2>
                  <p
                    className="text-[13px] sm:text-[13.5px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {artist.about || "No bio provided yet."}
                  </p>
                </div>

                {/* Experience */}
                {artist.experience.length > 0 && (
                  <div
                    className="rounded-2xl p-4 sm:p-6"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <h2
                      className="text-[15px] font-bold mb-4"
                      style={{ color: C.darkText }}
                    >
                      Experience
                    </h2>
                    <div className="flex flex-col gap-4">
                      {artist.experience.map((exp, i) => (
                        <div key={i} className="flex gap-3 sm:gap-4">
                          <div
                            className="w-[3px] rounded-full flex-shrink-0 self-stretch"
                            style={{ background: C.gold }}
                          />
                          <div>
                            <p
                              className="text-[14px] font-bold mb-[2px]"
                              style={{ color: C.darkText }}
                            >
                              {exp.role}
                            </p>
                            <p
                              className="text-[12.5px] font-semibold mb-[2px]"
                              style={{ color: C.gold }}
                            >
                              {exp.company}
                            </p>
                            <p
                              className="text-[11.5px] mb-1"
                              style={{ color: C.muted }}
                            >
                              {exp.period}
                            </p>
                            <p
                              className="text-[12.5px]"
                              style={{ color: C.lightText }}
                            >
                              {exp.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connect / Social */}
                <div
                  className="rounded-2xl p-4 sm:p-6"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <h2
                    className="text-[15px] font-bold mb-3"
                    style={{ color: C.darkText }}
                  >
                    Connect
                  </h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {[
                      { Icon: Instagram, label: "Instagram" },
                      { Icon: Facebook, label: "Facebook" },
                      { Icon: Linkedin, label: "LinkedIn" },
                    ].map(({ Icon, label }) => (
                      <button
                        key={label}
                        className="pf-social-btn flex items-center gap-2 px-3 sm:px-4 py-[8px] sm:py-[9px] rounded-xl text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.inputBorder}`,
                          color: C.darkText,
                        }}
                      >
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO */}
            {activeTab === "Portfolio" && (
              <div
                className="rounded-2xl p-4 sm:p-6"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <h2
                  className="text-[15px] font-bold mb-4"
                  style={{ color: C.darkText }}
                >
                  Portfolio
                </h2>
                {artist.portfolio.length === 0 ? (
                  <p
                    className="text-[13px] text-center py-8"
                    style={{ color: "rgba(139,163,144,0.4)" }}
                  >
                    No portfolio items yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {artist.portfolio.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden relative group cursor-pointer"
                        style={{ aspectRatio: "4/3" }}
                        onClick={() =>
                          setSelectedPortfolio({ ...item, index: i })
                        }
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0 flex items-end p-2 sm:p-3 transition-opacity opacity-0 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 50%)",
                          }}
                        >
                          <p
                            className="text-[11px] sm:text-[12px] font-semibold"
                            style={{ color: "#fff" }}
                          >
                            {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "Reviews" && (
              <div
                className="rounded-2xl p-4 sm:p-6"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-[15px] font-bold"
                    style={{ color: C.darkText }}
                  >
                    Reviews
                  </h2>
                  {artist.rating != null && (
                    <div className="flex items-center gap-2">
                      <Star size={15} style={{ color: C.gold }} fill={C.gold} />
                      <span
                        className="text-[15px] font-bold"
                        style={{ color: C.darkText }}
                      >
                        {artist.rating}
                      </span>
                      <span
                        className="text-[12.5px]"
                        style={{ color: C.muted }}
                      >
                        ({artist.reviews.length})
                      </span>
                    </div>
                  )}
                </div>
                {artist.reviews.length === 0 ? (
                  <p
                    className="text-[13px] text-center py-8"
                    style={{ color: "rgba(139,163,144,0.4)" }}
                  >
                    No reviews yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {artist.reviews.map((rev, i) => (
                      <div
                        key={i}
                        className="p-3 sm:p-4 rounded-xl"
                        style={{
                          background: C.bg,
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                              style={{ background: C.goldDim, color: C.gold }}
                            >
                              {rev.avatar}
                            </div>
                            <div>
                              <p
                                className="text-[13px] font-semibold"
                                style={{ color: C.darkText }}
                              >
                                {rev.name}
                              </p>
                              <p
                                className="text-[11px]"
                                style={{ color: C.muted }}
                              >
                                {rev.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, j) => (
                              <Star
                                key={j}
                                size={11}
                                style={{ color: C.gold }}
                                fill={C.gold}
                              />
                            ))}
                          </div>
                        </div>
                        <p
                          className="text-[12.5px] leading-relaxed"
                          style={{ color: C.lightText }}
                        >
                          {rev.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
