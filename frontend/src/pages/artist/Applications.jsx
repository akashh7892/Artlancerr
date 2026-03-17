import { useEffect, useMemo, useState } from "react";
import { Briefcase, Calendar, CheckCircle2, Clock3, XCircle } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { applicationsAPI } from "../../services/api";

const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  text: "#ffffff",
  muted: "#9ca3af",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.12)",
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.12)",
  warn: "#fbbf24",
  warnBg: "rgba(251,191,36,0.12)",
};

const STATUS_MAP = {
  pending: { label: "Pending", color: C.warn, bg: C.warnBg, Icon: Clock3 },
  accepted: { label: "Accepted", color: C.success, bg: C.successBg, Icon: CheckCircle2 },
  hired: { label: "Accepted", color: C.success, bg: C.successBg, Icon: CheckCircle2 },
  rejected: { label: "Rejected", color: C.danger, bg: C.dangerBg, Icon: XCircle },
  withdrawn: { label: "Withdrawn", color: C.muted, bg: "rgba(255,255,255,0.06)", Icon: XCircle },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[String(status || "pending").toLowerCase()] || STATUS_MAP.pending;
  const Icon = s.Icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        background: s.bg,
        color: s.color,
        fontSize: "12px",
        fontWeight: "600",
        border: `1px solid ${s.color}22`,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={12} strokeWidth={2.1} />
      {s.label}
    </span>
  );
}

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let m = true;
    setLoading(true);
    applicationsAPI
      .getAll()
      .then((res) => {
        if (!m) return;
        const list = Array.isArray(res) ? res : res?.data || [];
        setApps(list);
      })
      .catch(() => {
        if (!m) return;
        setError("Could not load your applications.");
      })
      .finally(() => {
        if (m) setLoading(false);
      });
    return () => {
      m = false;
    };
  }, []);

  const counts = useMemo(() => {
    const base = apps || [];
    const isAccepted = (s) => ["accepted", "hired"].includes(s);
    return {
      all: base.length,
      pending: base.filter((a) => (a.status || "pending") === "pending").length,
      accepted: base.filter((a) => isAccepted(a.status)).length,
      rejected: base.filter((a) => a.status === "rejected").length,
    };
  }, [apps]);

  const filteredApps = useMemo(() => {
    if (filter === "all") return apps;
    return (apps || []).filter((a) => {
      const s = String(a.status || "pending").toLowerCase();
      if (filter === "accepted") return s === "accepted" || s === "hired";
      return s === filter;
    });
  }, [apps, filter]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <div className="app-page">
          <h1 className="app-title">My Applications</h1>
          <p className="app-subtitle">
            Track every opportunity you've applied to in one place
          </p>

          {loading ? (
            <div className="app-empty">Loading...</div>
          ) : error ? (
            <div className="app-empty">{error}</div>
          ) : apps.length === 0 ? (
            <div className="app-empty">No applications yet</div>
          ) : (
            <>
              <div className="tabs-row">
                {[
                  { key: "all", label: "All", count: counts.all },
                  { key: "pending", label: "Pending", count: counts.pending },
                  {
                    key: "accepted",
                    label: "Accepted",
                    count: counts.accepted,
                  },
                  { key: "rejected", label: "Rejected", count: counts.rejected },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`tab-btn${filter === key ? " tab-active" : ""}`}
                  >
                    {label}
                    <span
                      className={`tab-count${filter === key ? " tab-count-active" : ""}`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {filteredApps.length === 0 ? (
                <div className="app-empty">No applications found</div>
              ) : (
                <div className="app-grid">
                  {filteredApps.map((app) => {
                    const opp = app.opportunity || {};
                    const title = opp.title || "Opportunity";
                    const date = app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "";
                    return (
                      <div key={app._id} className="app-card">
                        <div className="app-card-top">
                          <div>
                            <h3 className="app-card-title">{title}</h3>
                            <div className="app-meta">
                              <span className="app-meta-pill">
                                <Briefcase size={12} />
                                {opp.type || "Role"}
                              </span>
                              {date && (
                                <span className="app-meta-pill">
                                  <Calendar size={12} />
                                  Applied {date}
                                </span>
                              )}
                            </div>
                          </div>
                          <StatusBadge status={app.status} />
                        </div>
                        <div className="app-card-bottom">
                          <span className="app-muted">
                            {opp.location || "Remote"}
                          </span>
                          <span className="app-muted">
                            {opp.budgetMin || opp.budgetMax
                              ? `Rs ${Number(opp.budgetMin || 0).toLocaleString()} - Rs ${Number(
                                  opp.budgetMax || opp.budgetMin || 0,
                                ).toLocaleString()}`
                              : "Budget not specified"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .app-page {
          max-width: 980px;
          margin: 0 auto;
          padding: 26px 18px 60px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        @media (min-width: 1024px) {
          .app-page { padding: 36px 28px 80px; margin-left: 288px; }
        }

        .app-title {
          margin: 0 0 4px;
          color: ${C.text};
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 700;
          font-family: 'Playfair Display', serif;
        }
        .app-subtitle {
          margin: 0 0 20px;
          color: #5a6e7d;
          font-size: 13px;
        }

        .tabs-row {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .tabs-row::-webkit-scrollbar { display: none; }
        .tab-btn {
          padding: 7px 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          color: ${C.text};
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background .15s, color .15s;
          font-family: inherit;
        }
        .tab-btn.tab-active {
          background: ${C.gold}22;
          color: ${C.gold};
          outline: 1px solid rgba(201,169,97,0.2);
        }
        .tab-count {
          background: rgba(255,255,255,0.08);
          color: ${C.muted};
          font-size: 11px;
          font-weight: 700;
          border-radius: 10px;
          padding: 1px 7px;
        }
        .tab-count.tab-count-active {
          background: rgba(201,169,97,0.22);
          color: ${C.gold};
        }

        .app-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 720px) {
          .app-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .app-card {
          background: ${C.card};
          border: 1px solid ${C.border};
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.15s, transform 0.15s;
        }
        .app-card:hover { border-color: rgba(201,169,97,0.28); transform: translateY(-1px); }

        .app-card-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: flex-start;
        }
        .app-card-title {
          margin: 0 0 6px;
          color: #ddd0b0;
          font-size: 14.5px;
          font-weight: 600;
        }
        .app-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .app-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: ${C.muted};
          background: rgba(255,255,255,0.04);
          border: 1px solid ${C.border};
          border-radius: 999px;
          padding: 3px 8px;
        }

        .app-card-bottom {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 12px;
        }
        .app-muted { color: #6b7280; }

        .app-empty {
          background: ${C.card};
          border: 1px dashed ${C.border};
          border-radius: 14px;
          padding: 28px;
          text-align: center;
          color: ${C.muted};
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
