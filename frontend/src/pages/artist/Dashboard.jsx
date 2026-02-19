import { useNavigate } from "react-router-dom";
import {
  Eye,
  Briefcase,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Clock,
  Star,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

// ─── Color tokens ────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#22252e",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#b3a961",
  border: "rgba(179,169,97,0.10)",
};

const STATS = [
  {
    label: "Profile Views",
    value: "1,248",
    delta: "+12%",
    icon: Eye,
    iconBg: "rgba(179,169,97,0.12)",
    iconColor: "#b3a961",
  },
  {
    label: "Active Projects",
    value: "1",
    delta: "+3",
    icon: Briefcase,
    iconBg: "rgba(96,165,250,0.12)",
    iconColor: "#60a5fa",
  },
  {
    label: "Total Earnings",
    value: "$8,500",
    delta: "+8%",
    icon: DollarSign,
    iconBg: "rgba(52,211,153,0.12)",
    iconColor: "#34d399",
  },
  {
    label: "Messages",
    value: "12",
    delta: "3 new",
    icon: MessageSquare,
    iconBg: "rgba(251,191,36,0.12)",
    iconColor: "#fbbf24",
  },
];

const APPLICATIONS = [
  {
    title: "Cinematographer for Music Video",
    company: "Stellar Productions",
    budget: "$4,500",
    time: "3d ago",
    status: "Shortlisted",
    img: "https://images.unsplash.com/photo-1493804714600-6edb1cd93080?w=80&h=80&fit=crop",
  },
  {
    title: "Dance Choreographer - Feature Film",
    company: "Moonlight Studios",
    budget: "$8,000",
    time: "5d ago",
    status: "In Review",
    img: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=80&h=80&fit=crop",
  },
  {
    title: "Lead Actress - Indie Short",
    company: "Riverstone Films",
    budget: "$3,000",
    time: "7d ago",
    status: "Hired",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=80&h=80&fit=crop",
  },
];

const PAYMENTS = [
  {
    title: "Brand Commercial Shoot",
    date: "2/15/2026",
    amount: "$3,500",
    status: "Paid",
  },
  {
    title: "Documentary Series",
    date: "2/20/2026",
    amount: "$5,000",
    status: "Pending",
  },
];

const STATUS_STYLES = {
  Shortlisted: {
    bg: "rgba(139,92,246,0.15)",
    color: "#a78bfa",
    border: "rgba(139,92,246,0.25)",
  },
  "In Review": {
    bg: "rgba(251,146,60,0.15)",
    color: "#fb923c",
    border: "rgba(251,146,60,0.25)",
  },
  Hired: {
    bg: "rgba(52,211,153,0.15)",
    color: "#34d399",
    border: "rgba(52,211,153,0.25)",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();

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
            {STATS.map(
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
                {APPLICATIONS.map(
                  ({ title, company, budget, time, status, img }) => {
                    const s = STATUS_STYLES[status];
                    return (
                      <div
                        key={title}
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
                              <DollarSign size={12} style={{ color: C.gold }} />{" "}
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
                  {PAYMENTS.map(({ title, date, amount, status }) => (
                    <div
                      key={title}
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
                          {title}
                        </p>
                        <p
                          className="text-[11.5px] mt-[2px]"
                          style={{ color: C.lightText }}
                        >
                          {date}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className="text-[13.5px] font-bold"
                          style={{ color: C.darkText }}
                        >
                          {amount}
                        </span>
                        {status === "Paid" ? (
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
