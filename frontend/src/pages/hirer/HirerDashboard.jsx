import { motion } from "motion/react";
import {
  Users,
  IndianRupee,
  Briefcase,
  TrendingUp,
  Shield,
  ArrowRight,
  Plus,
  FileText,
  BarChart2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

export default function HirerDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    artistsHired: 0,
    totalSpent: 0,
    inEscrow: 0,
    opportunityCount: 0,
    applicationCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let m = true;
    hirerAPI
      .getDashboard()
      .then((res) => {
        if (!m) return;
        const rawProjects = Array.isArray(res?.opportunities)
          ? res.opportunities
          : [];
        setStats((prev) => ({ ...prev, ...(res?.stats || {}) }));
        setProjects(
          rawProjects.map((p) => ({
            id: p._id,
            title: p.title || "Project",
            artistsHired: Number(p.applicationCount || 0),
            budget: Number(p.budgetMax || p.budgetMin || 0),
            completion:
              p.maxSlots && p.maxSlots > 0
                ? Math.round(
                    ((p.maxSlots - Number(p.availableSlots || 0)) /
                      p.maxSlots) *
                      100,
                  )
                : 0,
            deadline: new Date(
              p.startDate ||
                (p.createdAt
                  ? new Date(new Date(p.createdAt).getTime() + 12096e5)
                  : Date.now()),
            ),
            type: p.type || "Project",
            location: p.location || "Remote",
          })),
        );
      })
      .catch(() => {
        if (!m) return;
        setProjects([]);
      })
      .finally(() => {
        if (m) setLoading(false);
      });
    return () => {
      m = false;
    };
  }, []);

  const totalSpent = Number(stats.totalSpent || 0);
  const inEscrow = Number(stats.inEscrow || 0);
  const activeProjects = Number(stats.activeProjects || projects.length || 0);

  /* ── stat cards config ── */
  const statCards = [
    {
      icon: Briefcase,
      iconBg: "rgba(201,169,97,0.12)",
      iconColor: "#c9a961",
      label: "Active Projects",
      value: activeProjects,
      badge: "+2",
      badgeColor: "#4ade80",
      delay: 0.08,
    },
    {
      icon: Users,
      iconBg: "rgba(59,130,246,0.12)",
      iconColor: "#60a5fa",
      label: "Artists Hired",
      value: Number(stats.artistsHired || 0),
      badge: "+5",
      badgeColor: "#4ade80",
      delay: 0.14,
    },
    {
      icon: IndianRupee,
      iconBg: "rgba(34,197,94,0.12)",
      iconColor: "#4ade80",
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      badge: "Total",
      badgeColor: "#6b7f8f",
      delay: 0.2,
    },
    {
      icon: Shield,
      iconBg: "rgba(234,179,8,0.12)",
      iconColor: "#facc15",
      label: "In Escrow",
      value: `₹${inEscrow.toLocaleString()}`,
      badge: "Secured",
      badgeColor: "#6b7f8f",
      delay: 0.26,
    },
  ];

  /* ── quick actions ── */
  const quickActions = [
    {
      label: "Post Requirement",
      icon: FileText,
      path: "/hirer/post-requirement",
      color: "#c9a961",
      bg: "rgba(201,169,97,0.10)",
    },
    {
      label: "Browse Artists",
      icon: Users,
      path: "/hirer/browse-artists",
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.10)",
    },
    {
      label: "View Applications",
      icon: CheckCircle2,
      path: "/hirer/applications",
      color: "#4ade80",
      bg: "rgba(34,197,94,0.10)",
    },
    {
      label: "Manage Bookings",
      icon: Clock,
      path: "/hirer/bookings",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.10)",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .hd-root {
          min-height: 100dvh;
          background: #191d25;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Stats grid: 2 cols on mobile, 4 on lg ── */
        .hd-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 1024px) {
          .hd-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
        }

        /* ── Main grid: 1 col mobile, 3 col lg ── */
        .hd-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 1024px) {
          .hd-main-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
        }

        /* ── Project cards grid: 1 col mobile, 2 col md ── */
        .hd-proj-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .hd-proj-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Quick action grid: 2 cols always ── */
        .hd-qa-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        /* ── Card base ── */
        .hd-card {
          background: #22252e;
          border: 1px solid rgba(201,169,97,0.12);
          border-radius: 16px;
          transition: border-color 0.18s, transform 0.18s;
        }
        .hd-card:hover { border-color: rgba(201,169,97,0.28); }

        .hd-card-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.28); }

        /* ── Progress bar ── */
        .hd-prog-track {
          width: 100%;
          height: 5px;
          border-radius: 99px;
          background: rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .hd-prog-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #c9a961, #dfc070);
          transition: width 0.4s ease;
        }

        /* ── Section heading ── */
        .hd-section-title {
          font-size: 15px;
          font-weight: 700;
          color: #ddd0b0;
          margin: 0 0 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Stat badge ── */
        .hd-badge {
          font-size: 10.5px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
        }

        /* ── Quick action button ── */
        .hd-qa-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
          cursor: pointer;
          outline: none;
          text-align: left;
          transition: background 0.16s, border-color 0.16s, transform 0.16s;
          width: 100%;
        }
        .hd-qa-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(201,169,97,0.20);
          transform: translateY(-1px);
        }
        .hd-qa-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 10px;
          flex-shrink: 0;
        }

        /* ── Month stat row ── */
        .hd-month-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hd-month-row:last-child { border-bottom: none; padding-bottom: 0; }

        /* ── Scrollbar ── */
        .hd-scroll::-webkit-scrollbar { width: 4px; }
        .hd-scroll::-webkit-scrollbar-track { background: transparent; }
        .hd-scroll::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.2); border-radius: 99px; }

        /* ── Page padding – accounts for sidebar on desktop ── */
        .hd-content {
          padding: 20px 16px 40px;
        }
        @media (min-width: 640px) { .hd-content { padding: 24px 24px 48px; } }
        @media (min-width: 1024px) { .hd-content { padding: 32px 32px 56px; } }
      `}</style>

      <div className="hd-root flex">
        {loading && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <div className="w-9 h-9 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <HirerSidebar />

        {/* ── Main content – offset by sidebar on desktop ── */}
        <main className="flex-1 lg:ml-[242px] min-w-0">
          <div className="hd-content max-w-[1100px] mx-auto">
            {/* ── Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              style={{ marginBottom: 24 }}
            >
              {/* Mobile: extra top space so hamburger doesn't overlap */}
              <div style={{ height: 4 }} className="lg:hidden" />
              <div style={{ paddingTop: 8 }} className="lg:hidden" />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "clamp(20px, 5vw, 26px)",
                      fontWeight: 700,
                      color: "#e8e4d8",
                      fontFamily: "'Playfair Display', serif",
                      lineHeight: 1.2,
                      marginTop:18,
                    }}
                  >
                    Dashboard
                  </h1>
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: 13,
                      color: "#5a6e7d",
                    }}
                  >
                    Track your projects and hire the best artists
                  </p>
                </div>

                <button
                  onClick={() => navigate("/hirer/post-requirement")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 16px",
                    borderRadius: 12,
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    background: "linear-gradient(135deg,#c9a961,#dfc070)",
                    color: "#1a1e26",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    flexShrink: 0,
                    transition: "opacity 0.16s, transform 0.16s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.88";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <Plus size={15} strokeWidth={2.6} />
                  Post Requirement
                </button>
              </div>
            </motion.div>

            {/* ── Stats: 2 cols mobile, 4 cols desktop ── */}
            <div className="hd-stats-grid" style={{ marginBottom: 20 }}>
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay, duration: 0.26 }}
                  className="hd-card hd-card-lift"
                  style={{ padding: "16px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: card.iconBg,
                        flexShrink: 0,
                      }}
                    >
                      <card.icon size={17} style={{ color: card.iconColor }} />
                    </div>
                    <span
                      className="hd-badge"
                      style={{ color: card.badgeColor }}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: "clamp(18px, 3.5vw, 22px)",
                      fontWeight: 700,
                      color: "#e8e4d8",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#5a6e7d" }}>
                    {card.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ── Main 2-col grid ── */}
            <div className="hd-main-grid">
              {/* ── LEFT: Active Projects ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.28 }}
                className="hd-card"
                style={{ padding: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <p className="hd-section-title" style={{ margin: 0 }}>
                    Active Projects
                  </p>
                  <button
                    onClick={() => navigate("/hirer/applications")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: "none",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      color: "#c9a961",
                      fontSize: 12.5,
                      fontWeight: 600,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.72")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    View All <ArrowRight size={13} />
                  </button>
                </div>

                {/* Project cards: 2 cols inside this section */}
                {projects.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "32px 0",
                      color: "#3a4e5e",
                    }}
                  >
                    <Briefcase size={32} strokeWidth={1.2} />
                    <p style={{ margin: 0, fontSize: 13 }}>
                      No active projects yet
                    </p>
                    <button
                      onClick={() => navigate("/hirer/post-requirement")}
                      style={{
                        marginTop: 4,
                        padding: "8px 18px",
                        borderRadius: 10,
                        border: "1px solid rgba(201,169,97,0.18)",
                        background: "transparent",
                        color: "#c9a961",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        outline: "none",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      Post your first requirement
                    </button>
                  </div>
                ) : (
                  <div className="hd-proj-grid">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="hd-card-lift"
                        style={{
                          background: "#191d25",
                          border: "1px solid rgba(255,255,255,0.065)",
                          borderRadius: 13,
                          padding: "14px",
                          cursor: "pointer",
                          transition: "border-color 0.16s, transform 0.16s",
                        }}
                        onClick={() => navigate("/hirer/applications")}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(201,169,97,0.28)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.065)")
                        }
                      >
                        {/* Type badge */}
                        <div style={{ marginBottom: 8 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: "rgba(201,169,97,0.10)",
                              color: "rgba(201,169,97,0.70)",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {project.type}
                          </span>
                        </div>

                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#ddd0b0",
                            lineHeight: 1.3,
                          }}
                        >
                          {project.title}
                        </p>
                        <p
                          style={{
                            margin: "0 0 10px",
                            fontSize: 11.5,
                            color: "#3a4e5e",
                          }}
                        >
                          {project.location}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "#5a6e7d",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Users size={11} /> {project.artistsHired}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#c9a961",
                            }}
                          >
                            ₹{project.budget.toLocaleString()}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="hd-prog-track">
                          <div
                            className="hd-prog-fill"
                            style={{ width: `${project.completion}%` }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 5,
                          }}
                        >
                          <span style={{ fontSize: 10.5, color: "#3a4e5e" }}>
                            Progress
                          </span>
                          <span style={{ fontSize: 10.5, color: "#7a8fa0" }}>
                            {project.completion}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* ── RIGHT col: Quick Actions + This Month ── */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.28 }}
                  className="hd-card"
                  style={{ padding: "20px" }}
                >
                  <p className="hd-section-title">Quick Actions</p>
                  <div className="hd-qa-grid">
                    {quickActions.map(
                      ({ label, icon: Icon, path, color, bg }) => (
                        <button
                          key={label}
                          className="hd-qa-btn"
                          onClick={() => navigate(path)}
                        >
                          <span
                            className="hd-qa-icon"
                            style={{ background: bg }}
                          >
                            <Icon
                              size={16}
                              strokeWidth={1.8}
                              style={{ color }}
                            />
                          </span>
                          <span
                            style={{
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: "#b8c8d4",
                              lineHeight: 1.3,
                            }}
                          >
                            {label}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </motion.div>

                {/* This Month Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44, duration: 0.28 }}
                  className="hd-card"
                  style={{ padding: "20px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <BarChart2 size={15} style={{ color: "#c9a961" }} />
                    <p className="hd-section-title" style={{ margin: 0 }}>
                      This Month
                    </p>
                  </div>

                  <div>
                    {[
                      {
                        label: "Requirements Posted",
                        value: Number(stats.opportunityCount || 0),
                        color: "#c9a961",
                      },
                      {
                        label: "Applications Received",
                        value: Number(stats.applicationCount || 0),
                        color: "#60a5fa",
                      },
                      {
                        label: "Artists Hired",
                        value: Number(stats.artistsHired || 0),
                        color: "#4ade80",
                      },
                      {
                        label: "Budget Spent",
                        value: `₹${totalSpent.toLocaleString()}`,
                        color: "#facc15",
                        icon: TrendingUp,
                      },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <div key={label} className="hd-month-row">
                        <span style={{ fontSize: 12.5, color: "#5a6e7d" }}>
                          {label}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#ddd0b0",
                          }}
                        >
                          {Icon && <Icon size={12} style={{ color }} />}
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Hire More CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.28 }}
                  style={{
                    borderRadius: 16,
                    padding: "18px 20px",
                    background:
                      "linear-gradient(135deg, rgba(201,169,97,0.14) 0%, rgba(201,169,97,0.06) 100%)",
                    border: "1px solid rgba(201,169,97,0.20)",
                    cursor: "pointer",
                    transition: "border-color 0.16s",
                  }}
                  onClick={() => navigate("/hirer/browse-artists")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(201,169,97,0.38)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(201,169,97,0.20)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#ddd0b0",
                        }}
                      >
                        Find More Artists
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#5a6e7d" }}>
                        Browse our talent pool
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "rgba(201,169,97,0.15)",
                        flexShrink: 0,
                      }}
                    >
                      <ArrowRight size={16} style={{ color: "#c9a961" }} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
