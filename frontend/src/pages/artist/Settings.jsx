import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  CreditCard,
  Eye,
  EyeOff,
  Camera,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  Trash,
  Check,
  MapPin,
  Mail,
  Phone,
  Shield,
  LogOut,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import {
  artistAPI,
  authAPI,
  getUser,
  setUser,
  uploadFile,
} from "../../services/api";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#20242d",
  border: "#2e3340",
  gold: "#c9a961",
  light: "#e8e9eb",
  muted: "#8ba3af",
};

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "payments", label: "Payments", icon: CreditCard },
];

const NOTIFICATION_SECTIONS = [
  {
    title: "Email Notifications",
    icon: Mail,
    description: "Choose what emails you receive",
    items: [
      {
        key: "emailPromos",
        label: "Promotion opportunities",
        desc: "Get notified when new promotions match your profile",
      },
      {
        key: "emailMessages",
        label: "New messages",
        desc: "Email alerts for direct messages",
      },
      {
        key: "emailPayments",
        label: "Payment updates",
        desc: "Receipts, approvals, and payment processing",
      },
      {
        key: "emailOpportunities",
        label: "Casting opportunities",
        desc: "Audition and casting call notifications",
      },
      {
        key: "weeklyDigest",
        label: "Weekly digest",
        desc: "Summary of your activity and new opportunities",
      },
      {
        key: "marketingEmails",
        label: "Marketing & tips",
        desc: "Product updates and platform tips",
      },
    ],
  },
  {
    title: "Push Notifications",
    icon: Bell,
    description: "In-app and mobile push alerts",
    items: [
      {
        key: "pushPromos",
        label: "Promotion alerts",
        desc: "Instant alerts for new promotions",
      },
      {
        key: "pushMessages",
        label: "Messages",
        desc: "Push alerts for new messages",
      },
      {
        key: "pushPayments",
        label: "Payment updates",
        desc: "Instant payment status notifications",
      },
      {
        key: "pushOpportunities",
        label: "New opportunities",
        desc: "Casting and collaboration alerts",
      },
    ],
  },
  {
    title: "SMS Notifications",
    icon: Phone,
    description: "Text message alerts for critical updates",
    items: [
      {
        key: "smsPayments",
        label: "Payment notifications",
        desc: "SMS when payment is processed or approved",
      },
      {
        key: "smsMessages",
        label: "Important messages",
        desc: "SMS for high-priority messages",
      },
    ],
  },
];

const SOCIAL_LINKS = [
  { key: "instagram", label: "Instagram", icon: Instagram, prefix: "@" },
  { key: "twitter", label: "Twitter / X", icon: Twitter, prefix: "@" },
  { key: "youtube", label: "YouTube Channel", icon: Youtube, prefix: "" },
  { key: "website", label: "Personal Website", icon: Globe, prefix: "" },
];

const ART_CATEGORIES = [
  "Film Director",
  "Actor / Actress",
  "Cinematographer",
  "Screenwriter",
  "Composer",
  "Editor",
  "Producer",
  "Animator",
];
const EXPERIENCE_LEVELS = [
  "0-1 year",
  "1-3 years",
  "3-5 years",
  "5+ years",
  "10+ years",
];
const PAYOUT_SCHEDULES = [
  "Weekly (every Friday)",
  "Bi-weekly",
  "Monthly (1st of month)",
  "On demand",
];
const PAYOUT_METHODS = [
  { id: "paypal", label: "PayPal" },
  { id: "bank", label: "Bank Transfer" },
  { id: "upi", label: "UPI" },
];
const PASSWORD_FIELDS = [
  {
    key: "current",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  { key: "newPass", label: "New Password", placeholder: "Enter new password" },
  {
    key: "confirm",
    label: "Confirm New Password",
    placeholder: "Confirm new password",
  },
];

// ─── Small components ─────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative inline-flex items-center rounded-full focus:outline-none flex-shrink-0 transition-all duration-300"
      style={{ width: 44, height: 24, background: enabled ? C.gold : C.border }}
    >
      <span
        className="inline-block rounded-full transition-transform duration-300"
        style={{
          width: 18,
          height: 18,
          background: "#fff",
          transform: enabled ? "translateX(22px)" : "translateX(3px)",
        }}
      />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm mb-1.5" style={{ color: C.light }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: C.muted }}
          >
            <Icon size={16} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-[11px] rounded-lg text-sm outline-none transition-all"
          style={{
            paddingLeft: Icon ? 36 : 14,
            paddingRight: 14,
            background: C.bg,
            border: `1px solid ${C.border}`,
            color: C.light,
            caretColor: C.gold,
          }}
          onFocus={(e) => (e.target.style.borderColor = C.gold)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
      </div>
    </div>
  );
}

