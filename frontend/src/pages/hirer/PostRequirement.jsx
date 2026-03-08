import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  ArrowLeft,
  Users,
  Briefcase,
  ChevronDown,
  CheckCircle,
  FileText,
  X,
  Eye,
  Edit3,
  Save,
  User,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronRight,
  Loader2,
  Star,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  cardDeep: "#22252e",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  goldDim: "rgba(201,169,97,0.10)",
  text: "#ffffff",
  muted: "#9ca3af",
  mutedLight: "#6b7280",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.12)",
  successBorder: "rgba(74,222,128,0.25)",
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.12)",
  warn: "#fbbf24",
  warnBg: "rgba(251,191,36,0.12)",
  info: "#93c5fd",
  infoBg: "rgba(147,197,253,0.12)",
};

// ─── All roles / project types grouped ──────────────────────────────────────
const PROJECT_TYPE_GROUPS = [
  {
    group: "🎬 Production Types",
    items: [
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
    ],
  },
  {
    group: "🎭 Performing Arts",
    items: [
      "Actor",
      "Lead Actor",
      "Supporting Actor",
      "Background Artist",
      "Voice Artist",
      "Dancer",
      "Choreographer",
      "Stunt Coordinator",
    ],
  },
  {
    group: "🎥 Film Crew",
    items: [
      "Director",
      "Assistant Director",
      "Cinematographer",
      "Camera Operator",
      "Lighting Director",
      "Colorist",
      "Film Editor",
      "Sound Designer",
    ],
  },
  {
    group: "✍️ Writing & Creative",
    items: [
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
    ],
  },
  {
    group: "💻 Digital & Tech",
    items: [
      "VFX Artist",
      "3D Animation Teams",
      "Game Cinematics",
      "Motion Capture Crews",
      "Virtual Production Specialists",
      "Unreal Engine Artists",
      "Music Composer",
    ],
  },
  {
    group: "📱 Creator Economy",
    items: [
      "YouTubers Hiring Editors",
      "Influencers Hiring Videographers",
      "Podcast Production Teams",
      "Social Media Content Studios",
      "Brand Creator Collaborations",
    ],
  },
  { group: "🎯 Other", items: ["Other"] },
];

const ALL_PROJECT_TYPES = PROJECT_TYPE_GROUPS.flatMap((g) =>
  g.items.map((item) => ({ value: item, label: item, group: g.group })),
);

