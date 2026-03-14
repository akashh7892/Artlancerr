import { useNavigate } from "react-router-dom";
import {
  Eye,
  Briefcase,
  IndianRupee,
  MessageSquare,
  ArrowRight,
  Clock,
  Star,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import { artistAPI } from "../../services/api";

// ─── Color tokens ────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#22252e",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#b3a961",
  border: "rgba(179,169,97,0.10)",
};

// ─── Profile completion: checks exactly what Profile.jsx collects ─
function calcProfileCompletion(profile = {}) {
  const checks = [
    { key: "name", label: "Full Name", tab: "Basic Info", weight: 10 },
    { key: "avatar", label: "Profile Photo", tab: "Basic Info", weight: 15 },
    { key: "bio", label: "Bio", tab: "Basic Info", weight: 10 },
    {
      key: "artCategory",
      label: "Primary Role",
      tab: "Basic Info",
      weight: 10,
    },
    { key: "experience", label: "Experience", tab: "Basic Info", weight: 5 },
    { key: "location", label: "Location", tab: "Basic Info", weight: 5 },
    { key: "rates.daily", label: "Daily Rate", tab: "Rates", weight: 15 },
    {
      key: "availability.blockedDates",
      label: "Availability",
      tab: "Availability",
      weight: 15,
    },
    { key: "equipment", label: "Equipment", tab: "Equipment", weight: 15 },
  ];
  // weights: 10+15+10+10+5+5+15+15+15 = 100 ✓

  function resolve(obj, dotKey) {
    return dotKey
      .split(".")
      .reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);
  }
  function isFilled(val) {
    if (val === undefined || val === null || val === "") return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val).length > 0;
    return true;
  }

  let earned = 0;
  const missing = [];
  checks.forEach(({ key, label, tab, weight }) => {
    if (isFilled(resolve(profile, key))) earned += weight;
    else missing.push({ label, tab, weight });
  });

  return { percent: Math.min(Math.round(earned), 100), missing };
}

// Tab accent colours matching Profile.jsx tab order
const TAB_COLORS = {
  "Basic Info": "#60a5fa",
  Rates: "#34d399",
  Availability: "#b3a961",
  Equipment: "#a78bfa",
};

