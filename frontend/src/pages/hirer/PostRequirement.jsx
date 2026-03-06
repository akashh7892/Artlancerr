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
} from "lucide-react";
import { useEffect, useState } from "react";
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

const baseInput = {
  width: "100%",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

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
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={15}
          style={{
            position: "absolute",
            left: "13px",
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? C.gold : C.muted,
            transition: "color 0.2s",
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...baseInput,
          background: readOnly ? "rgba(255,255,255,0.03)" : C.input,
          border: `1px solid ${focused && !readOnly ? C.gold : C.border}`,
          color: C.text,
          paddingLeft: Icon ? "38px" : "14px",
          boxShadow: focused && !readOnly ? `0 0 0 3px ${C.goldGlow}` : "none",
          cursor: readOnly ? "default" : "text",
        }}
      />
    </div>
  );
}

function Textarea({ value, onChange, placeholder, required, readOnly }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={5}
      readOnly={readOnly}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...baseInput,
        background: readOnly ? "rgba(255,255,255,0.03)" : C.input,
        border: `1px solid ${focused && !readOnly ? C.gold : C.border}`,
        color: C.text,
        resize: "vertical",
        lineHeight: "1.6",
        boxShadow: focused && !readOnly ? `0 0 0 3px ${C.goldGlow}` : "none",
        cursor: readOnly ? "default" : "text",
        minHeight: "110px",
      }}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        style={{
          ...baseInput,
          background: disabled ? "rgba(255,255,255,0.03)" : C.input,
          border: `1px solid ${focused && !disabled ? C.gold : C.border}`,
          color: value ? C.text : C.muted,
          paddingRight: "38px",
          appearance: "none",
          cursor: disabled ? "default" : "pointer",
          boxShadow: focused && !disabled ? `0 0 0 3px ${C.goldGlow}` : "none",
        }}
      >
        <option
          value=""
          disabled
          style={{ background: C.card, color: C.muted }}
        >
          {placeholder}
        </option>
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            style={{ background: C.card, color: C.text }}
          >
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        style={{
          position: "absolute",
          right: "13px",
          top: "50%",
          transform: "translateY(-50%)",
          color: focused ? C.gold : C.muted,
          pointerEvents: "none",
          transition: "color 0.2s",
        }}
      />
    </div>
  );
}

const PROJECT_TYPES = [
  { value: "Film & TV Production", label: "Film & TV Production" },
  {
    value: "Advertising & Commercial Shoots",
    label: "Advertising & Commercial Shoots",
  },
  { value: "Music Videos", label: "Music Videos" },
  { value: "Event Videography", label: "Event Videography" },
  { value: "Wedding Cinematography", label: "Wedding Cinematography" },
  { value: "Documentary Production", label: "Documentary Production" },
  {
    value: "Streaming Content Production",
    label: "Streaming Content Production",
  },
  { value: "YouTubers Hiring Editors", label: "YouTubers Hiring Editors" },
  {
    value: "Influencers Hiring Videographers",
    label: "Influencers Hiring Videographers",
  },
  { value: "Podcast Production Teams", label: "Podcast Production Teams" },
  {
    value: "Social Media Content Studios",
    label: "Social Media Content Studios",
  },
  {
    value: "Brand Creator Collaborations",
    label: "Brand Creator Collaborations",
  },
  { value: "Game Cinematics", label: "Game Cinematics" },
  { value: "Motion Capture Crews", label: "Motion Capture Crews" },
  { value: "3D Animation Teams", label: "3D Animation Teams" },
  {
    value: "Virtual Production Specialists",
    label: "Virtual Production Specialists",
  },
  { value: "Unreal Engine Artists", label: "Unreal Engine Artists" },
  { value: "Corporate Video Production", label: "Corporate Video Production" },
  { value: "Training Content Creation", label: "Training Content Creation" },
  { value: "Marketing Media Teams", label: "Marketing Media Teams" },
  {
    value: "Internal Communication Studios",
    label: "Internal Communication Studios",
  },
  { value: "acting", label: "Acting" },
  { value: "dance", label: "Dance / Choreography" },
  { value: "cinematography", label: "Cinematography" },
  { value: "music", label: "Music / Audio" },
  { value: "costume", label: "Costume Design" },
  { value: "makeup", label: "Makeup Artist" },
  { value: "editing", label: "Editing" },
  { value: "other", label: "Other" },
];

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
      <Icon size={12} strokeWidth={2.2} /> {s.label}
    </span>
  );
}

