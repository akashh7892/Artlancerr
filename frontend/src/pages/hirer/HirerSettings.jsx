import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Eye,
  EyeOff,
  Camera,
  Check,
  ChevronRight,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Download,
  AlertTriangle,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  LogOut,
} from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { getUser, hirerAPI, setUser, uploadFile } from "../../services/api";
import { useNavigate } from "react-router";

// ─── Design tokens (matches HirerDashboard / HirerMessages theme) ──────────
const C = {
  bg: "#191d25",
  card: "#22252e",
  cardInner: "#191d25",
  border: "rgba(201,169,97,0.14)",
  borderSub: "rgba(201,169,97,0.07)",
  gold: "#c9a961",
  goldDim: "rgba(201,169,97,0.10)",
  text: "#e8e4d8",
  muted: "#5a6e7d",
  sub: "#7a8fa0",
  inputBorder: "rgba(255,255,255,0.07)",
  inputBg: "#191d25",
  green: "#4ade80",
  red: "#f87171",
  blue: "#60a5fa",
};

// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV = [
  { key: "profile", icon: User, label: "Profile" },
  { key: "notifications", icon: Bell, label: "Notifications" },
  { key: "security", icon: Shield, label: "Security" },
  { key: "billing", icon: CreditCard, label: "Billing" },
  { key: "privacy", icon: Globe, label: "Privacy" },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    desc: "Up to 5 job postings · Email support · Basic analytics",
    popular: false,
  },
  {
    id: "pro",
    name: "Hirer Pro",
    price: 5999,
    desc: "Unlimited postings · Priority support · Advanced analytics",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 14999,
    desc: "Custom postings · Dedicated manager · Full analytics suite",
    popular: false,
  },
];

// ─── Primitives ──────────────────────────────────────────────────────────────
const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`rounded-xl p-5 sm:p-6 ${className}`}
    style={{
      backgroundColor: C.card,
      border: `1px solid ${C.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);

const SLabel = ({ children }) => (
  <label
    className="block text-sm font-medium mb-1.5"
    style={{ color: C.muted }}
  >
    {children}
  </label>
);

const SInput = ({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  rightEl,
}) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-lg text-[13.5px] outline-none transition-all"
      style={{
        background: C.inputBg,
        border: `1px solid ${C.inputBorder}`,
        color: C.text,
        padding: rightEl ? "10px 42px 10px 14px" : "10px 14px",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={(e) => {
        if (!disabled) e.target.style.borderColor = "rgba(201,169,97,0.38)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = C.inputBorder;
      }}
    />
    {rightEl && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
    )}
  </div>
);

const Toggle = ({ checked, onChange, label, description }) => (
  <div
    className="flex items-center justify-between py-3"
    style={{ borderBottom: `1px solid ${C.borderSub}` }}
  >
    <div className="flex-1 pr-6">
      <p className="text-sm font-medium" style={{ color: C.text }}>
        {label}
      </p>
      {description && (
        <p className="text-xs mt-0.5" style={{ color: C.muted }}>
          {description}
        </p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200 outline-none border-0 cursor-pointer"
      style={{ background: checked ? C.gold : "rgba(255,255,255,0.09)" }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
        style={{
          background: "#fff",
          left: checked ? "calc(100% - 22px)" : "2px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
        }}
      />
    </button>
  </div>
);

const SaveBtn = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    className="px-5 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all outline-none border-0 cursor-pointer"
    style={{
      background: `linear-gradient(135deg,${C.gold},#d4b56e)`,
      color: "#1a1d24",
      opacity: loading ? 0.7 : 1,
    }}
    onMouseEnter={(e) => {
      if (!loading) e.currentTarget.style.filter = "brightness(1.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.filter = "";
    }}
  >
    {loading ? "Saving…" : "Save Changes"}
  </button>
);

const GhostBtn = ({ onClick, children, style = {} }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer transition-all"
    style={{
      background: "transparent",
      border: `1px solid ${C.border}`,
      color: C.text,
      ...style,
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.borderColor = "rgba(201,169,97,0.35)")
    }
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
  >
    {children}
  </button>
);

