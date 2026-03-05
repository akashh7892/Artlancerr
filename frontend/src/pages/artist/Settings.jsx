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
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import {
  artistAPI,
  authAPI,
  getUser,
  setUser,
  uploadFile,
} from "../../services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
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

const RECENT_TRANSACTIONS = [
  {
    project: "Midnight Echo",
    type: "Instagram Story",
    amount: "+$25",
    date: "Feb 15, 2026",
    status: "Paid",
  },
  {
    project: "Dance Revolution",
    type: "Instagram Reel",
    amount: "+$75",
    date: "Feb 10, 2026",
    status: "Paid",
  },
  {
    project: "The Last Horizon",
    type: "Instagram Post",
    amount: "+$50",
    date: "Feb 05, 2026",
    status: "Pending",
  },
];

const ACTIVE_SESSIONS = [
  {
    device: "MacBook Pro",
    location: "Los Angeles, CA",
    time: "Current session",
    active: true,
  },
  {
    device: "iPhone 15",
    location: "Los Angeles, CA",
    time: "2 hours ago",
    active: false,
  },
  {
    device: "Chrome on Windows",
    location: "New York, NY",
    time: "3 days ago",
    active: false,
  },
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none flex-shrink-0"
      style={{
        width: 44,
        height: 24,
        background: enabled ? COLORS.gold : COLORS.border,
      }}
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

function FieldInput({
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
        <label className="block text-sm mb-1.5" style={{ color: COLORS.light }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: COLORS.muted }}
          >
            <Icon size={16} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2.5 rounded-lg text-sm outline-none transition-all"
          style={{
            paddingLeft: Icon ? 36 : 14,
            paddingRight: 14,
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.light,
            caretColor: COLORS.gold,
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.gold)}
          onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
        />
      </div>
    </div>
  );
}