// ─── Searchable Project Type Picker ──────────────────────────────────────────
function ProjectTypePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = query.trim()
    ? ALL_PROJECT_TYPES.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          borderRadius: "10px",
          padding: "11px 14px",
          fontSize: "14px",
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
          background: C.input,
          border: `1px solid ${open ? C.gold : C.border}`,
          color: value ? C.text : C.muted,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          boxShadow: open ? `0 0 0 3px ${C.goldGlow}` : "none",
          transition: "border-color .2s",
          touchAction: "manipulation",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {value || "Select project type / role"}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: C.muted,
            flexShrink: 0,
            marginLeft: 8,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.15 }}
            className="ptp-dropdown"
          >
            {/* Search */}
            <div
              style={{
                padding: "9px 12px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Search size={14} style={{ color: C.muted, flexShrink: 0 }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles & types…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  color: C.text,
                  fontFamily: "inherit",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    touchAction: "manipulation",
                  }}
                >
                  <X size={13} style={{ color: C.muted }} />
                </button>
              )}
            </div>
            {/* Options */}
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {filtered ? (
                filtered.length === 0 ? (
                  <p
                    style={{
                      padding: "18px",
                      textAlign: "center",
                      color: C.muted,
                      fontSize: "13px",
                      margin: 0,
                    }}
                  >
                    No results for "{query}"
                  </p>
                ) : (
                  filtered.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className="ptp-opt"
                      style={{
                        background:
                          value === opt.value ? C.goldDim : "transparent",
                        color: value === opt.value ? C.gold : C.text,
                      }}
                    >
                      {opt.label}
                      <span
                        style={{
                          fontSize: "11px",
                          color: C.muted,
                          marginLeft: 7,
                        }}
                      >
                        {opt.group}
                      </span>
                    </button>
                  ))
                )
              ) : (
                PROJECT_TYPE_GROUPS.map((grp) => (
                  <div key={grp.group}>
                    <div
                      style={{
                        padding: "7px 14px 3px",
                        fontSize: "10.5px",
                        fontWeight: "700",
                        color: C.gold,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        background: "rgba(201,169,97,0.05)",
                        borderTop: `1px solid ${C.border}`,
                      }}
                    >
                      {grp.group}
                    </div>
                    {grp.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className="ptp-opt"
                        style={{
                          paddingLeft: "20px",
                          background:
                            value === item ? C.goldDim : "transparent",
                          color: value === item ? C.gold : C.text,
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared sub-components ───────────────────────────────────────────────────
function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: C.muted,
        marginBottom: "7px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );
}

function TextInput({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  readOnly,
}) {
  const [f, setF] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={14}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: f ? C.gold : C.muted,
            transition: "color .2s",
            pointerEvents: "none",
          }}
        />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          width: "100%",
          borderRadius: "10px",
          padding: Icon ? "11px 14px 11px 36px" : "11px 14px",
          fontSize: "14px",
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
          background: readOnly ? "rgba(255,255,255,0.03)" : C.input,
          border: `1px solid ${f && !readOnly ? C.gold : C.border}`,
          color: C.text,
          boxShadow: f && !readOnly ? `0 0 0 3px ${C.goldGlow}` : "none",
          cursor: readOnly ? "default" : "text",
          transition: "border-color .2s,box-shadow .2s",
        }}
      />
    </div>
  );
}

function Textarea({ value, onChange, placeholder, required, readOnly }) {
  const [f, setF] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={4}
      readOnly={readOnly}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={{
        width: "100%",
        borderRadius: "10px",
        padding: "11px 14px",
        fontSize: "14px",
        outline: "none",
        resize: "vertical",
        lineHeight: "1.6",
        fontFamily: "inherit",
        boxSizing: "border-box",
        minHeight: "100px",
        background: readOnly ? "rgba(255,255,255,0.03)" : C.input,
        border: `1px solid ${f && !readOnly ? C.gold : C.border}`,
        color: C.text,
        boxShadow: f && !readOnly ? `0 0 0 3px ${C.goldGlow}` : "none",
        cursor: readOnly ? "default" : "text",
        transition: "border-color .2s,box-shadow .2s",
      }}
    />
  );
}

const STATUS_MAP = {
  pending: { bg: C.warnBg, color: C.warn, Icon: Clock3, label: "Pending" },
  hired: {
    bg: C.successBg,
    color: C.success,
    Icon: CheckCircle2,
    label: "Accepted",
  },
  accepted: {
    bg: C.successBg,
    color: C.success,
    Icon: CheckCircle2,
    label: "Accepted",
  },
  rejected: {
    bg: C.dangerBg,
    color: C.danger,
    Icon: XCircle,
    label: "Rejected",
  },
  shortlisted: {
    bg: C.infoBg,
    color: C.info,
    Icon: Star,
    label: "Shortlisted",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.pending;
  const { Icon } = s;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        background: s.bg,
        color: s.color,
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={12} strokeWidth={2.2} />
      {s.label}
    </span>
  );
}

