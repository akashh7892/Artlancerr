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
} from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { getUser, hirerAPI, setUser } from "../../services/api";

// ─── Color tokens ────────────────────────
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

// ─── Reusable primitives ───────────────────────────────────────
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

// ─── Sidebar nav items ────────────────────────────────────────
const NAV = [
  { key: "profile", icon: User, label: "Profile" },
  { key: "notifications", icon: Bell, label: "Notifications" },
  { key: "security", icon: Shield, label: "Security" },
  { key: "billing", icon: CreditCard, label: "Billing" },
  { key: "privacy", icon: Globe, label: "Privacy" },
];

// ─── Main ──────────────────────────────────────────────────────
export default function HirerSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingsNavOpen, setSettingsNavOpen] = useState(false);

  // ── Profile state ──
  const [profile, setProfile] = useState({
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@studioworks.com",
    phone: "+1 (555) 012-3456",
    company: "StudioWorks Productions",
    role: "Executive Producer",
    website: "https://studioworks.com",
    bio: "Emmy-nominated producer with 12+ years in commercial and documentary production. Passionate about connecting talented artists with impactful projects.",
    location: "Los Angeles, CA",
    timezone: "America/Los_Angeles",
  });

  const [notif, setNotif] = useState({
    newApplications: true,
    projectUpdates: true,
    paymentAlerts: true,
    weeklyDigest: false,
    artistMessages: true,
    marketingEmails: false,
    pushEnabled: true,
    smsAlerts: false,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
    twoFactor: true,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showBudgetRange: false,
    showHiringHistory: true,
    allowArtistContact: true,
    dataAnalytics: true,
    showOnlineStatus: true,
  });

  useEffect(() => {
    const localUser = getUser();
    if (localUser) {
      const parts = (localUser.name || "").split(" ");
      setProfile((prev) => ({
        ...prev,
        firstName: parts[0] || prev.firstName,
        lastName: parts.slice(1).join(" ") || prev.lastName,
        email: localUser.email || prev.email,
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
      } catch (error) {
        console.error("Failed to load hirer profile", error);
      }
    })();
  }, []);

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
        if (localUser) {
          setUser({
            ...localUser,
            name: updated?.name || fullName,
            email: updated?.email || localUser.email,
          });
        }
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
          },
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Save settings failed", error);
    } finally {
      setSaving(false);
    }
  };

  const patchProfile = (key, val) => setProfile((p) => ({ ...p, [key]: val }));
  const patchNotif = (key, val) => setNotif((n) => ({ ...n, [key]: val }));
  const patchSec = (key, val) => setSecurity((s) => ({ ...s, [key]: val }));
  const patchPrivacy = (key, val) => setPrivacy((p) => ({ ...p, [key]: val }));

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSettingsNavOpen(false);
  };

  const activeNav = NAV.find((n) => n.key === activeTab);

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
      `}</style>

      {/* App-level sidebar (handles its own mobile toggle) */}
      <HirerSidebar />

      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Page header */}
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
              {/* ── Settings Nav: Desktop sidebar (lg+) ── */}
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

              {/* ── Settings Nav: Mobile/Tablet dropdown trigger ── */}
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

                {/* Mobile dropdown nav */}
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

              {/* ── Panel content ── */}
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
                            JA
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
                            {profile.firstName} {profile.lastName}
                          </p>
                          <p className="text-sm" style={{ color: C.muted }}>
                            {profile.role} at {profile.company}
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
                            {profile.bio.length}/500 characters
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
                      {[
                        {
                          device: "MacBook Pro — Chrome",
                          location: "Los Angeles, CA",
                          time: "Now",
                          current: true,
                        },
                        {
                          device: "iPhone 15 Pro — Safari",
                          location: "Los Angeles, CA",
                          time: "2 hours ago",
                          current: false,
                        },
                        {
                          device: "iPad Pro — Safari",
                          location: "New York, NY",
                          time: "Yesterday",
                          current: false,
                        },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-3"
                          style={{
                            borderBottom:
                              i < 2 ? `1px solid ${C.borderSubtle}` : "none",
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
                              {s.location} · {s.time}
                            </p>
                          </div>
                          {!s.current && (
                            <button
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
                      ))}
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
                    <Card>
                      <SectionTitle>Current Plan</SectionTitle>
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
                              Hirer Pro
                            </p>
                            <span
                              className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: C.gold, color: "#1a1d24" }}
                            >
                              ACTIVE
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: C.muted }}>
                            Unlimited job postings · Priority support · Advanced
                            analytics
                          </p>
                          <p
                            className="text-xs mt-2"
                            style={{ color: C.muted }}
                          >
                            Renews on March 18, 2026
                          </p>
                        </div>
                        <p
                          className="text-xl font-bold"
                          style={{ color: C.text }}
                        >
                          $79
                          <span
                            className="text-sm font-normal"
                            style={{ color: C.muted }}
                          >
                            /mo
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer transition-all"
                          style={{ background: C.gold, color: "#1a1d24" }}
                        >
                          Upgrade Plan
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium outline-none border-0 cursor-pointer transition-all"
                          style={{
                            background: "transparent",
                            border: `1px solid ${C.border}`,
                            color: C.text,
                          }}
                        >
                          View Invoices
                        </button>
                      </div>
                    </Card>

                    <Card>
                      <SectionTitle>Payment Method</SectionTitle>
                      <div
                        className="flex items-center gap-4 p-4 rounded-xl mb-4"
                        style={{
                          background: C.inputBg,
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        <div
                          className="w-12 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "#1a56db", color: "#fff" }}
                        >
                          VISA
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium"
                            style={{ color: C.text }}
                          >
                            •••• •••• •••• 4242
                          </p>
                          <p className="text-xs" style={{ color: C.muted }}>
                            Expires 09/27
                          </p>
                        </div>
                        <span
                          className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                          style={{
                            background: "rgba(74,222,128,0.1)",
                            color: C.green,
                          }}
                        >
                          Default
                        </span>
                      </div>
                      <button
                        className="text-sm font-medium outline-none border-0 bg-transparent cursor-pointer"
                        style={{ color: C.gold }}
                      >
                        + Add payment method
                      </button>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-5">
                        <SectionTitle>Billing History</SectionTitle>
                        <button
                          className="flex items-center gap-1.5 text-sm outline-none border-0 bg-transparent cursor-pointer"
                          style={{ color: C.gold }}
                        >
                          <Download size={14} /> Export
                        </button>
                      </div>
                      <div className="overflow-x-auto -mx-2 px-2">
                        <table className="w-full text-sm min-w-[400px]">
                          <thead>
                            <tr
                              style={{
                                borderBottom: `1px solid ${C.borderSubtle}`,
                              }}
                            >
                              {["Date", "Description", "Amount", "Status"].map(
                                (h) => (
                                  <th
                                    key={h}
                                    className="text-left pb-3 pr-4 font-medium"
                                    style={{ color: C.muted }}
                                  >
                                    {h}
                                  </th>
                                ),
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                date: "Feb 18, 2026",
                                desc: "Hirer Pro – Monthly",
                                amount: "$79.00",
                                status: "Paid",
                              },
                              {
                                date: "Jan 18, 2026",
                                desc: "Hirer Pro – Monthly",
                                amount: "$79.00",
                                status: "Paid",
                              },
                              {
                                date: "Dec 18, 2025",
                                desc: "Hirer Pro – Monthly",
                                amount: "$79.00",
                                status: "Paid",
                              },
                              {
                                date: "Nov 18, 2025",
                                desc: "Escrow Fee – Film Proj",
                                amount: "$24.50",
                                status: "Paid",
                              },
                            ].map((row, i) => (
                              <tr
                                key={i}
                                style={{
                                  borderBottom:
                                    i < 3
                                      ? `1px solid ${C.borderSubtle}`
                                      : "none",
                                }}
                              >
                                <td
                                  className="py-3 pr-4 whitespace-nowrap"
                                  style={{ color: C.muted }}
                                >
                                  {row.date}
                                </td>
                                <td
                                  className="py-3 pr-4"
                                  style={{ color: C.text }}
                                >
                                  {row.desc}
                                </td>
                                <td
                                  className="py-3 pr-4 whitespace-nowrap"
                                  style={{ color: C.text }}
                                >
                                  {row.amount}
                                </td>
                                <td className="py-3">
                                  <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={{
                                      background: "rgba(74,222,128,0.1)",
                                      color: C.green,
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
                    </Card>
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
    </div>
  );
}
