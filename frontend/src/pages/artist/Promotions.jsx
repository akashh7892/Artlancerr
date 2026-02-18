import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  Instagram,
  DollarSign,
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

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  bg: "#1a1d24",
  card: "#20242d",
  border: "#2e3340",
  gold: "#c9a961",
  light: "#e8e9eb",
  muted: "#8ba3af",
};

const ALL_PROMOTIONS = [
  {
    id: 1,
    projectName: "Midnight Echo",
    poster:
      "https://images.unsplash.com/photo-1620153850780-0883dd907257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    promotionType: "Instagram Story",
    reward: "$25",
    totalSlots: 50,
    filledSlots: 32,
    deadline: "2026-02-20T23:59:59",
    description:
      "Share our movie poster on your Instagram story with the hashtag #MidnightEcho",
    requirements: [
      "Post must be visible for 24 hours",
      "Must include project hashtag",
      "Tag @midnightechomovie",
    ],
    createdBy: "Warner Bros Studios",
  },
  {
    id: 2,
    projectName: "The Last Horizon",
    poster:
      "https://images.unsplash.com/photo-1574267432644-f74f897cb112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    promotionType: "Instagram Post",
    reward: "$50",
    totalSlots: 50,
    filledSlots: 45,
    deadline: "2026-02-18T23:59:59",
    description: "Create a feed post about our upcoming thriller film",
    requirements: [
      "Minimum 100 followers",
      "Include movie poster",
      "Caption must be at least 50 words",
    ],
    createdBy: "Paramount Pictures",
  },
  {
    id: 3,
    projectName: "Dance Revolution",
    poster:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    promotionType: "Instagram Reel",
    reward: "$75",
    totalSlots: 50,
    filledSlots: 12,
    deadline: "2026-02-25T23:59:59",
    description:
      "Create a 15-30 second reel featuring our dance film soundtrack",
    requirements: [
      "Reel must be 15-30 seconds",
      "Use official soundtrack",
      "Include dance moves",
    ],
    createdBy: "Universal Studios",
  },
  {
    id: 4,
    projectName: "Shadows & Light",
    poster:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    promotionType: "Instagram Story",
    reward: "$30",
    totalSlots: 50,
    filledSlots: 50,
    deadline: "2026-02-17T23:59:59",
    description: "Share behind-the-scenes content on your story",
    requirements: ["Story must include swipe-up link", "24-hour visibility"],
    createdBy: "Netflix Films",
  },
];