// ─── Modal shell (bottom sheet mobile / centered desktop) ────────────────────
function ModalShell({ onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="pr-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="pr-modal-sheet"
        >
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg,${C.gold},transparent)`,
              borderRadius: "14px 14px 0 0",
            }}
          />
          <div className="pr-modal-handle-wrap">
            <div
              style={{
                width: 36,
                height: 4,
                background: "rgba(255,255,255,0.12)",
                borderRadius: "4px",
              }}
            />
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Applications Modal ───────────────────────────────────────────────────────
function ApplicationsModal({ post, onClose, onViewAll }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    if (!post?._id) {
      setLoading(false);
      return;
    }
    let m = true;
    (async () => {
      try {
        const res = await hirerAPI
          .getApplications({ opportunityId: post._id })
          .catch(() => hirerAPI.getApplications());
        const all = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        const fil = all.filter((a) => {
          const id = a.opportunityId || a.opportunity?._id || a.opportunity;
          return !id || String(id) === String(post._id);
        });
        if (m) setApps(fil);
      } catch {
        if (m) setError("Could not load applications.");
      } finally {
        if (m) setLoading(false);
      }
    })();
    return () => {
      m = false;
    };
  }, [post]);

  const updateStatus = async (appId, status) => {
    setBusyId(appId);
    try {
      const u = await hirerAPI.updateApplicationStatus(appId, { status });
      setApps((p) =>
        p.map((a) => (a._id === appId ? { ...a, ...u, status } : a)),
      );
    } catch {
    } finally {
      setBusyId("");
    }
  };

  return (
    <ModalShell onClose={onClose}>
      {/* header */}
      <div
        style={{
          padding: "14px 18px 12px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "2px",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "7px",
                background: C.goldDim,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Users size={13} style={{ color: C.gold }} />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "700",
                color: C.text,
              }}
            >
              Applications
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: C.muted,
              paddingLeft: "34px",
            }}
          >
            {post?.title}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            cursor: "pointer",
            color: C.muted,
            width: 30,
            height: 30,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            touchAction: "manipulation",
          }}
        >
          <X size={15} />
        </button>
      </div>
      {/* body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 18px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <Loader2
              size={22}
              style={{
                color: C.gold,
                margin: "0 auto 10px",
                display: "block",
                animation: "pr-spin 1s linear infinite",
              }}
            />
            <p style={{ color: C.muted, fontSize: "13px", margin: 0 }}>
              Loading…
            </p>
          </div>
        ) : error ? (
          <p
            style={{
              color: C.danger,
              fontSize: "13px",
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            {error}
          </p>
        ) : apps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <Users
              size={32}
              style={{
                color: "rgba(156,163,175,0.2)",
                margin: "0 auto 10px",
                display: "block",
              }}
            />
            <p
              style={{ color: C.muted, fontSize: "13.5px", margin: "0 0 4px" }}
            >
              No applications yet
            </p>
            <p style={{ color: C.mutedLight, fontSize: "12px", margin: 0 }}>
              Artists who apply will appear here
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {apps.map((app, i) => {
              const artist = app.artist || app.applicant || {};
              const name =
                artist.name || artist.fullName || artist.username || "Artist";
              const email = artist.email || app.email || "";
              const phone = artist.phone || app.phone || "";
              const location = artist.location || app.location || "";
              const avatar = artist.profileImage || artist.avatar || "";
              const portfolio =
                artist.portfolio || artist.portfolioUrl || app.portfolio || "";
              const note = app.coverLetter || app.note || app.message || "";
              const appliedAt = app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "";
              const status = app.status || "pending";
              const isBusy = busyId === app._id;
              return (
                <motion.div
                  key={app._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: "12px",
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginBottom: "9px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        minWidth: 0,
                      }}
                    >
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `2px solid ${C.border}`,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg,${C.gold},#a8863d)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <User size={14} style={{ color: "#1a1d24" }} />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13.5px",
                            fontWeight: "600",
                            color: C.text,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "3px 8px",
                            marginTop: "2px",
                          }}
                        >
                          {location && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: C.muted,
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <MapPin size={9} style={{ color: C.gold }} />
                              {location}
                            </span>
                          )}
                          {appliedAt && (
                            <span style={{ fontSize: "11px", color: C.muted }}>
                              {appliedAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                  {(email || phone || portfolio) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px 12px",
                        marginBottom: "9px",
                      }}
                    >
                      {email && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "11.5px",
                            color: C.muted,
                          }}
                        >
                          <Mail size={10} style={{ color: C.gold }} />
                          {email}
                        </span>
                      )}
                      {phone && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "11.5px",
                            color: C.muted,
                          }}
                        >
                          <Phone size={10} style={{ color: C.gold }} />
                          {phone}
                        </span>
                      )}
                      {portfolio && (
                        <a
                          href={portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "11.5px",
                            color: C.gold,
                            textDecoration: "none",
                          }}
                        >
                          <ExternalLink size={10} />
                          Portfolio
                        </a>
                      )}
                    </div>
                  )}
                  {note && (
                    <p
                      style={{
                        margin: "0 0 9px",
                        fontSize: "12px",
                        color: C.muted,
                        lineHeight: "1.5",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "7px",
                        padding: "7px 9px",
                        borderLeft: `2px solid ${C.border}`,
                      }}
                    >
                      {note}
                    </p>
                  )}
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    {[
                      {
                        s: "hired",
                        label: "Accept",
                        bg: C.successBg,
                        color: C.success,
                        Icon: CheckCircle2,
                      },
                      {
                        s: "rejected",
                        label: "Reject",
                        bg: C.dangerBg,
                        color: C.danger,
                        Icon: XCircle,
                      },
                      {
                        s: "pending",
                        label: "Pending",
                        bg: C.warnBg,
                        color: C.warn,
                        Icon: Clock3,
                      },
                    ].map(({ s, label, bg, color, Icon: BI }) => (
                      <button
                        key={s}
                        disabled={
                          isBusy ||
                          status === s ||
                          (s === "hired" && status === "accepted")
                        }
                        onClick={() => updateStatus(app._id, s)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "6px 11px",
                          borderRadius: "7px",
                          border: "none",
                          background: bg,
                          color,
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          opacity: isBusy || status === s ? 0.5 : 1,
                          touchAction: "manipulation",
                        }}
                      >
                        <BI size={11} />
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      {/* footer */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <p style={{ margin: 0, fontSize: "12.5px", color: C.muted }}>
          {!loading && !error && (
            <>
              <span style={{ color: C.gold, fontWeight: "600" }}>
                {apps.length}
              </span>{" "}
              application{apps.length !== 1 ? "s" : ""}
            </>
          )}
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onViewAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "8px 16px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            color: C.text,
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          View All <ChevronRight size={13} />
        </motion.button>
      </div>
    </ModalShell>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ post, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: post?.title || "",
    type: post?.type || "",
    description: post?.description || "",
    location: post?.location || "",
    budget: post?.budget || "",
    duration: post?.duration || "",
    startDate: post?.startDate ? post.startDate.slice(0, 10) : "",
    maxSlots: post?.maxSlots ?? "",
    availableSlots: post?.availableSlots ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: typeof e === "string" ? e : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        maxSlots: Number(form.maxSlots) || 0,
        availableSlots: Number(form.availableSlots) || 0,
      };
      await hirerAPI.updateOpportunity(post._id, payload);
      setSaved(true);
      setTimeout(() => {
        onSaved({ ...post, ...payload });
        onClose();
      }, 1100);
    } catch (err) {
      setError(err.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <div
        style={{
          padding: "14px 18px 12px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "7px",
              background: C.goldDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Edit3 size={13} style={{ color: C.gold }} />
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "700",
                color: C.text,
              }}
            >
              Edit Requirement
            </h2>
            <p style={{ margin: 0, fontSize: "11.5px", color: C.muted }}>
              {post?.title}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            cursor: "pointer",
            color: C.muted,
            width: 30,
            height: 30,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "manipulation",
          }}
        >
          <X size={15} />
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 18px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <form id="edit-form" onSubmit={handleSave}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <Label>Project Title</Label>
              <TextInput
                icon={Briefcase}
                value={form.title}
                onChange={set("title")}
                placeholder="Project title"
                required
              />
            </div>
            <div>
              <Label>Project Type / Role</Label>
              <ProjectTypePicker
                value={form.type}
                onChange={(v) => setForm((p) => ({ ...p, type: v }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={set("description")}
                placeholder="Describe your requirement…"
                required
              />
            </div>
            <div className="pr-grid2">
              <div>
                <Label>Location</Label>
                <TextInput
                  icon={MapPin}
                  value={form.location}
                  onChange={set("location")}
                  placeholder="City, State"
                />
              </div>
              <div>
                <Label>Budget Range</Label>
                <TextInput
                  value={form.budget}
                  onChange={set("budget")}
                  placeholder="₹5,000 – ₹8,000"
                />
              </div>
            </div>
            <div className="pr-grid2">
              <div>
                <Label>Duration</Label>
                <TextInput
                  icon={Clock}
                  value={form.duration}
                  onChange={set("duration")}
                  placeholder="e.g. 3 weeks"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <TextInput
                  icon={Calendar}
                  type="date"
                  value={form.startDate}
                  onChange={set("startDate")}
                />
              </div>
            </div>
            <div className="pr-grid2">
              <div>
                <Label>Max Slots</Label>
                <TextInput
                  icon={Users}
                  type="number"
                  value={form.maxSlots}
                  onChange={set("maxSlots")}
                  placeholder="5"
                />
              </div>
              <div>
                <Label>Available Slots</Label>
                <TextInput
                  icon={Users}
                  type="number"
                  value={form.availableSlots}
                  onChange={set("availableSlots")}
                  placeholder="3"
                />
              </div>
            </div>
            {error && (
              <p style={{ color: C.danger, fontSize: "13px", margin: 0 }}>
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
      <div
        style={{
          padding: "12px 18px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "10px 16px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            color: C.text,
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          Cancel
        </button>
        <motion.button
          form="edit-form"
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={saving || saved}
          style={{
            padding: "10px 18px",
            background: saved
              ? C.successBg
              : `linear-gradient(135deg,${C.gold},#a8863d)`,
            border: saved ? `1px solid ${C.successBorder}` : "none",
            borderRadius: "8px",
            color: saved ? C.success : "#1a1d24",
            fontSize: "13px",
            fontWeight: "700",
            cursor: saving || saved ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            opacity: saving ? 0.8 : 1,
            touchAction: "manipulation",
          }}
        >
          {saved ? (
            <>
              <CheckCircle2 size={13} />
              Saved!
            </>
          ) : saving ? (
            <>
              <Loader2
                size={13}
                style={{ animation: "pr-spin 1s linear infinite" }}
              />
              Saving…
            </>
          ) : (
            <>
              <Save size={13} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </ModalShell>
  );
}

