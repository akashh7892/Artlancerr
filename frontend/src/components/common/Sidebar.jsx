import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Search,
  Users,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  CalendarSearch,
  Sparkles,
  ArrowRight,
  Badge,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/artist/dashboard" },
  { label: "Profile", icon: User, path: "/artist/profile" },
  { label: "Portfolio", icon: Briefcase, path: "/artist/portfolio" },
  { label: "Opportunities", icon: Search, path: "/artist/opportunity" },
  { label: "Nearby Artists", icon: Users, path: "/artist/near-by-artists" },
  { label: "Messages", icon: MessageSquare, path: "/artist/message" },
  { label: "Payments", icon: CreditCard, path: "/artist/payment" },
  { label: "Promotions", icon: Badge, path: "/artist/promotion" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", icon: Settings, path: "/artist/settings" },
  { label: "Logout", icon: LogOut, path: null },
];

const ACTIONS = [
  {
    label: "Update Portfolio",
    desc: "Showcase your latest work",
    icon: Briefcase,
    path: "/artist/portfolio",
    tag: "Portfolio",
  },
  {
    label: "Browse Opportunities",
    desc: "Find gigs that match your skills",
    icon: CalendarSearch,
    path: "/artist/opportunity",
    tag: "Explore",
  },
  {
    label: "Check Messages",
    desc: "Stay in touch with clients",
    icon: MessageSquare,
    path: "/artist/message",
    tag: "Inbox",
  },
];