// Bar + label colour by strength
function strengthTheme(pct) {
  if (pct >= 80)
    return { bar: "linear-gradient(90deg,#34d399,#6ee7b7)", label: "#34d399" };
  if (pct >= 50)
    return { bar: "linear-gradient(90deg,#b3a961,#e0d070)", label: "#b3a961" };
  return { bar: "linear-gradient(90deg,#f87171,#fca5a5)", label: "#f87171" };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let m = true;
    artistAPI
      .getDashboard()
      .then((r) => {
        if (m) setData(r);
      })
      .catch((e) => {
        if (m) setError(e.message);
      })
      .finally(() => {
        if (m) setLoading(false);
      });
    return () => {
      m = false;
    };
  }, []);

  const stats = data?.stats || {};
  const applications = data?.applications || [];
  const recentPayments = data?.recentPayments || [];

  // Use the backend-calculated profile completion percentage
  const profilePct = stats.profileCompletion ?? 0;
  const theme = strengthTheme(profilePct);

  // Calculate missing fields for display
  const profile = {
    name: data?.profile?.name || "",
    avatar: data?.profile?.avatar || "",
    bio: data?.profile?.bio || "",
    artCategory: data?.profile?.artCategory || "",
    experience: data?.profile?.experience || "",
    location: data?.profile?.location || "",
    rates: {
      daily: data?.profile?.rates?.daily || "",
    },
    availability: {
      blockedDates: data?.profile?.availability?.blockedDates || [],
    },
    equipment: data?.profile?.equipment || [],
  };

  const { missing } = calcProfileCompletion(profile);

  // Group missing fields by tab for display
  const missingByTab = missing.reduce((acc, f) => {
    if (!acc[f.tab]) acc[f.tab] = [];
    acc[f.tab].push(f);
    return acc;
  }, {});

  const formatCur = (amt, cur) =>
    cur === "INR"
      ? `₹${Number(amt).toLocaleString()}`
      : `${Number(amt).toLocaleString()}`;

  const statCards = [
    {
      label: "Profile Views",
      value: String(stats.profileViews ?? 0),
      icon: Eye,
      iconBg: "rgba(179,169,97,0.12)",
      iconColor: C.gold,
    },
    {
      label: "Active Projects",
      value: String(stats.activeProjects ?? 0),
      icon: Briefcase,
      iconBg: "rgba(96,165,250,0.12)",
      iconColor: "#60a5fa",
    },
    {
      label: "Total Earnings",
      value: formatCur(stats.totalEarnings),
      icon: IndianRupee,
      iconBg: "rgba(52,211,153,0.12)",
      iconColor: "#34d399",
    },
    {
      label: "Messages",
      value: String(stats.messages ?? 0),
      icon: MessageSquare,
      iconBg: "rgba(251,191,36,0.12)",
      iconColor: "#fbbf24",
    },
  ];

  const paymentsList = recentPayments.map((p) => ({
    title: p.projectName || p.description || "Payment",
    date: (p.paidAt
      ? new Date(p.paidAt)
      : new Date(p.createdAt)
    ).toLocaleDateString(),
    amount: formatCur(p.amount, p.currency),
    status: p.status === "completed" ? "Paid" : "Pending",
  }));

  const STATUS_STYLES = {
    shortlisted: {
      bg: "rgba(139,92,246,0.15)",
      color: "#a78bfa",
      border: "rgba(139,92,246,0.25)",
    },
    pending: {
      bg: "rgba(251,146,60,0.15)",
      color: "#fb923c",
      border: "rgba(251,146,60,0.25)",
    },
    hired: {
      bg: "rgba(52,211,153,0.15)",
      color: "#34d399",
      border: "rgba(52,211,153,0.25)",
    },
    rejected: {
      bg: "rgba(248,113,113,0.15)",
      color: "#f87171",
      border: "rgba(248,113,113,0.25)",
    },
  };

  const applicationList = applications.map((app) => {
    const opp = app.opportunity || {};
    const hirer = app.hirer || {};
    const d = app.createdAt ? new Date(app.createdAt) : new Date();
    const ms = Date.now() - d.getTime();
    const timeAgo =
      ms < 3600000
        ? `${Math.floor(ms / 60000)}m ago`
        : ms < 86400000
          ? `${Math.floor(ms / 3600000)}h ago`
          : `${Math.floor(ms / 86400000)}d ago`;
    return {
      _id: app._id,
      title: opp.title || "Opportunity",
      company: hirer.companyName || hirer.name || "—",
      budget: opp.budget ? formatCur(opp.budget) : "—",
      time: timeAgo,
      status: (app.status || "pending").toLowerCase(),
    };
  });

  if (loading)
    return (
      <>
        <Sidebar />
        <div
          className="min-h-screen lg:ml-[248px] flex items-center justify-center"
          style={{ background: C.bg }}
        >
          <div className="w-10 h-10 border-2 border-[#b3a961] border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Sidebar />
        <div
          className="min-h-screen lg:ml-[248px] flex items-center justify-center"
          style={{ background: C.bg }}
        >
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes barFill {
          from { width: 0%; }
        }

        .stat-card { animation: fadeUp 0.35s ease both; }
        .stat-card:nth-child(1){ animation-delay:0.05s; }
        .stat-card:nth-child(2){ animation-delay:0.10s; }
        .stat-card:nth-child(3){ animation-delay:0.15s; }
        .stat-card:nth-child(4){ animation-delay:0.20s; }

        .app-row { animation: fadeUp 0.3s ease both; transition: background 0.18s; }
        .app-row:nth-child(1){ animation-delay:0.25s; }
        .app-row:nth-child(2){ animation-delay:0.32s; }
        .app-row:nth-child(3){ animation-delay:0.39s; }
        .app-row:hover { background: rgba(179,169,97,0.04) !important; }

        .right-card { animation: fadeUp 0.35s ease both; }
        .right-card:nth-child(1){ animation-delay:0.15s; }
        .right-card:nth-child(2){ animation-delay:0.25s; }

        .progress-bar { animation: barFill 1.2s cubic-bezier(0.4,0,0.2,1) 0.5s both; }

        .miss-group { transition: filter 0.15s; cursor: pointer; }
        .miss-group:hover { filter: brightness(1.1); }

        .complete-btn { transition: filter 0.18s, transform 0.18s; }
        .complete-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .pay-row { transition: background 0.15s; }
        .pay-row:hover { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      <Sidebar />

      <div
        className="min-h-screen lg:ml-[248px]"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="px-6 py-8 max-w-[1200px]">
          {/* Page header */}
          <div className="mb-7" style={{ animation: "fadeUp 0.3s ease both" }}>
            <h1
              className="text-[26px] font-bold leading-tight mb-1 flex items-center gap-2"
              style={{
                color: C.darkText,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Welcome back <span>👋</span>
            </h1>
            <p className="text-[14px]" style={{ color: C.lightText }}>
              Here's what's happening with your profile
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map(
              ({ label, value, icon: Icon, iconBg, iconColor }) => (
                <div
                  key={label}
                  className="stat-card rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-xl"
                      style={{ background: iconBg }}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        style={{ color: iconColor }}
                      />
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-[24px] font-bold leading-none mb-1"
                      style={{ color: C.darkText }}
                    >
                      {value}
                    </p>
                    <p className="text-[12.5px]" style={{ color: C.lightText }}>
                      {label}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            {/* ── CHANGE 1: Active Applications — no image, pure card layout ── */}
            <div
              className="rounded-2xl p-6"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-[16px] font-bold"
                  style={{ color: C.darkText }}
                >
                  Active Applications
                </h2>
                <button
                  onClick={() => navigate("/artist/opportunity")}
                  className="flex items-center gap-1 text-[13px] font-semibold border-0 bg-transparent outline-none cursor-pointer transition-opacity hover:opacity-70"
                  style={{ color: C.gold }}
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {applicationList.length === 0 && (
                  <p
                    className="text-[13px] text-center py-10"
                    style={{ color: C.lightText }}
                  >
                    No applications yet
                  </p>
                )}
                {applicationList.map(
                  ({ _id, title, company, budget, time, status }) => {
                    const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
                    const displayStatus =
                      status === "hired" ? "accepted" : status;
                    return (
                      // Card: no image — flex-col with title/badge, company, budget+time
                      <div
                        key={_id}
                        className="app-row flex flex-col gap-2 p-4 rounded-xl cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.018)",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {/* Row 1: title + status badge */}
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="text-[14.5px] font-semibold leading-tight truncate"
                            style={{ color: C.darkText }}
                          >
                            {title}
                          </p>
                          <span
                            className="text-[11px] font-bold px-[9px] py-[3px] rounded-full flex-shrink-0 capitalize"
                            style={{
                              background: s.bg,
                              color: s.color,
                              border: `1px solid ${s.border}`,
                            }}
                          >
                            {displayStatus}
                          </span>
                        </div>

                        {/* Row 2: company name */}
                        <p
                          className="text-[12.5px]"
                          style={{ color: C.lightText }}
                        >
                          {company}
                        </p>

                        {/* Row 3: budget + time */}
                        <div className="flex items-center gap-4">
                          <span
                            className="flex items-center gap-1 text-[12px]"
                            style={{ color: C.lightText }}
                          >
                            <IndianRupee size={12} style={{ color: C.gold }} />{" "}
                            {budget}
                          </span>
                          <span
                            className="flex items-center gap-1 text-[12px]"
                            style={{ color: C.lightText }}
                          >
                            <Clock size={12} /> {time}
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {/* ── CHANGE 2: Profile Strength — fully dynamic % ── */}
              <div
                className="right-card rounded-2xl p-6"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-[15px] font-bold"
                    style={{ color: C.darkText }}
                  >
                    Profile Strength
                  </h2>
                  <Star size={17} style={{ color: C.gold }} fill={C.gold} />
                </div>

                {/* Progress bar — width driven by real profilePct */}
                <div
                  className="w-full h-[7px] rounded-full overflow-hidden mb-3"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="progress-bar h-full rounded-full"
                    style={{ background: theme.bar, width: `${profilePct}%` }}
                  />
                </div>

                {/* Percentage number — colour changes red/gold/green */}
                <p
                  className="text-[28px] font-bold leading-none mb-1"
                  style={{ color: theme.label }}
                >
                  {profilePct}%
                </p>

                <p
                  className="text-[12.5px] mb-4 leading-relaxed"
                  style={{ color: C.lightText }}
                >
                  {profilePct === 100
                    ? "🎉 Your profile is complete!"
                    : profilePct >= 80
                      ? "Almost there! A few fields left."
                      : profilePct >= 50
                        ? "Good progress — keep going!"
                        : "Complete your profile to get more opportunities"}
                </p>

                {/* Missing fields grouped by tab — each group navigates to /artist/profile */}
                {Object.keys(missingByTab).length > 0 && (
                  <div className="flex flex-col gap-2 mb-5">
                    {Object.entries(missingByTab).map(([tab, fields]) => (
                      <div
                        key={tab}
                        className="miss-group rounded-xl px-3 py-2"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${TAB_COLORS[tab] || C.border}22`,
                        }}
                        onClick={() => navigate("/artist/profile")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-[11px] font-bold uppercase tracking-wide"
                            style={{ color: TAB_COLORS[tab] || C.gold }}
                          >
                            {tab}
                          </span>
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: C.lightText }}
                          >
                            +{fields.reduce((s, f) => s + f.weight, 0)}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {fields.map((f) => (
                            <span
                              key={f.label}
                              className="text-[10.5px] px-2 py-[2px] rounded-full"
                              style={{
                                background: `${TAB_COLORS[tab] || C.gold}12`,
                                color: C.lightText,
                                border: `1px solid ${TAB_COLORS[tab] || C.gold}20`,
                              }}
                            >
                              {f.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => navigate("/artist/profile")}
                  className="complete-btn w-full py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
                  style={{
                    background:
                      profilePct === 100
                        ? "rgba(52,211,153,0.15)"
                        : `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                    color: profilePct === 100 ? "#34d399" : "#1a1d24",
                    border:
                      profilePct === 100
                        ? "1px solid rgba(52,211,153,0.3)"
                        : "none",
                  }}
                >
                  {profilePct === 100 ? "✓ View Profile" : "Complete Profile →"}
                </button>
              </div>

              {/* Recent Payments — unchanged from original */}
              <div
                className="right-card rounded-2xl p-6"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2
                    className="text-[15px] font-bold"
                    style={{ color: C.darkText }}
                  >
                    Recent Payments
                  </h2>
                  <TrendingUp size={17} style={{ color: "#34d399" }} />
                </div>

                <div className="flex flex-col gap-1">
                  {paymentsList.length === 0 && (
                    <p
                      className="text-[13px] text-center py-4"
                      style={{ color: C.lightText }}
                    >
                      No payments yet
                    </p>
                  )}
                  {paymentsList.map((item, idx) => (
                    <div
                      key={item.title + idx}
                      className="pay-row flex items-center justify-between px-3 py-3 rounded-xl"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div>
                        <p
                          className="text-[13px] font-semibold leading-tight"
                          style={{ color: C.darkText }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="text-[11.5px] mt-[2px]"
                          style={{ color: C.lightText }}
                        >
                          {item.date}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className="text-[13.5px] font-bold"
                          style={{ color: C.darkText }}
                        >
                          {item.amount}
                        </span>
                        {item.status === "Paid" ? (
                          <span
                            className="flex items-center gap-1 text-[11px] font-semibold"
                            style={{ color: "#34d399" }}
                          >
                            <CheckCircle2 size={12} /> Paid
                          </span>
                        ) : (
                          <span
                            className="text-[10.5px] font-bold px-2 py-[2px] rounded-full"
                            style={{
                              background: "rgba(251,146,60,0.15)",
                              color: "#fb923c",
                              border: "1px solid rgba(251,146,60,0.25)",
                            }}
                          >
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/artist/payment")}
                  className="mt-4 w-full py-[9px] rounded-xl text-[12.5px] font-semibold border-0 outline-none cursor-pointer transition-opacity hover:opacity-75"
                  style={{
                    background: "rgba(179,169,97,0.08)",
                    color: C.gold,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  View All Payments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
