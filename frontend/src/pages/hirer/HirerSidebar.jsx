import { useNavigate, useLocation } from "react-router";
import {
  Film,
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/hirer/dashboard" },
  {
    icon: FileText,
    label: "Post Requirement",
    path: "/hirer/post-requirement",
  },
  { icon: Users, label: "Browse Artists", path: "/hirer/browse-artists" },
  { icon: Calendar, label: "Bookings", path: "/hirer/bookings" },
  { icon: MessageSquare, label: "Messages", path: "/hirer/messages" },
  { icon: CreditCard, label: "Payments", path: "/hirer/payments" },
  { icon: Megaphone, label: "Promotions", path: "/hirer/promotions" },
];

export default function HirerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fabDialogOpen, setFabDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const quickActions = [
    {
      icon: FileText,
      label: "Post New Requirement",
      description: "Create a new job posting",
      action: () => {
        setFabDialogOpen(false);
        navigate("/hirer/post-requirement");
      },
    },
    {
      icon: Users,
      label: "Browse Artists",
      description: "Find talented artists",
      action: () => {
        setFabDialogOpen(false);
        navigate("/hirer/browse-artists");
      },
    },
    {
      icon: Megaphone,
      label: "Create Promotion",
      description: "Launch a new campaign",
      action: () => {
        setFabDialogOpen(false);
        navigate("/hirer/promotions");
      },
    },
  ];

  return (
    <>
      {/* Fixed Sidebar for Desktop */}
      <aside
        className="hidden lg:flex w-72 flex-col fixed left-0 top-0 h-screen"
        style={{
          backgroundColor: "#2d3139",
          borderRight: "1px solid rgba(201, 169, 97, 0.1)",
        }}
      >
        {/* Logo */}
        <div
          className="p-6"
          style={{ borderBottom: "1px solid rgba(201, 169, 97, 0.1)" }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Artlancing"
              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
              style={{ border: "1.5px solid rgba(201,169,97,0.3)" }}
            />
            <span
              className="text-lg font-semibold"
              style={{ color: "#ffffff" }}
            >
              Szylo
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
            Hirer Mode
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isActive
                    ? "rgba(201, 169, 97, 0.15)"
                    : "transparent",
                  color: "#ffffff",
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? "#c9a961" : "#9ca3af" }}
                />
                <span style={{ color: isActive ? "#ffffff" : "#9ca3af" }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div
          className="p-4 space-y-1"
          style={{ borderTop: "1px solid rgba(201, 169, 97, 0.1)" }}
        >
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-opacity-10"
            style={{ color: "#9ca3af" }}
            onClick={() => navigate("/hirer/settings")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(201, 169, 97, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
            style={{ color: "#9ca3af" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(201, 169, 97, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <header>
        {/* Floating Hamburger Menu Button – Mobile & Tablet only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
      fixed top-4 left-4 z-50 p-2 rounded-lg transition-colors
      block lg:hidden
    "
          style={{ color: "#ffffff" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(201, 169, 97, 0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile/Tablet Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 flex flex-col z-50 lg:hidden"
              style={{
                backgroundColor: "#2d3139",
                borderRight: "1px solid rgba(201, 169, 97, 0.1)",
              }}
            >
              {/* Logo & Close Button */}
              <div
                className="p-6 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(201, 169, 97, 0.1)" }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Film className="w-6 h-6" style={{ color: "#c9a961" }} />
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      Artlancing
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                    Hirer Mode
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "#ffffff" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(201, 169, 97, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/");

                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 4 }}
                      onClick={() => handleNavigation(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(201, 169, 97, 0.15)"
                          : "transparent",
                        color: "#ffffff",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: isActive ? "#c9a961" : "#9ca3af" }}
                      />
                      <span style={{ color: isActive ? "#ffffff" : "#9ca3af" }}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Bottom actions */}
              <div
                className="p-4 space-y-1"
                style={{ borderTop: "1px solid rgba(201, 169, 97, 0.1)" }}
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ color: "#9ca3af" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(201, 169, 97, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ color: "#9ca3af" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(201, 169, 97, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setFabDialogOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-30 transition-shadow hover:shadow-xl"
        style={{
          backgroundColor: "#c9a961",
          color: "#1a1d24",
        }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Quick Actions Modal */}
      <AnimatePresence>
        {fabDialogOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFabDialogOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md mx-4 rounded-lg shadow-xl p-6"
                style={{
                  backgroundColor: "#2d3139",
                  border: "1px solid rgba(201, 169, 97, 0.2)",
                }}
              >
                <div className="mb-4">
                  <h2 className="text-xl mb-2" style={{ color: "#ffffff" }}>
                    Quick Actions
                  </h2>
                  <p style={{ color: "#9ca3af" }}>What would you like to do?</p>
                </div>

                <div className="space-y-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ x: 4 }}
                        onClick={action.action}
                        className="w-full flex items-start gap-4 p-4 rounded-lg transition-all duration-200 text-left"
                        style={{ backgroundColor: "#1a1d24" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "rgba(201, 169, 97, 0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#1a1d24")
                        }
                      >
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "rgba(201, 169, 97, 0.1)" }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: "#c9a961" }}
                          />
                        </div>
                        <div>
                          <h3
                            className="font-medium mb-1"
                            style={{ color: "#ffffff" }}
                          >
                            {action.label}
                          </h3>
                          <p className="text-sm" style={{ color: "#9ca3af" }}>
                            {action.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