const SIDEBAR_PATHS = [
  "/artist/dashboard",
  "/artist/profile",
  "/artist/portfolio",
  "/artist/opportunity",
  "/artist/near-by-artists",
  "/artist/message",
  "/artist/payment",
  "/artist/promotion",
  "/artist/plusicon",
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const showFloating = SIDEBAR_PATHS.some((p) =>
    location.pathname.startsWith("/" + p.split("/").slice(1, 3).join("/")),
  );

  useEffect(() => {
    if (location.pathname === "/artist/plusicon") setModalOpen(true);
    else setModalOpen(false);
  }, [location.pathname]);

  const closeModal = () => {
    setModalOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    document.body.style.overflow = open || modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, modalOpen]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    setOpen(false);
  };

  const NavItem = ({ label, icon: Icon, path }) => {
    if (!path) {
      return (
        <button
          onClick={handleLogout}
          className="sb-item flex items-center gap-3 w-full px-3 py-[10px] rounded-xl text-left border-0 outline-none cursor-pointer"
          style={{ background: "transparent" }}
        >
          <Icon
            size={17}
            strokeWidth={1.8}
            style={{ color: "#5a6e7d", flexShrink: 0 }}
          />
          <span
            style={{
              color: "#7a8fa0",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 13.5,
              fontWeight: 400,
            }}
          >
            {label}
          </span>
        </button>
      );
    }
    return (
      <NavLink
        to={path}
        onClick={() => setOpen(false)}
        className="sb-item flex items-center gap-3 w-full px-3 py-[10px] rounded-xl text-left border-0 outline-none cursor-pointer no-underline relative"
        style={({ isActive }) => ({
          background: isActive ? "rgba(201,169,97,0.10)" : "transparent",
          textDecoration: "none",
        })}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 3,
                  height: "52%",
                  borderRadius: "0 3px 3px 0",
                  background: "#c9a961",
                }}
              />
            )}
            <Icon
              size={17}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{
                color: isActive ? "#c9a961" : "#5a6e7d",
                flexShrink: 0,
                transition: "color 0.18s",
              }}
            />
            <span
              style={{
                color: isActive ? "#ddd0a8" : "#7a8fa0",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                transition: "color 0.18s",
              }}
            >
              {label}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        /* scrollbar */
        .sb-scroll::-webkit-scrollbar { display: none; }
        .sb-scroll { scrollbar-width: none; }

        /* ── Hamburger toggle – outside sidebar, mobile only ──────────
           ☰ when closed, ✕ when open. Hidden on desktop ≥1024px.       */
        .sb-toggle {
          display: none;
          position: fixed;
          top: 13px; left: 13px;
          z-index: 1300;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px;
          border: 1px solid rgba(201,169,97,0.16);
          background: #1a1e26;
          color: #b8c8d4;
          cursor: pointer;
          outline: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.36);
          transition: background 0.16s, border-color 0.16s;
        }
        .sb-toggle:hover { background: #20262f; border-color: rgba(201,169,97,0.36); }
        @media (max-width: 1023px) { .sb-toggle { display: flex; } }

        /* ── Backdrop – mobile only ─────────────────────────────────── */
        .sb-backdrop {
          display: none;
          position: fixed; inset: 0;
          z-index: 1100;
          background: rgba(0,0,0,0.58);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: sbFade 0.18s ease;
        }
        @media (max-width: 1023px) { .sb-backdrop { display: block; } }
        @keyframes sbFade { from { opacity:0; } to { opacity:1; } }

        /* ── Sidebar panel ──────────────────────────────────────────── */
        .sb-panel {
          position: fixed;
          top: 0; left: 0;
          width: 242px;
          height: 100dvh;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          background: #191d25;
          border-right: 1px solid rgba(255,255,255,0.055);
          transform: translateX(0);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          will-change: transform;
        }
        @media (max-width: 1023px) {
          .sb-panel { transform: translateX(-100%); }
          .sb-panel.sb-open { transform: translateX(0); }
        }

        /* ── Nav item hover ─────────────────────────────────────────── */
        .sb-item { transition: background 0.15s; }
        .sb-item:hover { background: rgba(255,255,255,0.042) !important; }

        /* ── Active glow strip ──────────────────────────────────────── */
        .sb-item-active { background: rgba(201,169,97,0.09) !important; }

        /* ── FAB ────────────────────────────────────────────────────── */
        @keyframes sbFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes sbRing {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,169,97,0.42), 0 6px 20px rgba(0,0,0,0.34); }
          60%      { box-shadow: 0 0 0 9px rgba(201,169,97,0),  0 6px 20px rgba(0,0,0,0.34); }
        }
        .sb-fab { animation: sbFloat 3.2s ease-in-out infinite, sbRing 3s ease-out infinite; }
        .sb-fab:hover {
          animation: none !important;
          transform: scale(1.1) rotate(90deg) !important;
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1) !important;
        }

        /* ── Quick-actions modal ───────────────────────────────────── */
        @keyframes sbUp {
          from { opacity:0; transform: translateY(18px) scale(0.96); }
          to   { opacity:1; transform: none; }
        }
        .sb-modal { animation: sbUp 0.26s cubic-bezier(0.34,1.3,0.64,1) forwards; }

        @keyframes sbRow {
          from { opacity:0; transform: translateY(7px); }
          to   { opacity:1; transform: none; }
        }
        .sb-ri { opacity:0; }
        .sb-ri:nth-child(1) { animation: sbRow 0.22s 0.06s ease forwards; }
        .sb-ri:nth-child(2) { animation: sbRow 0.22s 0.12s ease forwards; }
        .sb-ri:nth-child(3) { animation: sbRow 0.22s 0.18s ease forwards; }

        .sb-row { transition: background 0.15s, transform 0.15s, border-color 0.15s; }
        .sb-row:hover { background: rgba(201,169,97,0.07) !important; transform: translateX(3px); border-color: rgba(201,169,97,0.20) !important; }
        .sb-row:hover .sb-arr { opacity:1 !important; transform: translateX(0) !important; }
        .sb-arr { opacity:0; transform: translateX(-4px); transition: opacity 0.14s, transform 0.14s; }

        .sb-xbtn { transition: background 0.13s, transform 0.17s; }
        .sb-xbtn:hover { background: rgba(255,255,255,0.10) !important; transform: rotate(90deg); }

        /* ── Section divider label ──────────────────────────────────── */
        .sb-section-label {
          padding: 14px 12px 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(201,169,97,0.28);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      {/* ── Hamburger: mobile only, shows ☰ or ✕ ── */}
      <button
        className="sb-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <X size={17} strokeWidth={2.2} />
        ) : (
          <Menu size={17} strokeWidth={2} />
        )}
      </button>

      {/* ── Backdrop ── */}
      {open && <div className="sb-backdrop" onClick={() => setOpen(false)} />}

      <aside ref={sidebarRef} className={`sb-panel ${open ? "sb-open" : ""}`}>
        {/* ── Logo header
            The logo + name are pushed to the RIGHT end of the header
            row using justify-end, so they sit away from the hamburger
            button that floats at top-left on mobile.
        ── */}
        <div
          style={{
            flexShrink: 0,
            padding: "18px 16px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.055)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <NavLink
            to="/artist/dashboard"
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textDecoration: "none",
            }}
          >
            <img
              src="/logo.png"
              alt="Flip"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                objectFit: "cover",
              }}
            />

            <p
              style={{
                marginTop: 4,
                color: "rgba(201,169,97,0.5)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Artist Mode
            </p>
          </NavLink>
        </div>
        {/* ── Main nav ── */}
        <nav
          className="sb-scroll flex-1 overflow-y-auto"
          style={{ padding: "8px 8px 0" }}
        >
          <p className="sb-section-label">Menu</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </div>
        </nav>

        {/* ── Bottom: settings + logout — flex-shrink-0 ensures always visible ── */}
        <div
          style={{
            flexShrink: 0,
            padding: "8px 8px 16px",
            borderTop: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <p className="sb-section-label" style={{ paddingTop: 8 }}>
            Account
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {BOTTOM_ITEMS.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      </aside>

      {/* ── FAB ── */}
      {showFloating && (
        <button
          onClick={() => navigate("/artist/plusicon")}
          className="sb-fab fixed z-[1400] flex items-center justify-center rounded-full cursor-pointer border-0 outline-none"
          style={{
            bottom: 24,
            right: 20,
            width: 50,
            height: 50,
            background:
              "linear-gradient(135deg,#c9a961 0%,#dfc070 50%,#b8923f 100%)",
            color: "#1a1e26",
          }}
          aria-label="Quick Actions"
        >
          <Plus size={22} strokeWidth={2.8} />
        </button>
      )}

      {/* ── Quick Actions Modal ── */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(8,10,14,0.55)",
            animation: "sbFade 0.18s ease",
          }}
        >
          {/* Centre on sm+ */}
          <div
            style={{ display: "contents" }}
            className="sm:flex sm:items-center sm:justify-center sm:inset-0 sm:fixed"
          >
            <div
              className="sb-modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 356,
                margin: "0 12px",
                borderRadius: "20px 20px 20px 20px",
                padding: "24px 24px 28px",
                background: "#1e2230",
                border: "1px solid rgba(201,169,97,0.16)",
                boxShadow: "0 28px 72px rgba(0,0,0,0.62)",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                maxHeight: "88dvh",
                overflowY: "auto",
              }}
            >
              {/* Drag handle */}
              <div
                style={{
                  width: 36,
                  height: 3,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.10)",
                  margin: "0 auto 20px",
                }}
                className="sm:hidden"
              />

              <button
                className="sb-xbtn"
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: 0,
                  outline: "none",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.06)",
                  color: "#5a6e7d",
                }}
              >
                <X size={13} strokeWidth={2.2} />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 4,
                }}
              >
                <Sparkles size={13} style={{ color: "#c9a961" }} />
                <span
                  style={{
                    color: "rgba(201,169,97,0.55)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Artist Tools
                </span>
              </div>
              <h2
                style={{
                  margin: "0 0 4px",
                  color: "#ccc8bc",
                  fontFamily: "'Playfair Display',serif",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Quick Actions
              </h2>
              <p
                style={{
                  margin: "0 0 18px",
                  color: "#4e6070",
                  fontSize: 12,
                  lineHeight: 1.65,
                }}
              >
                Jump straight to what matters
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ACTIONS.map(({ label, desc, icon: Icon, path, tag }) => (
                  <button
                    key={label}
                    className="sb-ri sb-row"
                    onClick={() => {
                      setModalOpen(false);
                      navigate(path);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 13,
                      border: "1px solid rgba(201,169,97,0.07)",
                      background: "rgba(255,255,255,0.022)",
                      cursor: "pointer",
                      outline: "none",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: "rgba(201,169,97,0.10)",
                      }}
                    >
                      <Icon
                        size={15}
                        strokeWidth={1.8}
                        style={{ color: "#c9a961" }}
                      />
                    </span>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#c0baa8",
                          fontSize: 13.5,
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{ color: "#4e6070", fontSize: 11, marginTop: 2 }}
                      >
                        {desc}
                      </span>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(201,169,97,0.10)",
                          color: "rgba(201,169,97,0.65)",
                          fontSize: 9.5,
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 999,
                        }}
                      >
                        {tag}
                      </span>
                      <ArrowRight
                        size={12}
                        className="sb-arr"
                        style={{ color: "#c9a961" }}
                      />
                    </span>
                  </button>
                ))}
              </div>

              <p
                style={{
                  margin: "18px 0 0",
                  color: "#283540",
                  fontSize: 10.5,
                  textAlign: "center",
                }}
              >
                Click outside or press{" "}
                <span style={{ color: "#3e5260" }}>Esc</span> to dismiss
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
