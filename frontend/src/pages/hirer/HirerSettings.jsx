import { useEffect, useState } from "react";
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
  Menu,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { getUser, hirerAPI, setUser } from "../../services/api";

const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  cardInner: "#1a1d24",
  border: "rgba(201, 169, 97, 0.2)",
  borderSubtle: "rgba(201, 169, 97, 0.1)",
  gold: "#c9a961",
  goldDim: "rgba(201, 169, 97, 0.1)",
  text: "#ffffff",
  muted: "#9ca3af",
  inputBorder: "rgba(255,255,255,0.08)",
  inputBg: "#1a1d24",
  green: "#4ade80",
  red: "#f87171",
  blue: "#60a5fa",
};

// ─── Primitives ───────────────────────────────────────────────
const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`rounded-xl p-6 ${className}`}
    style={{
      backgroundColor: C.card,
      border: `1px solid ${C.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold mb-5" style={{ color: C.text }}>
    {children}
  </h2>
);

const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium mb-1.5"
    style={{ color: C.muted }}
  >
    {children}
  </label>
);

const Input = ({
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
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={(e) => {
        if (!disabled) e.target.style.borderColor = "rgba(201,169,97,0.4)";
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
    style={{ borderBottom: `1px solid ${C.borderSubtle}` }}
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
      style={{ background: checked ? C.gold : "rgba(255,255,255,0.1)" }}
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
    className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 outline-none border-0 cursor-pointer"
    style={{
      background: `linear-gradient(135deg, ${C.gold}, #d4b56e)`,
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

// ─── Modal ────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl p-6"
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
              <X size={18} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Toast ────────────────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl"
        style={{
          background:
            type === "success"
              ? "rgba(74,222,128,0.12)"
              : "rgba(248,113,113,0.12)",
          border: `1px solid ${type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
          backdropFilter: "blur(12px)",
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

const NAV = [
  { key: "profile", icon: User, label: "Profile" },
  { key: "notifications", icon: Bell, label: "Notifications" },
  { key: "security", icon: Shield, label: "Security" },
  { key: "billing", icon: CreditCard, label: "Billing" },
  { key: "privacy", icon: Globe, label: "Privacy" },
];

// ─── Plans ───────────────────────────────────────────────────
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

export default function HirerSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingsNavOpen, setSettingsNavOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // ── Billing modals ──
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  // ── New payment card form ──
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [addingCard, setAddingCard] = useState(false);

  // ── Delete confirmation ──
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // ── Billing state ──
  const [billing, setBilling] = useState({
    plan: null, // loaded from API
    renewDate: null,
    paymentMethods: [], // loaded from API
    invoices: [], // loaded from API
  });
  const [billingLoading, setBillingLoading] = useState(false);

  // ── Profile state ──
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
    timezone: "",
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

  // ── Sessions (real or empty) ──
  const [sessions, setSessions] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  useEffect(() => {
    const localUser = getUser();
    if (localUser) {
      const parts = (localUser.name || "").split(" ");
      setProfile((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: localUser.email || "",
      }));
    }

    (async () => {
      try {
        const data = await hirerAPI.getProfile();
        const parts = (data.name || "").split(" ");
        setProfile((prev) => ({
          ...prev,
          firstName: parts[0] || prev.firstName,
          lastName: parts.slice(1).join(" ") || prev.lastName,
          email: data.email || prev.email,
          phone: data.phone || "",
          company: data.companyName || "",
          website: data.companyWebsite || "",
          bio: data.bio || "",
          location: data.location || "",
        }));
        if (data.notifications) {
          setNotif({
            newApplications: data.notifications.emailApplications || false,
            projectUpdates: data.notifications.pushApplications || false,
            paymentAlerts: data.notifications.emailPayments || false,
            weeklyDigest: data.notifications.weeklyDigest || false,
            artistMessages: data.notifications.emailMessages || false,
            marketingEmails: data.notifications.marketingEmails || false,
            pushEnabled: data.notifications.pushMessages || false,
            smsAlerts: data.notifications.smsAlerts || false,
          });
        }
        if (data.privacy) setPrivacy(data.privacy);
        if (data.security) {
          setSecurity((prev) => ({
            ...prev,
            twoFactor: data.security.twoFactor || false,
            loginAlerts: data.security.loginAlerts || false,
            sessionTimeout: data.security.sessionTimeout || "30",
          }));
        }
        if (data.sessions) setSessions(data.sessions);
      } catch (err) {
        console.error("Failed to load hirer profile", err);
      }
    })();
  }, []);

  // ── Load billing when tab opens ──
  useEffect(() => {
    if (activeTab !== "billing") return;
    setBillingLoading(true);
    (async () => {
      try {
        const [planData, paymentData, invoiceData] = await Promise.all([
          hirerAPI.getBillingPlan?.() || Promise.resolve(null),
          hirerAPI.getPaymentMethods?.() || Promise.resolve([]),
          hirerAPI.getInvoices?.() || Promise.resolve([]),
        ]);
        setBilling({
          plan: planData,
          renewDate: planData?.renewDate || null,
          paymentMethods: Array.isArray(paymentData) ? paymentData : [],
          invoices: Array.isArray(invoiceData) ? invoiceData : [],
        });
      } catch (err) {
        console.error("Failed to load billing data", err);
        showToast("Failed to load billing information", "error");
      } finally {
        setBillingLoading(false);
      }
    })();
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "profile") {
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        const updated = await hirerAPI.updateProfile({
          name: fullName,
          companyName: profile.company,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          companyWebsite: profile.website,
        });
        const localUser = getUser();
        if (localUser)
          setUser({
            ...localUser,
            name: updated?.name || fullName,
            email: updated?.email || localUser.email,
          });
      }
      if (activeTab === "notifications") {
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
      }
      if (activeTab === "privacy") {
        await hirerAPI.updateProfile({ privacy });
      }
      setSaved(true);
      showToast("Changes saved successfully");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save settings failed", err);
      showToast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Upgrade plan ──
  const handleUpgradePlan = async () => {
    if (!selectedPlan) return;
    setPlanLoading(true);
    try {
      await hirerAPI.upgradePlan?.({ planId: selectedPlan });
      const planInfo = PLANS.find((p) => p.id === selectedPlan);
      setBilling((prev) => ({
        ...prev,
        plan: {
          ...prev.plan,
          id: selectedPlan,
          name: planInfo?.name,
          price: planInfo?.price,
        },
      }));
      setShowUpgradeModal(false);
      showToast(`Upgraded to ${planInfo?.name} successfully`);
    } catch (err) {
      console.error("Plan upgrade failed", err);
      showToast("Failed to upgrade plan. Please try again.", "error");
    } finally {
      setPlanLoading(false);
    }
  };

  // ── Add payment method ──
  const handleAddPayment = async () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.name) {
      showToast("Please fill in all card details", "error");
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
      setBilling((prev) => ({
        ...prev,
        paymentMethods: [
          ...prev.paymentMethods,
          added || {
            id: Date.now(),
            last4: newCard.number.slice(-4),
            brand: "Card",
            expiry: newCard.expiry,
            isDefault: prev.paymentMethods.length === 0,
          },
        ],
      }));
      setNewCard({ number: "", expiry: "", cvv: "", name: "" });
      setShowAddPaymentModal(false);
      showToast("Payment method added successfully");
    } catch (err) {
      console.error("Add payment failed", err);
      showToast("Failed to add payment method", "error");
    } finally {
      setAddingCard(false);
    }
  };

  // ── Remove payment method ──
  const handleRemovePayment = async (methodId) => {
    try {
      await hirerAPI.removePaymentMethod?.({ methodId });
      setBilling((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter((m) => m.id !== methodId),
      }));
      showToast("Payment method removed");
    } catch (err) {
      showToast("Failed to remove payment method", "error");
    }
  };

  // ── Set default payment ──
  const handleSetDefault = async (methodId) => {
    try {
      await hirerAPI.setDefaultPaymentMethod?.({ methodId });
      setBilling((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map((m) => ({
          ...m,
          isDefault: m.id === methodId,
        })),
      }));
      showToast("Default payment method updated");
    } catch (err) {
      showToast("Failed to update default payment method", "error");
    }
  };

  // ── Export invoices ──
  const handleExportInvoices = () => {
    if (billing.invoices.length === 0) {
      showToast("No invoices to export", "error");
      return;
    }
    const csv = [
      "Date,Description,Amount,Status",
      ...billing.invoices.map(
        (inv) =>
          `${inv.date},"${inv.description}",₹${inv.amount},${inv.status}`,
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Invoices exported as CSV");
  };

  // ── Download my data ──
  const handleDownloadData = async () => {
    try {
      const data = await hirerAPI.exportUserData?.();
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `my_data_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
      showToast("Your data download has started");
    } catch (err) {
      showToast("Failed to download data. Please try again.", "error");
    }
  };

  // ── Delete account ──
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showToast("Please type DELETE to confirm", "error");
      return;
    }
    try {
      await hirerAPI.deleteAccount?.();
      showToast("Account deleted. Redirecting…");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      showToast("Failed to delete account. Contact support.", "error");
    }
  };

  // ── Revoke session ──
  const handleRevokeSession = async (sessionId) => {
    try {
      await hirerAPI.revokeSession?.({ sessionId });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      showToast("Session revoked");
    } catch (err) {
      showToast("Failed to revoke session", "error");
    }
  };

  // ── Update password ──
  const handleUpdatePassword = async () => {
    if (!security.currentPassword || !security.newPassword) {
      showToast("Please fill in all password fields", "error");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (security.newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
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
      showToast("Password updated successfully");
    } catch (err) {
      showToast(
        "Failed to update password. Check your current password.",
        "error",
      );
    }
  };

  const patchProfile = (key, val) => setProfile((p) => ({ ...p, [key]: val }));
  const patchNotif = (key, val) => setNotif((n) => ({ ...n, [key]: val }));
  const patchSec = (key, val) => setSecurity((s) => ({ ...s, [key]: val }));
  const patchPrivacy = (key, val) => setPrivacy((p) => ({ ...p, [key]: val }));
  const patchCard = (key, val) => setNewCard((c) => ({ ...c, [key]: val }));

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSettingsNavOpen(false);
  };
  const activeNav = NAV.find((n) => n.key === activeTab);

  const formatCardNumber = (val) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .settings-panel { animation: fadeUp 0.3s ease both; }
        .nav-item { transition: background 0.15s, color 0.15s, border-color 0.15s; }
        .danger-btn { transition: background 0.15s, border-color 0.15s; }
        .danger-btn:hover { background: rgba(248,113,113,0.08) !important; border-color: rgba(248,113,113,0.4) !important; }
        .plan-card:hover { border-color: rgba(201,169,97,0.4) !important; transform: translateY(-2px); }
        .plan-card { transition: border-color 0.2s, transform 0.2s; }
      `}</style>

      <HirerSidebar />

      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8 mt-10 lg:mt-0"
            >
              <h1
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ color: C.text }}
              >
                Settings
              </h1>
              <p style={{ color: C.muted }}>
                Manage your account preferences and configurations
              </p>
            </motion.div>

            <div className="flex gap-6 flex-col lg:flex-row">
              {/* Desktop nav */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="hidden lg:block lg:w-56 flex-shrink-0"
              >
                <Card className="p-2" style={{ padding: "8px" }}>
                  {NAV.map(({ key, icon: Icon, label }) => {
                    const active = activeTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleTabChange(key)}
                        className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left outline-none border-0 cursor-pointer mb-0.5"
                        style={{
                          background: active ? C.goldDim : "transparent",
                          color: active ? C.gold : C.muted,
                          borderLeft: active
                            ? `2px solid ${C.gold}`
                            : "2px solid transparent",
                        }}
                      >
                        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                        {label}
                        {active && (
                          <ChevronRight size={14} className="ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </Card>
              </motion.div>

              {/* Mobile nav */}
              <div className="lg:hidden">
                <button
                  onClick={() => setSettingsNavOpen(!settingsNavOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium outline-none border-0 cursor-pointer"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {activeNav && (
                      <activeNav.icon size={16} style={{ color: C.gold }} />
                    )}
                    <span>{activeNav?.label}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    style={{ color: C.muted }}
                  >
                    <span className="text-xs">All sections</span>
                    {settingsNavOpen ? <X size={16} /> : <Menu size={16} />}
                  </div>
                </button>
                <AnimatePresence>
                  {settingsNavOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-1 rounded-xl"
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div className="p-2">
                        {NAV.map(({ key, icon: Icon, label }) => {
                          const active = activeTab === key;
                          return (
                            <button
                              key={key}
                              onClick={() => handleTabChange(key)}
                              className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left outline-none border-0 cursor-pointer mb-0.5"
                              style={{
                                background: active ? C.goldDim : "transparent",
                                color: active ? C.gold : C.muted,
                                borderLeft: active
                                  ? `2px solid ${C.gold}`
                                  : "2px solid transparent",
                              }}
                            >
                              <Icon
                                size={16}
                                strokeWidth={active ? 2.2 : 1.8}
                              />
                              {label}
                              {active && (
                                <ChevronRight size={14} className="ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Panel content */}
              <div className="flex-1 min-w-0">
                {/* ══ PROFILE ══════════════════════════════════════ */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 settings-panel"
                  >
                    <Card>
                      <SectionTitle>Profile Information</SectionTitle>
                      <div
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-6 pb-6"
                        style={{ borderBottom: `1px solid ${C.borderSubtle}` }}
                      >
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                            style={{
                              background: `linear-gradient(135deg, ${C.gold}, #b8913a)`,
                              color: "#1a1d24",
                            }}
                          >
                            {profile.firstName?.[0]?.toUpperCase() || "?"}
                            {profile.lastName?.[0]?.toUpperCase() || ""}
                          </div>
                          <button
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-0 outline-none cursor-pointer"
                            style={{ background: C.gold, color: "#1a1d24" }}
                          >
                            <Camera size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                        <div>
                          <p
                            className="font-semibold text-base"
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
                            className="text-xs mt-1.5 outline-none border-0 bg-transparent cursor-pointer"
                            style={{ color: C.gold }}
                          >
                            Change photo
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) =>
                              patchProfile("firstName", e.target.value)
                            }
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) =>
                              patchProfile("lastName", e.target.value)
                            }
                            placeholder="Last name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              patchProfile("email", e.target.value)
                            }
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) =>
                              patchProfile("phone", e.target.value)
                            }
                            placeholder="+91 00000 00000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={profile.company}
                            onChange={(e) =>
                              patchProfile("company", e.target.value)
                            }
                            placeholder="Your company name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Job Title</Label>
                          <Input
                            id="role"
                            value={profile.role}
                            onChange={(e) =>
                              patchProfile("role", e.target.value)
                            }
                            placeholder="e.g. Producer, Director"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) =>
                              patchProfile("location", e.target.value)
                            }
                            placeholder="City, State"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) =>
                              patchProfile("website", e.target.value)
                            }
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) =>
                              patchProfile("bio", e.target.value)
                            }
                            rows={4}
                            className="w-full rounded-lg text-[13.5px] outline-none resize-none transition-all"
                            style={{
                              background: C.inputBg,
                              border: `1px solid ${C.inputBorder}`,
                              color: C.text,
                              padding: "10px 14px",
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                            placeholder="Tell artists about yourself and your work…"
                            onFocus={(e) => {
                              e.target.style.borderColor =
                                "rgba(201,169,97,0.4)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = C.inputBorder;
                            }}
                          />
                          <p
                            className="text-xs mt-1"
                            style={{ color: C.muted }}
                          >
                            {(profile.bio || "").length}/500 characters
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
                          <Check size={15} /> Changes saved successfully
                        </span>
                      )}
                      <div className="ml-auto">
                        <SaveBtn onClick={handleSave} loading={saving} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ══ NOTIFICATIONS ════════════════════════════════ */}
                {activeTab === "notifications" && (
                  <motion.div
                    key="notif"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 settings-panel"
                  >
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: C.goldDim }}
                        >
                          <Mail size={18} style={{ color: C.gold }} />
                        </div>
                        <SectionTitle style={{ margin: 0 }}>
                          Email Notifications
                        </SectionTitle>
                      </div>
                      <Toggle
                        checked={notif.newApplications}
                        onChange={(v) => patchNotif("newApplications", v)}
                        label="New Applications"
                        description="Get notified when artists apply to your postings"
                      />
                      <Toggle
                        checked={notif.projectUpdates}
                        onChange={(v) => patchNotif("projectUpdates", v)}
                        label="Project Updates"
                        description="Milestone completions and status changes"
                      />
                      <Toggle
                        checked={notif.paymentAlerts}
                        onChange={(v) => patchNotif("paymentAlerts", v)}
                        label="Payment Alerts"
                        description="Escrow releases, invoices, and payment confirmations"
                      />
                      <Toggle
                        checked={notif.artistMessages}
                        onChange={(v) => patchNotif("artistMessages", v)}
                        label="Artist Messages"
                        description="New messages from hired artists"
                      />
                      <Toggle
                        checked={notif.weeklyDigest}
                        onChange={(v) => patchNotif("weeklyDigest", v)}
                        label="Weekly Digest"
                        description="A weekly summary of your activity and top talent"
                      />
                      <Toggle
                        checked={notif.marketingEmails}
                        onChange={(v) => patchNotif("marketingEmails", v)}
                        label="Product & Marketing"
                        description="News, features, and tips from Artlancing"
                      />
                    </Card>
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: "rgba(96,165,250,0.1)" }}
                        >
                          <Smartphone size={18} style={{ color: C.blue }} />
                        </div>
                        <SectionTitle style={{ margin: 0 }}>
                          Push & SMS
                        </SectionTitle>
                      </div>
                      <Toggle
                        checked={notif.pushEnabled}
                        onChange={(v) => patchNotif("pushEnabled", v)}
                        label="Push Notifications"
                        description="Enable browser or app push alerts"
                      />
                      <Toggle
                        checked={notif.smsAlerts}
                        onChange={(v) => patchNotif("smsAlerts", v)}
                        label="SMS Alerts"
                        description="Critical alerts sent to your phone number"
                      />
                    </Card>
                    <div className="flex justify-end">
                      <SaveBtn onClick={handleSave} loading={saving} />
                    </div>
                  </motion.div>
                )}

                {/* ══ SECURITY ══════════════════════════════════════ */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 settings-panel"
                  >
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: C.goldDim }}
                        >
                          <Lock size={18} style={{ color: C.gold }} />
                        </div>
                        <SectionTitle style={{ margin: 0 }}>
                          Change Password
                        </SectionTitle>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="curPwd">Current Password</Label>
                          <Input
                            id="curPwd"
                            type={security.showCurrent ? "text" : "password"}
                            value={security.currentPassword}
                            onChange={(e) =>
                              patchSec("currentPassword", e.target.value)
                            }
                            placeholder="Enter current password"
                            rightEl={
                              <button
                                className="border-0 bg-transparent outline-none cursor-pointer"
                                style={{ color: C.muted }}
                                onClick={() =>
                                  patchSec("showCurrent", !security.showCurrent)
                                }
                              >
                                {security.showCurrent ? (
                                  <EyeOff size={15} />
                                ) : (
                                  <Eye size={15} />
                                )}
                              </button>
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPwd">New Password</Label>
                          <Input
                            id="newPwd"
                            type={security.showNew ? "text" : "password"}
                            value={security.newPassword}
                            onChange={(e) =>
                              patchSec("newPassword", e.target.value)
                            }
                            placeholder="Minimum 8 characters"
                            rightEl={
                              <button
                                className="border-0 bg-transparent outline-none cursor-pointer"
                                style={{ color: C.muted }}
                                onClick={() =>
                                  patchSec("showNew", !security.showNew)
                                }
                              >
                                {security.showNew ? (
                                  <EyeOff size={15} />
                                ) : (
                                  <Eye size={15} />
                                )}
                              </button>
                            }
                          />
                          {security.newPassword.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4].map((n) => (
                                  <div
                                    key={n}
                                    className="h-1 flex-1 rounded-full transition-all duration-300"
                                    style={{
                                      background:
                                        security.newPassword.length >= n * 2
                                          ? n <= 1
                                            ? C.red
                                            : n <= 2
                                              ? "#fb923c"
                                              : n <= 3
                                                ? "#facc15"
                                                : C.green
                                          : "rgba(255,255,255,0.1)",
                                    }}
                                  />
                                ))}
                              </div>
                              <p className="text-xs" style={{ color: C.muted }}>
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
                        </div>
                        <div>
                          <Label htmlFor="confPwd">Confirm New Password</Label>
                          <Input
                            id="confPwd"
                            type={security.showConfirm ? "text" : "password"}
                            value={security.confirmPassword}
                            onChange={(e) =>
                              patchSec("confirmPassword", e.target.value)
                            }
                            placeholder="Re-enter new password"
                            rightEl={
                              <button
                                className="border-0 bg-transparent outline-none cursor-pointer"
                                style={{ color: C.muted }}
                                onClick={() =>
                                  patchSec("showConfirm", !security.showConfirm)
                                }
                              >
                                {security.showConfirm ? (
                                  <EyeOff size={15} />
                                ) : (
                                  <Eye size={15} />
                                )}
                              </button>
                            }
                          />
                          {security.confirmPassword &&
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
                        <button
                          onClick={handleUpdatePassword}
                          className="px-5 py-2.5 rounded-lg text-sm font-semibold outline-none border-0 cursor-pointer transition-all"
                          style={{ background: C.gold, color: "#1a1d24" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.filter = "brightness(1.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = "";
                          }}
                        >
                          Update Password
                        </button>
                      </div>
                    </Card>

                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: "rgba(74,222,128,0.1)" }}
                        >
                          <Shield size={18} style={{ color: C.green }} />
                        </div>
                        <SectionTitle style={{ margin: 0 }}>
                          Account Security
                        </SectionTitle>
                      </div>
                      <Toggle
                        checked={security.twoFactor}
                        onChange={(v) => patchSec("twoFactor", v)}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security with an authenticator app"
                      />
                      <Toggle
                        checked={security.loginAlerts}
                        onChange={(v) => patchSec("loginAlerts", v)}
                        label="Login Alerts"
                        description="Get notified of new sign-ins from unrecognised devices"
                      />
                      <div className="mt-4">
                        <Label htmlFor="sessionTimeout">
                          Auto-logout After
                        </Label>
                        <div className="relative w-full sm:w-48">
                          <select
                            id="sessionTimeout"
                            value={security.sessionTimeout}
                            onChange={(e) =>
                              patchSec("sessionTimeout", e.target.value)
                            }
                            className="w-full rounded-lg text-[13.5px] outline-none appearance-none cursor-pointer"
                            style={{
                              background: C.inputBg,
                              border: `1px solid ${C.inputBorder}`,
                              color: C.text,
                              padding: "10px 36px 10px 14px",
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {[
                              ["15", "15 minutes"],
                              ["30", "30 minutes"],
                              ["60", "1 hour"],
                              ["480", "8 hours"],
                              ["0", "Never"],
                            ].map(([v, l]) => (
                              <option
                                key={v}
                                value={v}
                                style={{ background: "#2d3139" }}
                              >
                                {l}
                              </option>
                            ))}
                          </select>
                          <ChevronRight
                            size={13}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"
                            style={{ color: C.muted }}
                          />
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <SectionTitle>Active Sessions</SectionTitle>
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
                                  ? `1px solid ${C.borderSubtle}`
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
                                className="text-xs outline-none border-0 bg-transparent cursor-pointer flex-shrink-0 transition-colors"
                                style={{ color: C.red }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = "0.7";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = "1";
                                }}
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

                {/* ══ BILLING ══════════════════════════════════════ */}
                {activeTab === "billing" && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 settings-panel"
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
                        {/* Current Plan */}
                        <Card>
                          <SectionTitle>Current Plan</SectionTitle>
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
                                    Renews on{" "}
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
                              onMouseEnter={(e) => {
                                e.currentTarget.style.filter =
                                  "brightness(1.08)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.filter = "";
                              }}
                            >
                              {billing.plan ? "Change Plan" : "Choose Plan"}
                            </button>
                            <button
                              onClick={() => setShowInvoicesModal(true)}
                              className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer transition-all"
                              style={{
                                background: "transparent",
                                border: `1px solid ${C.border}`,
                                color: C.text,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                  "rgba(201,169,97,0.4)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = C.border;
                              }}
                            >
                              View Invoices
                            </button>
                          </div>
                        </Card>

                        {/* Payment Methods */}
                        <Card>
                          <SectionTitle>Payment Methods</SectionTitle>
                          {billing.paymentMethods.length === 0 ? (
                            <div
                              className="py-6 text-center rounded-xl mb-4"
                              style={{
                                background: C.inputBg,
                                border: `1px solid ${C.inputBorder}`,
                              }}
                            >
                              <CreditCard
                                size={28}
                                className="mx-auto mb-2"
                                style={{ color: C.muted }}
                              />
                              <p className="text-sm" style={{ color: C.muted }}>
                                No payment methods added yet
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 mb-4">
                              {billing.paymentMethods.map((method) => (
                                <div
                                  key={method.id}
                                  className="flex items-center gap-4 p-4 rounded-xl"
                                  style={{
                                    background: C.inputBg,
                                    border: `1px solid ${C.inputBorder}`,
                                  }}
                                >
                                  <div
                                    className="w-12 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{
                                      background:
                                        method.brand === "visa"
                                          ? "#1a56db"
                                          : method.brand === "mastercard"
                                            ? "#eb001b"
                                            : "#2d3139",
                                      color: "#fff",
                                    }}
                                  >
                                    {(method.brand || "CARD")
                                      .toUpperCase()
                                      .slice(0, 4)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium"
                                      style={{ color: C.text }}
                                    >
                                      •••• •••• •••• {method.last4}
                                    </p>
                                    <p
                                      className="text-xs"
                                      style={{ color: C.muted }}
                                    >
                                      Expires {method.expiry}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {method.isDefault ? (
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
                                        onClick={() =>
                                          handleSetDefault(method.id)
                                        }
                                        className="text-xs outline-none border-0 bg-transparent cursor-pointer"
                                        style={{ color: C.gold }}
                                      >
                                        Set default
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleRemovePayment(method.id)
                                      }
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
                            <Plus size={15} /> Add payment method
                          </button>
                        </Card>

                        {/* Billing History */}
                        <Card>
                          <div className="flex items-center justify-between mb-5">
                            <SectionTitle>Billing History</SectionTitle>
                            <button
                              onClick={handleExportInvoices}
                              className="flex items-center gap-1.5 text-sm outline-none border-0 bg-transparent cursor-pointer transition-opacity"
                              style={{ color: C.gold }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.7";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              <Download size={14} /> Export CSV
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
                                size={28}
                                className="mx-auto mb-2"
                                style={{ color: C.muted }}
                              />
                              <p className="text-sm" style={{ color: C.muted }}>
                                No billing history yet
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto -mx-2 px-2">
                              <table className="w-full text-sm min-w-[400px]">
                                <thead>
                                  <tr
                                    style={{
                                      borderBottom: `1px solid ${C.borderSubtle}`,
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
                                            ? `1px solid ${C.borderSubtle}`
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

                {/* ══ PRIVACY ══════════════════════════════════════ */}
                {activeTab === "privacy" && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 settings-panel"
                  >
                    <Card>
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: C.goldDim }}
                        >
                          <Globe size={18} style={{ color: C.gold }} />
                        </div>
                        <SectionTitle style={{ margin: 0 }}>
                          Profile Visibility
                        </SectionTitle>
                      </div>
                      <Toggle
                        checked={privacy.profilePublic}
                        onChange={(v) => patchPrivacy("profilePublic", v)}
                        label="Public Profile"
                        description="Artists can discover and view your company profile"
                      />
                      <Toggle
                        checked={privacy.showBudgetRange}
                        onChange={(v) => patchPrivacy("showBudgetRange", v)}
                        label="Show Budget Range"
                        description="Display your typical project budget to artists"
                      />
                      <Toggle
                        checked={privacy.showHiringHistory}
                        onChange={(v) => patchPrivacy("showHiringHistory", v)}
                        label="Show Hiring History"
                        description="Display how many artists you've worked with"
                      />
                      <Toggle
                        checked={privacy.allowArtistContact}
                        onChange={(v) => patchPrivacy("allowArtistContact", v)}
                        label="Allow Artist Contact"
                        description="Artists can send you connection requests"
                      />
                      <Toggle
                        checked={privacy.showOnlineStatus}
                        onChange={(v) => patchPrivacy("showOnlineStatus", v)}
                        label="Show Online Status"
                        description="Let artists know when you're active on the platform"
                      />
                      <Toggle
                        checked={privacy.dataAnalytics}
                        onChange={(v) => patchPrivacy("dataAnalytics", v)}
                        label="Usage Analytics"
                        description="Help improve Artlancing by sharing anonymous usage data"
                      />
                    </Card>

                    <Card>
                      <SectionTitle>Data & Account</SectionTitle>
                      <div className="space-y-3">
                        <button
                          onClick={handleDownloadData}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all outline-none border-0 cursor-pointer"
                          style={{
                            background: C.inputBg,
                            border: `1px solid ${C.inputBorder}`,
                            color: C.text,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(201,169,97,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = C.inputBorder;
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Download size={15} style={{ color: C.gold }} />{" "}
                            Download My Data
                          </div>
                          <ChevronRight size={14} style={{ color: C.muted }} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="danger-btn w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all outline-none border-0 cursor-pointer"
                          style={{
                            background: "rgba(248,113,113,0.06)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: C.red,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Trash2 size={15} /> Delete Account
                          </div>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                      <div
                        className="mt-5 p-4 rounded-xl flex items-start gap-3"
                        style={{
                          background: "rgba(248,113,113,0.06)",
                          border: "1px solid rgba(248,113,113,0.15)",
                        }}
                      >
                        <AlertTriangle
                          size={16}
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
              </div>
            </div>
          </div>
        </main>
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
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer"
            style={{
              background: C.inputBg,
              border: `1px solid ${C.inputBorder}`,
              color: C.muted,
            }}
          >
            Cancel
          </button>
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
            {planLoading && <Loader2 size={14} className="animate-spin" />}
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
            <Label>Cardholder Name</Label>
            <Input
              value={newCard.name}
              onChange={(e) => patchCard("name", e.target.value)}
              placeholder="Name on card"
            />
          </div>
          <div>
            <Label>Card Number</Label>
            <Input
              value={newCard.number}
              onChange={(e) =>
                patchCard("number", formatCardNumber(e.target.value))
              }
              placeholder="0000 0000 0000 0000"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Expiry Date</Label>
              <Input
                value={newCard.expiry}
                onChange={(e) =>
                  patchCard("expiry", formatExpiry(e.target.value))
                }
                placeholder="MM/YY"
              />
            </div>
            <div>
              <Label>CVV</Label>
              <Input
                value={newCard.cvv}
                onChange={(e) =>
                  patchCard(
                    "cvv",
                    e.target.value.replace(/\D/g, "").slice(0, 4),
                  )
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
            <Shield size={12} style={{ color: C.green }} /> Your card details
            are encrypted and secure
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowAddPaymentModal(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer"
            style={{
              background: C.inputBg,
              border: `1px solid ${C.inputBorder}`,
              color: C.muted,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAddPayment}
            disabled={addingCard}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold outline-none border-0 cursor-pointer transition-all"
            style={{
              background: C.gold,
              color: "#1a1d24",
              opacity: addingCard ? 0.7 : 1,
            }}
          >
            {addingCard && <Loader2 size={14} className="animate-spin" />}
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
        <div className="max-h-80 overflow-y-auto -mx-1 px-1">
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
            <Download size={14} /> Export CSV
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
              size={18}
              className="flex-shrink-0"
              style={{ color: C.red }}
            />
            <p className="text-sm" style={{ color: C.text }}>
              This action is <strong>permanent and irreversible.</strong> All
              your data will be deleted.
            </p>
          </div>
          <Label>
            Type <span style={{ color: C.red, fontWeight: 600 }}>DELETE</span>{" "}
            to confirm
          </Label>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmText("");
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer"
            style={{
              background: C.inputBg,
              border: `1px solid ${C.inputBorder}`,
              color: C.muted,
            }}
          >
            Cancel
          </button>
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

      {/* ── Toast ── */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </div>
  );
}
