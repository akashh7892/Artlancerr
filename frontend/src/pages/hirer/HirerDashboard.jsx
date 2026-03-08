import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  IndianRupee,
  Briefcase,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  ArrowRight,
  Eye,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// Simple Card Component
const Card = ({ children, className = "", style = {} }) => (
  <div className={`rounded-lg ${className}`} style={style}>
    {children}
  </div>
);

// Simple Badge Component
const Badge = ({ children, className = "", style = {} }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    style={style}
  >
    {children}
  </span>
);

// Simple Progress Component
const Progress = ({ value, className = "" }) => (
  <div
    className={`w-full bg-gray-700 rounded-full overflow-hidden ${className}`}
  >
    <div
      className="h-full rounded-full transition-all duration-300"
      style={{
        width: `${value}%`,
        backgroundColor: "#c9a961",
      }}
    />
  </div>
);

// Simple Button Component
const Button = ({
  children,
  onClick,
  size = "default",
  variant = "default",
  className = "",
  style = {},
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-medium transition-all duration-200 ${sizeClasses[size]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

// Simple Image with Fallback
const ImageWithFallback = ({ src, alt, className = "" }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-gray-700 flex items-center justify-center ${className}`}
      >
        <Users className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default function HirerDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
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
  const [selectedTask, setSelectedTask] = useState(null);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);

  useEffect(() => {
    let m = true;
    hirerAPI
      .getDashboard()
      .then((res) => {
        if (!m) return;
        const rawTasks = Array.isArray(res?.tasks) ? res.tasks : [];
        const rawProjects = Array.isArray(res?.opportunities)
          ? res.opportunities
          : [];
        setStats((prev) => ({ ...prev, ...(res?.stats || {}) }));
        setTasks(
          rawTasks.map((t) => ({
            id: t._id,
            projectName: t.opportunity?.title || t.title || "Project",
            artistName: t.artist?.name || "Artist",
            artistImage: t.artist?.avatar || "",
            milestone: t.milestone || "Milestone",
            amount: Number(t.amount || 0),
            dueDate: new Date(t.dueDate || t.createdAt),
            status: t.status || "pending",
            progress: Number(t.progress || 0),
            description: t.description || "Task in progress",
          })),
        );
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
            image: "",
          })),
        );
      })
      .catch(() => {
        if (!m) return;
        setTasks([]);
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

  const getTaskStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          text: "#60a5fa",
          border: "rgba(59, 130, 246, 0.2)",
        };
      case "submitted":
        return {
          bg: "rgba(34, 197, 94, 0.1)",
          text: "#4ade80",
          border: "rgba(34, 197, 94, 0.2)",
        };
      case "approved":
        return {
          bg: "rgba(168, 85, 247, 0.1)",
          text: "#c084fc",
          border: "rgba(168, 85, 247, 0.2)",
        };
      case "overdue":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          text: "#f87171",
          border: "rgba(239, 68, 68, 0.2)",
        };
      default:
        return {
          bg: "rgba(156, 163, 175, 0.1)",
          text: "#9ca3af",
          border: "rgba(156, 163, 175, 0.2)",
        };
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "submitted":
        return <AlertCircle className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleReleasePayment = (task) => {
    setSelectedTask(task);
    setReleaseDialogOpen(true);
  };

  const confirmReleasePayment = async () => {
    if (!selectedTask) return;
    try {
      await hirerAPI.releaseTaskPayment(selectedTask.id);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, status: "approved" } : t,
        ),
      );
    } catch (_) {}
    setReleaseDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#1a1d24" }}>
      {loading && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
          <div className="w-10 h-10 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <HirerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto">
          <div
            className="min-h-screen p-8"
            style={{ backgroundColor: "#1a1d24" }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl mb-2" style={{ color: "#ffffff" }}>
                  Dashboard Overview
                </h1>
                <p style={{ color: "#9ca3af" }}>
                  Track your projects and manage payments
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card
                    className="p-6"
                    style={{
                      backgroundColor: "#2d3139",
                      border: "1px solid rgba(201, 169, 97, 0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(201, 169, 97, 0.1)" }}
                      >
                        <Briefcase
                          className="w-5 h-5"
                          style={{ color: "#c9a961" }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "#4ade80" }}>
                        +2
                      </span>
                    </div>
                    <p className="text-2xl mb-1" style={{ color: "#ffffff" }}>
                      {activeProjects}
                    </p>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      Active Projects
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card
                    className="p-6"
                    style={{
                      backgroundColor: "#2d3139",
                      border: "1px solid rgba(201, 169, 97, 0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                      >
                        <Users
                          className="w-5 h-5"
                          style={{ color: "#60a5fa" }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "#4ade80" }}>
                        +5
                      </span>
                    </div>
                    <p className="text-2xl mb-1" style={{ color: "#ffffff" }}>
                      {Number(stats.artistsHired || 0)}
                    </p>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      Artists Hired
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card
                    className="p-6"
                    style={{
                      backgroundColor: "#2d3139",
                      border: "1px solid rgba(201, 169, 97, 0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                      >
                        <IndianRupee
                          className="w-5 h-5"
                          style={{ color: "#4ade80" }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "#9ca3af" }}>
                        Total
                      </span>
                    </div>
                    <p className="text-2xl mb-1" style={{ color: "#ffffff" }}>
                      ₹{totalSpent.toLocaleString()}
                    </p>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      Total Spent
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card
                    className="p-6"
                    style={{
                      backgroundColor: "#2d3139",
                      border: "1px solid rgba(201, 169, 97, 0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(234, 179, 8, 0.1)" }}
                      >
                        <Shield
                          className="w-5 h-5"
                          style={{ color: "#facc15" }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "#9ca3af" }}>
                        Secured
                      </span>
                    </div>
                    <p className="text-2xl mb-1" style={{ color: "#ffffff" }}>
                      ₹{inEscrow.toLocaleString()}
                    </p>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      In Escrow
                    </p>
                  </Card>
                </motion.div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Tracking */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card
                      className="p-6"
                      style={{
                        backgroundColor: "#2d3139",
                        border: "1px solid rgba(201, 169, 97, 0.2)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl" style={{ color: "#ffffff" }}>
                          Task Tracking & Payment Release
                        </h2>
                        <button
                          onClick={() => navigate("/hirer/payments")}
                          className="text-sm flex items-center gap-1 transition-colors"
                          style={{ color: "#c9a961" }}
                        >
                          View All
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {tasks.map((task) => {
                          const statusColors = getTaskStatusColor(task.status);
                          return (
                            <motion.div
                              key={task.id}
                              whileHover={{ scale: 1.01 }}
                              className="p-5 rounded-lg transition-all"
                              style={{
                                backgroundColor: "#1a1d24",
                                border: "1px solid rgba(201, 169, 97, 0.1)",
                              }}
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <ImageWithFallback
                                  src={task.artistImage}
                                  alt={task.artistName}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <div>
                                      <h3 style={{ color: "#ffffff" }}>
                                        {task.projectName}
                                      </h3>
                                      <p
                                        className="text-sm"
                                        style={{ color: "#9ca3af" }}
                                      >
                                        {task.artistName}
                                      </p>
                                    </div>
                                    <Badge
                                      className="flex items-center gap-1"
                                      style={{
                                        backgroundColor: statusColors.bg,
                                        color: statusColors.text,
                                        border: `1px solid ${statusColors.border}`,
                                      }}
                                    >
                                      {getTaskStatusIcon(task.status)}
                                      <span className="ml-1">
                                        {formatStatus(task.status)}
                                      </span>
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span style={{ color: "#9ca3af" }}>
                                    Milestone: {task.milestone}
                                  </span>
                                  <span style={{ color: "#ffffff" }}>
                                    {task.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={task.progress}
                                  className="h-2"
                                />
                              </div>

                              <p
                                className="text-sm mb-4"
                                style={{ color: "#9ca3af" }}
                              >
                                {task.description}
                              </p>

                              <div
                                className="flex items-center justify-between pt-4"
                                style={{
                                  borderTop:
                                    "1px solid rgba(201, 169, 97, 0.1)",
                                }}
                              >
                                <div>
                                  <div
                                    className="flex items-center gap-4 text-sm"
                                    style={{ color: "#9ca3af" }}
                                  >
                                    <span className="flex items-center gap-1">
                                      <IndianRupee className="w-4 h-4" />₹
                                      {task.amount.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      Due {task.dueDate.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                {task.status === "submitted" && (
                                  <Button
                                    onClick={() => handleReleasePayment(task)}
                                    size="sm"
                                    style={{
                                      backgroundColor: "#c9a961",
                                      color: "#1a1d24",
                                    }}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1 inline" />
                                    Release Payment
                                  </Button>
                                )}
                                {task.status === "in_progress" && (
                                  <Button
                                    size="sm"
                                    style={{
                                      border:
                                        "1px solid rgba(201, 169, 97, 0.2)",
                                      color: "#ffffff",
                                      backgroundColor: "transparent",
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-1 inline" />
                                    View Details
                                  </Button>
                                )}
                                {task.status === "overdue" && (
                                  <Button
                                    size="sm"
                                    style={{
                                      border:
                                        "1px solid rgba(239, 68, 68, 0.2)",
                                      color: "#f87171",
                                      backgroundColor: "transparent",
                                    }}
                                  >
                                    <MessageSquare className="w-4 h-4 mr-1 inline" />
                                    Contact Artist
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Active Projects */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card
                      className="p-6"
                      style={{
                        backgroundColor: "#2d3139",
                        border: "1px solid rgba(201, 169, 97, 0.2)",
                      }}
                    >
                      <h3 className="mb-4" style={{ color: "#ffffff" }}>
                        Active Projects
                      </h3>
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="space-y-2">
                            <ImageWithFallback
                              src={project.image}
                              alt={project.title}
                              className="w-full h-32 rounded-lg object-cover"
                            />
                            <h4
                              className="text-sm"
                              style={{ color: "#ffffff" }}
                            >
                              {project.title}
                            </h4>
                            <div
                              className="flex items-center justify-between text-xs"
                              style={{ color: "#9ca3af" }}
                            >
                              <span>{project.artistsHired} artists</span>
                              <span>₹{project.budget.toLocaleString()}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span style={{ color: "#9ca3af" }}>
                                  Progress
                                </span>
                                <span style={{ color: "#ffffff" }}>
                                  {project.completion}%
                                </span>
                              </div>
                              <Progress
                                value={project.completion}
                                className="h-1.5"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => navigate("/hirer/browse-artists")}
                        className="w-full mt-4 py-2 rounded-lg transition-colors text-sm"
                        style={{
                          border: "1px solid rgba(201, 169, 97, 0.2)",
                          color: "#ffffff",
                          backgroundColor: "transparent",
                        }}
                      >
                        View All Projects
                      </button>
                    </Card>
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card
                      className="p-6"
                      style={{
                        backgroundColor: "#2d3139",
                        border: "1px solid rgba(201, 169, 97, 0.2)",
                      }}
                    >
                      <h3 className="mb-4" style={{ color: "#ffffff" }}>
                        This Month
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: "#9ca3af" }}
                          >
                            Requirements Posted
                          </span>
                          <span style={{ color: "#ffffff" }}>
                            {Number(stats.opportunityCount || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: "#9ca3af" }}
                          >
                            Applications Received
                          </span>
                          <span style={{ color: "#ffffff" }}>
                            {Number(stats.applicationCount || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: "#9ca3af" }}
                          >
                            Artists Hired
                          </span>
                          <span style={{ color: "#ffffff" }}>
                            {Number(stats.artistsHired || 0)}
                          </span>
                        </div>
                        <div
                          className="flex items-center justify-between pt-3"
                          style={{
                            borderTop: "1px solid rgba(201, 169, 97, 0.1)",
                          }}
                        >
                          <span
                            className="text-sm"
                            style={{ color: "#9ca3af" }}
                          >
                            Budget Spent
                          </span>
                          <span
                            className="flex items-center gap-1"
                            style={{ color: "#ffffff" }}
                          >
                            <TrendingUp
                              className="w-3 h-3"
                              style={{ color: "#4ade80" }}
                            />
                            ₹{totalSpent.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Release Payment Modal */}
      <AnimatePresence>
        {releaseDialogOpen && selectedTask && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReleaseDialogOpen(false)}
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl" style={{ color: "#ffffff" }}>
                    Release Payment
                  </h2>
                  <button
                    onClick={() => setReleaseDialogOpen(false)}
                    className="p-1 rounded-lg transition-colors"
                    style={{ color: "#9ca3af" }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="mb-4" style={{ color: "#9ca3af" }}>
                  Confirm payment release to the artist
                </p>

                <div className="space-y-4">
                  <div
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{
                      backgroundColor: "#1a1d24",
                      border: "1px solid rgba(201, 169, 97, 0.2)",
                    }}
                  >
                    <ImageWithFallback
                      src={selectedTask.artistImage}
                      alt={selectedTask.artistName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p style={{ color: "#ffffff" }}>
                        {selectedTask.artistName}
                      </p>
                      <p className="text-sm" style={{ color: "#9ca3af" }}>
                        {selectedTask.projectName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#9ca3af" }}>Milestone</span>
                      <span style={{ color: "#ffffff" }}>
                        {selectedTask.milestone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: "#9ca3af" }}>Amount</span>
                      <span className="text-2xl" style={{ color: "#ffffff" }}>
                        ₹{selectedTask.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle
                        className="w-5 h-5 mt-0.5"
                        style={{ color: "#4ade80" }}
                      />
                      <div className="text-sm" style={{ color: "#4ade80" }}>
                        <p className="mb-1">
                          Payment will be released immediately
                        </p>
                        <p className="text-xs opacity-80">
                          The artist will receive the funds within 2-3 business
                          days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setReleaseDialogOpen(false)}
                      className="flex-1"
                      style={{
                        border: "1px solid rgba(201, 169, 97, 0.2)",
                        color: "#ffffff",
                        backgroundColor: "transparent",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmReleasePayment}
                      className="flex-1"
                      style={{
                        backgroundColor: "#c9a961",
                        color: "#1a1d24",
                      }}
                    >
                      Confirm Release
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
