import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  Instagram,
  IndianRupee,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Film,
  Image as ImageIcon,
  Calendar,
  X,
  Loader,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { artistAPI } from "../../services/api";

// ── Design tokens ──────────────────────────────────────────────
const COLORS = {
  bg: "#1a1d24",
  card: "#20242d",
  border: "#2e3340",
  gold: "#c9a961",
  light: "#e8e9eb",
  muted: "#8ba3af",
};

// ── Sub-components ─────────────────────────────────────────────

function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        style={{ background: "#23272f" }}
      >
        <ImageIcon size={40} style={{ color: COLORS.muted }} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CreatePromotionDialog({ open, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    promotionType: "",
    reward: "",
    totalSlots: "50",
    deadline: "",
  });

  const update = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    if (!formData.projectName.trim() || !formData.description.trim()) return;
    try {
      await onCreate?.(formData);
      onClose();
      setFormData({
        projectName: "",
        description: "",
        promotionType: "",
        reward: "",
        totalSlots: "50",
        deadline: "",
      });
    } catch (_) {}
  };

  const inputStyle = {
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.light,
    caretColor: COLORS.gold,
  };
  const focusHandlers = {
    onFocus: (e) => (e.target.style.borderColor = COLORS.gold),
    onBlur: (e) => (e.target.style.borderColor = COLORS.border),
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold" style={{ color: COLORS.light }}>
            Create Promotion
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} style={{ color: COLORS.muted }} />
          </button>
        </div>
        <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
          Set up a new promotion mission for artists
        </p>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: COLORS.light }}
            >
              Project Name
            </label>
            <input
              value={formData.projectName}
              onChange={(e) => update("projectName", e.target.value)}
              placeholder="Enter movie/project name"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={inputStyle}
              {...focusHandlers}
            />
          </div>

          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: COLORS.light }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe what participants need to do..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
              style={inputStyle}
              {...focusHandlers}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: COLORS.light }}
              >
                Promotion Type
              </label>
              <select
                value={formData.promotionType}
                onChange={(e) => update("promotionType", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none appearance-none"
                style={{
                  ...inputStyle,
                  color: formData.promotionType ? COLORS.light : COLORS.muted,
                }}
                {...focusHandlers}
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="story">Instagram Story</option>
                <option value="post">Instagram Post</option>
                <option value="reel">Instagram Reel</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: COLORS.light }}
              >
                Fixed Reward (per participant)
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: COLORS.muted }}
                >
                  <IndianRupee size={14} />
                </span>
                <input
                  type="number"
                  value={formData.reward}
                  onChange={(e) => update("reward", e.target.value)}
                  placeholder="25"
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={inputStyle}
                  {...focusHandlers}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: COLORS.light }}
              >
                Total Slots
              </label>
              <input
                type="number"
                value={formData.totalSlots}
                onChange={(e) => update("totalSlots", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={inputStyle}
                {...focusHandlers}
              />
            </div>
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: COLORS.light }}
              >
                Deadline
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => update("deadline", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ ...inputStyle, colorScheme: "dark" }}
                {...focusHandlers}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: COLORS.light }}
            >
              Movie Poster
            </label>
            <button
              className="w-full py-8 rounded-lg flex flex-col items-center justify-center gap-2 transition-all"
              style={{
                border: `2px dashed ${COLORS.border}`,
                color: COLORS.muted,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.gold;
                e.currentTarget.style.color = COLORS.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.color = COLORS.muted;
              }}
            >
              <Upload size={32} />
              <span className="text-sm">Upload movie poster</span>
              <span className="text-xs">Recommended: 2:3 aspect ratio</span>
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90"
              style={{ background: COLORS.gold, color: "#1a1d24" }}
            >
              Create Promotion
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg font-medium text-sm transition-all hover:bg-white/10"
              style={{
                border: `1px solid ${COLORS.border}`,
                color: COLORS.light,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

// ── Main Component ─────────────────────────────────────────────

export default function ArtistPromotions() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreate] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showUploadDialog, setShowUpload] = useState(false);
  const [uploadProof, setUploadProof] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [allPromotions, setAllPromotions] = useState([]);
  const [myPromotions, setMyPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Effects ──
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let alive = true;
    artistAPI
      .getPromotions()
      .then((res) => {
        if (!alive) return;
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
          createdBy: "Flip",
          status: p.status === "active" ? "Pending" : "Submitted",
          submittedAt: p.createdAt,
          proofUrl: p.link || "",
          acceptedAt: p.createdAt,
        }));
        setAllPromotions(mapped);
        setMyPromotions(
          mapped.map((p) => ({
            ...p,
            status: p.status === "Submitted" ? "Submitted" : "Pending",
          })),
        );
      })
      .catch((e) => {
        if (alive) setError(e.message || "Failed to load promotions");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // ── Utilities ──
  const getTimeRemaining = (deadline) => {
    const diff = new Date(deadline).getTime() - currentTime.getTime();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusStyle = (status) => {
    const map = {
      Approved: {
        color: "#4ade80",
        background: "rgba(74,222,128,0.1)",
        border: "1px solid rgba(74,222,128,0.2)",
      },
      Submitted: {
        color: "#facc15",
        background: "rgba(250,204,21,0.1)",
        border: "1px solid rgba(250,204,21,0.2)",
      },
      Rejected: {
        color: "#f87171",
        background: "rgba(248,113,113,0.1)",
        border: "1px solid rgba(248,113,113,0.2)",
      },
    };
    return (
      map[status] || {
        color: "#60a5fa",
        background: "rgba(96,165,250,0.1)",
        border: "1px solid rgba(96,165,250,0.2)",
      }
    );
  };

  const getStatusIcon = (status) =>
    ({
      Approved: <CheckCircle size={16} />,
      Submitted: <Loader size={16} className="animate-spin" />,
      Rejected: <XCircle size={16} />,
    })[status] || <Clock size={16} />;

  // ── Handlers ──
  const handleConfirmAccept = () => {
    if (!selectedPromo) return;
    const newPromo = {
      id: selectedPromo.id,
      projectName: selectedPromo.projectName,
      poster: selectedPromo.poster,
      promotionType: selectedPromo.promotionType,
      reward: selectedPromo.reward,
      status: "Pending",
      acceptedAt: new Date().toISOString(),
      deadline: selectedPromo.deadline,
    };
    setMyPromotions((prev) =>
      prev.find((p) => p.id === newPromo.id) ? prev : [newPromo, ...prev],
    );
    setSelectedPromo(null);
    setActiveTab("my");
  };

  const handleSubmitProof = () => {
    setShowUpload(false);
    setUploadProof("");
    setSelectedPromo(null);
  };

  const handleCreatePromotion = async (formData) => {
    const created = await artistAPI.createPromotion({
      title: formData.projectName,
      description: formData.description,
      type: "featured",
      duration: formData.deadline
        ? Math.max(
            1,
            Math.ceil(
              (new Date(formData.deadline).getTime() - Date.now()) / 86400000,
            ),
          )
        : 7,
      price: Number(formData.reward || 0),
    });
    const mapped = {
      id: created._id,
      projectName: created.title || formData.projectName,
      poster: created.image || "",
      promotionType: created.type || formData.promotionType || "Promotion",
      reward: `$${Number(created.price || formData.reward || 0)}`,
      totalSlots: Number(formData.totalSlots || 50),
      filledSlots: 0,
      deadline:
        created.endDate || formData.deadline || new Date().toISOString(),
      description: created.description || formData.description,
      requirements: [],
      createdBy: "Flip",
      status: "Pending",
      acceptedAt: new Date().toISOString(),
    };
    setAllPromotions((prev) => [mapped, ...prev]);
    setMyPromotions((prev) => [mapped, ...prev]);
  };

  // ── Render ──
  return (
    <div className="min-h-screen flex" style={{ background: COLORS.bg }}>
      {/* Sidebar manages its own mobile toggle internally */}
      <Sidebar />

      {/* Main content — lg:ml-64 clears the fixed sidebar on desktop */}
      <div className="flex-1 min-w-0 lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* ── Header ── */}
          <div className="flex items-center gap-4 mb-8 mt-10 lg:mt-0">
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="p-2 rounded-lg transition-colors hover:bg-white/10 flex-shrink-0"
              style={{ color: COLORS.light }}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl sm:text-3xl font-semibold"
                style={{ color: COLORS.light }}
              >
                Promotions
              </h1>
              <p
                className="text-sm mt-1 hidden sm:block"
                style={{ color: COLORS.muted }}
              >
                Accept promotion missions and earn rewards
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90 flex-shrink-0"
              style={{ background: COLORS.gold, color: "#1a1d24" }}
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Create Promotion</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>

          {/* ── Tabs ── */}
          <div
            className="flex mb-6"
            style={{ borderBottom: `1px solid ${COLORS.border}` }}
          >
            {[
              { id: "all", label: "All Promotions" },
              { id: "my", label: "My Promotions" },
            ].map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="px-4 sm:px-6 py-3 text-sm relative transition-colors"
                  style={{ color: isActive ? COLORS.gold : COLORS.muted }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: COLORS.gold }}
                    />
                  )}
                </button>
              );
            })}
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

          {/* ── All Promotions ── */}
          {activeTab === "all" && (
            <div className="space-y-4">
              {allPromotions.map((promo) => {
                const remainingSlots = promo.totalSlots - promo.filledSlots;
                const isFull = remainingSlots <= 0;
                const timeLeft = getTimeRemaining(promo.deadline);
                const isExpired = timeLeft === "Expired";
                const disabled = isFull || isExpired;

                return (
                  <div
                    key={promo.id}
                    className="rounded-xl overflow-hidden flex transition-all"
                    style={{
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      opacity: disabled ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!disabled)
                        e.currentTarget.style.borderColor = COLORS.gold + "66";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = COLORS.border;
                    }}
                  >
                    {/* Poster */}
                    <div className="w-28 sm:w-36 md:w-40 flex-shrink-0 relative">
                      <ImageWithFallback
                        src={promo.poster}
                        alt={promo.projectName}
                        className="w-full h-full object-cover"
                      />
                      {disabled && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xs font-bold tracking-widest">
                            {isFull ? "FULL" : "EXPIRED"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <h3
                          className="text-base sm:text-lg font-semibold mb-2"
                          style={{ color: COLORS.light }}
                        >
                          {promo.projectName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-3">
                          <span
                            className="flex items-center gap-1"
                            style={{ color: COLORS.muted }}
                          >
                            <Instagram size={13} /> {promo.promotionType}
                          </span>
                          <span
                            className="flex items-center gap-1 font-semibold"
                            style={{ color: COLORS.gold }}
                          >
                            <IndianRupee size={13} /> {promo.reward} reward
                          </span>
                          <span
                            className="flex items-center gap-1"
                            style={{ color: COLORS.muted }}
                          >
                            <Users size={13} /> {remainingSlots}/
                            {promo.totalSlots} slots
                          </span>
                          <span
                            className="flex items-center gap-1"
                            style={{
                              color: isExpired ? "#f87171" : COLORS.muted,
                            }}
                          >
                            <Clock size={13} /> {timeLeft}
                          </span>
                        </div>
                        <p
                          className="text-xs sm:text-sm mb-4 line-clamp-2"
                          style={{ color: COLORS.muted }}
                        >
                          {promo.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs"
                          style={{ color: COLORS.muted }}
                        >
                          By {promo.createdBy}
                        </span>
                        <button
                          onClick={() => !disabled && setSelectedPromo(promo)}
                          disabled={disabled}
                          className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: COLORS.gold, color: "#1a1d24" }}
                        >
                          Accept Promotion
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── My Promotions ── */}
          {activeTab === "my" && (
            <div className="space-y-4">
              {myPromotions.length === 0 ? (
                <div className="text-center py-20">
                  <Film
                    size={64}
                    className="mx-auto mb-4 opacity-30"
                    style={{ color: COLORS.muted }}
                  />
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: COLORS.light }}
                  >
                    No promotions yet
                  </h3>
                  <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
                    Accept promotions from the "All Promotions" tab to get
                    started
                  </p>
                  <button
                    onClick={() => setActiveTab("all")}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                    style={{ background: COLORS.gold, color: "#1a1d24" }}
                  >
                    Browse Promotions
                  </button>
                </div>
              ) : (
                myPromotions.map((promo) => {
                  const timeLeft = getTimeRemaining(promo.deadline);
                  const isExpired = timeLeft === "Expired";
                  const statusStyle = getStatusStyle(promo.status);

                  return (
                    <div
                      key={promo.id}
                      className="rounded-xl overflow-hidden flex"
                      style={{
                        background: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      {/* Poster */}
                      <div className="w-28 sm:w-36 md:w-40 flex-shrink-0 relative">
                        <ImageWithFallback
                          src={promo.poster}
                          alt={promo.projectName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <div
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm"
                            style={statusStyle}
                          >
                            {getStatusIcon(promo.status)}
                            <span className="hidden sm:inline">
                              {promo.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-3 sm:p-5 min-w-0">
                        <h3
                          className="text-base sm:text-lg font-semibold mb-2"
                          style={{ color: COLORS.light }}
                        >
                          {promo.projectName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-4">
                          <span
                            className="flex items-center gap-1"
                            style={{ color: COLORS.muted }}
                          >
                            <Instagram size={13} /> {promo.promotionType}
                          </span>
                          <span
                            className="flex items-center gap-1 font-semibold"
                            style={{ color: COLORS.gold }}
                          >
                            <IndianRupee size={13} /> {promo.reward}
                          </span>
                          {!isExpired && (
                            <span
                              className="flex items-center gap-1"
                              style={{ color: COLORS.muted }}
                            >
                              <Clock size={13} /> {timeLeft} left
                            </span>
                          )}
                        </div>

                        {promo.status === "Approved" && (
                          <div
                            className="rounded-lg p-3 sm:p-4 mb-3"
                            style={{
                              background: "rgba(74,222,128,0.1)",
                              border: "1px solid rgba(74,222,128,0.2)",
                            }}
                          >
                            <div
                              className="flex items-center gap-2 mb-1 text-xs sm:text-sm font-medium"
                              style={{ color: "#4ade80" }}
                            >
                              <CheckCircle size={15} /> Approved! Payment will
                              be processed
                            </div>
                            <p
                              className="text-xs"
                              style={{ color: COLORS.muted }}
                            >
                              Approved on{" "}
                              {new Date(promo.approvedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {promo.status === "Submitted" && (
                          <div
                            className="rounded-lg p-3 sm:p-4 mb-3"
                            style={{
                              background: "rgba(250,204,21,0.1)",
                              border: "1px solid rgba(250,204,21,0.2)",
                            }}
                          >
                            <div
                              className="flex items-center gap-2 mb-1 text-xs sm:text-sm font-medium"
                              style={{ color: "#facc15" }}
                            >
                              <Loader size={15} className="animate-spin" />{" "}
                              Under Review
                            </div>
                            <p
                              className="text-xs"
                              style={{ color: COLORS.muted }}
                            >
                              Submitted on{" "}
                              {new Date(promo.submittedAt).toLocaleDateString()}{" "}
                              — Awaiting approval
                            </p>
                          </div>
                        )}

                        {promo.status === "Pending" && !isExpired && (
                          <div
                            className="rounded-lg p-3 sm:p-4 mb-3"
                            style={{
                              background: "rgba(96,165,250,0.1)",
                              border: "1px solid rgba(96,165,250,0.2)",
                            }}
                          >
                            <div
                              className="flex items-center gap-2 mb-1 text-xs sm:text-sm font-medium"
                              style={{ color: "#60a5fa" }}
                            >
                              <AlertCircle size={15} /> Action Required
                            </div>
                            <p
                              className="text-xs mb-3"
                              style={{ color: COLORS.muted }}
                            >
                              Complete the task and submit proof before the
                              deadline
                            </p>
                            <button
                              onClick={() => {
                                setSelectedPromo(promo);
                                setShowUpload(true);
                              }}
                              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                              style={{
                                background: COLORS.gold,
                                color: "#1a1d24",
                              }}
                            >
                              <Upload size={12} /> Submit Proof
                            </button>
                          </div>
                        )}

                        {promo.proofUrl && (
                          <p
                            className="text-xs"
                            style={{ color: COLORS.muted }}
                          >
                            <span style={{ color: COLORS.light }}>Proof: </span>
                            <a
                              href={promo.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: COLORS.gold }}
                              className="hover:underline"
                            >
                              {promo.proofUrl}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Accept Dialog ── */}
      <Dialog
        open={!!selectedPromo && !showUploadDialog}
        onClose={() => setSelectedPromo(null)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2
              className="text-xl font-semibold"
              style={{ color: COLORS.light }}
            >
              Accept Promotion
            </h2>
            <button
              onClick={() => setSelectedPromo(null)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} style={{ color: COLORS.muted }} />
            </button>
          </div>
          <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
            Review the requirements before accepting
          </p>

          {selectedPromo && (
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedPromo.poster}
                    alt={selectedPromo.projectName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: COLORS.light }}
                  >
                    {selectedPromo.projectName}
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <div
                      className="flex items-center gap-2"
                      style={{ color: COLORS.muted }}
                    >
                      <Instagram size={15} /> {selectedPromo.promotionType}
                    </div>
                    <div
                      className="flex items-center gap-2 font-semibold"
                      style={{ color: COLORS.gold }}
                    >
                      <IndianRupee size={15} /> {selectedPromo.reward} fixed
                      reward
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{ color: COLORS.muted }}
                    >
                      <Calendar size={15} /> Deadline:{" "}
                      {new Date(selectedPromo.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4
                  className="text-sm font-semibold mb-3"
                  style={{ color: COLORS.light }}
                >
                  Requirements
                </h4>
                <ul className="space-y-2">
                  {selectedPromo.requirements?.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: COLORS.muted }}
                    >
                      <CheckCircle
                        size={16}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: COLORS.gold }}
                      />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-lg p-4 text-sm"
                style={{
                  background: `${COLORS.gold}10`,
                  border: `1px solid ${COLORS.gold}33`,
                  color: COLORS.muted,
                }}
              >
                By accepting, you commit to completing the task by the deadline.
                Payment is processed within 3–5 business days after approval.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAccept}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{ background: COLORS.gold, color: "#1a1d24" }}
                >
                  Accept &amp; Start Mission
                </button>
                <button
                  onClick={() => setSelectedPromo(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/10"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.light,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* ── Submit Proof Dialog ── */}
      <Dialog open={showUploadDialog} onClose={() => setShowUpload(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2
              className="text-xl font-semibold"
              style={{ color: COLORS.light }}
            >
              Submit Proof
            </h2>
            <button
              onClick={() => setShowUpload(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} style={{ color: COLORS.muted }} />
            </button>
          </div>
          <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
            Upload a screenshot or provide a link to your Instagram post
          </p>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: COLORS.light }}
              >
                Instagram Post URL
              </label>
              <input
                value={uploadProof}
                onChange={(e) => setUploadProof(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.light,
                  caretColor: COLORS.gold,
                }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.gold)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
              />
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: COLORS.light }}
              >
                Or Upload Screenshot
              </label>
              <button
                className="w-full py-8 rounded-lg flex flex-col items-center justify-center gap-2 transition-all"
                style={{
                  border: `2px dashed ${COLORS.border}`,
                  color: COLORS.muted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.gold;
                  e.currentTarget.style.color = COLORS.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.color = COLORS.muted;
                }}
              >
                <ImageIcon size={32} />
                <span className="text-sm">Click to upload screenshot</span>
                <span className="text-xs">PNG, JPG up to 10MB</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitProof}
                disabled={!uploadProof}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: COLORS.gold, color: "#1a1d24" }}
              >
                Submit for Review
              </button>
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/10"
                style={{
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.light,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* ── Create Promotion Dialog ── */}
      <CreatePromotionDialog
        open={showCreateDialog}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreatePromotion}
      />
    </div>
  );
}
