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
  const formatCur = (amt, cur) =>
    cur === "INR"
      ? `₹${Number(amt).toLocaleString()}`
      : `${Number(amt).toLocaleString()}`;
  const statCards = [
    {
      label: "Profile Views",
      value: String(stats.profileViews ?? 0),
      delta: "",
      icon: Eye,
      iconBg: "rgba(179,169,97,0.12)",
      iconColor: C.gold,
    },
    {
      label: "Active Projects",
      value: String(stats.activeProjects ?? 0),
      delta: "",
      icon: Briefcase,
      iconBg: "rgba(96,165,250,0.12)",
      iconColor: "#60a5fa",
    },
    {
      label: "Total Earnings",
      value: formatCur(stats.totalEarnings),
      delta: "",
      icon: IndianRupee,
      iconBg: "rgba(52,211,153,0.12)",
      iconColor: "#34d399",
    },
    {
      label: "Messages",
      value: String(stats.messages ?? 0),
      delta: "",
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
  };
  const applicationList = applications.map((app) => {
    const opp = app.opportunity || {};
    const hirer = app.hirer || {};
    const d = app.createdAt ? new Date(app.createdAt) : new Date();
    const timeAgo =
      Date.now() - d.getTime() < 86400000
        ? `${Math.floor((Date.now() - d.getTime()) / 3600000)}h ago`
        : `${Math.floor((Date.now() - d.getTime()) / 86400000)}d ago`;
    return {
      _id: app._id,
      title: opp.title || "Opportunity",
      company: hirer.companyName || hirer.name || "—",
      budget: opp.budget ? formatCur(opp.budget) : "—",
      time: timeAgo,
      status: (app.status || "pending").toLowerCase(),
      img: hirer.avatar || "",
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
          to   { width: 75%; }
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

        .complete-btn { transition: filter 0.18s, transform 0.18s; }
        .complete-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .pay-row { transition: background 0.15s; }
        .pay-row:hover { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      {/* Sidebar is fixed — always rendered separately */}
      <Sidebar />

      {/* ── Main content — offset by sidebar width on desktop ── */}
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
              ({ label, value, delta, icon: Icon, iconBg, iconColor }) => (
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
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: C.gold }}
                    >
                      {delta}
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
            {/* Active Applications */}
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
                {applicationList.map(
                  ({ _id, title, company, budget, time, status, img }) => {
                    const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
                    return (
                      <div
                        key={_id}
                        className="app-row flex items-center gap-4 p-4 rounded-xl cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.018)",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <img
                          src={img}
                          alt={title}
                          className="w-[56px] h-[56px] rounded-xl object-cover flex-shrink-0"
                          style={{ border: `1px solid ${C.border}` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p
                              className="text-[14.5px] font-semibold leading-tight truncate"
                              style={{ color: C.darkText }}
                            >
                              {title}
                            </p>
                            <span
                              className="text-[11px] font-bold px-[9px] py-[3px] rounded-full flex-shrink-0"
                              style={{
                                background: s.bg,
                                color: s.color,
                                border: `1px solid ${s.border}`,
                              }}
                            >
                              {status}
                            </span>
                          </div>
                          <p
                            className="text-[12.5px] mb-2"
                            style={{ color: C.lightText }}
                          >
                            {company}
                          </p>
                          <div className="flex items-center gap-4">
                            <span
                              className="flex items-center gap-1 text-[12px]"
                              style={{ color: C.lightText }}
                            >
                              <IndianRupee
                                size={12}
                                style={{ color: C.gold }}
                              />{" "}
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
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {/* Profile Strength */}
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

                <div className="mb-3">
                  <div
                    className="w-full h-[7px] rounded-full overflow-hidden mb-3"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="progress-bar h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${C.gold}, #e0d070)`,
                      }}
                    />
                  </div>
                  <p
                    className="text-[28px] font-bold leading-none"
                    style={{ color: C.darkText }}
                  >
                    75%
                  </p>
                </div>

                <p
                  className="text-[12.5px] mb-5 leading-relaxed"
                  style={{ color: C.lightText }}
                >
                  Complete your profile to get more opportunities
                </p>

                <button
                  onClick={() => navigate("/artist/profile")}
                  className="complete-btn w-full py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                    color: "#1a1d24",
                  }}
                >
                  Complete Profile
                </button>
              </div>

              {/* Recent Payments */}
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
