import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  X,
  User,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Briefcase,
  ChevronDown,
  Users,
  Loader2,
  Instagram,
  Youtube,
  Globe,
  Star,
  Calendar,
  Package,
  Play,
  Twitter,
  IndianRupee,
  UserCircle,
  Film,
  Lightbulb,
  Camera,
} from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  cardDeep: "#22252e",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  goldBg: "rgba(201,169,97,0.12)",
  goldDim: "rgba(201,169,97,0.07)",
  text: "#ffffff",
  muted: "#9ca3af",
  dim: "#6b7280",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.12)",
  successBdr: "rgba(74,222,128,0.25)",
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.12)",
  dangerBdr: "rgba(248,113,113,0.25)",
  warn: "#fbbf24",
  warnBg: "rgba(251,191,36,0.12)",
  info: "#93c5fd",
  infoBg: "rgba(147,197,253,0.12)",
};

const CAT_COLORS = {
  Camera: "#60a5fa",
  Lens: "#a78bfa",
  Lighting: "#fbbf24",
  Audio: "#34d399",
  Grip: "#f97316",
  Other: C.gold,
};
const CAT_ICONS = {
  Camera,
  Lens: Package,
  Lighting: Lightbulb,
  Audio: Package,
  Grip: Package,
  Other: Package,
};

const STATUS_CFG = {
  pending: { bg: C.warnBg, color: C.warn, label: "Pending", icon: Clock3 },
  hired: {
    bg: C.successBg,
    color: C.success,
    label: "Accepted",
    icon: CheckCircle2,
  },
  accepted: {
    bg: C.successBg,
    color: C.success,
    label: "Accepted",
    icon: CheckCircle2,
  },
  rejected: {
    bg: C.dangerBg,
    color: C.danger,
    label: "Rejected",
    icon: XCircle,
  },
  shortlisted: {
    bg: C.infoBg,
    color: C.info,
    label: "Shortlisted",
    icon: Star,
  },
  in_review: {
    bg: "rgba(196,181,253,0.12)",
    color: "#c4b5fd",
    label: "In Review",
    icon: Eye,
  },
};
const sCfg = (s) =>
  STATUS_CFG[String(s || "pending").toLowerCase()] || STATUS_CFG.pending;
const labelForStatus = (s) => sCfg(s).label;

/* A status is considered "actioned" (not the default pending) when it has
   been explicitly set by the hirer — so all three action buttons collapse. */
const isActioned = (s) => {
  const v = String(s || "pending").toLowerCase();
  return v === "hired" || v === "accepted" || v === "rejected";
};

const fmt = (v) => (v && String(v).trim() ? String(v).trim() : null);
const money = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  return s.startsWith("₹") || s.startsWith("$") ? s : `₹${s}`;
};
const dateIN = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
const dateSh = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

const SLabel = ({ children, noGap }) => (
  <p
    style={{
      margin: noGap ? "0" : "0 0 9px",
      fontSize: "10.5px",
      fontWeight: "700",
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    }}
  >
    {children}
  </p>
);

function InfoRow({ icon: Icon, label, value, gold, href }) {
  if (!value) return null;
  const inner = (
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
            fontWeight: "600",
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
            wordBreak: "break-word",
            color: gold ? C.gold : C.text,
            fontWeight: gold ? "600" : "400",
          }}
        >
          {value}
        </p>
      </div>
      {href && (
        <ExternalLink
          size={12}
          style={{ color: C.muted, flexShrink: 0, marginTop: 2 }}
        />
      )}
    </div>
  );
  if (href)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
      >
        {inner}
      </a>
    );
  return inner;
}

function RateTile({ label, value }) {
  const d = money(value) || value;
  if (!d) return null;
  return (
    <div
      style={{
        flex: "1 1 100px",
        padding: "10px 14px",
        background: C.input,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: "0 0 3px",
          fontSize: 10,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: "600",
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: "700", color: C.gold }}>
        {d}
      </p>
    </div>
  );
}

function SocialLink({ icon: Icon, color, href, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        color: C.text,
        textDecoration: "none",
        fontSize: 13,
      }}
    >
      <Icon size={13} style={{ color: color || C.gold, flexShrink: 0 }} />
      {label}
    </a>
  );
}