// ─── Modal ───────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl p-5 sm:p-6"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-base" style={{ color: C.text }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="border-0 bg-transparent outline-none cursor-pointer"
              style={{ color: C.muted }}
            >
              <X size={17} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl"
        style={{
          background:
            type === "success"
              ? "rgba(74,222,128,0.12)"
              : "rgba(248,113,113,0.12)",
          border: `1px solid ${type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
          backdropFilter: "blur(12px)",
          maxWidth: "calc(100vw - 32px)",
        }}
      >
        {type === "success" ? (
          <CheckCircle2 size={16} style={{ color: C.green }} />
        ) : (
          <XCircle size={16} style={{ color: C.red }} />
        )}
        <span className="text-sm font-medium" style={{ color: C.text }}>
          {message}
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function HirerSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // billing modals
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [addingCard, setAddingCard] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [billing, setBilling] = useState({
    plan: null,
    renewDate: null,
    paymentMethods: [],
    invoices: [],
  });
  const [sessions, setSessions] = useState([]);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    website: "",
    bio: "",
    location: "",
    avatar: "",
  });

  const [notif, setNotif] = useState({
    newApplications: false,
    projectUpdates: false,
    paymentAlerts: false,
    weeklyDigest: false,
    artistMessages: false,
    marketingEmails: false,
    pushEnabled: false,
    smsAlerts: false,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
    twoFactor: false,
    loginAlerts: false,
    sessionTimeout: "30",
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showBudgetRange: false,
    showHiringHistory: false,
    allowArtistContact: false,
    dataAnalytics: false,
    showOnlineStatus: false,
  });

  const flash = (msg, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  /* ── Load profile ── */
  useEffect(() => {
    const lu = getUser();
    if (lu) {
      const p = (lu.name || "").split(" ");
      setProfile((prev) => ({
        ...prev,
        firstName: p[0] || "",
        lastName: p.slice(1).join(" ") || "",
        email: lu.email || "",
      }));
    }
    (async () => {
      try {
        const d = await hirerAPI.getProfile();
        const p = (d.name || "").split(" ");
        setProfile((prev) => ({
          ...prev,
          firstName: p[0] || prev.firstName,
          lastName: p.slice(1).join(" ") || prev.lastName,
          email: d.email || prev.email,
          phone: d.phone || "",
          company: d.companyName || "",
          website: d.companyWebsite || "",
          bio: d.bio || "",
          location: d.location || "",
          avatar: d.avatar || "",
        }));
        if (d.notifications)
          setNotif({
            newApplications: d.notifications.emailApplications || false,
            projectUpdates: d.notifications.pushApplications || false,
            paymentAlerts: d.notifications.emailPayments || false,
            weeklyDigest: d.notifications.weeklyDigest || false,
            artistMessages: d.notifications.emailMessages || false,
            marketingEmails: d.notifications.marketingEmails || false,
            pushEnabled: d.notifications.pushMessages || false,
            smsAlerts: d.notifications.smsAlerts || false,
          });
        if (d.privacy) setPrivacy((p) => ({ ...p, ...d.privacy }));
        if (d.security)
          setSecurity((p) => ({
            ...p,
            twoFactor: d.security.twoFactor || false,
            loginAlerts: d.security.loginAlerts || false,
            sessionTimeout: d.security.sessionTimeout || "30",
          }));
        if (d.sessions) setSessions(d.sessions);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* ── Load billing when tab opens ── */
  useEffect(() => {
    if (activeTab !== "billing") return;
    setBillingLoading(true);
    (async () => {
      try {
        const [plan, pmethods, invs] = await Promise.all([
          hirerAPI.getBillingPlan?.() || Promise.resolve(null),
          hirerAPI.getPaymentMethods?.() || Promise.resolve([]),
          hirerAPI.getInvoices?.() || Promise.resolve([]),
        ]);
        setBilling({
          plan,
          renewDate: plan?.renewDate || null,
          paymentMethods: Array.isArray(pmethods) ? pmethods : [],
          invoices: Array.isArray(invs) ? invs : [],
        });
      } catch (e) {
        flash("Failed to load billing information", "error");
      } finally {
        setBillingLoading(false);
      }
    })();
  }, [activeTab]);

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "profile") {
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        const upd = await hirerAPI.updateProfile({
          name: fullName,
          companyName: profile.company,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          companyWebsite: profile.website,
          avatar: profile.avatar,
        });
        const lu = getUser();
        if (lu)
          setUser({
            ...lu,
            name: upd?.name || fullName,
            email: upd?.email || lu.email,
            avatar: upd?.avatar || profile.avatar || lu.avatar,
          });
      }
      if (activeTab === "notifications")
        await hirerAPI.updateProfile({
          notifications: {
            emailMessages: notif.artistMessages,
            emailPayments: notif.paymentAlerts,
            emailApplications: notif.newApplications,
            weeklyDigest: notif.weeklyDigest,
            marketingEmails: notif.marketingEmails,
            pushMessages: notif.pushEnabled,
            pushApplications: notif.projectUpdates,
            pushPayments: notif.paymentAlerts,
            smsAlerts: notif.smsAlerts,
          },
        });
      if (activeTab === "privacy") await hirerAPI.updateProfile({ privacy });
      setSaved(true);
      flash("Changes saved successfully");
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      flash("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      flash("Please select an image file", "error");
      return;
    }
    setAvatarUploading(true);
    try {
      const up = await uploadFile(file, {
        bucket: "profile-images",
        type: "profile",
        fieldName: "file",
      });
      const upd = await hirerAPI.updateProfile({ avatar: up.url });
      const url = upd?.avatar || up.url;
      setProfile((p) => ({ ...p, avatar: url }));
      const lu = getUser();
      if (lu) setUser({ ...lu, avatar: url });
      flash("Profile photo updated");
    } catch (e) {
      flash("Failed to upload profile photo", "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!security.currentPassword || !security.newPassword) {
      flash("Please fill in all password fields", "error");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      flash("Passwords do not match", "error");
      return;
    }
    if (security.newPassword.length < 8) {
      flash("Password must be at least 8 characters", "error");
      return;
    }
    try {
      await hirerAPI.updatePassword?.({
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      setSecurity((s) => ({
        ...s,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      flash("Password updated successfully");
    } catch (e) {
      flash("Failed to update password. Check your current password.", "error");
    }
  };

  const handleUpgradePlan = async () => {
    if (!selectedPlan) return;
    setPlanLoading(true);
    try {
      await hirerAPI.upgradePlan?.({ planId: selectedPlan });
      const pi = PLANS.find((p) => p.id === selectedPlan);
      setBilling((b) => ({
        ...b,
        plan: { ...b.plan, id: selectedPlan, name: pi?.name, price: pi?.price },
      }));
      setShowUpgradeModal(false);
      flash(`Upgraded to ${pi?.name} successfully`);
    } catch (e) {
      flash("Failed to upgrade plan", "error");
    } finally {
      setPlanLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.name) {
      flash("Please fill in all card details", "error");
      return;
    }
    setAddingCard(true);
    try {
      const added = await hirerAPI.addPaymentMethod?.({
        cardNumber: newCard.number.replace(/\s/g, ""),
        expiry: newCard.expiry,
        cvv: newCard.cvv,
        cardholderName: newCard.name,
      });
      setBilling((b) => ({
        ...b,
        paymentMethods: [
          ...b.paymentMethods,
          added || {
            id: Date.now(),
            last4: newCard.number.slice(-4),
            brand: "Card",
            expiry: newCard.expiry,
            isDefault: b.paymentMethods.length === 0,
          },
        ],
      }));
      setNewCard({ number: "", expiry: "", cvv: "", name: "" });
      setShowAddPaymentModal(false);
      flash("Payment method added successfully");
    } catch (e) {
      flash("Failed to add payment method", "error");
    } finally {
      setAddingCard(false);
    }
  };

  const handleRemovePayment = async (id) => {
    try {
      await hirerAPI.removePaymentMethod?.({ methodId: id });
      setBilling((b) => ({
        ...b,
        paymentMethods: b.paymentMethods.filter((m) => m.id !== id),
      }));
      flash("Payment method removed");
    } catch (e) {
      flash("Failed to remove payment method", "error");
    }
  };
  const handleSetDefault = async (id) => {
    try {
      await hirerAPI.setDefaultPaymentMethod?.({ methodId: id });
      setBilling((b) => ({
        ...b,
        paymentMethods: b.paymentMethods.map((m) => ({
          ...m,
          isDefault: m.id === id,
        })),
      }));
      flash("Default payment method updated");
    } catch (e) {
      flash("Failed to update default", "error");
    }
  };
  const handleRevokeSession = async (id) => {
    try {
      await hirerAPI.revokeSession?.({ sessionId: id });
      setSessions((s) => s.filter((x) => x.id !== id));
      flash("Session revoked");
    } catch (e) {
      flash("Failed to revoke session", "error");
    }
  };

  const handleExportInvoices = () => {
    if (billing.invoices.length === 0) {
      flash("No invoices to export", "error");
      return;
    }
    const csv = [
      "Date,Description,Amount,Status",
      ...billing.invoices.map(
        (i) => `${i.date},"${i.description}",₹${i.amount},${i.status}`,
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `invoices_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
    flash("Invoices exported as CSV");
  };

  const handleDownloadData = async () => {
    try {
      const data = await hirerAPI.exportUserData?.();
      if (data) {
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          }),
        );
        const a = Object.assign(document.createElement("a"), {
          href: url,
          download: `my_data_${new Date().toISOString().slice(0, 10)}.json`,
        });
        a.click();
        URL.revokeObjectURL(url);
      }
      flash("Your data download has started");
    } catch (e) {
      flash("Failed to download data", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      flash("Please type DELETE to confirm", "error");
      return;
    }
    try {
      await hirerAPI.deleteAccount?.();
      flash("Account deleted. Redirecting…");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (e) {
      flash("Failed to delete account. Contact support.", "error");
    }
  };

  const fmtCard = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const pp = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const pn = (k, v) => setNotif((p) => ({ ...p, [k]: v }));
  const ps = (k, v) => setSecurity((p) => ({ ...p, [k]: v }));
  const ppv = (k, v) => setPrivacy((p) => ({ ...p, [k]: v }));
  const pc = (k, v) => setNewCard((p) => ({ ...p, [k]: v }));

  const activeNav = NAV.find((n) => n.key === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .hs-root { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── Mobile: horizontal scrollable tab strip ── */
        .hs-tab-strip {
          display: flex; gap: 6px;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; padding-bottom: 3px; margin-bottom: 20px;
        }
        .hs-tab-strip::-webkit-scrollbar { display: none; }

        .hs-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500; white-space: nowrap;
          flex-shrink: 0; cursor: pointer; outline: none;
          border: 1px solid transparent;
          transition: background 0.13s, color 0.13s, border-color 0.13s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Desktop side nav — hidden on mobile */
        .hs-sidenav { display: none; }
        @media (min-width: 1024px) {
          .hs-sidenav   { display: block; }
          .hs-tab-strip { display: none; }
        }

        /* Header top pad: clears hamburger button on mobile */
        .hs-hdr { padding-top: 56px; margin-bottom: 20px; }
        @media (min-width: 1024px) { .hs-hdr { padding-top: 0; margin-bottom: 28px; } }

        /* Page offset for desktop sidebar */
        .hs-main { margin-left: 0; }
        @media (min-width: 1024px) { .hs-main { margin-left: 242px; } }

        /* ── Logout button ── */
        .hs-logout {
          display: flex; align-items: center; gap: 9px;
          width: 100%; padding: 12px 16px; border-radius: 11px;
          border: 1px solid rgba(248,113,113,0.25);
          background: rgba(248,113,113,0.07); color: #f87171;
          font-size: 13.5px; font-weight: 600; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          justify-content: center;
          transition: background 0.14s, border-color 0.14s;
        }
        .hs-logout:hover { background: rgba(248,113,113,0.14); border-color: rgba(248,113,113,0.5); }
        .hs-logout-mobile { display: block; }
        @media (min-width: 1024px) { .hs-logout-mobile { display: none; } }

        /* misc */
        .nav-item  { transition: background 0.14s, color 0.14s; }
        .plan-card { transition: border-color 0.18s, transform 0.18s; }
        .plan-card:hover { border-color: rgba(201,169,97,0.4) !important; transform: translateY(-2px); }
        .danger-btn { transition: background 0.14s, border-color 0.14s; }
        .danger-btn:hover { background: rgba(248,113,113,0.09) !important; border-color: rgba(248,113,113,0.42) !important; }
        select option { background: #22252e; color: #e8e4d8; }
      `}</style>

      <div
        className="min-h-screen flex hs-root"
        style={{ backgroundColor: C.bg }}
      >
        <HirerSidebar />

        {/* ── Content area ── */}
        <div className="flex-1 hs-main min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="hs-hdr">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ color: C.text }}
              >
                Settings
              </h1>
              <p style={{ color: C.muted, fontSize: 13.5 }}>
                Manage your account preferences and configurations
              </p>
            </div>

            {/* ── Mobile horizontal tab strip ── */}
            <div className="hs-tab-strip">
              {NAV.map(({ key, icon: Icon, label }) => {
                const a = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className="hs-pill"
                    style={{
                      background: a ? C.goldDim : C.card,
                      borderColor: a ? C.gold : C.border,
                      color: a ? C.gold : C.muted,
                      fontWeight: a ? 600 : 400,
                    }}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Two-column layout */}
            <div className="flex gap-5 lg:gap-6 items-start">
              {/* Desktop side nav */}
              <div className="hs-sidenav w-52 flex-shrink-0 sticky top-8">
                <div
                  className="rounded-xl p-2"
                  style={{
                    backgroundColor: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {NAV.map(({ key, icon: Icon, label }) => {
                    const a = activeTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left outline-none border-0 cursor-pointer mb-0.5"
                        style={{
                          background: a ? C.goldDim : "transparent",
                          color: a ? C.gold : C.muted,
                          borderLeft: `2px solid ${a ? C.gold : "transparent"}`,
                        }}
                      >
                        <Icon size={15} strokeWidth={a ? 2.2 : 1.8} />
                        {label}
                        {a && <ChevronRight size={13} className="ml-auto" />}
                      </button>
                    );
                  })}
                  {/* Logout in desktop nav */}
                  <div
                    style={{
                      borderTop: `1px solid ${C.borderSub}`,
                      marginTop: 8,
                      paddingTop: 8,
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left outline-none border-0 cursor-pointer"
                      style={{
                        color: "#f87171",
                        background: "transparent",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(248,113,113,0.09)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <LogOut size={15} /> Log Out
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Panel content ── */}
              <div className="flex-1 min-w-0 space-y-5">
                {/* ════════ PROFILE ════════ */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <Card>
                      <h2
                        className="text-base font-semibold mb-5"
                        style={{ color: C.text }}
                      >
                        Profile Information
                      </h2>

                      {/* Avatar row */}
                      <div
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6"
                        style={{ borderBottom: `1px solid ${C.borderSub}` }}
                      >
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold overflow-hidden"
                            style={{
                              width: 72,
                              height: 72,
                              background: `linear-gradient(135deg,${C.gold},#b8913a)`,
                              color: "#1a1d24",
                            }}
                          >
                            {profile.avatar ? (
                              <img
                                src={profile.avatar}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-2xl"
                              />
                            ) : (
                              <>
                                {profile.firstName?.[0]?.toUpperCase() || "?"}
                                {profile.lastName?.[0]?.toUpperCase() || ""}
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-0 outline-none cursor-pointer"
                            style={{ background: C.gold, color: "#1a1d24" }}
                          >
                            <Camera size={12} strokeWidth={2.5} />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </div>
                        <div>
                          <p
                            className="font-semibold text-sm sm:text-base"
                            style={{ color: C.text }}
                          >
                            {profile.firstName || profile.lastName
                              ? `${profile.firstName} ${profile.lastName}`.trim()
                              : "—"}
                          </p>
                          <p className="text-sm" style={{ color: C.muted }}>
                            {[profile.role, profile.company]
                              .filter(Boolean)
                              .join(" at ") || "No role set"}
                          </p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs mt-1.5 outline-none border-0 bg-transparent cursor-pointer"
                            style={{ color: C.gold }}
                          >
                            {avatarUploading ? "Uploading…" : "Change photo"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            id: "fn",
                            label: "First Name",
                            key: "firstName",
                            placeholder: "First name",
                          },
                          {
                            id: "ln",
                            label: "Last Name",
                            key: "lastName",
                            placeholder: "Last name",
                          },
                          {
                            id: "em",
                            label: "Email",
                            key: "email",
                            placeholder: "email@example.com",
                            type: "email",
                          },
                          {
                            id: "ph",
                            label: "Phone",
                            key: "phone",
                            placeholder: "+91 00000 00000",
                          },
                          {
                            id: "co",
                            label: "Company",
                            key: "company",
                            placeholder: "Your company name",
                          },
                          {
                            id: "ro",
                            label: "Job Title",
                            key: "role",
                            placeholder: "e.g. Producer, Director",
                          },
                          {
                            id: "lo",
                            label: "Location",
                            key: "location",
                            placeholder: "City, State",
                          },
                          {
                            id: "ws",
                            label: "Website",
                            key: "website",
                            placeholder: "https://yourwebsite.com",
                          },
                        ].map(
                          ({ id, label, key, placeholder, type = "text" }) => (
                            <div key={id}>
                              <SLabel>{label}</SLabel>
                              <SInput
                                id={id}
                                type={type}
                                value={profile[key]}
                                onChange={(e) => pp(key, e.target.value)}
                                placeholder={placeholder}
                              />
                            </div>
                          ),
                        )}
                        <div className="sm:col-span-2">
                          <SLabel>Bio</SLabel>
                          <textarea
                            value={profile.bio}
                            onChange={(e) => pp("bio", e.target.value)}
                            rows={4}
                            maxLength={500}
                            className="w-full rounded-lg text-[13.5px] outline-none resize-none transition-all"
                            style={{
                              background: C.inputBg,
                              border: `1px solid ${C.inputBorder}`,
                              color: C.text,
                              padding: "10px 14px",
                              fontFamily: "'Plus Jakarta Sans',sans-serif",
                            }}
                            placeholder="Tell artists about yourself and your work…"
                            onFocus={(e) =>
                              (e.target.style.borderColor =
                                "rgba(201,169,97,0.38)")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = C.inputBorder)
                            }
                          />
                          <p
                            className="text-xs mt-1"
                            style={{ color: C.muted }}
                          >
                            {(profile.bio || "").length}/500
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {saved && (
                        <span
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: C.green }}
                        >
                          <Check size={15} /> Saved successfully
                        </span>
                      )}
                      <div className="ml-auto">
                        <SaveBtn onClick={handleSave} loading={saving} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ════════ NOTIFICATIONS ════════ */}
                {activeTab === "notifications" && (
                  <motion.div
                    key="notif"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: C.goldDim }}
                        >
                          <Mail size={17} style={{ color: C.gold }} />
                        </div>
                        <h2
                          className="text-base font-semibold"
                          style={{ color: C.text }}
                        >
                          Email Notifications
                        </h2>
                      </div>
                      <Toggle
                        checked={notif.newApplications}
                        onChange={(v) => pn("newApplications", v)}
                        label="New Applications"
                        description="Get notified when artists apply to your postings"
                      />
                      <Toggle
                        checked={notif.projectUpdates}
                        onChange={(v) => pn("projectUpdates", v)}
                        label="Project Updates"
                        description="Milestone completions and status changes"
                      />
                      <Toggle
                        checked={notif.paymentAlerts}
                        onChange={(v) => pn("paymentAlerts", v)}
                        label="Payment Alerts"
                        description="Escrow releases, invoices, and payment confirmations"
                      />
                      <Toggle
                        checked={notif.artistMessages}
                        onChange={(v) => pn("artistMessages", v)}
                        label="Artist Messages"
                        description="New messages from hired artists"
                      />
                      <Toggle
                        checked={notif.weeklyDigest}
                        onChange={(v) => pn("weeklyDigest", v)}
                        label="Weekly Digest"
                        description="A weekly summary of your activity and top talent"
                      />
                      <Toggle
                        checked={notif.marketingEmails}
                        onChange={(v) => pn("marketingEmails", v)}
                        label="Product & Marketing"
                        description="News, features, and tips from Flip"
                      />
                    </Card>
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: "rgba(96,165,250,0.10)" }}
                        >
                          <Smartphone size={17} style={{ color: C.blue }} />
                        </div>
                        <h2
                          className="text-base font-semibold"
                          style={{ color: C.text }}
                        >
                          Push &amp; SMS
                        </h2>
                      </div>
                      <Toggle
                        checked={notif.pushEnabled}
                        onChange={(v) => pn("pushEnabled", v)}
                        label="Push Notifications"
                        description="Enable browser or app push alerts"
                      />
                      <Toggle
                        checked={notif.smsAlerts}
                        onChange={(v) => pn("smsAlerts", v)}
                        label="SMS Alerts"
                        description="Critical alerts sent to your phone number"
                      />
                    </Card>
                    <div className="flex justify-end">
                      <SaveBtn onClick={handleSave} loading={saving} />
                    </div>
                  </motion.div>
                )}

                {/* ════════ SECURITY ════════ */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: C.goldDim }}
                        >
                          <Lock size={17} style={{ color: C.gold }} />
                        </div>
                        <h2
                          className="text-base font-semibold"
                          style={{ color: C.text }}
                        >
                          Change Password
                        </h2>
                      </div>
                      <div className="space-y-4">
                        {[
                          {
                            id: "curPw",
                            label: "Current Password",
                            key: "currentPassword",
                            show: "showCurrent",
                          },
                          {
                            id: "newPw",
                            label: "New Password",
                            key: "newPassword",
                            show: "showNew",
                          },
                          {
                            id: "confPw",
                            label: "Confirm New Password",
                            key: "confirmPassword",
                            show: "showConfirm",
                          },
                        ].map(({ id, label, key, show }) => (
                          <div key={id}>
                            <SLabel>{label}</SLabel>
                            <SInput
                              id={id}
                              type={security[show] ? "text" : "password"}
                              value={security[key]}
                              onChange={(e) => ps(key, e.target.value)}
                              placeholder={label}
                              rightEl={
                                <button
                                  className="border-0 bg-transparent outline-none cursor-pointer"
                                  style={{ color: C.muted }}
                                  onClick={() => ps(show, !security[show])}
                                >
                                  {security[show] ? (
                                    <EyeOff size={14} />
                                  ) : (
                                    <Eye size={14} />
                                  )}
                                </button>
                              }
                            />
                            {key === "newPassword" &&
                              security.newPassword.length > 0 && (
                                <div className="mt-2">
                                  <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map((n) => (
                                      <div
                                        key={n}
                                        className="h-1 flex-1 rounded-full transition-all duration-300"
                                        style={{
                                          background:
                                            security.newPassword.length >= n * 2
                                              ? n <= 1
                                                ? "#f87171"
                                                : n <= 2
                                                  ? "#fb923c"
                                                  : n <= 3
                                                    ? "#facc15"
                                                    : C.green
                                              : "rgba(255,255,255,0.09)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <p
                                    className="text-xs"
                                    style={{ color: C.muted }}
                                  >
                                    {security.newPassword.length < 2
                                      ? "Too short"
                                      : security.newPassword.length < 4
                                        ? "Weak"
                                        : security.newPassword.length < 6
                                          ? "Fair"
                                          : security.newPassword.length < 8
                                            ? "Good"
                                            : "Strong"}
                                  </p>
                                </div>
                              )}
                            {key === "confirmPassword" &&
                              security.confirmPassword &&
                              security.newPassword !==
                                security.confirmPassword && (
                                <p
                                  className="text-xs mt-1"
                                  style={{ color: C.red }}
                                >
                                  Passwords do not match
                                </p>
                              )}
                          </div>
                        ))}
                        <button
                          onClick={handleUpdatePassword}
                          className="px-5 py-2.5 rounded-lg text-sm font-semibold outline-none border-0 cursor-pointer transition-all"
                          style={{ background: C.gold, color: "#1a1d24" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.filter = "brightness(1.08)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.filter = "")
                          }
                        >
                          Update Password
                        </button>
                      </div>
                    </Card>

                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: "rgba(74,222,128,0.10)" }}
                        >
                          <Shield size={17} style={{ color: C.green }} />
                        </div>
                        <h2
                          className="text-base font-semibold"
                          style={{ color: C.text }}
                        >
                          Account Security
                        </h2>
                      </div>
                      <Toggle
                        checked={security.twoFactor}
                        onChange={(v) => ps("twoFactor", v)}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security with an authenticator app"
                      />
                      <Toggle
                        checked={security.loginAlerts}
                        onChange={(v) => ps("loginAlerts", v)}
                        label="Login Alerts"
                        description="Get notified of new sign-ins from unrecognised devices"
                      />
                      <div className="mt-4">
                        <SLabel>Auto-logout After</SLabel>
                        <div className="relative w-full sm:w-52">
                          <select
                            value={security.sessionTimeout}
                            onChange={(e) =>
                              ps("sessionTimeout", e.target.value)
                            }
                            className="w-full rounded-lg text-[13.5px] outline-none appearance-none cursor-pointer"
                            style={{
                              background: C.inputBg,
                              border: `1px solid ${C.inputBorder}`,
                              color: C.text,
                              padding: "10px 36px 10px 14px",
                              fontFamily: "'Plus Jakarta Sans',sans-serif",
                            }}
                          >
                            {[
                              ["15", "15 minutes"],
                              ["30", "30 minutes"],
                              ["60", "1 hour"],
                              ["480", "8 hours"],
                              ["0", "Never"],
                            ].map(([v, l]) => (
                              <option key={v} value={v}>
                                {l}
                              </option>
                            ))}
                          </select>
                          <ChevronRight
                            size={12}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"
                            style={{ color: C.muted }}
                          />
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <h2
                        className="text-base font-semibold mb-4"
                        style={{ color: C.text }}
                      >
                        Active Sessions
                      </h2>
                      {sessions.length === 0 ? (
                        <p
                          className="text-sm py-4 text-center"
                          style={{ color: C.muted }}
                        >
                          No active sessions data available
                        </p>
                      ) : (
                        sessions.map((s, i) => (
                          <div
                            key={s.id || i}
                            className="flex items-center justify-between py-3"
                            style={{
                              borderBottom:
                                i < sessions.length - 1
                                  ? `1px solid ${C.borderSub}`
                                  : "none",
                            }}
                          >
                            <div className="flex-1 min-w-0 pr-3">
                              <p
                                className="text-sm font-medium truncate"
                                style={{ color: C.text }}
                              >
                                {s.device}
                                {s.current && (
                                  <span
                                    className="ml-2 text-xs px-2 py-0.5 rounded-full"
                                    style={{
                                      background: "rgba(74,222,128,0.12)",
                                      color: C.green,
                                    }}
                                  >
                                    Current
                                  </span>
                                )}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: C.muted }}
                              >
                                {s.location} · {s.lastActive}
                              </p>
                            </div>
                            {!s.current && (
                              <button
                                onClick={() => handleRevokeSession(s.id)}
                                className="text-xs outline-none border-0 bg-transparent cursor-pointer flex-shrink-0"
                                style={{ color: C.red }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.opacity = "0.7")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.opacity = "1")
                                }
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </Card>
                  </motion.div>
                )}

                {/* ════════ BILLING ════════ */}
                {activeTab === "billing" && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    {billingLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2
                          size={28}
                          className="animate-spin"
                          style={{ color: C.gold }}
                        />
                      </div>
                    ) : (
                      <>
                        {/* Current plan */}
                        <Card>
                          <h2
                            className="text-base font-semibold mb-5"
                            style={{ color: C.text }}
                          >
                            Current Plan
                          </h2>
                          {billing.plan ? (
                            <div
                              className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 rounded-xl mb-4"
                              style={{
                                background: C.goldDim,
                                border: `1px solid ${C.border}`,
                              }}
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p
                                    className="font-bold text-base"
                                    style={{ color: C.gold }}
                                  >
                                    {billing.plan.name}
                                  </p>
                                  <span
                                    className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                                    style={{
                                      background: C.gold,
                                      color: "#1a1d24",
                                    }}
                                  >
                                    ACTIVE
                                  </span>
                                </div>
                                <p
                                  className="text-sm"
                                  style={{ color: C.muted }}
                                >
                                  {billing.plan.description}
                                </p>
                                {billing.renewDate && (
                                  <p
                                    className="text-xs mt-2"
                                    style={{ color: C.muted }}
                                  >
                                    Renews{" "}
                                    {new Date(
                                      billing.renewDate,
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </p>
                                )}
                              </div>
                              <p
                                className="text-xl font-bold"
                                style={{ color: C.text }}
                              >
                                ₹{billing.plan.price?.toLocaleString("en-IN")}
                                <span
                                  className="text-sm font-normal"
                                  style={{ color: C.muted }}
                                >
                                  /mo
                                </span>
                              </p>
                            </div>
                          ) : (
                            <div
                              className="p-4 rounded-xl mb-4 text-center"
                              style={{
                                background: C.inputBg,
                                border: `1px solid ${C.inputBorder}`,
                              }}
                            >
                              <p className="text-sm" style={{ color: C.muted }}>
                                No active plan. Choose a plan to get started.
                              </p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => setShowUpgradeModal(true)}
                              className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer transition-all"
                              style={{ background: C.gold, color: "#1a1d24" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.filter =
                                  "brightness(1.08)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.filter = "")
                              }
                            >
                              {billing.plan ? "Change Plan" : "Choose Plan"}
                            </button>
                            <GhostBtn
                              onClick={() => setShowInvoicesModal(true)}
                            >
                              View Invoices
                            </GhostBtn>
                          </div>
                        </Card>

                        {/* Payment methods */}
                        <Card>
                          <h2
                            className="text-base font-semibold mb-5"
                            style={{ color: C.text }}
                          >
                            Payment Methods
                          </h2>
                          {billing.paymentMethods.length === 0 ? (
                            <div
                              className="py-6 text-center rounded-xl mb-4"
                              style={{
                                background: C.inputBg,
                                border: `1px solid ${C.inputBorder}`,
                              }}
                            >
                              <CreditCard
                                size={26}
                                className="mx-auto mb-2"
                                style={{ color: C.muted }}
                              />
                              <p className="text-sm" style={{ color: C.muted }}>
                                No payment methods added yet
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 mb-4">
                              {billing.paymentMethods.map((m) => (
                                <div
                                  key={m.id}
                                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl"
                                  style={{
                                    background: C.inputBg,
                                    border: `1px solid ${C.inputBorder}`,
                                  }}
                                >
                                  <div
                                    className="w-12 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{
                                      background:
                                        m.brand === "visa"
                                          ? "#1a56db"
                                          : m.brand === "mastercard"
                                            ? "#eb001b"
                                            : "#2d3139",
                                      color: "#fff",
                                    }}
                                  >
                                    {(m.brand || "CARD")
                                      .toUpperCase()
                                      .slice(0, 4)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium"
                                      style={{ color: C.text }}
                                    >
                                      •••• {m.last4}
                                    </p>
                                    <p
                                      className="text-xs"
                                      style={{ color: C.muted }}
                                    >
                                      Expires {m.expiry}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {m.isDefault ? (
                                      <span
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{
                                          background: "rgba(74,222,128,0.1)",
                                          color: C.green,
                                        }}
                                      >
                                        Default
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => handleSetDefault(m.id)}
                                        className="text-xs outline-none border-0 bg-transparent cursor-pointer"
                                        style={{ color: C.gold }}
                                      >
                                        Set default
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleRemovePayment(m.id)}
                                      className="outline-none border-0 bg-transparent cursor-pointer"
                                      style={{ color: C.red }}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => setShowAddPaymentModal(true)}
                            className="flex items-center gap-1.5 text-sm font-medium outline-none border-0 bg-transparent cursor-pointer"
                            style={{ color: C.gold }}
                          >
                            <Plus size={14} /> Add payment method
                          </button>
                        </Card>

                        {/* Billing history */}
                        <Card>
                          <div className="flex items-center justify-between mb-5">
                            <h2
                              className="text-base font-semibold"
                              style={{ color: C.text }}
                            >
                              Billing History
                            </h2>
                            <button
                              onClick={handleExportInvoices}
                              className="flex items-center gap-1.5 text-sm outline-none border-0 bg-transparent cursor-pointer"
                              style={{ color: C.gold }}
                            >
                              <Download size={13} /> Export CSV
                            </button>
                          </div>
                          {billing.invoices.length === 0 ? (
                            <div
                              className="py-10 text-center rounded-xl"
                              style={{
                                background: C.inputBg,
                                border: `1px solid ${C.inputBorder}`,
                              }}
                            >
                              <Download
                                size={26}
                                className="mx-auto mb-2"
                                style={{ color: C.muted }}
                              />
                              <p className="text-sm" style={{ color: C.muted }}>
                                No billing history yet
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto -mx-1 px-1">
                              <table className="w-full text-sm min-w-[380px]">
                                <thead>
                                  <tr
                                    style={{
                                      borderBottom: `1px solid ${C.borderSub}`,
                                    }}
                                  >
                                    {[
                                      "Date",
                                      "Description",
                                      "Amount",
                                      "Status",
                                    ].map((h) => (
                                      <th
                                        key={h}
                                        className="text-left pb-3 pr-4 font-medium"
                                        style={{ color: C.muted }}
                                      >
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {billing.invoices.map((row, i) => (
                                    <tr
                                      key={row.id || i}
                                      style={{
                                        borderBottom:
                                          i < billing.invoices.length - 1
                                            ? `1px solid ${C.borderSub}`
                                            : "none",
                                      }}
                                    >
                                      <td
                                        className="py-3 pr-4 whitespace-nowrap"
                                        style={{ color: C.muted }}
                                      >
                                        {new Date(row.date).toLocaleDateString(
                                          "en-IN",
                                          {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          },
                                        )}
                                      </td>
                                      <td
                                        className="py-3 pr-4"
                                        style={{ color: C.text }}
                                      >
                                        {row.description}
                                      </td>
                                      <td
                                        className="py-3 pr-4 whitespace-nowrap"
                                        style={{ color: C.text }}
                                      >
                                        ₹
                                        {Number(row.amount).toLocaleString(
                                          "en-IN",
                                        )}
                                      </td>
                                      <td className="py-3">
                                        <span
                                          className="text-xs px-2 py-0.5 rounded-full"
                                          style={{
                                            background:
                                              row.status === "Paid"
                                                ? "rgba(74,222,128,0.1)"
                                                : row.status === "Pending"
                                                  ? "rgba(251,191,36,0.1)"
                                                  : "rgba(248,113,113,0.1)",
                                            color:
                                              row.status === "Paid"
                                                ? C.green
                                                : row.status === "Pending"
                                                  ? "#fbbf24"
                                                  : C.red,
                                          }}
                                        >
                                          {row.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </Card>
                      </>
                    )}
                  </motion.div>
                )}

                {/* ════════ PRIVACY ════════ */}
                {activeTab === "privacy" && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: C.goldDim }}
                        >
                          <Globe size={17} style={{ color: C.gold }} />
                        </div>
                        <h2
                          className="text-base font-semibold"
                          style={{ color: C.text }}
                        >
                          Profile Visibility
                        </h2>
                      </div>
                      <Toggle
                        checked={privacy.profilePublic}
                        onChange={(v) => ppv("profilePublic", v)}
                        label="Public Profile"
                        description="Artists can discover and view your company profile"
                      />
                      <Toggle
                        checked={privacy.showBudgetRange}
                        onChange={(v) => ppv("showBudgetRange", v)}
                        label="Show Budget Range"
                        description="Display your typical project budget to artists"
                      />
                      <Toggle
                        checked={privacy.showHiringHistory}
                        onChange={(v) => ppv("showHiringHistory", v)}
                        label="Show Hiring History"
                        description="Display how many artists you've worked with"
                      />
                      <Toggle
                        checked={privacy.allowArtistContact}
                        onChange={(v) => ppv("allowArtistContact", v)}
                        label="Allow Artist Contact"
                        description="Artists can send you connection requests"
                      />
                      <Toggle
                        checked={privacy.showOnlineStatus}
                        onChange={(v) => ppv("showOnlineStatus", v)}
                        label="Show Online Status"
                        description="Let artists know when you're active on the platform"
                      />
                      <Toggle
                        checked={privacy.dataAnalytics}
                        onChange={(v) => ppv("dataAnalytics", v)}
                        label="Usage Analytics"
                        description="Help improve Flip by sharing anonymous usage data"
                      />
                    </Card>

                    <Card>
                      <h2
                        className="text-base font-semibold mb-4"
                        style={{ color: C.text }}
                      >
                        Data &amp; Account
                      </h2>
                      <div className="space-y-3">
                        <button
                          onClick={handleDownloadData}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all outline-none border-0 cursor-pointer"
                          style={{
                            background: C.inputBg,
                            border: `1px solid ${C.inputBorder}`,
                            color: C.text,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor =
                              "rgba(201,169,97,0.32)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = C.inputBorder)
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Download size={14} style={{ color: C.gold }} />{" "}
                            Download My Data
                          </div>
                          <ChevronRight size={13} style={{ color: C.muted }} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="danger-btn w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer"
                          style={{
                            background: "rgba(248,113,113,0.06)",
                            border: "1px solid rgba(248,113,113,0.20)",
                            color: C.red,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Trash2 size={14} /> Delete Account
                          </div>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                      <div
                        className="mt-5 p-4 rounded-xl flex items-start gap-3"
                        style={{
                          background: "rgba(248,113,113,0.06)",
                          border: "1px solid rgba(248,113,113,0.14)",
                        }}
                      >
                        <AlertTriangle
                          size={15}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: C.red }}
                        />
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: C.muted }}
                        >
                          Deleting your account is permanent and irreversible.
                          All your projects, payment history, and hired artist
                          records will be permanently erased.
                        </p>
                      </div>
                    </Card>

                    <div className="flex justify-end">
                      <SaveBtn onClick={handleSave} loading={saving} />
                    </div>
                  </motion.div>
                )}

                {/* ── Mobile logout ── */}
                <div className="hs-logout-mobile pb-10 pt-2">
                  <button onClick={handleLogout} className="hs-logout">
                    <LogOut size={17} /> Log Out of Account
                  </button>
                </div>
              </div>
              {/* end panel */}
            </div>
            {/* end layout */}
          </div>
        </div>
      </div>

      {/* ── Upgrade Plan Modal ── */}
      <Modal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Choose a Plan"
      >
        <div className="space-y-3 mb-5">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className="plan-card w-full text-left p-4 rounded-xl outline-none border-0 cursor-pointer"
              style={{
                background: selectedPlan === plan.id ? C.goldDim : C.inputBg,
                border: `1px solid ${selectedPlan === plan.id ? C.gold : C.inputBorder}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: C.text }}
                    >
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{ background: C.gold, color: "#1a1d24" }}
                      >
                        POPULAR
                      </span>
                    )}
                    {billing.plan?.id === plan.id && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "rgba(74,222,128,0.2)",
                          color: C.green,
                        }}
                      >
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>
                    {plan.desc}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="font-bold"
                    style={{
                      color: selectedPlan === plan.id ? C.gold : C.text,
                    }}
                  >
                    ₹{plan.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs" style={{ color: C.muted }}>
                    /mo
                  </p>
                </div>
              </div>
              {selectedPlan === plan.id && (
                <div
                  className="mt-2 flex items-center gap-1.5"
                  style={{ color: C.gold }}
                >
                  <Check size={13} />
                  <span className="text-xs font-medium">Selected</span>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-3 justify-end">
          <GhostBtn onClick={() => setShowUpgradeModal(false)}>Cancel</GhostBtn>
          <button
            onClick={handleUpgradePlan}
            disabled={!selectedPlan || planLoading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold outline-none border-0 cursor-pointer transition-all"
            style={{
              background: C.gold,
              color: "#1a1d24",
              opacity: !selectedPlan || planLoading ? 0.6 : 1,
            }}
          >
            {planLoading && <Loader2 size={13} className="animate-spin" />}
            {planLoading ? "Upgrading…" : "Confirm Plan"}
          </button>
        </div>
      </Modal>

      {/* ── Add Payment Modal ── */}
      <Modal
        open={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        title="Add Payment Method"
      >
        <div className="space-y-4 mb-5">
          <div>
            <SLabel>Cardholder Name</SLabel>
            <SInput
              value={newCard.name}
              onChange={(e) => pc("name", e.target.value)}
              placeholder="Name on card"
            />
          </div>
          <div>
            <SLabel>Card Number</SLabel>{" "}
            <SInput
              value={newCard.number}
              onChange={(e) => pc("number", fmtCard(e.target.value))}
              placeholder="0000 0000 0000 0000"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <SLabel>Expiry</SLabel>
              <SInput
                value={newCard.expiry}
                onChange={(e) => pc("expiry", fmtExpiry(e.target.value))}
                placeholder="MM/YY"
              />
            </div>
            <div>
              <SLabel>CVV</SLabel>{" "}
              <SInput
                value={newCard.cvv}
                onChange={(e) =>
                  pc("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="•••"
                type="password"
              />
            </div>
          </div>
          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: C.muted }}
          >
            <Shield size={11} style={{ color: C.green }} /> Your card details
            are encrypted and secure
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <GhostBtn onClick={() => setShowAddPaymentModal(false)}>
            Cancel
          </GhostBtn>
          <button
            onClick={handleAddPayment}
            disabled={addingCard}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold outline-none border-0 cursor-pointer"
            style={{
              background: C.gold,
              color: "#1a1d24",
              opacity: addingCard ? 0.7 : 1,
            }}
          >
            {addingCard && <Loader2 size={13} className="animate-spin" />}
            {addingCard ? "Adding…" : "Add Card"}
          </button>
        </div>
      </Modal>

      {/* ── Invoices Modal ── */}
      <Modal
        open={showInvoicesModal}
        onClose={() => setShowInvoicesModal(false)}
        title="All Invoices"
      >
        <div className="max-h-72 overflow-y-auto -mx-1 px-1">
          {billing.invoices.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: C.muted }}>
                No invoices available
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {billing.invoices.map((inv, i) => (
                <div
                  key={inv.id || i}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: C.inputBg,
                    border: `1px solid ${C.inputBorder}`,
                  }}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: C.text }}
                    >
                      {inv.description}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                      {new Date(inv.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: C.text }}
                    >
                      ₹{Number(inv.amount).toLocaleString("en-IN")}
                    </p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          inv.status === "Paid"
                            ? "rgba(74,222,128,0.1)"
                            : "rgba(251,191,36,0.1)",
                        color: inv.status === "Paid" ? C.green : "#fbbf24",
                      }}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-5">
          <button
            onClick={handleExportInvoices}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer"
            style={{ background: C.gold, color: "#1a1d24" }}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </Modal>

      {/* ── Delete Account Modal ── */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText("");
        }}
        title="Delete Account"
      >
        <div className="mb-5">
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-4"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            <AlertTriangle
              size={17}
              className="flex-shrink-0"
              style={{ color: C.red }}
            />
            <p className="text-sm" style={{ color: C.text }}>
              This action is <strong>permanent and irreversible.</strong> All
              your data will be deleted.
            </p>
          </div>
          <SLabel>
            Type <span style={{ color: C.red, fontWeight: 600 }}>DELETE</span>{" "}
            to confirm
          </SLabel>
          <SInput
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <GhostBtn
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmText("");
            }}
          >
            Cancel
          </GhostBtn>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== "DELETE"}
            className="px-5 py-2 rounded-lg text-sm font-semibold outline-none border-0 cursor-pointer transition-all"
            style={{
              background: "rgba(248,113,113,0.8)",
              color: "#fff",
              opacity: deleteConfirmText !== "DELETE" ? 0.4 : 1,
            }}
          >
            Delete Account
          </button>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </>
  );
}