function Card({ title, description, icon: Icon, children }) {
  return (
    <div
      className="rounded-xl p-4 sm:p-6"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="p-2 rounded-lg flex-shrink-0"
          style={{ background: `${C.gold}18` }}
        >
          <Icon size={18} style={{ color: C.gold }} />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-base" style={{ color: C.light }}>
            {title}
          </h3>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function SaveToast({ message, visible }) {
  return (
    <div
      className="fixed z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
      style={{
        bottom: 20,
        left: 16,
        right: 16,
        background: C.gold,
        color: "#1a1d24",
        transform: visible ? "translateY(0)" : "translateY(140px)",
        opacity: visible ? 1 : 0,
        boxShadow: "0 6px 28px rgba(201,169,97,0.35)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Check size={16} className="flex-shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ArtistSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    instagram: "",
    twitter: "",
    youtube: "",
    avatar: null,
    artCategory: "Film Director",
    experience: "0-1 year",
  });
  const setP = (k, v) => setProfile((p) => ({ ...p, [k]: v }));

  const [notifs, setNotifs] = useState({
    emailPromos: true,
    emailMessages: true,
    emailPayments: true,
    emailOpportunities: false,
    pushPromos: true,
    pushMessages: true,
    pushPayments: true,
    pushOpportunities: true,
    smsPayments: false,
    smsMessages: false,
    weeklyDigest: true,
    marketingEmails: false,
  });

  const [pw, setPw] = useState({ current: "", newPass: "", confirm: "" });
  const [showPw, setShowPw] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [payment, setPayment] = useState({
    method: "paypal",
    paypalEmail: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    upiId: "",
    minimumPayout: "500",
    payoutSchedule: "Weekly (every Friday)",
  });
  const setPay = (k, v) => setPayment((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const lu = getUser();
    if (lu)
      setProfile((p) => ({
        ...p,
        name: lu.name || p.name,
        email: lu.email || p.email,
      }));
    (async () => {
      try {
        const d = await artistAPI.getProfile();
        setProfile((p) => ({
          ...p,
          name: d.name || p.name,
          username: d.username || p.username,
          email: d.email || p.email,
          phone: d.phone || "",
          location: d.location || "",
          bio: d.bio || "",
          website: d.website || "",
          instagram: d.instagram || "",
          twitter: d.twitter || "",
          youtube: d.youtube || "",
          avatar: d.avatar || null,
          artCategory: d.artCategory || p.artCategory,
          experience: d.experience || p.experience,
        }));
        if (d.notifications) setNotifs((p) => ({ ...p, ...d.notifications }));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const flash = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      flash("Please select an image file");
      return;
    }
    try {
      const up = await uploadFile(file, {
        bucket: "profile-images",
        type: "profile",
        fieldName: "file",
      });
      const upd = await artistAPI.updateProfile({ avatar: up.url });
      setP("avatar", upd.avatar || up.url);
      const lu = getUser();
      if (lu) setUser({ ...lu, avatar: upd.avatar || up.url });
      flash("Profile photo updated");
    } catch (e) {
      flash(e.message || "Failed to upload photo");
    }
  };

  const handleSave = async () => {
    try {
      if (activeTab === "profile") {
        const upd = await artistAPI.updateProfile({
          name: profile.name,
          username: profile.username,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          website: profile.website,
          instagram: profile.instagram,
          twitter: profile.twitter,
          youtube: profile.youtube,
          artCategory: profile.artCategory,
          experience: profile.experience,
        });
        const lu = getUser();
        if (lu)
          setUser({
            ...lu,
            name: upd?.name || profile.name,
            email: upd?.email || lu.email,
          });
      } else if (activeTab === "notifications") {
        await artistAPI.updateProfile({ notifications: notifs });
      }
      flash("Settings saved successfully");
    } catch (e) {
      flash(e.message || "Failed to save settings");
    }
  };

  const handlePasswordSave = async () => {
    try {
      await authAPI.changePassword(pw.current, pw.newPass);
      flash("Password updated successfully");
      setPw({ current: "", newPass: "", confirm: "" });
    } catch (e) {
      flash(e.message || "Could not update password");
    }
  };

  const pwDisabled = !pw.current || !pw.newPass || pw.newPass !== pw.confirm;
  const pwStrength = (() => {
    const n = pw.newPass.length;
    if (n === 0) return { bars: 0, label: "", color: C.border };
    if (n < 6) return { bars: 1, label: "Too short", color: "#f87171" };
    if (n < 9) return { bars: 2, label: "Fair", color: C.gold };
    if (n < 12) return { bars: 3, label: "Good", color: C.gold };
    return { bars: 4, label: "Strong", color: "#4ade80" };
  })();

  const selSt = {
    background: C.bg,
    border: `1px solid ${C.border}`,
    color: C.light,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .st-wrap { font-family:'Plus Jakarta Sans',sans-serif; }

        /* ───────────────────────────────────────────
           TAB BAR
           Mobile : horizontal scrollable pill strip
           Desktop: hidden (side nav takes over)
        ─────────────────────────────────────────── */
        .st-tab-strip {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 3px;
          margin-bottom: 18px;
        }
        .st-tab-strip::-webkit-scrollbar { display: none; }

        .st-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
          cursor: pointer;
          outline: none;
          border: 1px solid transparent;
          transition: background 0.13s, color 0.13s, border-color 0.13s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ───────────────────────────────────────────
           SIDE NAV — desktop only
        ─────────────────────────────────────────── */
        .st-sidenav   { display: none; }
        @media (min-width: 1024px) {
          .st-sidenav    { display: block; }
          .st-tab-strip  { display: none;  }
        }

        /* ───────────────────────────────────────────
           HEADER — top padding on mobile clears the
           floating hamburger button (≈ 56px)
        ─────────────────────────────────────────── */
        .st-hdr { padding-top: 56px; }
        @media (min-width: 1024px) { .st-hdr { padding-top: 0; } }

        /* ───────────────────────────────────────────
           LOGOUT BUTTON (mobile bottom / desktop nav)
        ─────────────────────────────────────────── */
        .st-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          padding: 12px 16px;
          border-radius: 11px;
          border: 1px solid rgba(248,113,113,0.25);
          background: rgba(248,113,113,0.07);
          color: #f87171;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.14s, border-color 0.14s;
        }
        .st-logout:hover {
          background: rgba(248,113,113,0.14);
          border-color: rgba(248,113,113,0.5);
        }

        /* Mobile logout wrapper — hidden on desktop */
        .st-logout-mobile { display: block; }
        @media (min-width: 1024px) { .st-logout-mobile { display: none; } }

        /* Select options */
        select option { background: #20242d; color: #e8e9eb; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="min-h-screen flex st-wrap" style={{ background: C.bg }}>
        <Sidebar />

        <div className="flex-1 min-w-0 lg:ml-[248px]">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* ── Header ── */}
            <div className="st-hdr flex items-center gap-3 mb-5 lg:mb-7">
              <button
                onClick={() => navigate("/artist/dashboard")}
                className="p-2 rounded-lg flex-shrink-0 transition-colors"
                style={{ color: C.light, background: "rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.09)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                }
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1
                  className="text-xl sm:text-2xl font-semibold"
                  style={{ color: C.light }}
                >
                  Settings
                </h1>
                <p
                  className="text-xs sm:text-sm mt-0.5"
                  style={{ color: C.muted }}
                >
                  Manage your account preferences
                </p>
              </div>
            </div>

            {/* ── Mobile tab strip ── */}
            <div className="st-tab-strip">
              {TABS.map(({ id, label, icon: Icon }) => {
                const a = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="st-pill"
                    style={{
                      background: a ? `${C.gold}18` : C.card,
                      borderColor: a ? C.gold : C.border,
                      color: a ? C.gold : C.muted,
                      fontWeight: a ? 600 : 400,
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── Layout ── */}
            <div className="flex gap-5 lg:gap-6 items-start">
              {/* Desktop side nav */}
              <div className="st-sidenav w-48 xl:w-52 flex-shrink-0 sticky top-8">
                <nav
                  className="rounded-xl p-2"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {TABS.map(({ id, label, icon: Icon }) => {
                    const a = activeTab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-1 last:mb-0"
                        style={{
                          background: a ? `${C.gold}18` : "transparent",
                          color: a ? C.gold : C.muted,
                          fontWeight: a ? 600 : 400,
                        }}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    );
                  })}
                  {/* Logout inside desktop nav */}
                  <div
                    style={{
                      borderTop: `1px solid ${C.border}`,
                      marginTop: 8,
                      paddingTop: 8,
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
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
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </nav>
              </div>

              {/* ── Content ── */}
              <div className="flex-1 min-w-0 space-y-4 sm:space-y-5">
                {/* ════════════ PROFILE ════════════ */}
                {activeTab === "profile" && (
                  <>
                    {/* Avatar */}
                    <div
                      className="rounded-xl p-4 sm:p-6"
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center text-xl sm:text-2xl font-bold"
                            style={{
                              background: `${C.gold}25`,
                              color: C.gold,
                              border: `2px solid ${C.gold}40`,
                            }}
                          >
                            {profile.avatar ? (
                              <img
                                src={profile.avatar}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (profile.name || "?")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            )}
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: C.gold }}
                          >
                            <Camera size={13} style={{ color: "#1a1d24" }} />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </div>
                        <div>
                          <h3
                            className="font-semibold text-sm sm:text-base"
                            style={{ color: C.light }}
                          >
                            {profile.name || "Your Name"}
                          </h3>
                          <p
                            className="text-xs sm:text-sm mt-0.5"
                            style={{ color: C.muted }}
                          >
                            @{profile.username || "username"} ·{" "}
                            {profile.artCategory}
                          </p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-2 text-xs px-3 py-1 rounded-lg transition-all hover:opacity-80"
                            style={{
                              background: `${C.gold}18`,
                              color: C.gold,
                              border: `1px solid ${C.gold}33`,
                            }}
                          >
                            Change Photo
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Personal info */}
                    <Card
                      title="Personal Information"
                      description="Update your basic profile details"
                      icon={User}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                          label="Full Name"
                          value={profile.name}
                          onChange={(v) => setP("name", v)}
                          placeholder="Your full name"
                        />
                        <Field
                          label="Username"
                          value={profile.username}
                          onChange={(v) => setP("username", v)}
                          placeholder="username"
                        />
                        <Field
                          label="Email Address"
                          value={profile.email}
                          onChange={(v) => setP("email", v)}
                          type="email"
                          icon={Mail}
                        />
                        <Field
                          label="Phone Number"
                          value={profile.phone}
                          onChange={(v) => setP("phone", v)}
                          icon={Phone}
                        />
                        <Field
                          label="Location"
                          value={profile.location}
                          onChange={(v) => setP("location", v)}
                          icon={MapPin}
                        />
                        <Field
                          label="Website"
                          value={profile.website}
                          onChange={(v) => setP("website", v)}
                          icon={Globe}
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          className="block text-sm mb-1.5"
                          style={{ color: C.light }}
                        >
                          Bio
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setP("bio", e.target.value)}
                          rows={3}
                          maxLength={300}
                          placeholder="Tell others about yourself..."
                          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
                          style={{
                            background: C.bg,
                            border: `1px solid ${C.border}`,
                            color: C.light,
                            caretColor: C.gold,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = C.gold)}
                          onBlur={(e) =>
                            (e.target.style.borderColor = C.border)
                          }
                        />
                        <p
                          className="text-xs mt-1 text-right"
                          style={{ color: C.muted }}
                        >
                          {profile.bio.length}/300
                        </p>
                      </div>
                    </Card>

                    {/* Artist details */}
                    <Card
                      title="Artist Details"
                      description="Your professional information"
                      icon={Globe}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            key: "artCategory",
                            label: "Art Category",
                            options: ART_CATEGORIES,
                          },
                          {
                            key: "experience",
                            label: "Experience Level",
                            options: EXPERIENCE_LEVELS,
                          },
                        ].map(({ key, label, options }) => (
                          <div key={key}>
                            <label
                              className="block text-sm mb-1.5"
                              style={{ color: C.light }}
                            >
                              {label}
                            </label>
                            <select
                              value={profile[key]}
                              onChange={(e) => setP(key, e.target.value)}
                              className="w-full px-4 py-[11px] rounded-lg text-sm outline-none appearance-none"
                              style={selSt}
                            >
                              {options.map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Social links */}
                    <Card
                      title="Social Media Links"
                      description="Connect your social profiles"
                      icon={Globe}
                    >
                      <div className="space-y-3">
                        {SOCIAL_LINKS.map(
                          ({ key, label, icon: Icon, prefix }) => (
                            <div key={key}>
                              <label
                                className="block text-sm mb-1.5"
                                style={{ color: C.light }}
                              >
                                {label}
                              </label>
                              <div className="relative">
                                <span
                                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                  style={{ color: C.muted }}
                                >
                                  <Icon size={16} />
                                </span>
                                {prefix && (
                                  <span
                                    className="absolute top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                                    style={{ left: 36, color: C.muted }}
                                  >
                                    {prefix}
                                  </span>
                                )}
                                <input
                                  value={profile[key] || ""}
                                  onChange={(e) => setP(key, e.target.value)}
                                  placeholder={`Your ${label.toLowerCase()}`}
                                  className="w-full py-[11px] rounded-lg text-sm outline-none transition-all"
                                  style={{
                                    paddingLeft: prefix ? 48 : 36,
                                    paddingRight: 14,
                                    background: C.bg,
                                    border: `1px solid ${C.border}`,
                                    color: C.light,
                                    caretColor: C.gold,
                                  }}
                                  onFocus={(e) =>
                                    (e.target.style.borderColor = C.gold)
                                  }
                                  onBlur={(e) =>
                                    (e.target.style.borderColor = C.border)
                                  }
                                />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </Card>
                  </>
                )}

                {/* ════════════ NOTIFICATIONS ════════════ */}
                {activeTab === "notifications" &&
                  NOTIFICATION_SECTIONS.map((sec) => (
                    <Card
                      key={sec.title}
                      title={sec.title}
                      description={sec.description}
                      icon={sec.icon}
                    >
                      <div className="space-y-4">
                        {sec.items.map(({ key, label, desc }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-sm font-medium"
                                style={{ color: C.light }}
                              >
                                {label}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: C.muted }}
                              >
                                {desc}
                              </p>
                            </div>
                            <Toggle
                              enabled={notifs[key]}
                              onChange={() =>
                                setNotifs((p) => ({ ...p, [key]: !p[key] }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}

                {/* ════════════ SECURITY ════════════ */}
                {activeTab === "security" && (
                  <>
                    <Card
                      title="Change Password"
                      description="Update your account password"
                      icon={Lock}
                    >
                      <div className="space-y-4">
                        {PASSWORD_FIELDS.map(({ key, label, placeholder }) => (
                          <div key={key}>
                            <label
                              className="block text-sm mb-1.5"
                              style={{ color: C.light }}
                            >
                              {label}
                            </label>
                            <div className="relative">
                              <input
                                type={showPw[key] ? "text" : "password"}
                                value={pw[key]}
                                onChange={(e) =>
                                  setPw((p) => ({
                                    ...p,
                                    [key]: e.target.value,
                                  }))
                                }
                                placeholder={placeholder}
                                className="w-full px-4 py-[11px] pr-11 rounded-lg text-sm outline-none transition-all"
                                style={{
                                  background: C.bg,
                                  border: `1px solid ${C.border}`,
                                  color: C.light,
                                  caretColor: C.gold,
                                }}
                                onFocus={(e) =>
                                  (e.target.style.borderColor = C.gold)
                                }
                                onBlur={(e) =>
                                  (e.target.style.borderColor = C.border)
                                }
                              />
                              <button
                                onClick={() =>
                                  setShowPw((p) => ({ ...p, [key]: !p[key] }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: C.muted }}
                              >
                                {showPw[key] ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                        {pw.newPass && (
                          <div>
                            <p
                              className="text-xs mb-1.5"
                              style={{ color: C.muted }}
                            >
                              Password strength
                            </p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className="h-1 flex-1 rounded-full transition-all"
                                  style={{
                                    background:
                                      i <= pwStrength.bars
                                        ? pwStrength.color
                                        : C.border,
                                  }}
                                />
                              ))}
                            </div>
                            <p
                              className="text-xs mt-1"
                              style={{ color: pwStrength.color }}
                            >
                              {pwStrength.label}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={handlePasswordSave}
                          disabled={pwDisabled}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ background: C.gold, color: "#1a1d24" }}
                        >
                          Update Password
                        </button>
                      </div>
                    </Card>

                    <Card
                      title="Two-Factor Authentication"
                      description="Add an extra layer of security"
                      icon={Shield}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: C.light }}
                          >
                            Authenticator App (2FA)
                          </p>
                          <p className="text-xs" style={{ color: C.muted }}>
                            Use Google Authenticator or Authy for time-based
                            one-time passwords.
                          </p>
                        </div>
                        <Toggle enabled={twoFA} onChange={setTwoFA} />
                      </div>
                      {twoFA && (
                        <div
                          className="rounded-lg p-4 mb-4"
                          style={{
                            background: `${C.gold}10`,
                            border: `1px solid ${C.gold}30`,
                          }}
                        >
                          <p className="text-xs" style={{ color: C.muted }}>
                            2FA is enabled. Your account has an additional
                            verification step.
                          </p>
                        </div>
                      )}
                      <div
                        className="flex items-start justify-between gap-4 pt-4"
                        style={{ borderTop: `1px solid ${C.border}` }}
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: C.light }}
                          >
                            Login Alerts
                          </p>
                          <p className="text-xs" style={{ color: C.muted }}>
                            Receive alerts when someone logs in from a new
                            device
                          </p>
                        </div>
                        <Toggle
                          enabled={loginAlerts}
                          onChange={setLoginAlerts}
                        />
                      </div>
                    </Card>

                    {/* Danger Zone */}
                    <div
                      className="rounded-xl p-4 sm:p-6"
                      style={{
                        background: C.card,
                        border: "1px solid rgba(248,113,113,0.28)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ background: "rgba(248,113,113,0.10)" }}
                        >
                          <Trash size={18} style={{ color: "#f87171" }} />
                        </div>
                        <div>
                          <h3
                            className="font-semibold text-base"
                            style={{ color: "#f87171" }}
                          >
                            Danger Zone
                          </h3>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: C.muted }}
                          >
                            Irreversible account actions
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium"
                            style={{ color: C.light }}
                          >
                            Delete Account
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: C.muted }}
                          >
                            Permanently delete your account and all associated
                            data
                          </p>
                        </div>
                        <button
                          className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all self-start sm:self-auto"
                          style={{
                            border: "1px solid rgba(248,113,113,0.45)",
                            color: "#f87171",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(248,113,113,0.10)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ════════════ PAYMENTS ════════════ */}
                {activeTab === "payments" && (
                  <>
                    <Card
                      title="Payout Method"
                      description="Choose how you want to receive your earnings"
                      icon={CreditCard}
                    >
                      <div className="flex gap-2 mb-5 flex-wrap">
                        {PAYOUT_METHODS.map(({ id, label }) => {
                          const sel = payment.method === id;
                          return (
                            <button
                              key={id}
                              onClick={() => setPay("method", id)}
                              className="flex-1 min-w-[76px] py-2.5 rounded-lg text-sm font-medium transition-all"
                              style={{
                                background: sel ? `${C.gold}20` : C.bg,
                                border: `1px solid ${sel ? C.gold : C.border}`,
                                color: sel ? C.gold : C.muted,
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      {payment.method === "paypal" && (
                        <Field
                          label="PayPal Email"
                          value={payment.paypalEmail}
                          onChange={(v) => setPay("paypalEmail", v)}
                          icon={Mail}
                          type="email"
                          placeholder="your@paypal.com"
                        />
                      )}
                      {payment.method === "bank" && (
                        <div className="space-y-4">
                          <Field
                            label="Bank Name"
                            value={payment.bankName}
                            onChange={(v) => setPay("bankName", v)}
                            placeholder="e.g. SBI, HDFC"
                          />
                          <Field
                            label="Account Number"
                            value={payment.accountNumber}
                            onChange={(v) => setPay("accountNumber", v)}
                            placeholder="Account number"
                          />
                          <Field
                            label="IFSC Code"
                            value={payment.routingNumber}
                            onChange={(v) => setPay("routingNumber", v)}
                            placeholder="e.g. SBIN0001234"
                          />
                        </div>
                      )}
                      {payment.method === "upi" && (
                        <Field
                          label="UPI ID"
                          value={payment.upiId}
                          onChange={(v) => setPay("upiId", v)}
                          placeholder="yourname@upi"
                        />
                      )}
                    </Card>

                    <Card
                      title="Payout Preferences"
                      description="Configure when and how much you get paid"
                      icon={CreditCard}
                    >
                      <div className="space-y-4">
                        <div>
                          <label
                            className="block text-sm mb-1.5"
                            style={{ color: C.light }}
                          >
                            Minimum Payout Amount
                          </label>
                          <div className="relative">
                            <span
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                              style={{ color: C.muted }}
                            >
                              ₹
                            </span>
                            <input
                              type="number"
                              min="100"
                              value={payment.minimumPayout}
                              onChange={(e) =>
                                setPay("minimumPayout", e.target.value)
                              }
                              className="w-full pl-7 pr-4 py-[11px] rounded-lg text-sm outline-none transition-all"
                              style={{
                                background: C.bg,
                                border: `1px solid ${C.border}`,
                                color: C.light,
                              }}
                              onFocus={(e) =>
                                (e.target.style.borderColor = C.gold)
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = C.border)
                              }
                            />
                          </div>
                          <p
                            className="text-xs mt-1"
                            style={{ color: C.muted }}
                          >
                            Minimum ₹100. Payouts process when your balance
                            reaches this amount.
                          </p>
                        </div>
                        <div>
                          <label
                            className="block text-sm mb-1.5"
                            style={{ color: C.light }}
                          >
                            Payout Schedule
                          </label>
                          <select
                            value={payment.payoutSchedule}
                            onChange={(e) =>
                              setPay("payoutSchedule", e.target.value)
                            }
                            className="w-full px-4 py-[11px] rounded-lg text-sm outline-none appearance-none"
                            style={selSt}
                          >
                            {PAYOUT_SCHEDULES.map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* Earnings overview */}
                    <div
                      className="rounded-xl p-4 sm:p-6"
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <h3
                        className="font-semibold text-base mb-4"
                        style={{ color: C.light }}
                      >
                        Earnings Overview
                      </h3>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                          {
                            label: "Total Earned",
                            value: "₹0",
                            sub: "All time",
                          },
                          {
                            label: "Pending",
                            value: "₹0",
                            sub: "Awaiting approval",
                          },
                          {
                            label: "This Month",
                            value: "₹0",
                            sub: "Current month",
                          },
                        ].map(({ label, value, sub }) => (
                          <div
                            key={label}
                            className="rounded-lg p-3"
                            style={{ background: C.bg }}
                          >
                            <p
                              className="text-xs mb-1"
                              style={{ color: C.muted }}
                            >
                              {label}
                            </p>
                            <p
                              className="text-lg sm:text-xl font-bold"
                              style={{ color: C.gold }}
                            >
                              {value}
                            </p>
                            <p
                              className="text-xs mt-1"
                              style={{ color: C.muted }}
                            >
                              {sub}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── Save button (not on security tab) ── */}
                {activeTab !== "security" && (
                  <div className="flex justify-end pt-1 pb-2">
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: C.gold, color: "#1a1d24" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(201,169,97,0.4)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "none")
                      }
                    >
                      Save Changes
                    </button>
                  </div>
                )}

                {/* ── Mobile logout button ──
                    Shown at the very bottom on mobile only.
                    On desktop, logout lives inside the side nav.
                ── */}
                <div className="st-logout-mobile pb-10 pt-1">
                  <button onClick={handleLogout} className="st-logout">
                    <LogOut size={17} />
                    Log Out of Account
                  </button>
                </div>
              </div>
              {/* end content */}
            </div>
            {/* end layout */}
          </div>
        </div>
      </div>

      <SaveToast message={toast.message} visible={toast.visible} />
    </>
  );
}
