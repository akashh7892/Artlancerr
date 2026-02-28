import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Shield,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";
import RazorpayCheckout from "../../components/payment/RazorpayCheckout";

// ─── Color tokens (matching HirerSettings) ────────────────────────
const C = {
  bg: "#1a1d2a",
  card: "#2d3139",
  cardInner: "#1a1d2a",
  border: "rgba(201, 169, 97, 0.2)",
  borderSubtle: "rgba(201, 169, 97, 0.1)",
  gold: "#c9a96a",
  goldDim: "rgba(201, 169, 97, 0.1)",
  text: "#ffffff",
  muted: "#9ca3af",
  inputBorder: "rgba(255,255,255,0.08)",
  inputBg: "#1a1d2a",
  green: "#4ade80",
  red: "#f87171",
  blue: "#60a5fa",
};

// ─── Reusable primitives (following HirerSettings style) ──────────
const Card = ({ children, className = "", style = {}, hoverable = false }) => (
  <div
    className={`rounded-xl p-6 transition-colors ${className}`}
    style={{
      backgroundColor: C.card,
      border: `1px solid ${C.border}`,
      ...(hoverable ? { transition: "border-color 0.2s" } : {}),
      ...style,
    }}
    onMouseEnter={(e) => {
      if (hoverable) e.currentTarget.style.borderColor = C.gold;
    }}
    onMouseLeave={(e) => {
      if (hoverable) e.currentTarget.style.borderColor = C.border;
    }}
  >
    {children}
  </div>
);

const Badge = ({
  children,
  color = C.gold,
  bgOpacity = 0.1,
  className = "",
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}
    style={{
      backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${bgOpacity})`,
      color: color,
      border: `1px solid ${color}20`,
    }}
  >
    {children}
  </span>
);

const Button = ({
  children,
  variant = "solid",
  size = "md",
  className = "",
  onClick,
  disabled,
}) => {
  const base =
    "rounded-lg font-medium transition-all duration-200 outline-none border-0 cursor-pointer";
  const variants = {
    solid: {
      background: `linear-gradient(135deg, ${C.gold}, #d4b56e)`,
      color: "#1a1d2a",
    },
    outline: {
      background: "transparent",
      border: `1px solid ${C.gold}`,
      color: C.gold,
    },
    ghost: {
      background: "transparent",
      border: `1px solid ${C.border}`,
      color: C.text,
    },
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${className}`}
      style={variants[variant]}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled && variant === "solid")
          e.currentTarget.style.filter = "brightness(1.08)";
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant === "solid") e.currentTarget.style.filter = "";
      }}
    >
      {children}
    </button>
  );
};

const Input = ({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full rounded-lg text-sm outline-none transition-all ${className}`}
    style={{
      backgroundColor: C.inputBg,
      border: `1px solid ${C.inputBorder}`,
      color: C.text,
      padding: "10px 14px",
    }}
    onFocus={(e) => (e.target.style.borderColor = C.gold + "80")}
    onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
  />
);

const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium mb-1.5"
    style={{ color: C.muted }}
  >
    {children}
  </label>
);

const Textarea = ({ id, value, onChange, placeholder, rows = 3 }) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full rounded-lg text-sm outline-none resize-none transition-all"
    style={{
      backgroundColor: C.inputBg,
      border: `1px solid ${C.inputBorder}`,
      color: C.text,
      padding: "10px 14px",
    }}
    onFocus={(e) => (e.target.style.borderColor = C.gold + "80")}
    onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
  />
);