const INITIAL_MY_PROMOTIONS = [
  {
    id: 2,
    projectName: "The Last Horizon",
    poster:
      "https://images.unsplash.com/photo-1574267432644-f74f897cb112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    promotionType: "Instagram Post",
    reward: "$50",
    status: "Submitted",
    submittedAt: "2026-02-15T10:30:00",
    deadline: "2026-02-18T23:59:59",
    proofUrl: "https://instagram.com/p/example123",
  },
  {
    id: 1,
    projectName: "Midnight Echo",
    poster:
      "https://images.unsplash.com/photo-1620153850780-0883dd907257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    promotionType: "Instagram Story",
    reward: "$25",
    status: "Approved",
    submittedAt: "2026-02-14T16:45:00",
    approvedAt: "2026-02-15T09:20:00",
    deadline: "2026-02-20T23:59:59",
    proofUrl: "https://instagram.com/stories/example",
  },
  {
    id: 3,
    projectName: "Dance Revolution",
    poster:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    promotionType: "Instagram Reel",
    reward: "$75",
    status: "Pending",
    acceptedAt: "2026-02-14T12:00:00",
    deadline: "2026-02-25T23:59:59",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function CreatePromotionDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    promotionType: "",
    reward: "",
    totalSlots: "50",
    deadline: "",
  });

  const update = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = () => {
    onClose();
    setFormData({
      projectName: "",
      description: "",
      promotionType: "",
      reward: "",
      totalSlots: "50",
      deadline: "",
    });
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
                  $
                </span>
                <input
                  type="number"
                  value={formData.reward}
                  onChange={(e) => update("reward", e.target.value)}
                  placeholder="25"
                  className="w-full pl-7 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ArtistPromotions() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProof, setUploadProof] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [myPromotions, setMyPromotions] = useState(INITIAL_MY_PROMOTIONS);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  const getStatusIcon = (status) => {
    const map = {
      Approved: <CheckCircle size={16} />,
      Submitted: <Loader size={16} className="animate-spin" />,
      Rejected: <XCircle size={16} />,
    };
    return map[status] || <Clock size={16} />;
  };

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
    setShowUploadDialog(false);
    setUploadProof("");
    setSelectedPromo(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex" style={{ background: COLORS.bg }}>
      <Sidebar />

      {/* ── Main content — offset by sidebar width ── */}
      <div className="flex-1 ml-64 min-w-0">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="p-2 rounded-lg transition-colors hover:bg-white/10 flex-shrink-0"
              style={{ color: COLORS.light }}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1
                className="text-3xl font-semibold"
                style={{ color: COLORS.light }}
              >
                Promotions
              </h1>
              <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                Accept promotion missions and earn rewards
              </p>
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90 flex-shrink-0"
              style={{ background: COLORS.gold, color: "#1a1d24" }}
            >
              <Upload size={16} />
              Create Promotion
            </button>
          </div>

          {/* Tabs */}
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
                  className="px-6 py-3 text-sm relative transition-colors"
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

          {/* ── All Promotions ── */}
          {activeTab === "all" && (
            <div className="space-y-4">
              {ALL_PROMOTIONS.map((promo) => {
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
                    <div className="w-40 flex-shrink-0 relative">
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
                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <h3
                          className="text-lg font-semibold mb-2"
                          style={{ color: COLORS.light }}
                        >
                          {promo.projectName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                          <span
                            className="flex items-center gap-1.5"
                            style={{ color: COLORS.muted }}
                          >
                            <Instagram size={15} />
                            {promo.promotionType}
                          </span>
                          <span
                            className="flex items-center gap-1.5 font-semibold"
                            style={{ color: COLORS.gold }}
                          >
                            <DollarSign size={15} />
                            {promo.reward} reward
                          </span>
                          <span
                            className="flex items-center gap-1.5"
                            style={{ color: COLORS.muted }}
                          >
                            <Users size={15} />
                            {remainingSlots} / {promo.totalSlots} slots left
                          </span>
                          <span
                            className="flex items-center gap-1.5"
                            style={{
                              color: isExpired ? "#f87171" : COLORS.muted,
                            }}
                          >
                            <Clock size={15} />
                            {timeLeft}
                          </span>
                        </div>
                        <p
                          className="text-sm mb-4 line-clamp-2"
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
                          className="px-5 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <div className="w-40 flex-shrink-0 relative">
                        <ImageWithFallback
                          src={promo.poster}
                          alt={promo.projectName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                            style={statusStyle}
                          >
                            {getStatusIcon(promo.status)}
                            {promo.status}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-5 min-w-0">
                        <h3
                          className="text-lg font-semibold mb-2"
                          style={{ color: COLORS.light }}
                        >
                          {promo.projectName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                          <span
                            className="flex items-center gap-1.5"
                            style={{ color: COLORS.muted }}
                          >
                            <Instagram size={15} />
                            {promo.promotionType}
                          </span>
                          <span
                            className="flex items-center gap-1.5 font-semibold"
                            style={{ color: COLORS.gold }}
                          >
                            <DollarSign size={15} />
                            {promo.reward}
                          </span>
                          {!isExpired && (
                            <span
                              className="flex items-center gap-1.5"
                              style={{ color: COLORS.muted }}
                            >
                              <Clock size={15} />
                              {timeLeft} left
                            </span>
                          )}
                        </div>

                        {promo.status === "Approved" && (
                          <div
                            className="rounded-lg p-4 mb-3"
                            style={{
                              background: "rgba(74,222,128,0.1)",
                              border: "1px solid rgba(74,222,128,0.2)",
                            }}
                          >
                            <div
                              className="flex items-center gap-2 mb-1 text-sm font-medium"
                              style={{ color: "#4ade80" }}
                            >
                              <CheckCircle size={16} /> Approved! Payment will
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
                            className="rounded-lg p-4 mb-3"
                            style={{
                              background: "rgba(250,204,21,0.1)",
                              border: "1px solid rgba(250,204,21,0.2)",
                            }}
                          >
                            <div
                              className="flex items-center gap-2 mb-1 text-sm font-medium"
                              style={{ color: "#facc15" }}
                            >
                              <Loader size={16} className="animate-spin" />{" "}
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
                            className="rounded-lg p-4 mb-3"
                            style={{
                              background: "rgba(96,165,250,0.1)",
                              border: "1px solid rgba(96,165,250,0.2)",
                            }}
                          >
                            <div
                              className="flex items-center gap-2 mb-1 text-sm font-medium"
                              style={{ color: "#60a5fa" }}
                            >
                              <AlertCircle size={16} /> Action Required
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
                                setShowUploadDialog(true);
                              }}
                              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
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
                      <Instagram size={15} />
                      {selectedPromo.promotionType}
                    </div>
                    <div
                      className="flex items-center gap-2 font-semibold"
                      style={{ color: COLORS.gold }}
                    >
                      <DollarSign size={15} />
                      {selectedPromo.reward} fixed reward
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{ color: COLORS.muted }}
                    >
                      <Calendar size={15} />
                      Deadline:{" "}
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
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2
              className="text-xl font-semibold"
              style={{ color: COLORS.light }}
            >
              Submit Proof
            </h2>
            <button
              onClick={() => setShowUploadDialog(false)}
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
                onClick={() => setShowUploadDialog(false)}
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

      <CreatePromotionDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
}
