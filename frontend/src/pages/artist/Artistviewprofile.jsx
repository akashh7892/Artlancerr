import { useState } from "react";
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

// ─── Color tokens ──────────────────────────────────────────────
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

// Full artist data (same as nearby list, extended with extra fields)
const ARTISTS_MAP = {
  1: {
    id: 1,
    name: "Marcus Lee",
    photo:
      "https://images.unsplash.com/photo-1699269266070-97882aaf9fec?w=600&q=80",
    coverPhoto:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&q=80",
    primarySkill: "Choreographer",
    specialties: ["Contemporary", "Hip Hop", "Ballroom"],
    distance: 2.3,
    availability: "Available Now",
    rating: 4.8,
    projectsCompleted: 24,
    responseTime: "Within 2 hours",
    location: "Los Angeles, CA",
    about:
      "Professional choreographer specializing in contemporary fusion with over 8 years of experience in theater and film productions. Passionate about creating innovative movement that tells compelling stories.",
    experience: [
      {
        role: "Lead Choreographer",
        company: "Broadway Dance Theater",
        period: "2020 – Present",
        desc: "Creating original choreography for major theatrical productions",
      },
      {
        role: "Dance Instructor",
        company: "LA Dance Academy",
        period: "2018 – 2020",
        desc: "Teaching contemporary and hip hop to students of all levels",
      },
    ],
    portfolio: [
      {
        img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
        title: "Contemporary Showcase",
      },
      {
        img: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&q=80",
        title: "Hip Hop Battle",
      },
      {
        img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
        title: "Music Video – 2023",
      },
      {
        img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&q=80",
        title: "Theater Production",
      },
    ],
    reviews: [
      {
        name: "Sony Pictures",
        avatar: "SP",
        rating: 5,
        text: "Marcus brought an incredible energy to our production. Highly professional and creative.",
        date: "Dec 2024",
      },
      {
        name: "Universal Music",
        avatar: "UM",
        rating: 5,
        text: "Outstanding choreographer. The music video exceeded all expectations.",
        date: "Oct 2024",
      },
      {
        name: "LA Dance Co.",
        avatar: "LD",
        rating: 4,
        text: "Great communicator, delivered on time and within budget. Will hire again.",
        date: "Aug 2024",
      },
    ],
  },
  2: {
    id: 2,
    name: "Alex Rivera",
    photo:
      "https://images.unsplash.com/photo-1768885511762-4f8a888b0a6f?w=600&q=80",
    coverPhoto:
      "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1200&q=80",
    primarySkill: "Cinematographer",
    specialties: ["Color Grading", "Lighting", "Drone"],
    distance: 4.7,
    availability: "Available Now",
    rating: 5.0,
    projectsCompleted: 56,
    responseTime: "Within 1 hour",
    location: "Los Angeles, CA",
    about:
      "Award-winning cinematographer with 10+ years crafting visual narratives for top studios worldwide. Specializing in cinematic storytelling through light, shadow and motion.",
    experience: [
      {
        role: "Director of Photography",
        company: "Paramount Pictures",
        period: "2021 – Present",
        desc: "Leading cinematography on major studio productions",
      },
      {
        role: "Camera Operator",
        company: "Netflix Originals",
        period: "2018 – 2021",
        desc: "Operating on high-profile streaming productions",
      },
    ],
    portfolio: [
      {
        img: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&q=80",
        title: "Cinematic Reel 2024",
      },
      {
        img: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=400&q=80",
        title: "Short Film – Dawn",
      },
      {
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
        title: "Nature Documentary",
      },
      {
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
        title: "Commercial Shoot",
      },
    ],
    reviews: [
      {
        name: "Paramount Studios",
        avatar: "PS",
        rating: 5,
        text: "Alex's eye for light and composition is unmatched. Every frame was stunning.",
        date: "Jan 2025",
      },
      {
        name: "Netflix",
        avatar: "NF",
        rating: 5,
        text: "Phenomenal work ethic and creative vision. One of the best in the industry.",
        date: "Nov 2024",
      },
    ],
  },
};

// Fallback for unknown IDs
const DEFAULT_ARTIST = ARTISTS_MAP[1];

