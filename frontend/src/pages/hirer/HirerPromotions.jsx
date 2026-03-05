import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Clock,
  Users,
  DollarSign,
  ArrowLeft,
  Instagram,
  CheckCircle,
  AlertCircle,
  Calendar,
  Film,
  Eye,
  ThumbsUp,
  ThumbsDown,
  X,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  cardInner: "#1a1d24",
  border: "rgba(201,169,97,0.2)",
  borderSub: "rgba(201,169,97,0.08)",
  gold: "#c9a961",
  text: "#ffffff",
  muted: "#9ca3af",
  inputBg: "#22252e",
  inputBorder: "rgba(255,255,255,0.08)",
  green: "#4ade80",
  greenDim: "rgba(74,222,128,0.10)",
  yellow: "#facc15",
  yellowDim: "rgba(250,204,21,0.10)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.10)",
};

// ── Utilities ──────────────────────────────────────────────────────────────
function timeLeft(deadline, now) {
  const diff = new Date(deadline).getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ── Primitives ─────────────────────────────────────────────────────────────
function Img({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: C.inputBg }}
      >
        <Film size={28} style={{ color: C.muted, opacity: 0.35 }} />
      </div>
    );
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: "cover" }}
      onError={() => setErr(true)}
    />
  );
}

function StatusBadge({ status }) {
  const s = {
    Pending: { bg: C.yellowDim, color: C.yellow },
    Approved: { bg: C.greenDim, color: C.green },
    Rejected: { bg: C.redDim, color: C.red },
    Active: { bg: "rgba(74,222,128,0.88)", color: "#fff" },
    Completed: { bg: "rgba(156,163,175,0.35)", color: "#fff" },
  }[status] || { bg: C.yellowDim, color: C.yellow };
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

function ProgressBar({ pct }) {
  return (
    <div
      style={{
        height: 6,
        borderRadius: 99,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7 }}
        style={{ height: "100%", background: C.gold, borderRadius: 99 }}
      />
    </div>
  );
}

function FieldInput({ type = "text", value, onChange, placeholder, icon }) {
  return (
    <div className="relative">
      {icon && (
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: C.muted }}
        >
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl outline-none text-sm"
        style={{
          background: C.inputBg,
          border: `1px solid ${C.inputBorder}`,
          color: C.text,
          padding: icon ? "10px 14px 10px 36px" : "10px 14px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(201,169,97,0.5)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = C.inputBorder;
        }}
      />
    </div>
  );
}

// ── Modal shell ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, subtitle, children, wide }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[900] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          key="box"
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: wide ? 680 : 540,
            maxHeight: "90vh",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 28px 80px rgba(0,0,0,0.55)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "24px 24px 20px",
              borderBottom: `1px solid ${C.borderSub}`,
              flexShrink: 0,
            }}
          >
            <div>
              <p
                style={{
                  color: C.text,
                  fontSize: 20,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {title}
              </p>
              {subtitle && (
                <p style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.07)",
                color: C.muted,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
            >
              <X size={15} />
            </button>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 24px",
              scrollbarWidth: "thin",
              scrollbarColor: `rgba(201,169,97,0.2) transparent`,
            }}
          >
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function HirerPromotions() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [now, setNow] = useState(new Date());
  const [allPromos, setAllPromos] = useState([]);
  const [myPromos, setMyPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailPromo, setDetailPromo] = useState(null);
  const [reviewPromo, setReviewPromo] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (reviewPromo) {
      const fresh = myPromos.find((p) => p.id === reviewPromo.id);
      if (fresh) setReviewPromo(fresh);
    }
  }, [myPromos]);

  useEffect(() => {
    let m = true;
    hirerAPI
      .getPromotions()
      .then((res) => {
        if (!m) return;
        const list = Array.isArray(res) ? res : [];
        const mapped = list.map((p) => ({
          id: p._id,
          projectName: p.title || "Promotion",
          poster: p.image || "",
          promotionType: p.type || "Promotion",
          reward: `$${Number(p.price || 0)}`,
          totalSlots: 50,
          filledSlots: 0,
          deadline: p.endDate || p.createdAt,
          description: p.description || "",
          requirements: [],
          createdBy: "Artlancerr",
          acceptedCount: 0,
          submittedCount: 0,
          approvedCount: 0,
          rejectedCount: 0,
          pendingReview: 0,
          status: p.status === "active" ? "Active" : "Completed",
          submissions: [],
        }));
        setAllPromos(mapped);
        setMyPromos(mapped);
      })
      .catch((e) => {
        if (m) setError(e.message || "Failed to load promotions");
      })
      .finally(() => {
        if (m) setLoading(false);
      });
    return () => {
      m = false;
    };
  }, []);

  const handleCreatePromotion = async (form) => {
    const created = await hirerAPI.createPromotion({
      title: form.projectName,
      description: form.description,
      type: "featured",
      duration: form.deadline
        ? Math.max(
            1,
            Math.ceil(
              (new Date(form.deadline).getTime() - Date.now()) / 86400000,
            ),
          )
        : 7,
      price: Number(form.reward || 0),
    });
    const mapped = {
      id: created._id,
      projectName: created.title || form.projectName,
      poster: created.image || "",
      promotionType: created.type || form.promotionType || "Promotion",
      reward: `$${Number(created.price || form.reward || 0)}`,
      totalSlots: Number(form.totalSlots || 50),
      filledSlots: 0,
      deadline: created.endDate || form.deadline || new Date().toISOString(),
      description: created.description || form.description,
      requirements: [],
      createdBy: "Artlancerr",
      acceptedCount: 0,
      submittedCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      pendingReview: 0,
      status: "Active",
      submissions: [],
    };
    setAllPromos((prev) => [mapped, ...prev]);
    setMyPromos((prev) => [mapped, ...prev]);
  };

  const approve = (promoId, subId) =>
    setMyPromos((prev) =>
      prev.map((p) =>
        p.id !== promoId
          ? p
          : {
              ...p,
              pendingReview: Math.max(0, p.pendingReview - 1),
              approvedCount: p.approvedCount + 1,
              submissions: p.submissions.map((s) =>
                s.id === subId ? { ...s, status: "Approved" } : s,
              ),
            },
      ),
    );

  const reject = (promoId, subId) =>
    setMyPromos((prev) =>
      prev.map((p) =>
        p.id !== promoId
          ? p
          : {
              ...p,
              pendingReview: Math.max(0, p.pendingReview - 1),
              rejectedCount: p.rejectedCount + 1,
              submissions: p.submissions.map((s) =>
                s.id === subId ? { ...s, status: "Rejected" } : s,
              ),
            },
      ),
    );

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .pc { transition: border-color 0.2s, box-shadow 0.2s; }
        .pc:hover { border-color: rgba(201,169,97,0.45) !important; box-shadow: 0 6px 28px rgba(0,0,0,0.3); }
        .tln { position: relative; }
      `}</style>

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[40] bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar wrapper ──
          lg+: always visible, fixed 288px (matches HirerSidebar w-72).
          <lg:  off-canvas drawer toggled by sidebarOpen. */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-[50]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: "288px" }}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors z-10"
          style={{ color: C.muted }}
        >
          <X size={18} />
        </button>
        <HirerSidebar />
      </div>

      {/* ── Main content ──
          lg+: offset by sidebar (lg:ml-72).
          <lg:  full width with a sticky mobile top bar. */}
      <div className="flex-1 min-w-0 lg:ml-72">
        {/* Mobile top bar */}
        <div
          className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
          style={{ background: C.bg, borderBottom: `1px solid ${C.borderSub}` }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors hover:bg-white/10 flex-shrink-0"
            style={{ color: C.text }}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <span className="text-base font-semibold" style={{ color: C.text }}>
            Promotions
          </span>
        </div>

        {/* Page content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <button
              onClick={() => navigate("/hirer/dashboard")}
              className="flex items-center justify-center w-9 h-9 rounded-lg outline-none border-0 cursor-pointer flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", color: C.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              {/* Title hidden on mobile (shown in top bar) */}
              <h1
                className="hidden lg:block"
                style={{
                  color: C.text,
                  fontSize: 30,
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                Promotions
              </h1>
              <p
                className="hidden lg:block"
                style={{ color: C.muted, fontSize: 14 }}
              >
                Create promotion missions and manage submissions
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-sm font-semibold outline-none border-0 cursor-pointer flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #d4b56e)`,
                color: "#1a1d24",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            >
              <Upload size={16} strokeWidth={2.2} />
              <span className="hidden sm:inline">Create Promotion</span>
              <span className="sm:hidden">Create</span>
            </button>
          </motion.div>

          {/* Tabs */}
          <div
            className="flex mb-6"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            {[
              ["all", "All Promotions"],
              ["my", "My Promotions"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="tln px-4 sm:px-6 py-3 text-sm font-medium outline-none border-0 bg-transparent cursor-pointer"
                style={{ color: tab === key ? C.gold : C.muted }}
              >
                {label}
                {tab === key && (
                  <motion.div
                    layoutId="ul"
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: 2, background: C.gold }}
                  />
                )}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && (
            <p className="text-sm mb-4" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {/* ALL */}
            {tab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {(allPromos || []).map((p, i) => {
                  const rem = p.totalSlots - p.filledSlots;
                  const isFull = rem <= 0;
                  const tl = timeLeft(p.deadline, now);
                  const expired = tl === "Expired";
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="pc flex overflow-hidden rounded-xl"
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        opacity: isFull || expired ? 0.6 : 1,
                      }}
                    >
                      {/* Poster */}
                      <div
                        className="relative flex-shrink-0 w-28 sm:w-36 md:w-44"
                        style={{ minHeight: 190 }}
                      >
                        <Img
                          src={p.poster}
                          alt={p.projectName}
                          className="absolute inset-0 w-full h-full"
                        />
                        {(isFull || expired) && (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(0,0,0,0.55)" }}
                          >
                            <span
                              style={{
                                color: "#fff",
                                fontWeight: 700,
                                letterSpacing: 2,
                                fontSize: 11,
                              }}
                            >
                              {isFull ? "FULL" : "EXPIRED"}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col justify-between min-w-0">
                        <div>
                          <h3
                            className="text-base sm:text-lg font-semibold mb-2"
                            style={{ color: C.text }}
                          >
                            {p.projectName}
                          </h3>
                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mb-3">
                            <span
                              className="flex items-center gap-1"
                              style={{ color: C.muted }}
                            >
                              <Instagram size={13} /> {p.promotionType}
                            </span>
                            <span
                              className="flex items-center gap-1 font-semibold"
                              style={{ color: C.gold }}
                            >
                              <DollarSign size={13} /> {p.reward} reward
                            </span>
                            <span
                              className="flex items-center gap-1"
                              style={{ color: C.muted }}
                            >
                              <Users size={13} /> {rem}/{p.totalSlots} slots
                            </span>
                            <span
                              className="flex items-center gap-1"
                              style={{ color: expired ? C.red : C.muted }}
                            >
                              <Clock size={13} /> {tl}
                            </span>
                          </div>
                          <p
                            className="text-xs sm:text-sm leading-relaxed"
                            style={{
                              color: C.muted,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {p.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span style={{ color: C.muted, fontSize: 12 }}>
                            By {p.createdBy}
                          </span>
                          <button
                            onClick={() => setDetailPromo(p)}
                            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium outline-none cursor-pointer"
                            style={{
                              background: "transparent",
                              border: `1px solid ${C.border}`,
                              color: C.text,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = C.gold;
                              e.currentTarget.style.color = C.gold;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.color = C.text;
                            }}
                          >
                            <Eye size={14} /> View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* MY */}
            {tab === "my" && (
              <motion.div
                key="my"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {myPromos.map((p, i) => {
                  const tl = timeLeft(p.deadline, now);
                  const pct = Math.round(
                    (p.acceptedCount / p.totalSlots) * 100,
                  );
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="pc flex overflow-hidden rounded-xl"
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {/* Poster */}
                      <div
                        className="relative flex-shrink-0 w-28 sm:w-36 md:w-44"
                        style={{ minHeight: 260 }}
                      >
                        <Img
                          src={p.poster}
                          alt={p.projectName}
                          className="absolute inset-0 w-full h-full"
                        />
                        <div className="absolute top-3 left-3">
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col gap-3 sm:gap-4 min-w-0">
                        <div>
                          <h3
                            className="text-base sm:text-lg font-semibold mb-2"
                            style={{ color: C.text }}
                          >
                            {p.projectName}
                          </h3>
                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                            <span
                              className="flex items-center gap-1"
                              style={{ color: C.muted }}
                            >
                              <Instagram size={13} /> {p.promotionType}
                            </span>
                            <span
                              className="flex items-center gap-1 font-semibold"
                              style={{ color: C.gold }}
                            >
                              <DollarSign size={13} /> {p.reward} per artist
                            </span>
                            {p.status === "Active" && tl !== "Expired" && (
                              <span
                                className="flex items-center gap-1"
                                style={{ color: C.muted }}
                              >
                                <Clock size={13} /> {tl} left
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                            <span style={{ color: C.muted }}>
                              Participation
                            </span>
                            <span
                              className="font-semibold"
                              style={{ color: C.text }}
                            >
                              {p.acceptedCount} / {p.totalSlots}
                            </span>
                          </div>
                          <ProgressBar pct={pct} />
                        </div>
                        {/* Stats — 2×2 on mobile, 4-col on sm+ */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            {
                              label: "Submitted",
                              val: p.submittedCount,
                              bg: C.cardInner,
                              col: C.text,
                            },
                            {
                              label: "Approved",
                              val: p.approvedCount,
                              bg: C.greenDim,
                              col: C.green,
                            },
                            {
                              label: "Pending",
                              val: p.pendingReview,
                              bg: C.yellowDim,
                              col: C.yellow,
                            },
                            {
                              label: "Rejected",
                              val: p.rejectedCount,
                              bg: C.redDim,
                              col: C.red,
                            },
                          ].map(({ label, val, bg, col }) => (
                            <div
                              key={label}
                              className="rounded-lg p-2 sm:p-3 text-center"
                              style={{ background: bg }}
                            >
                              <p
                                style={{
                                  color: col,
                                  fontSize: 20,
                                  fontWeight: 600,
                                  margin: 0,
                                }}
                              >
                                {val}
                              </p>
                              <p
                                style={{
                                  color: C.muted,
                                  fontSize: 11,
                                  marginTop: 2,
                                }}
                              >
                                {label}
                              </p>
                            </div>
                          ))}
                        </div>
                        {/* Action buttons — stack on mobile */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {p.pendingReview > 0 && (
                            <button
                              onClick={() => setReviewPromo(p)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold outline-none border-0 cursor-pointer"
                              style={{
                                background: `linear-gradient(135deg, ${C.gold}, #d4b56e)`,
                                color: "#1a1d24",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.filter =
                                  "brightness(1.08)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.filter = "none";
                              }}
                            >
                              <AlertCircle size={14} /> Review Submissions (
                              {p.pendingReview})
                            </button>
                          )}
                          <button
                            onClick={() => setReviewPromo(p)}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium outline-none cursor-pointer"
                            style={{
                              background: "transparent",
                              border: `1px solid ${C.border}`,
                              color: C.text,
                              flex: p.pendingReview > 0 ? "0 0 auto" : 1,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = C.gold;
                              e.currentTarget.style.color = C.gold;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.color = C.text;
                            }}
                          >
                            <Eye size={14} /> View All Submissions
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Promotion Details Modal ── */}
      <Modal
        open={!!detailPromo}
        onClose={() => setDetailPromo(null)}
        title="Promotion Details"
        subtitle="View the full details of this promotion"
      >
        {detailPromo && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div
                style={{
                  width: 96,
                  height: 144,
                  borderRadius: 12,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Img
                  src={detailPromo.poster}
                  alt={detailPromo.projectName}
                  className="w-full h-full"
                />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <p
                  style={{
                    color: C.text,
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  {detailPromo.projectName}
                </p>
                {[
                  {
                    Icon: Instagram,
                    label: detailPromo.promotionType,
                    color: C.muted,
                  },
                  {
                    Icon: DollarSign,
                    label: `${detailPromo.reward} fixed reward`,
                    color: C.gold,
                  },
                  {
                    Icon: Calendar,
                    label: `Deadline: ${new Date(detailPromo.deadline).toLocaleDateString()}`,
                    color: C.muted,
                  },
                  {
                    Icon: Users,
                    label: `${detailPromo.totalSlots} total slots`,
                    color: C.muted,
                  },
                ].map(({ Icon, label, color }, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color,
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    <Icon size={14} /> {label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: C.borderSub }} />
            <div>
              <p style={{ color: C.text, fontWeight: 600, marginBottom: 6 }}>
                Description
              </p>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
                {detailPromo.description}
              </p>
            </div>
            {detailPromo.requirements?.length > 0 && (
              <div>
                <p style={{ color: C.text, fontWeight: 600, marginBottom: 10 }}>
                  Requirements
                </p>
                {detailPromo.requirements.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <CheckCircle
                      size={16}
                      style={{ color: C.gold, flexShrink: 0, marginTop: 1 }}
                    />
                    <span style={{ color: C.muted, fontSize: 13 }}>{r}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setDetailPromo(null)}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: `linear-gradient(135deg, ${C.gold}, #d4b56e)`,
                color: "#1a1d24",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* ── Review Submissions Modal ── */}
      <Modal
        open={!!reviewPromo}
        onClose={() => setReviewPromo(null)}
        title="Review Submissions"
        subtitle="Approve or reject artist submissions"
        wide
      >
        {reviewPromo &&
          (reviewPromo.submissions.length === 0 ? (
            <p
              style={{ color: C.muted, textAlign: "center", padding: "40px 0" }}
            >
              No submissions yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviewPromo.submissions.map((sub) => (
                <motion.div
                  key={sub.id}
                  layout
                  style={{
                    background: C.cardInner,
                    border: `1px solid ${C.borderSub}`,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Img
                        src={sub.artistPhoto}
                        alt={sub.artistName}
                        className="w-full h-full"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 3,
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <p
                          style={{ color: C.text, fontWeight: 600, margin: 0 }}
                        >
                          {sub.artistName}
                        </p>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p
                        style={{
                          color: C.muted,
                          fontSize: 12,
                          marginBottom: 8,
                        }}
                      >
                        Submitted{" "}
                        {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <a
                        href={sub.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: C.gold,
                          fontSize: 13,
                          display: "block",
                          marginBottom: 10,
                          wordBreak: "break-all",
                        }}
                      >
                        {sub.proofUrl}
                      </a>
                      {sub.status === "Pending" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => approve(reviewPromo.id, sub.id)}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              padding: "8px 0",
                              borderRadius: 10,
                              border: "none",
                              background: `linear-gradient(135deg, ${C.gold}, #d4b56e)`,
                              color: "#1a1d24",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.filter = "brightness(1.08)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.filter = "none";
                            }}
                          >
                            <ThumbsUp size={14} /> Approve
                          </button>
                          <button
                            onClick={() => reject(reviewPromo.id, sub.id)}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              padding: "8px 0",
                              borderRadius: 10,
                              border: `1px solid rgba(248,113,113,0.25)`,
                              background: C.redDim,
                              color: C.red,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.filter = "brightness(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.filter = "none";
                            }}
                          >
                            <ThumbsDown size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
      </Modal>

      {/* ── Create Promotion Modal ── */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Promotion"
        subtitle="Set up a new promotion mission for artists"
      >
        <CreateForm
          onClose={() => setShowCreate(false)}
          onCreate={handleCreatePromotion}
        />
      </Modal>
    </div>
  );
}

// ── Create Promotion Form ──────────────────────────────────────────────────
function CreateForm({ onClose, onCreate }) {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    promotionType: "",
    reward: "",
    totalSlots: "50",
    deadline: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label
          style={{
            color: C.text,
            fontSize: 13,
            fontWeight: 500,
            display: "block",
            marginBottom: 6,
          }}
        >
          Project Name
        </label>
        <FieldInput
          value={form.projectName}
          onChange={(e) => set("projectName", e.target.value)}
          placeholder="Enter movie/project name"
        />
      </div>
      <div>
        <label
          style={{
            color: C.text,
            fontSize: 13,
            fontWeight: 500,
            display: "block",
            marginBottom: 6,
          }}
        >
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe what participants need to do..."
          rows={4}
          style={{
            width: "100%",
            borderRadius: 12,
            background: C.inputBg,
            border: `1px solid ${C.inputBorder}`,
            color: C.text,
            padding: "10px 14px",
            fontSize: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            outline: "none",
            resize: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(201,169,97,0.5)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = C.inputBorder;
          }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label
            style={{
              color: C.text,
              fontSize: 13,
              fontWeight: 500,
              display: "block",
              marginBottom: 6,
            }}
          >
            Promotion Type
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={form.promotionType}
              onChange={(e) => set("promotionType", e.target.value)}
              style={{
                width: "100%",
                borderRadius: 12,
                background: C.inputBg,
                border: `1px solid ${C.inputBorder}`,
                color: form.promotionType ? C.text : C.muted,
                padding: "10px 36px 10px 14px",
                fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(201,169,97,0.5)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.inputBorder;
              }}
            >
              <option value="" disabled style={{ background: "#22252e" }}>
                Select type
              </option>
              <option value="story" style={{ background: "#22252e" }}>
                Instagram Story
              </option>
              <option value="post" style={{ background: "#22252e" }}>
                Instagram Post
              </option>
              <option value="reel" style={{ background: "#22252e" }}>
                Instagram Reel
              </option>
            </select>
            <svg
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: C.muted,
              }}
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M6 8L1 3h10z" />
            </svg>
          </div>
        </div>
        <div>
          <label
            style={{
              color: C.text,
              fontSize: 13,
              fontWeight: 500,
              display: "block",
              marginBottom: 6,
            }}
          >
            Fixed Reward (per participant)
          </label>
          <FieldInput
            type="number"
            value={form.reward}
            onChange={(e) => set("reward", e.target.value)}
            placeholder="25"
            icon={<DollarSign size={15} />}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label
            style={{
              color: C.text,
              fontSize: 13,
              fontWeight: 500,
              display: "block",
              marginBottom: 6,
            }}
          >
            Total Slots
          </label>
          <FieldInput
            type="number"
            value={form.totalSlots}
            onChange={(e) => set("totalSlots", e.target.value)}
            placeholder="50"
          />
        </div>
        <div>
          <label
            style={{
              color: C.text,
              fontSize: 13,
              fontWeight: 500,
              display: "block",
              marginBottom: 6,
            }}
          >
            Deadline
          </label>
          <FieldInput
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label
          style={{
            color: C.text,
            fontSize: 13,
            fontWeight: 500,
            display: "block",
            marginBottom: 6,
          }}
        >
          Movie Poster
        </label>
        <button
          style={{
            width: "100%",
            padding: "32px 0",
            borderRadius: 12,
            border: "2px dashed rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.02)",
            color: C.muted,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.gold;
            e.currentTarget.style.color = C.gold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = C.muted;
          }}
        >
          <Upload size={28} strokeWidth={1.5} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Upload movie poster
          </span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Recommended: 2:3 aspect ratio
          </span>
        </button>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={async () => {
            await onCreate?.(form);
            onClose();
          }}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 12,
            border: "none",
            background: `linear-gradient(135deg, ${C.gold}, #d4b56e)`,
            color: "#1a1d24",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
          }}
        >
          Create Promotion
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: "transparent",
            color: C.text,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(201,169,97,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