// ─── Main PostRequirement page ────────────────────────────────────────────────
export default function PostRequirement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    budget: "",
    duration: "",
    startDate: "",
    maxSlots: "",
    availableSlots: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [viewAppsPost, setViewAppsPost] = useState(null);
  const [editPost, setEditPost] = useState(null);

  const set = (k) => (e) =>
    setFormData((p) => ({
      ...p,
      [k]: typeof e === "string" ? e : e.target.value,
    }));

  useEffect(() => {
    let m = true;
    setLoadingPosts(true);
    hirerAPI
      .getOpportunities()
      .then((res) => {
        if (!m) return;
        const list = Array.isArray(res) ? res : [];
        setRecentPosts(
          list.map((o) => ({
            ...o,
            _meta: `${new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${Number(o.applicationCount || 0)} application${Number(o.applicationCount || 0) !== 1 ? "s" : ""}`,
          })),
        );
      })
      .catch(() => {})
      .finally(() => {
        if (m) setLoadingPosts(false);
      });
    return () => {
      m = false;
    };
  }, [submitted]);

  const parseBudget = (b) => {
    const nums = String(b || "")
      .replace(/,/g, "")
      .match(/\d+(\.\d+)?/g)
      ?.map(Number);
    if (!nums?.length) return { min: 0, max: 0 };
    return nums.length === 1
      ? { min: nums[0], max: nums[0] }
      : { min: Math.min(...nums), max: Math.max(...nums) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const { min, max } = parseBudget(formData.budget);
      await hirerAPI.postOpportunity({
        ...formData,
        budgetMin: min,
        budgetMax: max,
        maxSlots: Number(formData.maxSlots),
        availableSlots: Number(formData.availableSlots),
        startDate: formData.startDate || undefined,
      });
      setSubmitted(true);
      setFormData({
        title: "",
        type: "",
        description: "",
        location: "",
        budget: "",
        duration: "",
        startDate: "",
        maxSlots: "",
        availableSlots: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setSubmitError(err.message || "Could not post requirement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostSaved = (u) =>
    setRecentPosts((p) => p.map((x) => (x._id === u._id ? { ...x, ...u } : x)));

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg }}>
      <HirerSidebar />

      <div className="pr-main">
        <div className="pr-page">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "22px" }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
            >
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => navigate("/hirer/browse-artists")}
                style={{
                  padding: "9px",
                  borderRadius: "9px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  color: C.text,
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  marginTop: "3px",
                  touchAction: "manipulation",
                }}
              >
                <ArrowLeft size={16} />
              </motion.button>
              <div>
                <h1 className="pr-title">Post a Requirement</h1>
                <p style={{ margin: 0, color: C.muted, fontSize: "13.5px" }}>
                  Find the perfect talent for your project
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: "14px",
              padding: "clamp(16px,4vw,26px)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: 34,
                height: 3,
                background: `linear-gradient(90deg,${C.gold},transparent)`,
                borderRadius: "2px",
                marginBottom: "18px",
              }}
            />
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <Label>Project Title</Label>
                  <TextInput
                    icon={Briefcase}
                    value={formData.title}
                    onChange={set("title")}
                    placeholder="e.g. Lead Actor for Indie Film"
                    required
                  />
                </div>
                <div>
                  <Label>Project Type / Role</Label>
                  <ProjectTypePicker
                    value={formData.type}
                    onChange={(v) => setFormData((p) => ({ ...p, type: v }))}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={set("description")}
                    placeholder="Describe your project requirements in detail…"
                    required
                  />
                </div>
                <div className="pr-grid2">
                  <div>
                    <Label>Location</Label>
                    <TextInput
                      icon={MapPin}
                      value={formData.location}
                      onChange={set("location")}
                      placeholder="City, State"
                      required
                    />
                  </div>
                  <div>
                    <Label>Budget Range</Label>
                    <TextInput
                      value={formData.budget}
                      onChange={set("budget")}
                      placeholder="₹5,000 – ₹8,000"
                      required
                    />
                  </div>
                </div>
                <div className="pr-grid2">
                  <div>
                    <Label>Project Duration</Label>
                    <TextInput
                      icon={Clock}
                      value={formData.duration}
                      onChange={set("duration")}
                      placeholder="e.g. 3 weeks"
                      required
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <TextInput
                      icon={Calendar}
                      type="date"
                      value={formData.startDate}
                      onChange={set("startDate")}
                      required
                    />
                  </div>
                </div>
                <div className="pr-grid2">
                  <div>
                    <Label>Max Slots</Label>
                    <TextInput
                      icon={Users}
                      type="number"
                      value={formData.maxSlots}
                      onChange={set("maxSlots")}
                      placeholder="5"
                      required
                    />
                  </div>
                  <div>
                    <Label>Available Slots</Label>
                    <TextInput
                      icon={Users}
                      type="number"
                      value={formData.availableSlots}
                      onChange={set("availableSlots")}
                      placeholder="3"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "13px",
                    background: submitted
                      ? "rgba(74,222,128,0.85)"
                      : `linear-gradient(135deg,${C.gold} 0%,#a8863d 100%)`,
                    color: "#1a1d24",
                    fontWeight: "700",
                    fontSize: "14px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "background .35s",
                    opacity: isSubmitting ? 0.75 : 1,
                    touchAction: "manipulation",
                  }}
                >
                  {submitted ? (
                    <>
                      <CheckCircle size={16} />
                      Requirement Posted!
                    </>
                  ) : isSubmitting ? (
                    <>Posting…</>
                  ) : (
                    <>
                      <FileText size={16} />
                      Post Requirement
                    </>
                  )}
                </motion.button>
                {submitError && (
                  <p style={{ color: C.danger, margin: 0, fontSize: "13px" }}>
                    {submitError}
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          {/* ── Recent Posts ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <h2
              style={{
                fontSize: "17px",
                fontWeight: "600",
                color: C.text,
                marginBottom: "12px",
              }}
            >
              Your Recent Posts
            </h2>

            {loadingPosts ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "28px",
                }}
              >
                <Loader2
                  size={22}
                  style={{
                    color: C.gold,
                    animation: "pr-spin 1s linear infinite",
                  }}
                />
              </div>
            ) : recentPosts.length === 0 ? (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  padding: "28px",
                  textAlign: "center",
                }}
              >
                <FileText
                  size={26}
                  style={{
                    color: "rgba(156,163,175,0.2)",
                    margin: "0 auto 10px",
                    display: "block",
                  }}
                />
                <p
                  style={{
                    color: C.muted,
                    fontSize: "13.5px",
                    margin: "0 0 3px",
                  }}
                >
                  No posts yet
                </p>
                <p style={{ color: C.mutedLight, fontSize: "12px", margin: 0 }}>
                  Your posted requirements will appear here
                </p>
              </div>
            ) : (
              recentPosts.map((post, i) => (
                <motion.div
                  key={post._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "14.5px",
                        fontWeight: "600",
                        color: C.text,
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </h3>
                    <span
                      style={{
                        padding: "2px 10px",
                        background: C.successBg,
                        color: C.success,
                        borderRadius: "20px",
                        fontSize: "11.5px",
                        fontWeight: "600",
                        border: `1px solid ${C.successBorder}`,
                        flexShrink: 0,
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 10px",
                      color: C.muted,
                      fontSize: "12.5px",
                    }}
                  >
                    {post._meta}
                  </p>
                  {/* Info pills */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginBottom: "12px",
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                      paddingBottom: "2px",
                    }}
                  >
                    {post.type && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11.5px",
                          color: C.muted,
                          background: C.goldDim,
                          border: `1px solid ${C.border}`,
                          borderRadius: "6px",
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <Briefcase size={10} style={{ color: C.gold }} />
                        {post.type}
                      </span>
                    )}
                    {post.location && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11.5px",
                          color: C.muted,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.border}`,
                          borderRadius: "6px",
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={10} style={{ color: C.gold }} />
                        {post.location}
                      </span>
                    )}
                    {post.budget && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11.5px",
                          color: C.muted,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.border}`,
                          borderRadius: "6px",
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <IndianRupee size={10} style={{ color: C.gold }} />
                        {post.budget}
                      </span>
                    )}
                    {post.duration && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11.5px",
                          color: C.muted,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.border}`,
                          borderRadius: "6px",
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <Clock size={10} style={{ color: C.gold }} />
                        {post.duration}
                      </span>
                    )}
                  </div>
                  {/* Actions */}
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setViewAppsPost(post)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "9px 14px",
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: "8px",
                        color: C.text,
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        flex: "1 1 auto",
                        justifyContent: "center",
                        minWidth: "120px",
                        touchAction: "manipulation",
                      }}
                    >
                      <Eye size={13} />
                      View Applications
                      {Number(post.applicationCount) > 0 && (
                        <span
                          style={{
                            background: C.gold,
                            color: "#1a1d24",
                            borderRadius: "10px",
                            fontSize: "10.5px",
                            fontWeight: "700",
                            padding: "1px 6px",
                          }}
                        >
                          {post.applicationCount}
                        </span>
                      )}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setEditPost(post)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "9px 14px",
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: "8px",
                        color: C.text,
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        flex: "1 1 auto",
                        justifyContent: "center",
                        minWidth: "80px",
                        touchAction: "manipulation",
                      }}
                    >
                      <Edit3 size={13} />
                      Edit
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {viewAppsPost && (
        <ApplicationsModal
          post={viewAppsPost}
          onClose={() => setViewAppsPost(null)}
          onViewAll={() => {
            navigate(`/hirer/applications?opportunityId=${viewAppsPost._id}`);
            setViewAppsPost(null);
          }}
        />
      )}
      {editPost && (
        <EditModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onSaved={handlePostSaved}
        />
      )}

      <style>{`
        /* ── Layout ── */
        .pr-main { flex:1; overflow-x:hidden; }
        .pr-page { max-width:820px; margin:0 auto; padding:18px 14px 70px; }
        @media(min-width:480px)  { .pr-page { padding:22px 20px 70px; } }
        @media(min-width:768px)  { .pr-page { padding:28px 26px 60px; } }
        @media(min-width:1024px) { .pr-main { margin-left:288px; } .pr-page { padding:36px 32px 60px; } }

        /* ── Title ── */
        .pr-title { font-size:clamp(20px,4vw,28px); font-weight:700; margin:0 0 4px; color:#ffffff; letter-spacing:-0.02em; }

        /* ── 2-col grid that stacks on mobile ── */
        .pr-grid2 { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:480px) { .pr-grid2 { grid-template-columns:1fr 1fr; } }

        /* ── Project type picker dropdown ── */
        .ptp-dropdown {
          position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:999;
          background:${C.card}; border:1px solid ${C.border}; border-radius:12px;
          box-shadow:0 12px 40px rgba(0,0,0,0.55); overflow:hidden; transform-origin:top;
        }
        .ptp-opt {
          display:block; width:100%; text-align:left; padding:9px 14px;
          border:none; font-size:13.5px; cursor:pointer; font-family:inherit;
          transition:background .12s;
        }
        .ptp-opt:hover { background:rgba(255,255,255,0.04) !important; }

        /* ── Modal overlay ── */
        .pr-modal-overlay {
          position:fixed; inset:0; z-index:2000; background:rgba(0,0,0,0.7);
          backdrop-filter:blur(4px); display:flex; align-items:flex-end; justify-content:center;
        }
        @media(min-width:640px) {
          .pr-modal-overlay { align-items:center; padding:20px; }
        }

        /* ── Modal sheet (bottom sheet mobile / card desktop) ── */
        .pr-modal-sheet {
          background:${C.cardDeep}; border-radius:18px 18px 0 0;
          border:1px solid ${C.border}; width:100%; max-height:92vh;
          display:flex; flex-direction:column;
          box-shadow:0 -8px 40px rgba(0,0,0,0.5); overflow:hidden;
        }
        @media(min-width:640px) {
          .pr-modal-sheet { border-radius:16px; max-width:640px; max-height:88vh; box-shadow:0 24px 80px rgba(0,0,0,0.65); }
        }

        /* ── Modal handle ── */
        .pr-modal-handle-wrap { display:flex; justify-content:center; padding:8px 0 2px; }
        @media(min-width:640px) { .pr-modal-handle-wrap { display:none; } }

        /* ── Global ── */
        *{box-sizing:border-box;}
        input,select,textarea,button{-webkit-tap-highlight-color:transparent;font-family:inherit;}
        input::placeholder,textarea::placeholder{color:#6b7280;}
        select option{background:${C.card};}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.55) sepia(0.3) saturate(2) hue-rotate(5deg);cursor:pointer;}
        @keyframes pr-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(201,169,97,0.2);border-radius:4px;}
      `}</style>
    </div>
  );
}
