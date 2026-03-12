import { useState, useEffect } from "react";
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

  const showFloating = SIDEBAR_PATHS.some((p) =>
    location.pathname.startsWith("/" + p.split("/").slice(1, 3).join("/")),
  );

  // Open modal when route is /artist/plusicon
  useEffect(() => {
    if (location.pathname === "/artist/plusicon") {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [location.pathname]);

  // Close modal → go back to previous page
  const closeModal = () => {
    setModalOpen(false);
    navigate(-1);
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open || modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, modalOpen]);

  const handleLogout = () => {
    // Remove token / user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optional: clear everything
    // localStorage.clear();

    // Redirect to signin page
    navigate("/");

    // Close sidebar if open
    setOpen(false);
  };

  const NavItem = ({ label, icon: Icon, path }) => {
    if (!path) {
      return (
        <button
          className="relative flex items-center gap-3 w-full px-4 py-[11px] rounded-xl text-left transition-all duration-200 cursor-pointer border-0 outline-none"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
          onClick={handleLogout}
        >
          <Icon
            size={19}
            strokeWidth={1.7}
            style={{ color: "#6b7f8f", flexShrink: 0 }}
          />
          <span
            className="text-[15px]"
            style={{
              color: "#8a9faf",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
        className="relative flex items-center gap-3 w-full px-4 py-[11px] rounded-xl text-left transition-all duration-200 cursor-pointer border-0 outline-none no-underline"
        style={({ isActive }) => ({
          background: isActive ? "rgba(201,169,97,0.10)" : "transparent",
          textDecoration: "none",
        })}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                style={{ background: "#c9a961", height: "55%" }}
              />
            )}
            <Icon
              size={19}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{
                color: isActive ? "#c9a961" : "#6b7f8f",
                flexShrink: 0,
                transition: "color 0.2s",
              }}
            />
            <span
              className="text-[15px] tracking-[0.01em]"
              style={{
                color: isActive ? "#c4d5e0" : "#8a9faf",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: isActive ? 600 : 400,
                transition: "color 0.2s",
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes pulse-ring {
          0%  { box-shadow: 0 0 0 0 rgba(201,169,97,0.5), 0 8px 32px rgba(0,0,0,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(201,169,97,0), 0 8px 32px rgba(0,0,0,0.4); }
          100%{ box-shadow: 0 0 0 0 rgba(201,169,97,0),   0 8px 32px rgba(0,0,0,0.4); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes itemIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fab-btn { animation: float 3s ease-in-out infinite, pulse-ring 2.5s ease-out infinite; }
        .fab-btn:hover { animation: none !important; transform: scale(1.13) rotate(90deg) !important; transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }

        .modal-overlay { animation: overlayIn 0.22s ease forwards; }
        .modal-card    { animation: cardIn 0.3s cubic-bezier(0.34,1.4,0.64,1) forwards; }

        .action-item { opacity: 0; }
        .action-item:nth-child(1) { animation: itemIn 0.28s 0.10s ease forwards; }
        .action-item:nth-child(2) { animation: itemIn 0.28s 0.18s ease forwards; }
        .action-item:nth-child(3) { animation: itemIn 0.28s 0.26s ease forwards; }

        .action-row { transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease; }
        .action-row:hover { background: rgba(201,169,97,0.08) !important; transform: translateX(5px); border-color: rgba(201,169,97,0.22) !important; }
        .action-row:hover .action-arrow { opacity: 1 !important; transform: translateX(0) !important; }
        .action-arrow { opacity: 0; transform: translateX(-4px); transition: opacity 0.18s ease, transform 0.18s ease; }

        .close-btn { transition: background 0.15s ease, transform 0.2s ease; }
        .close-btn:hover { background: rgba(255,255,255,0.1) !important; transform: rotate(90deg); }
      `}</style>

      {/* Mobile toggle */}
      <button
        id="sidebar-toggle"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden fixed top-4 left-4 z-[1100] flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
        style={{
          background: "#1f2229",
          border: "1px solid rgba(201,169,97,0.2)",
          color: "#c4d5e0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
        aria-label="Toggle navigation"
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>

      {/* Sidebar backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[999] bg-black/65 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="FlipSidebar"
        className={`fixed top-0 left-0 h-screen z-[1000] flex flex-col w-[248px] transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "#1f2229",
          borderRight: "1px solid rgba(201,169,97,0.10)",
        }}
      >
        {/* Logo */}
        <div
          className="flex-shrink-0 px-5 pt-6 pb-5"
          style={{ borderBottom: "1px solid rgba(201,169,97,0.10)" }}
        >
          <NavLink
            to="/artist/dashboard"
            className="flex items-center gap-3 no-underline"
            onClick={() => setOpen(false)}
          >
            <img
              src="/logo.png"
              alt="flip logo"
              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
              style={{ border: "1.5px solid rgba(201,169,97,0.3)" }}
            />
            <span
              className="text-[22px] leading-none"
              style={{
                color: "#c9a961",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                letterSpacing: "0.01em",
              }}
            >
              Flip
            </span>
          </NavLink>
          <p
            className="mt-[7px] text-[10.5px] font-semibold tracking-[0.18em] uppercase"
            style={{
              color: "rgba(201,169,97,0.5)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              paddingLeft: "48px",
            }}
          >
            Artist Mode
          </p>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 flex flex-col gap-[3px]">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>

        {/* Bottom nav */}
        <div
          className="px-3 pb-5 pt-3 flex flex-col gap-[3px]"
          style={{ borderTop: "1px solid rgba(201,169,97,0.10)" }}
        >
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </aside>

      {/* ── FAB ── */}
      {showFloating && (
        <button
          onClick={() => navigate("/artist/plusicon")}
          className="fab-btn fixed bottom-8 right-8 z-[1200] flex items-center justify-center w-14 h-14 rounded-full cursor-pointer border-0 outline-none"
          style={{
            background:
              "linear-gradient(135deg, #c9a961 0%, #e0c07a 50%, #b8923f 100%)",
            color: "#1f2229",
          }}
          aria-label="Quick Actions"
        >
          <Plus size={26} strokeWidth={2.8} />
        </button>
      )}

      {/* ── Quick Actions Modal Overlay ── */}
      {modalOpen && (
        <div
          className="modal-overlay fixed inset-0 z-[2000] flex items-center justify-center"
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            background: "rgba(10,12,16,0.45)",
          }}
          onClick={closeModal}
        >
          <div
            className="modal-card relative w-[340px] rounded-2xl p-7"
            style={{
              background: "#1f2229",
              border: "1px solid rgba(201,169,97,0.18)",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="close-btn absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full border-0 outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", color: "#6b7f8f" }}
              onClick={closeModal}
            >
              <X size={15} strokeWidth={2.2} />
            </button>

            {/* Header */}
            <div className="mb-1 flex items-center gap-2">
              <Sparkles size={15} style={{ color: "#c9a961" }} />
              <span
                className="text-[11px] font-semibold tracking-[0.16em] uppercase"
                style={{ color: "rgba(201,169,97,0.65)" }}
              >
                Artist Tools
              </span>
            </div>
            <h2
              className="text-[20px] font-bold mb-1"
              style={{ color: "#c4d5e0" }}
            >
              Quick Actions
            </h2>
            <p
              className="text-[13px] mb-6 leading-relaxed"
              style={{ color: "#5a6e7d" }}
            >
              Jump straight to what matters — update your work, find new gigs,
              or check in with clients.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-[10px]">
              {ACTIONS.map(({ label, desc, icon: Icon, path, tag }) => (
                <button
                  key={label}
                  className="action-item action-row flex items-center gap-4 w-full px-4 py-[13px] rounded-xl border-0 outline-none cursor-pointer text-left"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(201,169,97,0.07)",
                  }}
                  onClick={() => {
                    setModalOpen(false);
                    navigate(path);
                  }}
                >
                  {/* Icon box */}
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                    style={{ background: "rgba(201,169,97,0.10)" }}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      style={{ color: "#c9a961" }}
                    />
                  </span>

                  {/* Text */}
                  <span className="flex flex-col flex-1 min-w-0">
                    <span
                      className="text-[14.5px] font-semibold leading-tight"
                      style={{ color: "#c4d5e0" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-[12px] mt-[3px] leading-snug"
                      style={{ color: "#5a6e7d" }}
                    >
                      {desc}
                    </span>
                  </span>

                  {/* Tag + arrow */}
                  <span className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-[10.5px] font-semibold px-2 py-[3px] rounded-full"
                      style={{
                        background: "rgba(201,169,97,0.10)",
                        color: "rgba(201,169,97,0.75)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tag}
                    </span>
                    <ArrowRight
                      size={14}
                      className="action-arrow"
                      style={{ color: "#c9a961" }}
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <p
              className="mt-5 text-center text-[11.5px]"
              style={{ color: "#3a4e5e" }}
            >
              Press{" "}
              <span className="font-semibold" style={{ color: "#5a6e7d" }}>
                Esc
              </span>{" "}
              or click outside to dismiss
            </p>
          </div>
        </div>
      )}
    </>
  );
}