function MiniCalendar({ blockedDates = [], freeDates = [] }) {
  const today = new Date();
  const year = today.getFullYear(),
    month = today.getMonth();
  const total = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();
  const bSet = new Set(blockedDates),
    fSet = new Set(freeDates);
  const DLBL = ["S", "M", "T", "W", "T", "F", "S"];
  const MLBL = [
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
  const key = (d) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const cells = Array.from({ length: start + total }, (_, i) =>
    i < start ? null : i - start + 1,
  );
  while (cells.length % 7 !== 0) cells.push(null);
  return (
    <div>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 13,
          fontWeight: "600",
          color: C.text,
        }}
      >
        {MLBL[month]} {year}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 3,
          marginBottom: 6,
        }}
      >
        {DLBL.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: "700",
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
          const k = key(d),
            bl = bSet.has(k),
            fr = fSet.has(k),
            td = d === today.getDate();
          return (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: td ? "700" : "400",
                background: bl
                  ? "rgba(248,113,113,0.18)"
                  : fr
                    ? "rgba(74,222,128,0.12)"
                    : "rgba(255,255,255,0.04)",
                color: bl ? C.danger : fr ? C.success : C.muted,
                border: td ? `2px solid ${C.gold}` : "1px solid transparent",
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
        {[
          { bg: "rgba(74,222,128,0.25)", bdr: "", lbl: "Free" },
          { bg: "rgba(248,113,113,0.25)", bdr: "", lbl: "Blocked" },
          { bg: "transparent", bdr: `1px solid ${C.gold}`, lbl: "Today" },
        ].map(({ bg, bdr, lbl }) => (
          <span
            key={lbl}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: C.muted,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: bg,
                border: bdr || "none",
              }}
            />
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
}

function PortfolioThumb({ item }) {
  const [err, setErr] = useState(false);
  const thumb = item?.thumbnailUrl || item?.mediaUrl || item?.imageUrl || null;
  const title = item?.title || item?.projectName || "Work";
  const type = item?.category || item?.workType || null;
  const link = item?.link || item?.url || null;
  return (
    <a
      href={link || undefined}
      target={link ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          borderRadius: 9,
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16/10",
          border: `1px solid ${C.border}`,
          background: C.input,
          cursor: link ? "pointer" : "default",
        }}
      >
        {thumb && !err ? (
          <img
            src={thumb}
            alt={title}
            onError={() => setErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={18} style={{ color: "rgba(156,163,175,0.35)" }} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 55%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "7px 9px",
          }}
        >
          {type && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: C.gold,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 1,
              }}
            >
              {type}
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
          {link && (
            <span
              style={{
                fontSize: 10,
                color: C.gold,
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginTop: 2,
              }}
            >
              <ExternalLink size={9} />
              View
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ARTIST DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════
function ArtistDetailPanel({
  app,
  onClose,
  onUpdateStatus,
  busyId,
  onNavigateToProfile,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [avatarErr, setAvatarErr] = useState(false);
  const [coverErr, setCoverErr] = useState(false);

  useEffect(() => {
    setActiveTab("overview");
    setAvatarErr(false);
    setCoverErr(false);
  }, [app?._id]);

  if (!app) return null;

  const artist = app.artist || app.applicant || {};
  const opp = app.opportunity || {};
  const status = String(app.status || "pending").toLowerCase();
  const isBusy = busyId === app._id;
  const cfg = sCfg(status);
  const acted = isActioned(status);

  const name =
    fmt(artist.name || artist.fullName || artist.username) || "Artist";
  const email = fmt(artist.email || app.email);
  const phone = fmt(artist.phone || app.phone);
  const location = fmt(artist.location || app.location);
  const bio = fmt(artist.bio || artist.about);
  const experience = fmt(artist.experience || artist.yearsOfExperience);
  const role = fmt(artist.artCategory || artist.role || artist.category);
  const avatar = fmt(artist.profileImage || artist.avatar || artist.photo);
  const coverPhoto = fmt(artist.coverPhoto || artist.coverImage);
  const responseTime = fmt(artist.responseTime);
  const coverNote = fmt(app.coverLetter || app.note || app.message);

  const dailyRate = money(artist?.rates?.daily || app?.rates?.daily);
  const weeklyRate = money(artist?.rates?.weekly || app?.rates?.weekly);
  const projectRate = fmt(artist?.rates?.project || app?.rates?.project);

  const portfolioStr =
    typeof artist.portfolio === "string" ? artist.portfolio : null;
  const portfolioUrl = fmt(
    portfolioStr || artist.portfolioUrl || app.portfolio || null,
  );
  const instagram = fmt(artist.instagram || artist.instagramUrl);
  const youtube = fmt(artist.youtube || artist.youtubeUrl);
  const website = fmt(artist.website || artist.websiteUrl);
  const twitter = fmt(artist.twitter || artist.twitterUrl);

  const skills = [
    ...(role ? [role] : []),
    ...(Array.isArray(artist.skills) ? artist.skills : []),
  ].filter((v, i, a) => v && a.indexOf(v) === i);
  const portfolioItems = Array.isArray(artist.portfolio)
    ? artist.portfolio
    : Array.isArray(app.portfolio)
      ? app.portfolio
      : [];
  const blockedDates = Array.isArray(artist?.availability?.blockedDates)
    ? artist.availability.blockedDates
    : [];
  const freeDates = Array.isArray(artist?.availability?.freeDates)
    ? artist.availability.freeDates
    : [];
  const equipment = Array.isArray(artist.equipment) ? artist.equipment : [];
  const reviews = Array.isArray(artist.reviews) ? artist.reviews : [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? Number(
          (
            reviews.reduce((s, r) => s + Number(r?.rating || 0), 0) /
            reviewCount
          ).toFixed(1),
        )
      : null;
  const appliedLong = dateIN(app.createdAt);

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "rates", label: "Rates" },
    { key: "availability", label: "Availability" },
    { key: "portfolio", label: "Portfolio" },
    { key: "equipment", label: "Equipment" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div className="adp-panel">
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg,${C.gold},#a8863d,transparent)`,
            flexShrink: 0,
          }}
        />
        <div className="adp-handle">
          <div
            style={{
              width: 36,
              height: 4,
              background: "rgba(255,255,255,0.13)",
              borderRadius: 4,
            }}
          />
        </div>

        {/* Cover */}
        <div
          style={{
            position: "relative",
            height: 108,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {coverPhoto && !coverErr ? (
            <img
              src={coverPhoto}
              alt="cover"
              onError={() => setCoverErr(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg,${C.bg},${C.card})`,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,transparent 25%,#22252e 100%)",
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              background: "rgba(26,29,36,0.88)",
              backdropFilter: "blur(6px)",
              border: `1px solid ${C.border}`,
              borderRadius: 9,
              color: C.muted,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Avatar + name */}
        <div
          style={{
            padding: "0 20px 14px",
            marginTop: -44,
            flexShrink: 0,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div
              onClick={onNavigateToProfile}
              title="Open full artist profile"
              style={{
                position: "relative",
                flexShrink: 0,
                cursor: "pointer",
                paddingBottom: 18,
              }}
            >
              {avatar && !avatarErr ? (
                <img
                  src={avatar}
                  alt={name}
                  onError={() => setAvatarErr(true)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${C.gold}`,
                    display: "block",
                    boxShadow: `0 0 0 4px ${C.goldGlow}`,
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
                  <User size={28} style={{ color: "#1a1d24" }} />
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.gold,
                  whiteSpace: "nowrap",
                  background: "rgba(26,29,36,0.85)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  letterSpacing: "0.03em",
                }}
              >
                VIEW PROFILE
              </div>
            </div>
            <span
              style={{
                padding: "5px 13px",
                borderRadius: 20,
                background: cfg.bg,
                color: cfg.color,
                fontSize: 12,
                fontWeight: 700,
                alignSelf: "flex-start",
                marginTop: 46,
                flexShrink: 0,
              }}
            >
              {labelForStatus(status)}
            </span>
          </div>
          <h2
            style={{
              margin: "18px 0 3px",
              fontSize: "clamp(17px,3vw,21px)",
              fontWeight: 700,
              color: C.text,
            }}
          >
            {name}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
            {role && (
              <span style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>
                {role}
              </span>
            )}
            {location && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: C.muted,
                }}
              >
                <MapPin size={11} style={{ color: C.gold }} />
                {location}
              </span>
            )}
            {experience && (
              <span style={{ fontSize: 12, color: C.muted }}>
                {experience} exp
              </span>
            )}
            {avgRating !== null && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 12,
                  color: C.text,
                  fontWeight: 600,
                }}
              >
                <Star size={11} fill={C.gold} color={C.gold} />
                {avgRating} ({reviewCount})
              </span>
            )}
          </div>
        </div>

        {/* Applied strip */}
        <div
          style={{
            padding: "9px 20px",
            flexShrink: 0,
            background: C.goldDim,
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 600,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Applied for
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {opp.title || app.opportunityTitle || "—"}
            </p>
          </div>
          {appliedLong && (
            <span style={{ fontSize: 11.5, color: C.muted, flexShrink: 0 }}>
              {appliedLong}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="adp-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`adp-tab${activeTab === t.key ? " adp-tab-active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 20px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {activeTab === "overview" && (
            <div>
              {(dailyRate || weeklyRate || projectRate) && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <RateTile label="Daily" value={dailyRate} />
                  <RateTile label="Weekly" value={weeklyRate} />
                  <RateTile label="Project" value={projectRate} />
                </div>
              )}
              {bio && (
                <div style={{ marginBottom: 18 }}>
                  <SLabel>About</SLabel>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      color: C.text,
                      lineHeight: 1.65,
                      background: "rgba(255,255,255,0.03)",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      borderLeft: `3px solid ${C.gold}`,
                    }}
                  >
                    {bio}
                  </p>
                </div>
              )}
              {skills.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <SLabel>Skills &amp; Category</SLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {skills.map((sk, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "4px 12px",
                          background: C.goldBg,
                          border: `1px solid ${C.border}`,
                          borderRadius: 20,
                          fontSize: 12.5,
                          color: C.gold,
                          fontWeight: 500,
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginBottom: 18 }}>
                <InfoRow icon={UserCircle} label="Full Name" value={name} />
                <InfoRow icon={Film} label="Primary Role" value={role} gold />
                <InfoRow
                  icon={Briefcase}
                  label="Experience"
                  value={experience}
                />
                <InfoRow icon={MapPin} label="Location" value={location} />
              </div>
              {(email || phone) && (
                <div style={{ marginBottom: 18 }}>
                  <SLabel>Contact</SLabel>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 7 }}
                  >
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "9px 12px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 8,
                          border: `1px solid ${C.border}`,
                          color: C.text,
                          textDecoration: "none",
                          fontSize: 13,
                        }}
                      >
                        <Mail
                          size={13}
                          style={{ color: C.gold, flexShrink: 0 }}
                        />
                        {email}
                      </a>
                    )}
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "9px 12px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 8,
                          border: `1px solid ${C.border}`,
                          color: C.text,
                          textDecoration: "none",
                          fontSize: 13,
                        }}
                      >
                        <Phone
                          size={13}
                          style={{ color: C.gold, flexShrink: 0 }}
                        />
                        {phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
              {(portfolioUrl || instagram || youtube || twitter || website) && (
                <div style={{ marginBottom: 18 }}>
                  <SLabel>Links &amp; Social</SLabel>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <SocialLink
                      icon={ExternalLink}
                      color={C.gold}
                      href={portfolioUrl}
                      label="View Portfolio"
                    />
                    <SocialLink
                      icon={Instagram}
                      color="#e1306c"
                      href={instagram}
                      label="Instagram"
                    />
                    <SocialLink
                      icon={Youtube}
                      color="#ff0000"
                      href={youtube}
                      label="YouTube"
                    />
                    <SocialLink
                      icon={Twitter}
                      color="#1da1f2"
                      href={twitter}
                      label="Twitter / X"
                    />
                    <SocialLink
                      icon={Globe}
                      color={C.gold}
                      href={website}
                      label="Website"
                    />
                  </div>
                </div>
              )}
              {responseTime && (
                <div style={{ marginBottom: 18 }}>
                  <SLabel>Response Time</SLabel>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 13px",
                      background: C.input,
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      fontSize: 13,
                      color: C.text,
                    }}
                  >
                    <Clock3 size={13} style={{ color: C.gold }} />
                    {responseTime}
                  </div>
                </div>
              )}
              {coverNote && (
                <div style={{ marginBottom: 18 }}>
                  <SLabel>Cover Note</SLabel>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      color: C.muted,
                      lineHeight: 1.65,
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 10,
                      padding: "12px 14px",
                      borderLeft: `3px solid ${C.gold}`,
                    }}
                  >
                    {coverNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "rates" && (
            <div>
              <SLabel>Pricing</SLabel>
              {[
                { label: "Daily Rate", value: dailyRate },
                { label: "Weekly Rate", value: weeklyRate },
                { label: "Project Rate", value: projectRate },
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
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
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
                      style={{ fontSize: 16, fontWeight: 700, color: C.gold }}
                    >
                      {value}
                    </span>
                  </div>
                ) : null,
              )}
              {!dailyRate && !weeklyRate && !projectRate && (
                <p
                  style={{
                    color: C.muted,
                    fontSize: 13,
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  No rate information provided.
                </p>
              )}
            </div>
          )}

          {activeTab === "availability" && (
            <div>
              <SLabel>Availability This Month</SLabel>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <MiniCalendar
                  blockedDates={blockedDates}
                  freeDates={freeDates}
                />
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div>
              <SLabel>Portfolio Work</SLabel>
              {portfolioItems.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
                    gap: 8,
                  }}
                >
                  {portfolioItems.map((item, i) => (
                    <PortfolioThumb key={i} item={item} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <Play
                    size={32}
                    style={{
                      color: "rgba(156,163,175,0.18)",
                      margin: "0 auto 10px",
                      display: "block",
                    }}
                  />
                  <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
                    No portfolio items yet
                  </p>
                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 12,
                        padding: "8px 18px",
                        background: C.goldBg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 9,
                        color: C.gold,
                        textDecoration: "none",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      <ExternalLink size={13} /> View External Portfolio
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "equipment" && (
            <div>
              <SLabel>Equipment &amp; Gear</SLabel>
              {equipment.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <Package
                    size={32}
                    style={{
                      color: "rgba(156,163,175,0.18)",
                      margin: "0 auto 10px",
                      display: "block",
                    }}
                  />
                  <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
                    No equipment listed
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {equipment.map((eq, i) => {
                    const avail = eq.rentalOn !== false;
                    const catColor = CAT_COLORS[eq.category] || C.gold;
                    const CatIcon = CAT_ICONS[eq.category] || Package;
                    return (
                      <div
                        key={eq._id || i}
                        style={{
                          display: "flex",
                          gap: 12,
                          padding: 12,
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${avail ? C.border : "rgba(255,255,255,0.04)"}`,
                          borderRadius: 12,
                          alignItems: "center",
                          opacity: avail ? 1 : 0.45,
                        }}
                      >
                        {eq.img ? (
                          <img
                            src={eq.img}
                            alt={eq.name}
                            style={{
                              width: 54,
                              height: 54,
                              borderRadius: 8,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 54,
                              height: 54,
                              borderRadius: 8,
                              background: "rgba(255,255,255,0.05)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <CatIcon size={22} style={{ color: C.muted }} />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 6,
                              marginBottom: 3,
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
                              {eq.name || "Equipment"}
                            </p>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 7px",
                                borderRadius: 20,
                                background: `${catColor}18`,
                                color: catColor,
                                border: `1px solid ${catColor}30`,
                                flexShrink: 0,
                              }}
                            >
                              {eq.category || "Other"}
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {eq.rental ? (
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
                            ) : (
                              <span />
                            )}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 9px",
                                borderRadius: 20,
                                background: avail ? C.successBg : C.dangerBg,
                                border: `1px solid ${avail ? C.successBdr : C.dangerBdr}`,
                              }}
                            >
                              <div
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: avail ? C.success : C.danger,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  color: avail ? C.success : C.danger,
                                }}
                              >
                                {avail ? "Available" : "Booked"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <SLabel noGap>Reviews</SLabel>
                {avgRating !== null && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      background: C.goldBg,
                      border: `1px solid ${C.border}`,
                      borderRadius: 20,
                    }}
                  >
                    <Star size={11} fill={C.gold} color={C.gold} />
                    <span
                      style={{ fontSize: 11, fontWeight: 700, color: C.gold }}
                    >
                      {avgRating}
                    </span>
                    <span style={{ fontSize: 11, color: C.muted }}>
                      ({reviewCount})
                    </span>
                  </div>
                )}
              </div>
              {reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <Star
                    size={30}
                    style={{
                      color: "rgba(156,163,175,0.18)",
                      margin: "0 auto 10px",
                      display: "block",
                    }}
                  />
                  <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
                    No reviews yet
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {reviews.map((r, i) => {
                    const rName =
                      r.name || r.reviewerName || r.hirer?.name || "Anonymous";
                    const rText = r.text || r.comment || r.message || "";
                    const rRating = Number(r.rating || 0);
                    const rDate = dateSh(r.createdAt || r.date);
                    return (
                      <div
                        key={r._id || i}
                        style={{
                          padding: "12px 14px",
                          background: C.input,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 7,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {rName}
                          </span>
                          <div style={{ display: "flex", gap: 2 }}>
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                size={11}
                                fill={j < rRating ? C.gold : "transparent"}
                                color={j < rRating ? C.gold : C.muted}
                              />
                            ))}
                          </div>
                        </div>
                        {rText && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              color: C.muted,
                              lineHeight: 1.55,
                            }}
                          >
                            {rText}
                          </p>
                        )}
                        {rDate && (
                          <p
                            style={{
                              margin: "5px 0 0",
                              fontSize: 10.5,
                              color: C.dim,
                            }}
                          >
                            {rDate}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer actions ──
            If the application has been actioned (accepted/rejected),
            show only the status chip — no buttons.
            Otherwise show all three action buttons.
        ── */}
        <div
          style={{
            padding: "12px 20px 14px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 7,
            flexShrink: 0,
            background: C.cardDeep,
            flexWrap: "wrap",
          }}
        >
          {/* Full profile button — always visible */}
          <button
            onClick={onNavigateToProfile}
            style={{
              flex: "2 1 120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "10px",
              borderRadius: 9,
              background: `linear-gradient(135deg,${C.gold},#a8863d)`,
              border: "none",
              color: "#1a1d24",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <UserCircle size={14} /> Full Profile
          </button>

          {acted ? (
            /* Status already set — show pill only, no action buttons */
            <div
              style={{
                flex: "3 1 160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 9,
                background: cfg.bg,
                border: `1px solid ${cfg.color}28`,
              }}
            >
              <cfg.icon size={15} style={{ color: cfg.color }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>
                {labelForStatus(status)}
              </span>
            </div>
          ) : (
            /* Pending — show all three action buttons */
            <>
              <button
                disabled={isBusy}
                onClick={() => onUpdateStatus(app._id, "hired")}
                style={{
                  flex: "1 1 68px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "10px",
                  borderRadius: 9,
                  border: "none",
                  background: C.successBg,
                  color: C.success,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: isBusy ? 0.5 : 1,
                }}
              >
                <CheckCircle2 size={13} /> Accept
              </button>
              <button
                disabled={isBusy}
                onClick={() => onUpdateStatus(app._id, "rejected")}
                style={{
                  flex: "1 1 68px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "10px",
                  borderRadius: 9,
                  border: "none",
                  background: C.dangerBg,
                  color: C.danger,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: isBusy ? 0.5 : 1,
                }}
              >
                <XCircle size={13} /> Reject
              </button>
              <button
                disabled={isBusy}
                onClick={() => onUpdateStatus(app._id, "pending")}
                style={{
                  flex: "1 1 68px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "10px",
                  borderRadius: 9,
                  border: "none",
                  background: C.warnBg,
                  color: C.warn,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: isBusy ? 0.5 : 1,
                }}
              >
                <Clock3 size={13} /> Pending
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION CARD
// ═══════════════════════════════════════════════════════════════════════════
function AppCard({
  app,
  isOpen,
  onToggleDetail,
  onUpdateStatus,
  busyId,
  showOpp,
  onNavigateToProfile,
}) {
  const [avatarErr, setAvatarErr] = useState(false);

  const status = String(app.status || "pending").toLowerCase();
  const cfg = sCfg(status);
  const acted = isActioned(status);
  const artist = app.artist || {};
  const opp = app.opportunity || {};

  const name = artist.name || artist.username || "Artist";
  const location = artist.location || "";
  const role = artist.artCategory || artist.role || "";
  const avatar = artist.profileImage || artist.avatar || "";
  const experience = artist.experience || "";
  const note = app.coverLetter || app.note || app.message || "";
  const skills = Array.isArray(artist.skills) ? artist.skills : [];
  const isBusy = busyId === app._id;
  const dailyRate = artist?.rates?.daily
    ? String(artist.rates.daily).startsWith("₹")
      ? artist.rates.daily
      : `₹${artist.rates.daily}`
    : null;
  const appliedAt = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <div
      className="app-card"
      style={{
        border: `1px solid ${isOpen ? "rgba(201,169,97,0.5)" : C.border}`,
      }}
    >
      {/* Top section */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 11,
          marginBottom: 10,
        }}
      >
        <div
          onClick={onNavigateToProfile}
          title="View full profile"
          style={{
            position: "relative",
            flexShrink: 0,
            cursor: "pointer",
            paddingBottom: 14,
          }}
        >
          {avatar && !avatarErr ? (
            <img
              src={avatar}
              alt={name}
              onError={() => setAvatarErr(true)}
              className="card-avatar"
              style={{ border: `2px solid ${C.border}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.gold;
                e.currentTarget.style.transform = "scale(1.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          ) : (
            <div className="card-avatar-ph">
              <User size={17} style={{ color: "#1a1d24" }} />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 8,
              fontWeight: 700,
              color: C.gold,
              whiteSpace: "nowrap",
              background: "rgba(26,29,36,0.85)",
              padding: "1px 5px",
              borderRadius: 4,
              letterSpacing: "0.04em",
            }}
          >
            PROFILE
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <p className="card-name">{name}</p>
            <span
              className="status-badge"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {labelForStatus(status)}
            </span>
          </div>
          {role && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: C.gold,
                fontWeight: 600,
              }}
            >
              {role}
            </p>
          )}
          {showOpp && (opp.title || app.opportunityTitle) && (
            <p className="card-opp">
              <Briefcase
                size={11}
                style={{ marginRight: 3, color: C.gold, flexShrink: 0 }}
              />
              {opp.title || app.opportunityTitle}
            </p>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px 10px",
              marginTop: 4,
            }}
          >
            {location && (
              <span className="meta-chip">
                <MapPin size={10} style={{ color: C.gold }} />
                {location}
              </span>
            )}
            {experience && (
              <span className="meta-chip">
                <Briefcase size={10} style={{ color: C.gold }} />
                {experience}
              </span>
            )}
            {dailyRate && (
              <span className="meta-chip">
                <IndianRupee size={10} style={{ color: C.gold }} />
                {dailyRate}/day
              </span>
            )}
            {appliedAt && <span className="meta-chip">{appliedAt}</span>}
          </div>
          {skills.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginTop: 6,
              }}
            >
              {skills.slice(0, 3).map((sk, i) => (
                <span
                  key={i}
                  style={{
                    padding: "2px 8px",
                    background: C.goldDim,
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    fontSize: 11,
                    color: C.gold,
                    fontWeight: 500,
                  }}
                >
                  {sk}
                </span>
              ))}
              {skills.length > 3 && (
                <span style={{ fontSize: 11, color: C.muted }}>
                  +{skills.length - 3}
                </span>
              )}
            </div>
          )}
          {note && <p className="card-note">{note}</p>}
        </div>
      </div>

      {/* ── Action row ──
          • Always show the Details toggle button
          • If actioned → show status pill only (no Accept/Reject/Pending buttons)
          • If pending  → show all three action buttons
      ── */}
      <div className="card-actions">
        <button
          onClick={onToggleDetail}
          className="btn-details"
          style={{
            background: isOpen ? C.goldDim : "transparent",
            borderColor: isOpen ? C.gold : C.border,
            color: isOpen ? C.gold : C.text,
          }}
        >
          <Eye size={13} /> {isOpen ? "Hide" : "Details"}
        </button>

        {acted ? (
          /* Already actioned — show only the current status, no buttons */
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              background: cfg.bg,
              flex: "1 1 auto",
              justifyContent: "center",
            }}
          >
            <cfg.icon size={13} style={{ color: cfg.color }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: cfg.color }}>
              {labelForStatus(status)}
            </span>
          </div>
        ) : (
          /* Pending — show all action buttons */
          <>
            <button
              disabled={isBusy}
              onClick={() => onUpdateStatus(app._id, "hired")}
              className="btn-status"
              style={{
                background: C.successBg,
                color: C.success,
                opacity: isBusy ? 0.6 : 1,
              }}
            >
              <CheckCircle2 size={13} /> Accept
            </button>
            <button
              disabled={isBusy}
              onClick={() => onUpdateStatus(app._id, "rejected")}
              className="btn-status"
              style={{
                background: C.dangerBg,
                color: C.danger,
                opacity: isBusy ? 0.6 : 1,
              }}
            >
              <XCircle size={13} /> Reject
            </button>
            <button
              disabled={isBusy}
              onClick={() => onUpdateStatus(app._id, "pending")}
              className="btn-status"
              style={{
                background: C.warnBg,
                color: C.warn,
                opacity: isBusy ? 0.6 : 1,
              }}
            >
              <Clock3 size={13} /> Pending
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function Applications() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preOppId = searchParams.get("opportunityId") || "";

  const [items, setItems] = useState([]);
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState("all");
  const [selOppId, setSelOppId] = useState(preOppId);
  const [detailApp, setDetailApp] = useState(null);

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const [a, o] = await Promise.all([
          hirerAPI.getApplications().catch(() => []),
          hirerAPI.getOpportunities().catch(() => []),
        ]);
        if (!m) return;
        setItems(Array.isArray(a) ? a : []);
        setOpps(Array.isArray(o) ? o : []);
      } catch {
        if (m) {
          setItems([]);
          setOpps([]);
        }
      } finally {
        if (m) setLoading(false);
      }
    })();
    return () => {
      m = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (selOppId)
      list = list.filter(
        (a) =>
          String(a.opportunityId || a.opportunity?._id || a.opportunity) ===
          String(selOppId),
      );
    if (filter !== "all")
      list = list.filter((a) => {
        const s = String(a.status || "pending").toLowerCase();
        return filter === "hired"
          ? s === "hired" || s === "accepted"
          : s === filter;
      });
    return list;
  }, [items, selOppId, filter]);

  const counts = useMemo(() => {
    const base = selOppId
      ? items.filter(
          (a) =>
            String(a.opportunityId || a.opportunity?._id || a.opportunity) ===
            String(selOppId),
        )
      : items;
    return {
      all: base.length,
      pending: base.filter((a) => (a.status || "pending") === "pending").length,
      hired: base.filter((a) => ["hired", "accepted"].includes(a.status))
        .length,
      rejected: base.filter((a) => a.status === "rejected").length,
    };
  }, [items, selOppId]);

  const updateStatus = async (applicationId, status) => {
    setBusyId(applicationId);
    try {
      const updated = await hirerAPI.updateApplicationStatus(applicationId, {
        status,
      });
      setItems((prev) =>
        prev.map((item) =>
          item._id === applicationId ? { ...item, ...updated, status } : item,
        ),
      );
      setDetailApp((prev) =>
        prev?._id === applicationId ? { ...prev, ...updated, status } : prev,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId("");
    }
  };

  const navigateToProfile = (app) => {
    const artist = app.artist || app.applicant || {};
    const artistId = artist._id || artist.id || app.artistId;
    if (!artistId) return;
    setDetailApp(null);
    navigate(`/hirer/browse-artists/${artistId}`, { state: { artist } });
  };

  const selectedOpp = opps.find((o) => o._id === selOppId);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: C.bg,
        fontFamily: "'Plus Jakarta Sans','Inter','Segoe UI',sans-serif",
      }}
    >
      <HirerSidebar />

      <div className="apps-wrap">
        <div className="apps-inner">
          {/* ── Header — margin-top ensures it clears the mobile hamburger ── */}
          <div style={{ marginBottom: 20 }}>
            <h1 className="page-title">Applications</h1>
            <p className="page-sub">
              {selectedOpp ? (
                <>
                  Showing applications for{" "}
                  <span style={{ color: C.gold, fontWeight: 600 }}>
                    {selectedOpp.title}
                  </span>
                </>
              ) : (
                "Review and manage applicants. Click a photo to view the full artist profile."
              )}
            </p>
          </div>

          {/* Post filter */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Briefcase
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.gold,
                pointerEvents: "none",
              }}
            />
            <select
              value={selOppId}
              onChange={(e) => {
                setSelOppId(e.target.value);
                setFilter("all");
                setDetailApp(null);
              }}
              className="post-select"
            >
              <option value="">All posts</option>
              {opps.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.title}
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

          {/* Status tabs */}
          <div className="tabs-row">
            {[
              { key: "all", label: "All", count: counts.all },
              { key: "pending", label: "Pending", count: counts.pending },
              { key: "hired", label: "Accepted", count: counts.hired },
              { key: "rejected", label: "Rejected", count: counts.rejected },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`tab-btn${filter === key ? " tab-active" : ""}`}
              >
                {label}
                <span
                  className={`tab-count${filter === key ? " tab-count-active" : ""}`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "56px 0",
              }}
            >
              <Loader2
                size={26}
                style={{
                  color: C.gold,
                  animation: "apps-spin 1s linear infinite",
                }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Users
                size={30}
                style={{
                  color: "rgba(156,163,175,0.22)",
                  margin: "0 auto 10px",
                  display: "block",
                }}
              />
              <p style={{ color: C.muted, fontSize: 13, margin: "0 0 3px" }}>
                {selOppId
                  ? "No applications for this post yet."
                  : "No applications found."}
              </p>
              {filter !== "all" && (
                <p style={{ color: C.dim, fontSize: 12, margin: 0 }}>
                  Try a different status filter.
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((app) => (
                <AppCard
                  key={app._id}
                  app={app}
                  isOpen={detailApp?._id === app._id}
                  onToggleDetail={() =>
                    setDetailApp((prev) => (prev?._id === app._id ? null : app))
                  }
                  onUpdateStatus={updateStatus}
                  busyId={busyId}
                  showOpp={!selOppId}
                  onNavigateToProfile={() => navigateToProfile(app)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {detailApp && (
        <ArtistDetailPanel
          app={detailApp}
          onClose={() => setDetailApp(null)}
          onUpdateStatus={updateStatus}
          busyId={busyId}
          onNavigateToProfile={() => navigateToProfile(detailApp)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        /* ── Layout ── */
        .apps-wrap  { flex:1; overflow-x:hidden; padding:60px 14px 60px; }
        .apps-inner { max-width:860px; margin:0 auto; }
        @media(min-width:480px)  { .apps-wrap { padding:64px 20px 64px; } }
        @media(min-width:640px)  { .apps-wrap { padding:32px 24px 64px; } }
        @media(min-width:1024px) { .apps-wrap { margin-left:242px; padding:32px 32px 64px; } }

        /* ── Typography ── */
        .page-title { font-size:clamp(20px,4vw,24px); font-weight:700; color:#fff; margin:0 0 4px; font-family:'Plus Jakarta Sans',sans-serif; }
        .page-sub   { font-size:13.5px; color:${C.muted}; margin:0; line-height:1.5; }

        /* ── Post selector ── */
        .post-select { width:100%; padding:10px 36px 10px 34px; background:${C.card}; border:1px solid ${C.border}; border-radius:10px; color:${C.text}; font-size:13.5px; appearance:none; -webkit-appearance:none; cursor:pointer; outline:none; font-family:inherit; }
        .post-select option { background:${C.card}; color:#fff; }

        /* ── Tabs ── */
        .tabs-row { display:flex; gap:6px; margin-bottom:18px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:2px; scrollbar-width:none; }
        .tabs-row::-webkit-scrollbar { display:none; }
        .tab-btn { padding:7px 12px; border-radius:8px; border:none; cursor:pointer; flex-shrink:0; background:rgba(255,255,255,0.06); color:${C.text}; font-size:13px; font-weight:600; display:flex; align-items:center; gap:5px; touch-action:manipulation; transition:background .15s,color .15s; font-family:inherit; }
        .tab-btn.tab-active { background:${C.goldDim}; color:${C.gold}; outline:1px solid rgba(201,169,97,0.2); }
        .tab-count { background:rgba(255,255,255,0.08); color:${C.muted}; font-size:11px; font-weight:700; border-radius:10px; padding:1px 7px; }
        .tab-count.tab-count-active { background:rgba(201,169,97,0.22); color:${C.gold}; }

        /* ── Empty ── */
        .empty-state { border-radius:12px; padding:40px 20px; text-align:center; background:${C.card}; border:1px solid ${C.border}; }

        /* ── App card ── */
        .app-card { border-radius:12px; padding:14px 14px 12px; background:${C.card}; transition:border-color .2s; }
        @media(min-width:480px) { .app-card { padding:16px 18px 14px; } }

        .card-avatar    { width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; display:block; transition:border-color .2s,transform .2s; }
        .card-avatar-ph { width:44px; height:44px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,${C.gold},#a8863d); display:flex; align-items:center; justify-content:center; }
        .card-name      { margin:0; font-size:14px; font-weight:600; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:calc(100% - 96px); }
        .card-opp       { display:flex; align-items:center; margin:2px 0 0; font-size:12px; color:${C.gold}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .card-note      { margin:7px 0 0; font-size:12px; color:${C.muted}; line-height:1.45; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
        .meta-chip      { display:inline-flex; align-items:center; gap:3px; font-size:11.5px; color:${C.muted}; }
        .status-badge   { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:600; white-space:nowrap; flex-shrink:0; }

        /* ── Card buttons ── */
        .card-actions { display:flex; flex-wrap:wrap; gap:6px; }
        .btn-details  { display:flex; align-items:center; gap:5px; padding:8px 13px; border-radius:8px; border:1px solid; font-size:12.5px; font-weight:500; cursor:pointer; flex:1 1 auto; justify-content:center; min-width:80px; touch-action:manipulation; font-family:inherit; transition:background .15s,border-color .15s,color .15s; }
        .btn-status   { display:flex; align-items:center; gap:5px; padding:8px 13px; border-radius:8px; border:none; font-size:12.5px; font-weight:600; cursor:pointer; flex:1 1 auto; justify-content:center; min-width:68px; touch-action:manipulation; font-family:inherit; }
        .btn-status:disabled { opacity:.55; cursor:default; }

        /* ── Detail panel ── */
        .adp-panel { position:fixed; left:0; right:0; bottom:0; z-index:1001; height:93vh; background:${C.cardDeep}; border-radius:18px 18px 0 0; border:1px solid ${C.border}; box-shadow:0 -10px 56px rgba(0,0,0,0.65); display:flex; flex-direction:column; overflow:hidden; animation:adp-up .28s cubic-bezier(.4,0,.2,1); }
        @media(min-width:768px) {
          .adp-panel { left:auto; top:0; right:0; bottom:0; height:100vh; width:clamp(360px,44vw,520px); border-radius:0; border-left:1px solid ${C.border}; border-top:none; border-bottom:none; border-right:none; animation:adp-right .28s cubic-bezier(.4,0,.2,1); }
        }

        /* ── Detail tabs ── */
        .adp-tabs { display:flex; border-bottom:1px solid ${C.border}; flex-shrink:0; overflow-x:auto; scrollbar-width:none; padding:0 20px; }
        .adp-tabs::-webkit-scrollbar { display:none; }
        .adp-tab { padding:10px 14px; font-size:12.5px; font-weight:600; border:none; background:transparent; cursor:pointer; white-space:nowrap; flex-shrink:0; color:${C.muted}; border-bottom:2px solid transparent; transition:color .2s; margin-bottom:-1px; touch-action:manipulation; font-family:inherit; }
        .adp-tab.adp-tab-active { color:${C.gold}; border-bottom-color:${C.gold}; }

        /* Mobile drag handle */
        .adp-handle { display:flex; justify-content:center; padding:8px 0 2px; flex-shrink:0; }
        @media(min-width:768px) { .adp-handle { display:none; } }

        /* ── Keyframes ── */
        @keyframes adp-up    { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes adp-right { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes apps-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* ── Global ── */
        * { box-sizing:border-box; }
        input,select,textarea,button { -webkit-tap-highlight-color:transparent; font-family:inherit; }
        select option { background:${C.card}; color:#ffffff; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,169,97,0.2); border-radius:4px; }
      `}</style>
    </div>
  );
}