function SectionCard({ title, description, icon: Icon, children }) {
  return (
    <div
      className="rounded-xl p-6"
      style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="p-2 rounded-lg"
          style={{ background: `${COLORS.gold}18` }}
        >
          <Icon size={18} style={{ color: COLORS.gold }} />
        </div>
        <div>
          <h3
            className="font-semibold text-base"
            style={{ color: COLORS.light }}
          >
            {title}
          </h3>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Toast({ message, visible }) {
  return (
    <div
      className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium z-50 transition-all duration-300"
      style={{
        background: COLORS.gold,
        color: "#1a1d24",
        transform: visible ? "translateY(0)" : "translateY(100px)",
        opacity: visible ? 1 : 0,
        boxShadow: "0 4px 24px rgba(201,169,97,0.3)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Check size={16} />
      {message}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ArtistSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ visible: false, message: "" });

  const [profile, setProfile] = useState({
    name: "Alex Rivera",
    username: "alexrivera",
    email: "alex@example.com",
    phone: "+1 (555) 012-3456",
    location: "Los Angeles, CA",
    bio: "Professional filmmaker and visual storyteller. Specializing in narrative short films and music videos.",
    website: "https://alexrivera.com",
    instagram: "@alexrivera",
    twitter: "@alexrivera",
    youtube: "AlexRiveraFilms",
    avatar: null,
    artCategory: "Film Director",
    experience: "5+ years",
  });

  const [notifications, setNotifications] = useState({
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

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [payment, setPayment] = useState({
    method: "paypal",
    paypalEmail: "alex@example.com",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    upiId: "",
    minimumPayout: "50",
    payoutSchedule: "Weekly (every Friday)",
  });

  useEffect(() => {
    const localUser = getUser();
    if (localUser) {
      setProfile((prev) => ({
        ...prev,
        name: localUser.name || prev.name,
        email: localUser.email || prev.email,
      }));
    }

    (async () => {
      try {
        const data = await artistAPI.getProfile();
        setProfile((prev) => ({
          ...prev,
          name: data.name || prev.name,
          username: data.username || prev.username,
          email: data.email || prev.email,
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          website: data.website || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          youtube: data.youtube || "",
          avatar: data.avatar || null,
          artCategory: data.artCategory || prev.artCategory,
          experience: data.experience || prev.experience,
        }));
        if (data.notifications) {
          setNotifications((prev) => ({ ...prev, ...data.notifications }));
        }
      } catch (error) {
        console.error("Failed to load artist profile", error);
      }
    })();
  }, []);

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  };

  const handleUpdateProfile = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const handleToggleNotif = (k) =>
    setNotifications((p) => ({ ...p, [k]: !p[k] }));
  const handleUpdatePassword = (k, v) =>
    setPasswords((p) => ({ ...p, [k]: v }));
  const handleToggleShowPw = (k) =>
    setShowPasswords((p) => ({ ...p, [k]: !p[k] }));
  const handleUpdatePayment = (k, v) => setPayment((p) => ({ ...p, [k]: v }));

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) {
      showToast("Please select an image file");
      return;
    }

    try {
      const uploaded = await uploadFile(file, {
        bucket: "profile-images",
        type: "profile",
        fieldName: "file",
      });
      const updated = await artistAPI.updateProfile({ avatar: uploaded.url });
      setProfile((prev) => ({ ...prev, avatar: updated.avatar || uploaded.url }));

      const localUser = getUser();
      if (localUser) {
        setUser({ ...localUser, avatar: updated.avatar || uploaded.url });
      }

      showToast("Profile photo updated");
    } catch (error) {
      showToast(error.message || "Failed to upload profile photo");
    }
  };

  const handlePasswordSave = () => {
    (async () => {
      try {
        await authAPI.changePassword(passwords.current, passwords.newPass);
        showToast("Password updated successfully");
        setPasswords({ current: "", newPass: "", confirm: "" });
      } catch (error) {
        showToast(error.message || "Could not update password");
      }
    })();
  };

  const handleSaveChanges = async () => {
    try {
      if (activeTab === "profile") {
        const updated = await artistAPI.updateProfile({
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
        const localUser = getUser();
        if (localUser) {
          setUser({
            ...localUser,
            name: updated?.name || profile.name,
            email: updated?.email || localUser.email,
          });
        }
      } else if (activeTab === "notifications") {
        await artistAPI.updateProfile({ notifications });
      }
      showToast("Settings saved successfully");
    } catch (error) {
      showToast(error.message || "Failed to save settings");
    }
  };

  const isPasswordSaveDisabled =
    !passwords.current ||
    !passwords.newPass ||
    passwords.newPass !== passwords.confirm;

  const passwordStrength = (() => {
    const len = passwords.newPass.length;
    if (len === 0) return { bars: 0, label: "", color: COLORS.border };
    if (len < 6) return { bars: 1, label: "Too short", color: "#f87171" };
    if (len < 9) return { bars: 2, label: "Fair", color: COLORS.gold };
    if (len < 12) return { bars: 3, label: "Good", color: COLORS.gold };
    return { bars: 4, label: "Strong", color: "#4ade80" };
  })();

  const selectStyle = {
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.light,
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
              className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              style={{ color: COLORS.light }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1
                className="text-3xl font-semibold"
                style={{ color: COLORS.light }}
              >
                Settings
              </h1>
              <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                Manage your account preferences
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Settings Sidebar Nav */}
            <div className="w-52 flex-shrink-0">
              <nav
                className="rounded-xl p-2 sticky top-8"
                style={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                {TABS.map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-1 last:mb-0"
                      style={{
                        background: isActive
                          ? `${COLORS.gold}18`
                          : "transparent",
                        color: isActive ? COLORS.gold : COLORS.muted,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* ════ PROFILE ════ */}
              {activeTab === "profile" && (
                <>
                  {/* Avatar card */}
                  <div
                    className="rounded-xl p-6"
                    style={{
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                          style={{
                            background: `${COLORS.gold}25`,
                            color: COLORS.gold,
                            border: `2px solid ${COLORS.gold}40`,
                          }}
                        >
                          {profile.avatar ? (
                            <img
                              src={profile.avatar}
                              alt="Avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                          style={{ background: COLORS.gold }}
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
                          className="font-semibold text-base"
                          style={{ color: COLORS.light }}
                        >
                          {profile.name}
                        </h3>
                        <p className="text-sm" style={{ color: COLORS.muted }}>
                          @{profile.username} · {profile.artCategory}
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 text-xs px-3 py-1 rounded-lg hover:opacity-80 transition-all"
                          style={{
                            background: `${COLORS.gold}18`,
                            color: COLORS.gold,
                            border: `1px solid ${COLORS.gold}33`,
                          }}
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <SectionCard
                    title="Personal Information"
                    description="Update your basic profile details"
                    icon={User}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FieldInput
                        label="Full Name"
                        value={profile.name}
                        onChange={(v) => handleUpdateProfile("name", v)}
                        placeholder="Your full name"
                      />
                      <FieldInput
                        label="Username"
                        value={profile.username}
                        onChange={(v) => handleUpdateProfile("username", v)}
                        placeholder="username"
                      />
                      <FieldInput
                        label="Email Address"
                        value={profile.email}
                        onChange={(v) => handleUpdateProfile("email", v)}
                        type="email"
                        icon={Mail}
                      />
                      <FieldInput
                        label="Phone Number"
                        value={profile.phone}
                        onChange={(v) => handleUpdateProfile("phone", v)}
                        icon={Phone}
                      />
                      <FieldInput
                        label="Location"
                        value={profile.location}
                        onChange={(v) => handleUpdateProfile("location", v)}
                        icon={MapPin}
                      />
                      <FieldInput
                        label="Website"
                        value={profile.website}
                        onChange={(v) => handleUpdateProfile("website", v)}
                        icon={Globe}
                      />
                    </div>
                    <div className="mt-4">
                      <label
                        className="block text-sm mb-1.5"
                        style={{ color: COLORS.light }}
                      >
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) =>
                          handleUpdateProfile("bio", e.target.value)
                        }
                        rows={3}
                        maxLength={300}
                        placeholder="Tell others about yourself..."
                        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
                        style={{
                          background: COLORS.bg,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.light,
                          caretColor: COLORS.gold,
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = COLORS.gold)
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = COLORS.border)
                        }
                      />
                      <p
                        className="text-xs mt-1 text-right"
                        style={{ color: COLORS.muted }}
                      >
                        {profile.bio.length}/300
                      </p>
                    </div>
                  </SectionCard>

                  {/* Artist Details */}
                  <SectionCard
                    title="Artist Details"
                    description="Your professional information"
                    icon={Globe}
                  >
                    <div className="grid grid-cols-2 gap-4">
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
                            style={{ color: COLORS.light }}
                          >
                            {label}
                          </label>
                          <select
                            value={profile[key]}
                            onChange={(e) =>
                              handleUpdateProfile(key, e.target.value)
                            }
                            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none appearance-none"
                            style={selectStyle}
                          >
                            {options.map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  {/* Social Links */}
                  <SectionCard
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
                              style={{ color: COLORS.light }}
                            >
                              {label}
                            </label>
                            <div className="relative">
                              <span
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: COLORS.muted }}
                              >
                                <Icon size={16} />
                              </span>
                              {prefix && (
                                <span
                                  className="absolute top-1/2 -translate-y-1/2 text-sm"
                                  style={{ left: 36, color: COLORS.muted }}
                                >
                                  {prefix}
                                </span>
                              )}
                              <input
                                value={profile[key] || ""}
                                onChange={(e) =>
                                  handleUpdateProfile(key, e.target.value)
                                }
                                placeholder={`Your ${label.toLowerCase()}`}
                                className="w-full py-2.5 rounded-lg text-sm outline-none transition-all"
                                style={{
                                  paddingLeft: prefix ? 48 : 36,
                                  paddingRight: 14,
                                  background: COLORS.bg,
                                  border: `1px solid ${COLORS.border}`,
                                  color: COLORS.light,
                                  caretColor: COLORS.gold,
                                }}
                                onFocus={(e) =>
                                  (e.target.style.borderColor = COLORS.gold)
                                }
                                onBlur={(e) =>
                                  (e.target.style.borderColor = COLORS.border)
                                }
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </SectionCard>
                </>
              )}

              {/* ════ NOTIFICATIONS ════ */}
              {activeTab === "notifications" &&
                NOTIFICATION_SECTIONS.map((section) => (
                  <SectionCard
                    key={section.title}
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                  >
                    <div className="space-y-4">
                      {section.items.map(({ key, label, desc }) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-4"
                        >
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: COLORS.light }}
                            >
                              {label}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: COLORS.muted }}
                            >
                              {desc}
                            </p>
                          </div>
                          <Toggle
                            enabled={notifications[key]}
                            onChange={() => handleToggleNotif(key)}
                          />
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                ))}

              {/* ════ SECURITY ════ */}
              {activeTab === "security" && (
                <>
                  <SectionCard
                    title="Change Password"
                    description="Update your account password"
                    icon={Lock}
                  >
                    <div className="space-y-4">
                      {PASSWORD_FIELDS.map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label
                            className="block text-sm mb-1.5"
                            style={{ color: COLORS.light }}
                          >
                            {label}
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords[key] ? "text" : "password"}
                              value={passwords[key]}
                              onChange={(e) =>
                                handleUpdatePassword(key, e.target.value)
                              }
                              placeholder={placeholder}
                              className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
                              style={{
                                background: COLORS.bg,
                                border: `1px solid ${COLORS.border}`,
                                color: COLORS.light,
                                caretColor: COLORS.gold,
                              }}
                              onFocus={(e) =>
                                (e.target.style.borderColor = COLORS.gold)
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = COLORS.border)
                              }
                            />
                            <button
                              onClick={() => handleToggleShowPw(key)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              style={{ color: COLORS.muted }}
                            >
                              {showPasswords[key] ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}

                      {passwords.newPass && (
                        <div>
                          <p
                            className="text-xs mb-1.5"
                            style={{ color: COLORS.muted }}
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
                                    i <= passwordStrength.bars
                                      ? passwordStrength.color
                                      : COLORS.border,
                                }}
                              />
                            ))}
                          </div>
                          <p
                            className="text-xs mt-1"
                            style={{ color: passwordStrength.color }}
                          >
                            {passwordStrength.label}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handlePasswordSave}
                        disabled={isPasswordSaveDisabled}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: COLORS.gold, color: "#1a1d24" }}
                      >
                        Update Password
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security"
                    icon={Shield}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: COLORS.light }}
                        >
                          Authenticator App (2FA)
                        </p>
                        <p className="text-xs" style={{ color: COLORS.muted }}>
                          Use Google Authenticator or Authy to generate
                          time-based one-time passwords.
                        </p>
                      </div>
                      <Toggle enabled={twoFA} onChange={setTwoFA} />
                    </div>
                    {twoFA && (
                      <div
                        className="rounded-lg p-4 mb-4"
                        style={{
                          background: `${COLORS.gold}10`,
                          border: `1px solid ${COLORS.gold}30`,
                        }}
                      >
                        <p className="text-xs" style={{ color: COLORS.muted }}>
                          2FA is enabled. Your account is now protected with an
                          additional verification step.
                        </p>
                      </div>
                    )}
                    <div
                      className="flex items-start justify-between gap-4 pt-4"
                      style={{ borderTop: `1px solid ${COLORS.border}` }}
                    >
                      <div>
                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: COLORS.light }}
                        >
                          Login Alerts
                        </p>
                        <p className="text-xs" style={{ color: COLORS.muted }}>
                          Receive alerts when someone logs in from a new device
                        </p>
                      </div>
                      <Toggle enabled={loginAlerts} onChange={setLoginAlerts} />
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Active Sessions"
                    description="Manage devices logged into your account"
                    icon={Shield}
                  >
                    <div className="space-y-3">
                      {ACTIVE_SESSIONS.map((session, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ background: COLORS.bg }}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p
                                className="text-sm font-medium"
                                style={{ color: COLORS.light }}
                              >
                                {session.device}
                              </p>
                              {session.active && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    background: "rgba(74,222,128,0.15)",
                                    color: "#4ade80",
                                  }}
                                >
                                  Active
                                </span>
                              )}
                            </div>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: COLORS.muted }}
                            >
                              {session.location} · {session.time}
                            </p>
                          </div>
                          {!session.active && (
                            <button
                              className="text-xs px-3 py-1 rounded-lg transition-all hover:bg-red-500/20"
                              style={{ color: "#f87171" }}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <div
                    className="rounded-xl p-6"
                    style={{
                      background: COLORS.card,
                      border: "1px solid rgba(248,113,113,0.3)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="p-2 rounded-lg"
                        style={{ background: "rgba(248,113,113,0.1)" }}
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
                          style={{ color: COLORS.muted }}
                        >
                          Irreversible account actions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: COLORS.light }}
                        >
                          Delete Account
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: COLORS.muted }}
                        >
                          Permanently delete your account and all associated
                          data
                        </p>
                      </div>
                      <button
                        className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
                        style={{
                          border: "1px solid rgba(248,113,113,0.5)",
                          color: "#f87171",
                        }}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ════ PAYMENTS ════ */}
              {activeTab === "payments" && (
                <>
                  <SectionCard
                    title="Payout Method"
                    description="Choose how you want to receive your earnings"
                    icon={CreditCard}
                  >
                    <div className="flex gap-3 mb-5">
                      {PAYOUT_METHODS.map(({ id, label }) => {
                        const isSelected = payment.method === id;
                        return (
                          <button
                            key={id}
                            onClick={() => handleUpdatePayment("method", id)}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                            style={{
                              background: isSelected
                                ? `${COLORS.gold}20`
                                : COLORS.bg,
                              border: `1px solid ${isSelected ? COLORS.gold : COLORS.border}`,
                              color: isSelected ? COLORS.gold : COLORS.muted,
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {payment.method === "paypal" && (
                      <FieldInput
                        label="PayPal Email"
                        value={payment.paypalEmail}
                        onChange={(v) => handleUpdatePayment("paypalEmail", v)}
                        icon={Mail}
                        type="email"
                        placeholder="your@paypal.com"
                      />
                    )}
                    {payment.method === "bank" && (
                      <div className="space-y-4">
                        <FieldInput
                          label="Bank Name"
                          value={payment.bankName}
                          onChange={(v) => handleUpdatePayment("bankName", v)}
                          placeholder="e.g. Chase"
                        />
                        <FieldInput
                          label="Account Number"
                          value={payment.accountNumber}
                          onChange={(v) =>
                            handleUpdatePayment("accountNumber", v)
                          }
                          placeholder="Account number"
                        />
                        <FieldInput
                          label="Routing Number"
                          value={payment.routingNumber}
                          onChange={(v) =>
                            handleUpdatePayment("routingNumber", v)
                          }
                          placeholder="9-digit routing number"
                        />
                      </div>
                    )}
                    {payment.method === "upi" && (
                      <FieldInput
                        label="UPI ID"
                        value={payment.upiId}
                        onChange={(v) => handleUpdatePayment("upiId", v)}
                        placeholder="yourname@bank"
                      />
                    )}
                  </SectionCard>

                  <SectionCard
                    title="Payout Preferences"
                    description="Configure when and how much you get paid"
                    icon={CreditCard}
                  >
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm mb-1.5"
                          style={{ color: COLORS.light }}
                        >
                          Minimum Payout Amount
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
                            min="10"
                            value={payment.minimumPayout}
                            onChange={(e) =>
                              handleUpdatePayment(
                                "minimumPayout",
                                e.target.value,
                              )
                            }
                            className="w-full pl-7 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                            style={{
                              background: COLORS.bg,
                              border: `1px solid ${COLORS.border}`,
                              color: COLORS.light,
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = COLORS.gold)
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = COLORS.border)
                            }
                          />
                        </div>
                        <p
                          className="text-xs mt-1"
                          style={{ color: COLORS.muted }}
                        >
                          Minimum $10. Payouts process when your balance reaches
                          this amount.
                        </p>
                      </div>
                      <div>
                        <label
                          className="block text-sm mb-1.5"
                          style={{ color: COLORS.light }}
                        >
                          Payout Schedule
                        </label>
                        <select
                          value={payment.payoutSchedule}
                          onChange={(e) =>
                            handleUpdatePayment(
                              "payoutSchedule",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none appearance-none"
                          style={selectStyle}
                        >
                          {PAYOUT_SCHEDULES.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </SectionCard>

                  <div
                    className="rounded-xl p-6"
                    style={{
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <h3
                      className="font-semibold text-base mb-4"
                      style={{ color: COLORS.light }}
                    >
                      Earnings Overview
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          label: "Total Earned",
                          value: "$1,240",
                          sub: "All time",
                        },
                        {
                          label: "Pending",
                          value: "$125",
                          sub: "Awaiting approval",
                        },
                        {
                          label: "This Month",
                          value: "$350",
                          sub: "February 2026",
                        },
                      ].map(({ label, value, sub }) => (
                        <div
                          key={label}
                          className="rounded-lg p-4"
                          style={{ background: COLORS.bg }}
                        >
                          <p
                            className="text-xs mb-1"
                            style={{ color: COLORS.muted }}
                          >
                            {label}
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{ color: COLORS.gold }}
                          >
                            {value}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: COLORS.muted }}
                          >
                            {sub}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <SectionCard
                    title="Recent Transactions"
                    description="Your recent payout history"
                    icon={CreditCard}
                  >
                    <div className="space-y-3">
                      {RECENT_TRANSACTIONS.map((tx, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ background: COLORS.bg }}
                        >
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: COLORS.light }}
                            >
                              {tx.project}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: COLORS.muted }}
                            >
                              {tx.type} · {tx.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-sm font-bold"
                              style={{ color: COLORS.gold }}
                            >
                              {tx.amount}
                            </p>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background:
                                  tx.status === "Paid"
                                    ? "rgba(74,222,128,0.15)"
                                    : "rgba(250,204,21,0.15)",
                                color:
                                  tx.status === "Paid" ? "#4ade80" : "#facc15",
                              }}
                            >
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </>
              )}

              {/* Save Button */}
              {activeTab !== "security" && (
                <div className="flex justify-end pt-2 pb-8">
                  <button
                    onClick={handleSaveChanges}
                    className="px-8 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: COLORS.gold, color: "#1a1d24" }}
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
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