const TABS = ["Overview", "Portfolio", "Reviews"];

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
        className="relative w-full max-w-[460px] rounded-2xl p-7"
        style={{
          background: "#22252e",
          border: "1px solid rgba(201,169,97,0.18)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
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
          className="text-[19px] font-bold mb-1"
          style={{ color: C.darkText }}
        >
          Send Connection Request
        </h2>
        <p className="text-[13px] mb-5" style={{ color: C.muted }}>
          Introduce yourself to {artist.name}
        </p>
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
            border: `1px solid rgba(255,255,255,0.08)`,
            color: C.darkText,
            padding: "11px 14px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(201,169,97,0.45)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
        <p className="text-[12px] mb-5" style={{ color: C.muted }}>
          A thoughtful message increases your chances of connecting
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
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
              border: `1px solid rgba(255,255,255,0.08)`,
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

export default function ArtistProfileView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const artist = ARTISTS_MAP[Number(id)] || DEFAULT_ARTIST;
  const [activeTab, setActiveTab] = useState("Overview");
  const [showConnect, setShowConnect] = useState(false);
  const avail =
    AVAIL_STYLE[artist.availability] || AVAIL_STYLE["Available Now"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .tab-btn { transition: color 0.15s, border-color 0.15s; }
        .pf-social-btn { transition: background 0.15s, border-color 0.15s; }
        .pf-social-btn:hover { background: rgba(201,169,97,0.10) !important; border-color: rgba(201,169,97,0.35) !important; }
        .pf-action-outline { transition: border-color 0.15s, color 0.15s; }
        .pf-action-outline:hover { border-color: rgba(201,169,97,0.45) !important; color: #c9a961 !important; }
      `}</style>

      <Sidebar />
      {showConnect && (
        <ConnectModal artist={artist} onClose={() => setShowConnect(false)} />
      )}

      <div
        className="lg:ml-[248px] min-h-screen"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* ── Cover Photo ── */}
        <div className="relative w-full" style={{ height: 260 }}>
          <img
            src={artist.coverPhoto}
            alt="cover"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(26,29,36,0.3) 0%, rgba(26,29,36,0.75) 100%)",
            }}
          />
          {/* Back button */}
          <button
            onClick={() => navigate("/artist/near-by-artists")}
            className="absolute top-5 left-5 flex items-center justify-center w-9 h-9 rounded-xl border-0 outline-none cursor-pointer transition-all"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              color: "#fff",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.6)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.4)")
            }
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
        </div>

        {/* ── Profile Card ── */}
        <div className="px-6 md:px-8">
          <div
            className="rounded-2xl p-6 -mt-10 relative z-10 mb-5"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              animation: "fadeUp 0.3s ease both",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              {/* Avatar */}
              <img
                src={artist.photo}
                alt={artist.name}
                className="w-[90px] h-[90px] rounded-2xl object-cover flex-shrink-0"
                style={{
                  border: "3px solid rgba(201,169,97,0.35)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1
                    className="text-[22px] font-bold"
                    style={{ color: C.darkText }}
                  >
                    {artist.name}
                  </h1>
                  {artist.rating >= 4.8 && (
                    <span
                      className="flex items-center gap-1 px-2 py-[3px] rounded-full text-[11px] font-semibold"
                      style={{
                        background: C.goldDim,
                        color: C.gold,
                        border: "1px solid rgba(201,169,97,0.22)",
                      }}
                    >
                      <CheckCircle size={11} /> Top Rated
                    </span>
                  )}
                  <span
                    className="ml-auto flex-shrink-0 px-3 py-[4px] rounded-full text-[12px] font-semibold border"
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
                  className="text-[14px] font-semibold mb-2"
                  style={{ color: C.gold }}
                >
                  {artist.primarySkill}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {artist.specialties.map((s, i) => (
                    <span
                      key={i}
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
                {/* Stats row */}
                <div
                  className="flex flex-wrap gap-4 text-[12.5px]"
                  style={{ color: C.lightText }}
                >
                  <span className="flex items-center gap-1.5">
                    <Star size={13} style={{ color: C.gold }} />
                    <span style={{ color: C.darkText, fontWeight: 600 }}>
                      {artist.rating}
                    </span>{" "}
                    rating
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={13} />
                    {artist.projectsCompleted} projects
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {artist.responseTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {artist.distance} mi away
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5 flex-wrap">
              <button
                onClick={() => navigate(`/artist/messages?userId=${artist.id}`)}
                className="flex items-center gap-2 px-5 py-[10px] rounded-xl text-[13px] font-bold border-0 outline-none cursor-pointer transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${C.gold}, #d4b96e)`,
                  color: "#1a1d24",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <MessageSquare size={15} /> Send Message
              </button>
              <button
                onClick={() => setShowConnect(true)}
                className="pf-action-outline flex items-center gap-2 px-5 py-[10px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
                style={{
                  background: "transparent",
                  border: `1px solid ${C.inputBorder}`,
                  color: C.darkText,
                }}
              >
                <Users size={15} /> Connect
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div
            className="flex items-center gap-1 mb-5"
            style={{ borderBottom: `1px solid ${C.inputBorder}` }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="tab-btn px-5 py-[11px] text-[13.5px] font-semibold border-0 outline-none cursor-pointer bg-transparent relative"
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

          {/* ── Tab Content ── */}
          <div
            style={{ animation: "fadeUp 0.25s ease both", paddingBottom: 48 }}
          >
            {/* OVERVIEW */}
            {activeTab === "Overview" && (
              <div className="flex flex-col gap-5">
                {/* About */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <h2
                    className="text-[16px] font-bold mb-3"
                    style={{ color: C.darkText }}
                  >
                    About
                  </h2>
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {artist.about}
                  </p>
                </div>

                {/* Experience */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <h2
                    className="text-[16px] font-bold mb-5"
                    style={{ color: C.darkText }}
                  >
                    Experience
                  </h2>
                  <div className="flex flex-col gap-5">
                    {artist.experience.map((exp, i) => (
                      <div key={i} className="flex gap-4">
                        <div
                          className="w-[3px] rounded-full flex-shrink-0 mt-1"
                          style={{ background: C.gold, minHeight: "100%" }}
                        />
                        <div>
                          <p
                            className="text-[14.5px] font-bold mb-[2px]"
                            style={{ color: C.darkText }}
                          >
                            {exp.role}
                          </p>
                          <p
                            className="text-[13px] font-semibold mb-[2px]"
                            style={{ color: C.gold }}
                          >
                            {exp.company}
                          </p>
                          <p
                            className="text-[12px] mb-1"
                            style={{ color: C.muted }}
                          >
                            {exp.period}
                          </p>
                          <p
                            className="text-[13px]"
                            style={{ color: C.lightText }}
                          >
                            {exp.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connect / Social */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <h2
                    className="text-[16px] font-bold mb-4"
                    style={{ color: C.darkText }}
                  >
                    Connect
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { Icon: Instagram, label: "Instagram" },
                      { Icon: Facebook, label: "Facebook" },
                      { Icon: Linkedin, label: "LinkedIn" },
                    ].map(({ Icon, label }) => (
                      <button
                        key={label}
                        className="pf-social-btn flex items-center gap-2 px-4 py-[9px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.inputBorder}`,
                          color: C.darkText,
                        }}
                      >
                        <Icon size={15} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO */}
            {activeTab === "Portfolio" && (
              <div
                className="rounded-2xl p-6"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <h2
                  className="text-[16px] font-bold mb-5"
                  style={{ color: C.darkText }}
                >
                  Portfolio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {artist.portfolio.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden relative group cursor-pointer"
                      style={{ aspectRatio: "4/3" }}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 flex items-end p-3 transition-opacity"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
                        }}
                      >
                        <p
                          className="text-[12px] font-semibold"
                          style={{ color: "#fff" }}
                        >
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "Reviews" && (
              <div
                className="rounded-2xl p-6"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2
                    className="text-[16px] font-bold"
                    style={{ color: C.darkText }}
                  >
                    Reviews
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star size={16} style={{ color: C.gold }} />
                    <span
                      className="text-[15px] font-bold"
                      style={{ color: C.darkText }}
                    >
                      {artist.rating}
                    </span>
                    <span className="text-[13px]" style={{ color: C.muted }}>
                      ({artist.reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {artist.reviews.map((rev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl"
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.inputBorder}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                            style={{ background: C.goldDim, color: C.gold }}
                          >
                            {rev.avatar}
                          </div>
                          <div>
                            <p
                              className="text-[13.5px] font-semibold"
                              style={{ color: C.darkText }}
                            >
                              {rev.name}
                            </p>
                            <p
                              className="text-[11.5px]"
                              style={{ color: C.muted }}
                            >
                              {rev.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rev.rating }).map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              style={{ color: C.gold }}
                              fill={C.gold}
                            />
                          ))}
                        </div>
                      </div>
                      <p
                        className="text-[13px] leading-relaxed"
                        style={{ color: C.lightText }}
                      >
                        {rev.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
