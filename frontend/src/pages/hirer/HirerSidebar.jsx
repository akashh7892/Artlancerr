import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Users,
  Megaphone,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
  Plus,
  Menu,
  X,
  Calendar,
  UserCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/hirer/dashboard" },
  {
    icon: FileText,
    label: "Post Requirement",
    path: "/hirer/post-requirement",
  },
  { icon: Users, label: "Browse Artists", path: "/hirer/browse-artists" },
  { icon: UserCheck, label: "Applications", path: "/hirer/applications" },
  { icon: Calendar, label: "Bookings", path: "/hirer/bookings" },
  { icon: MessageSquare, label: "Messages", path: "/hirer/messages" },
  { icon: CreditCard, label: "Payments", path: "/hirer/payments" },
  { icon: Megaphone, label: "Promotions", path: "/hirer/promotions" },
];

const BOTTOM_ITEMS = [
  { icon: Settings, label: "Settings", path: "/hirer/settings" },
  { icon: LogOut, label: "Logout", path: null },
];

const QUICK_ACTIONS = [
  {
    icon: FileText,
    label: "Post New Requirement",
    desc: "Create a new job posting",
    path: "/hirer/post-requirement",
    tag: "Post",
  },
  {
    icon: Users,
    label: "Browse Artists",
    desc: "Find talented artists",
    path: "/hirer/browse-artists",
    tag: "Browse",
  },
  {
    icon: Megaphone,
    label: "Create Promotion",
    desc: "Launch a new campaign",
    path: "/hirer/promotions",
    tag: "Promote",
  },
];

export default function HirerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    setOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = open || fabOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, fabOpen]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const NavItem = ({ icon: Icon, label, path }) => {
    const isActive =
      path &&
      (location.pathname === path || location.pathname.startsWith(path + "/"));

    if (!path) {
      return (
        <button
          onClick={handleLogout}
          className="hs-item flex items-center gap-3 w-full px-3 py-[10px] rounded-xl border-0 outline-none cursor-pointer text-left"
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
      <button
        onClick={() => {
          navigate(path);
          setOpen(false);
        }}
        className="hs-item flex items-center gap-3 w-full px-3 py-[10px] rounded-xl border-0 outline-none cursor-pointer text-left relative"
        style={{
          background: isActive ? "rgba(201,169,97,0.10)" : "transparent",
        }}
      >
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
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .hs-scroll::-webkit-scrollbar { display: none; }
        .hs-scroll { scrollbar-width: none; }

        /* ── Hamburger toggle – mobile only ─────────────────────────── */
        .hs-toggle {
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
        .hs-toggle:hover { background: #20262f; border-color: rgba(201,169,97,0.36); }
        @media (max-width: 1023px) { .hs-toggle { display: flex; } }

        /* ── Sidebar panel ──────────────────────────────────────────── */
        .hs-panel {
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
          .hs-panel { transform: translateX(-100%); }
          .hs-panel.hs-open { transform: translateX(0); }
        }

        /* ── Nav item hover ─────────────────────────────────────────── */
        .hs-item { transition: background 0.15s; }
        .hs-item:hover { background: rgba(255,255,255,0.042) !important; }

        /* ── FAB ────────────────────────────────────────────────────── */
        @keyframes hsFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes hsRing {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,169,97,0.42), 0 6px 20px rgba(0,0,0,0.34); }
          60%      { box-shadow: 0 0 0 9px rgba(201,169,97,0),  0 6px 20px rgba(0,0,0,0.34); }
        }
        .hs-fab { animation: hsFloat 3.2s ease-in-out infinite, hsRing 3s ease-out infinite; }
        .hs-fab:hover {
          animation: none !important;
          transform: scale(1.1) rotate(90deg) !important;
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1) !important;
        }

        /* ── Action rows ────────────────────────────────────────────── */
        .hs-row { transition: background 0.15s, transform 0.15s, border-color 0.15s; }
        .hs-row:hover { background: rgba(201,169,97,0.07) !important; transform: translateX(3px); border-color: rgba(201,169,97,0.20) !important; }
        .hs-row:hover .hs-arr { opacity:1 !important; transform: translateX(0) !important; }
        .hs-arr { opacity:0; transform: translateX(-4px); transition: opacity 0.14s, transform 0.14s; }

        @keyframes hsFade { from { opacity:0; } to { opacity:1; } }
        @keyframes hsRowIn {
          from { opacity:0; transform: translateY(7px); }
          to   { opacity:1; transform: none; }
        }
        .hs-ri { opacity:0; }
        .hs-ri:nth-child(1) { animation: hsRowIn 0.22s 0.06s ease forwards; }
        .hs-ri:nth-child(2) { animation: hsRowIn 0.22s 0.12s ease forwards; }
        .hs-ri:nth-child(3) { animation: hsRowIn 0.22s 0.18s ease forwards; }

        .hs-xbtn { transition: background 0.13s, transform 0.17s; }
        .hs-xbtn:hover { background: rgba(255,255,255,0.10) !important; transform: rotate(90deg); }

        .hs-section-label {
          padding: 14px 12px 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(201,169,97,0.28);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      {/* ── Hamburger: mobile only ── */}
      <button
        className="hs-toggle"
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
      <AnimatePresence>
        {open && (
          <motion.div
            key="hs-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 z-[1100]"
            style={{
              background: "rgba(0,0,0,0.58)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          SIDEBAR — no X inside, hamburger outside handles close
      ══════════════════════════════════════════════════════════ */}
      <aside ref={sidebarRef} className={`hs-panel ${open ? "hs-open" : ""}`}>
        {/* ── Logo header — logo+name pushed to the RIGHT end ── */}
        <div
          style={{
            flexShrink: 0,
            padding: "18px 16px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.055)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => {
              navigate("/hirer/dashboard");
              setOpen(false);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              border: 0,
              outline: "none",
              cursor: "pointer",
              background: "transparent",
              padding: 0,
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
              Hirer Mode
            </p>
          </button>
        </div>
        {/* ── Main nav ── */}
        <nav
          className="hs-scroll flex-1 overflow-y-auto"
          style={{ padding: "8px 8px 0" }}
        >
          <p className="hs-section-label">Menu</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </div>
        </nav>

        {/* ── Bottom — flex-shrink-0 prevents clipping ── */}
        <div
          style={{
            flexShrink: 0,
            padding: "8px 8px 16px",
            borderTop: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <p className="hs-section-label" style={{ paddingTop: 8 }}>
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
      <button
        onClick={() => setFabOpen(true)}
        className="hs-fab fixed z-[1400] flex items-center justify-center rounded-full cursor-pointer border-0 outline-none"
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

      {/* ── Quick Actions Modal ── */}
      <AnimatePresence>
        {fabOpen && (
          <motion.div
            key="hs-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setFabOpen(false)}
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
            }}
          >
            <motion.div
              key="hs-card"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 356,
                margin: "0 12px",
                borderRadius: 20,
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
                className="hs-xbtn"
                onClick={() => setFabOpen(false)}
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
                  Hirer Tools
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
                What would you like to do?
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {QUICK_ACTIONS.map(({ icon: Icon, label, desc, path, tag }) => (
                  <button
                    key={label}
                    className="hs-ri hs-row"
                    onClick={() => {
                      setFabOpen(false);
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
                        className="hs-arr"
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
                Tap outside or press{" "}
                <span style={{ color: "#3e5260" }}>Esc</span> to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