const Select = ({ options, value, onChange, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-lg text-sm appearance-none outline-none transition-all"
      style={{
        backgroundColor: C.inputBg,
        border: `1px solid ${C.inputBorder}`,
        color: C.text,
        padding: "10px 32px 10px 14px",
      }}
      onFocus={(e) => (e.target.style.borderColor = C.gold + "80")}
      onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
    >
      <option value="" disabled hidden style={{ backgroundColor: C.card }}>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          style={{ backgroundColor: C.card }}
        >
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronRight
      size={14}
      className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"
      style={{ color: C.muted }}
    />
  </div>
);

// Simple Modal/Dialog
const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="relative rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-colors"
          style={{ color: C.muted }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = C.goldDim)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────
export default function HirerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [razorpayPayload, setRazorpayPayload] = useState(null);
  const [toast, setToast] = useState(null);
  const [createAmount, setCreateAmount] = useState("");
  const [createProject, setCreateProject] = useState("");
  const [createDescription, setCreateDescription] = useState("");

  useEffect(() => {
    let m = true;
    hirerAPI.getPayments().then((res) => { if (m) setPayments(res.payments || []); }).catch(() => { if (m) setPayments([]); }).finally(() => { if (m) setLoading(false); });
    return () => { m = false; };
  }, []);

  const paymentsList = payments.map((p) => ({
    id: p._id,
    projectName: p.projectName || p.description || "Payment",
    artistName: p.artist?.name || "Artist",
    amount: p.amount,
    status: p.status === "completed" ? "released" : p.status === "pending" || p.status === "processing" ? "in_escrow" : "pending",
    createdAt: p.paidAt ? new Date(p.paidAt) : new Date(p.createdAt),
    releaseDate: p.paidAt ? new Date(p.paidAt) : null,
    milestone: p.description || "—",
    description: p.description || "—",
  }));

  // Stats calculations
  const totalPaid = paymentsList
    .filter((p) => p.status === "released")
    .reduce((sum, p) => sum + p.amount, 0);
  const inEscrow = paymentsList
    .filter((p) => p.status === "in_escrow")
    .reduce((sum, p) => sum + p.amount, 0);
  const pending = paymentsList
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#fbbf24"; // yellow-400
      case "in_escrow":
        return C.blue;
      case "released":
        return C.green;
      case "disputed":
        return C.red;
      default:
        return C.muted;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "in_escrow":
        return <Shield size={14} />;
      case "released":
        return <CheckCircle size={14} />;
      case "disputed":
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredPayments = paymentsList.filter((p) => {
    if (activeTab === "all") return true;
    return p.status === activeTab;
  });

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.bg }}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-10 h-10 border-2 border-[#c9a96a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {razorpayPayload && (
        <RazorpayCheckout
          amount={razorpayPayload.amount}
          artistId={razorpayPayload.artistId}
          description={razorpayPayload.description}
          projectName={razorpayPayload.projectName}
          onSuccess={(payment) => {
            setRazorpayPayload(null);
            if (payment && !payment.error) {
              hirerAPI.getPayments().then((res) => setPayments(res.payments || []));
            }
          }}
          onClose={() => setRazorpayPayload(null)}
        />
      )}
      <HirerSidebar />

      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with back button (mimics HirerSettings header style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-4"
            >
              <button
                onClick={() => window.history.back()} // or use navigate if needed
                className="p-2 rounded-lg transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = C.goldDim)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1
                  className="text-3xl font-bold mb-1"
                  style={{ color: C.text }}
                >
                  Payments & Escrow
                </h1>
                <p style={{ color: C.muted }}>
                  Securely manage payments to artists
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: C.muted }}>
                      Total Paid
                    </span>
                    <CheckCircle size={20} style={{ color: C.green }} />
                  </div>
                  <p
                    className="text-3xl font-semibold"
                    style={{ color: C.text }}
                  >
                    ${totalPaid.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    Successfully completed
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: C.muted }}>
                      In Escrow
                    </span>
                    <Shield size={20} style={{ color: C.blue }} />
                  </div>
                  <p
                    className="text-3xl font-semibold"
                    style={{ color: C.text }}
                  >
                    ${inEscrow.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    Protected funds
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: C.muted }}>
                      Pending
                    </span>
                    <Clock size={20} style={{ color: "#fbbf24" }} />
                  </div>
                  <p
                    className="text-3xl font-semibold"
                    style={{ color: C.text }}
                  >
                    ${pending.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    Awaiting action
                  </p>
                </Card>
              </motion.div>
            </div>

            {/* Payment History Header + Create Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold" style={{ color: C.text }}>
                Payment History
              </h2>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus size={16} className="mr-1 inline" />
                Create Payment
              </Button>
            </div>

            {/* Tabs (manual switcher) */}
            <div
              className="flex gap-1 mb-6 p-1 rounded-lg w-fit"
              style={{
                backgroundColor: C.card,
                border: `1px solid ${C.border}`,
              }}
            >
              {["all", "pending", "in_escrow", "released"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeTab === tab ? C.gold : "transparent",
                    color: activeTab === tab ? "#1a1d2a" : C.muted,
                  }}
                >
                  {tab === "all" ? "All" : formatStatus(tab)}
                </button>
              ))}
            </div>

            {/* Payment List */}
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card hoverable>
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: C.text }}
                            >
                              {payment.projectName}
                            </h3>
                            <Badge color={getStatusColor(payment.status)}>
                              {getStatusIcon(payment.status)}
                              <span>{formatStatus(payment.status)}</span>
                            </Badge>
                          </div>
                          <p
                            className="text-sm mb-1"
                            style={{ color: C.muted }}
                          >
                            Artist: {payment.artistName}
                          </p>
                          <p className="text-sm" style={{ color: C.muted }}>
                            {payment.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-2xl font-semibold"
                            style={{ color: C.text }}
                          >
                            ${payment.amount.toLocaleString()}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: C.muted }}
                          >
                            {payment.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-6 mt-4 pt-4 border-t"
                        style={{ borderColor: C.borderSubtle }}
                      >
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={{ color: C.muted }}
                        >
                          <FileText size={16} />
                          <span>Milestone: {payment.milestone}</span>
                        </div>
                        {payment.releaseDate && (
                          <div
                            className="flex items-center gap-2 text-sm"
                            style={{ color: C.muted }}
                          >
                            <Clock size={16} />
                            <span>
                              {payment.status === "in_escrow"
                                ? `Auto‑release: ${payment.releaseDate.toLocaleDateString()}`
                                : `Released: ${payment.releaseDate.toLocaleDateString()}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {payment.status === "in_escrow" && (
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">
                            Release Payment
                          </Button>
                          <Button variant="ghost" size="sm">
                            Request Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}

              {filteredPayments.length === 0 && (
                <Card>
                  <p className="text-center py-8" style={{ color: C.muted }}>
                    No payments found
                  </p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Payment Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-1" style={{ color: C.text }}>
            Create Escrow Payment
          </h2>
          <p className="text-sm mb-6" style={{ color: C.muted }}>
            Set up a secure payment with milestone‑based release
          </p>

            <div className="space-y-4">
            <div>
              <Label htmlFor="project">Project Name</Label>
              <Input id="project" placeholder="e.g., Brand Commercial Shoot" value={createProject} onChange={(e) => setCreateProject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" placeholder="5000" value={createAmount} onChange={(e) => setCreateAmount(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="milestone">Description</Label>
              <Input id="milestone" placeholder="e.g., Completion of principal photography" value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} />
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: C.blue + "10",
                border: `1px solid ${C.blue}30`,
              }}
            >
              <div className="flex items-start gap-2">
                <Shield size={18} style={{ color: C.blue }} />
                <div className="text-sm" style={{ color: C.blue }}>
                  <p className="font-medium mb-1">Escrow Protection</p>
                  <p className="text-xs opacity-80">
                    Funds will be held securely until the milestone is completed
                    and confirmed.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const amount = Number(createAmount);
                  if (!amount || amount < 1) return;
                  setRazorpayPayload({
                    amount,
                    projectName: createProject || "Payment",
                    description: createDescription || "Payment",
                    artistId: undefined,
                  });
                  setCreateDialogOpen(false);
                  setCreateAmount("");
                  setCreateProject("");
                  setCreateDescription("");
                }}
              >
                Pay with Razorpay
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