// ── Applications Modal ────────────────────────────────────────────────────────
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
    let mounted = true;
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
        const filtered = all.filter((a) => {
          const id = a.opportunityId || a.opportunity?._id || a.opportunity;
          return !id || String(id) === String(post._id);
        });
        if (mounted) setApps(filtered);
      } catch {
        if (mounted) setError("Could not load applications.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [post]);

  const updateStatus = async (appId, status) => {
    setBusyId(appId);
    try {
      const updated = await hirerAPI.updateApplicationStatus(appId, { status });
      setApps((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, ...updated, status } : a)),
      );
    } catch {
    } finally {
      setBusyId("");
    }
  };

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
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0",
        }}
        className="modal-overlay-resp"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-sheet-resp"
        >
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${C.gold}, transparent)`,
              borderRadius: "14px 14px 0 0",
            }}
          />
          {/* drag handle on mobile */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "8px 0 0",
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                background: "rgba(255,255,255,0.12)",
                borderRadius: "4px",
              }}
              className="drag-handle-resp"
            />
          </div>

          {/* Header */}
          <div
            style={{
              padding: "14px 20px 12px",
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
                  marginBottom: "3px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "7px",
                    background: C.goldDim,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Users size={14} style={{ color: C.gold }} />
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
                  fontSize: "12.5px",
                  color: C.muted,
                  paddingLeft: "36px",
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
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Loader2
                  size={24}
                  style={{
                    color: C.gold,
                    margin: "0 auto 10px",
                    display: "block",
                    animation: "spin 1s linear infinite",
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
                  padding: "24px 0",
                }}
              >
                {error}
              </p>
            ) : apps.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Users
                  size={34}
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
                    margin: "0 0 4px",
                  }}
                >
                  No applications yet
                </p>
                <p style={{ color: C.mutedLight, fontSize: "12px", margin: 0 }}>
                  Artists who apply will appear here
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {apps.map((app, i) => {
                  const artist = app.artist || app.applicant || {};
                  const name =
                    artist.name ||
                    artist.fullName ||
                    artist.username ||
                    "Artist";
                  const email = artist.email || app.email || "";
                  const phone = artist.phone || app.phone || "";
                  const location = artist.location || app.location || "";
                  const avatar = artist.profileImage || artist.avatar || "";
                  const portfolio =
                    artist.portfolio ||
                    artist.portfolioUrl ||
                    app.portfolio ||
                    "";
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
                        padding: "14px 16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            minWidth: 0,
                          }}
                        >
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={name}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: `2px solid ${C.border}`,
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <User size={15} style={{ color: "#1a1d24" }} />
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
                                gap: "3px 10px",
                                marginTop: "2px",
                              }}
                            >
                              {location && (
                                <span
                                  style={{
                                    fontSize: "11.5px",
                                    color: C.muted,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "3px",
                                  }}
                                >
                                  <MapPin size={10} style={{ color: C.gold }} />
                                  {location}
                                </span>
                              )}
                              {appliedAt && (
                                <span
                                  style={{ fontSize: "11.5px", color: C.muted }}
                                >
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
                            gap: "6px 14px",
                            marginBottom: "10px",
                          }}
                        >
                          {email && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                color: C.muted,
                              }}
                            >
                              <Mail size={11} style={{ color: C.gold }} />
                              {email}
                            </span>
                          )}
                          {phone && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                color: C.muted,
                              }}
                            >
                              <Phone size={11} style={{ color: C.gold }} />
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
                                gap: "4px",
                                fontSize: "12px",
                                color: C.gold,
                                textDecoration: "none",
                              }}
                            >
                              <ExternalLink size={11} />
                              Portfolio
                            </a>
                          )}
                        </div>
                      )}

                      {note && (
                        <p
                          style={{
                            margin: "0 0 10px",
                            fontSize: "12.5px",
                            color: C.muted,
                            lineHeight: "1.5",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "7px",
                            padding: "8px 10px",
                            borderLeft: `2px solid ${C.border}`,
                          }}
                        >
                          {note}
                        </p>
                      )}

                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
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
                        ].map(({ s, label, bg, color, Icon: BtnIcon }) => (
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
                              padding: "6px 12px",
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
                            <BtnIcon size={12} />
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

          {/* Footer */}
          <div
            style={{
              padding: "12px 20px",
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
              whileHover={{ borderColor: C.gold, color: C.gold }}
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
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

  const set = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: typeof e === "string" ? e : e.target.value,
    }));

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
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
        className="modal-overlay-resp"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-sheet-resp"
        >
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${C.gold}, transparent)`,
              borderRadius: "14px 14px 0 0",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "8px 0 0",
            }}
          >
            <div
              className="drag-handle-resp"
              style={{
                width: 36,
                height: 4,
                background: "rgba(255,255,255,0.12)",
                borderRadius: "4px",
              }}
            />
          </div>

          <div
            style={{
              padding: "14px 20px 12px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "7px",
                  background: C.goldDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Edit3 size={14} style={{ color: C.gold }} />
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
              }}
            >
              <X size={15} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px 20px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <form id="edit-form" onSubmit={handleSave}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 3,
                    background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                    borderRadius: "2px",
                  }}
                />
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
                  <Label>Project Type</Label>
                  <SelectInput
                    value={form.type}
                    onChange={set("type")}
                    options={PROJECT_TYPES}
                    placeholder="Select type"
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
                <div className="grid-2-resp">
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
                      placeholder="e.g., ₹5,000 – ₹8,000"
                    />
                  </div>
                </div>
                <div className="grid-2-resp">
                  <div>
                    <Label>Duration</Label>
                    <TextInput
                      icon={Clock}
                      value={form.duration}
                      onChange={set("duration")}
                      placeholder="e.g., 3 weeks"
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
                <div className="grid-2-resp">
                  <div>
                    <Label>Max Slots</Label>
                    <TextInput
                      icon={Users}
                      type="number"
                      value={form.maxSlots}
                      onChange={set("maxSlots")}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label>Available Slots</Label>
                    <TextInput
                      icon={Users}
                      type="number"
                      value={form.availableSlots}
                      onChange={set("availableSlots")}
                      placeholder="e.g., 3"
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
              padding: "12px 20px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <motion.button
              whileHover={{ borderColor: C.gold }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                padding: "10px 18px",
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
            </motion.button>
            <motion.button
              form="edit-form"
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={saving || saved}
              style={{
                padding: "10px 20px",
                background: saved
                  ? C.successBg
                  : `linear-gradient(135deg, ${C.gold}, #a8863d)`,
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
                    style={{ animation: "spin 1s linear infinite" }}
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
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

  const set = (key) => (e) =>
    setFormData((p) => ({
      ...p,
      [key]: typeof e === "string" ? e : e.target.value,
    }));

  useEffect(() => {
    let mounted = true;
    setLoadingPosts(true);
    hirerAPI
      .getOpportunities()
      .then((res) => {
        if (!mounted) return;
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
        if (mounted) setLoadingPosts(false);
      });
    return () => {
      mounted = false;
    };
  }, [submitted]);

  const parseBudgetRange = (budget) => {
    const nums = String(budget || "")
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
      const { min, max } = parseBudgetRange(formData.budget);
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

  const handlePostSaved = (updated) =>
    setRecentPosts((prev) =>
      prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)),
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg }}>
      <HirerSidebar />

      <div
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        className="main-content-resp"
      >
        <main style={{ flex: 1, overflowX: "hidden" }}>
          <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
            <div className="page-container-resp">
              {/* ── Header ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginBottom: "24px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/hirer/browse-artists")}
                    style={{
                      padding: "8px",
                      borderRadius: "9px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      cursor: "pointer",
                      color: C.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "4px",
                      touchAction: "manipulation",
                    }}
                  >
                    <ArrowLeft size={16} />
                  </motion.button>
                  <div>
                    <h1
                      style={{
                        fontSize: "clamp(20px, 4vw, 30px)",
                        fontWeight: "700",
                        margin: "0 0 4px",
                        color: C.text,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Post a Requirement
                    </h1>
                    <p
                      style={{ margin: 0, color: C.muted, fontSize: "13.5px" }}
                    >
                      Find the perfect talent for your project
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Form card ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px",
                  padding: "clamp(16px,4vw,28px)",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 3,
                    background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                    borderRadius: "2px",
                    marginBottom: "20px",
                  }}
                />
                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "18px",
                    }}
                  >
                    <div>
                      <Label>Project Title</Label>
                      <TextInput
                        icon={Briefcase}
                        value={formData.title}
                        onChange={set("title")}
                        placeholder="e.g., Lead Actor for Indie Film"
                        required
                      />
                    </div>
                    <div>
                      <Label>Project Type</Label>
                      <SelectInput
                        value={formData.type}
                        onChange={set("type")}
                        options={PROJECT_TYPES}
                        placeholder="Select project type"
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

                    <div className="grid-2-resp">
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
                          placeholder="e.g., ₹5,000 - ₹8,000"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid-2-resp">
                      <div>
                        <Label>Project Duration</Label>
                        <TextInput
                          icon={Clock}
                          value={formData.duration}
                          onChange={set("duration")}
                          placeholder="e.g., 3 weeks"
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
                    <div className="grid-2-resp">
                      <div>
                        <Label>Max Slots</Label>
                        <TextInput
                          icon={Users}
                          type="number"
                          value={formData.maxSlots}
                          onChange={set("maxSlots")}
                          placeholder="e.g., 5"
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
                          placeholder="e.g., 3"
                          required
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.012 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: "100%",
                        padding: "13px",
                        background: submitted
                          ? "rgba(74,222,128,0.85)"
                          : `linear-gradient(135deg, ${C.gold} 0%, #a8863d 100%)`,
                        color: "#1a1d24",
                        fontWeight: "700",
                        fontSize: "14px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "background 0.35s",
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
                      <p
                        style={{ color: C.danger, margin: 0, fontSize: "13px" }}
                      >
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
                transition={{ delay: 0.18, duration: 0.4 }}
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
                        animation: "spin 1s linear infinite",
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
                    <p
                      style={{
                        color: C.mutedLight,
                        fontSize: "12px",
                        margin: 0,
                      }}
                    >
                      Your posted requirements will appear here
                    </p>
                  </div>
                ) : (
                  recentPosts.map((post, i) => (
                    <motion.div
                      key={post._id || i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 + i * 0.05 }}
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: "12px",
                        padding: "16px 18px",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "8px",
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

                      {/* Info pills - scroll on mobile */}
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

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <motion.button
                          whileHover={{ borderColor: C.gold, color: C.gold }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setViewAppsPost(post)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "8px 14px",
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
                          whileHover={{ borderColor: C.gold, color: C.gold }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setEditPost(post)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "8px 14px",
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
        </main>
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
        /* Sidebar offset */
        .main-content-resp { margin-left: 0; }
        @media (min-width: 1024px) { .main-content-resp { margin-left: 288px; } }

        /* Page container padding */
        .page-container-resp {
          max-width: 820px;
          margin: 0 auto;
          padding: 20px 16px 40px;
        }
        @media (min-width: 640px)  { .page-container-resp { padding: 28px 24px 48px; } }
        @media (min-width: 1024px) { .page-container-resp { padding: 36px 32px 56px; } }

        /* 2-col grid that stacks on mobile */
        .grid-2-resp {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 480px) { .grid-2-resp { grid-template-columns: 1fr 1fr; } }

        /* Modal: full-screen sheet on mobile, centered card on desktop */
        .modal-overlay-resp {
          align-items: flex-end !important;
        }
        @media (min-width: 640px) {
          .modal-overlay-resp {
            align-items: center !important;
            padding: 20px !important;
          }
        }
        .modal-sheet-resp {
          background: ${C.cardDeep};
          border-radius: 14px 14px 0 0;
          border: 1px solid ${C.border};
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .modal-sheet-resp {
            border-radius: 16px;
            max-width: 640px;
            max-height: 85vh;
            box-shadow: 0 24px 80px rgba(0,0,0,0.65);
          }
          .drag-handle-resp { display: none; }
        }

        /* Inputs full-size touch */
        input, select, textarea, button { -webkit-tap-highlight-color: transparent; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.55) sepia(0.3) saturate(2) hue-rotate(5deg); cursor: pointer; }
        input::placeholder, textarea::placeholder { color: #6b7280; }
        * { box-sizing: border-box; }
        select option { background: #2d3139; color: #ffffff; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
