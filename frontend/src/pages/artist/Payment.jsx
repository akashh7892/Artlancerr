import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";

const MOCK_PAYMENTS = [
  {
    id: "1",
    projectName: "Cinematic Short Film",
    hirerName: "Paramount Studios",
    amount: 5000,
    status: "in_escrow",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    milestone: "Principal Photography Completed",
    description: "Payment for cinematography services - 5 day shoot",
  },
  {
    id: "2",
    projectName: "Documentary Series",
    hirerName: "Netflix Originals",
    amount: 8500,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    milestone: "Initial Consultation",
    description: "50% upfront payment for documentary project",
  },
  {
    id: "3",
    projectName: "Brand Commercial",
    hirerName: "Nike Productions",
    amount: 3000,
    status: "released",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    milestone: "Final Delivery",
    description: "Final payment for commercial cinematography",
  },
];

const STATUS_STYLES = {
  pending: {
    bg: "rgba(234,179,8,0.10)",
    border: "rgba(234,179,8,0.20)",
    color: "#eab308",
  },
  in_escrow: {
    bg: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.20)",
    color: "#3b82f6",
  },
  released: {
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.20)",
    color: "#22c55e",
  },
  disputed: {
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.20)",
    color: "#ef4444",
  },
};

function StatusIcon({ status }) {
  const props = { size: 13, strokeWidth: 2 };
  if (status === "pending") return <Clock {...props} />;
  if (status === "in_escrow") return <DollarSign {...props} />;
  if (status === "released") return <CheckCircle {...props} />;
  if (status === "disputed") return <AlertCircle {...props} />;
  return <Clock {...props} />;
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const label = status
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[11.5px] font-semibold border"
      style={{ background: s.bg, borderColor: s.border, color: s.color }}
    >
      <StatusIcon status={status} />
      {label}
    </span>
  );
}

function PaymentCard({ payment }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="rounded-2xl p-6 transition-colors"
        style={{
          background: "#2d3139",
          border: "1px solid rgba(201,169,97,0.10)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "rgba(201,169,97,0.30)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "rgba(201,169,97,0.10)")
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title + badge */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3
                className="text-[16px] font-semibold"
                style={{ color: "#c4d5e0" }}
              >
                {payment.projectName}
              </h3>
              <StatusBadge status={payment.status} />
            </div>
            <p className="text-[13px] mb-[2px]" style={{ color: "#5a6e7d" }}>
              Client:{" "}
              <span style={{ color: "#8a9faf" }}>{payment.hirerName}</span>
            </p>
            <p className="text-[13px]" style={{ color: "#5a6e7d" }}>
              {payment.description}
            </p>

            {/* Footer row */}
            <div
              className="flex items-center gap-6 mt-4 pt-4 flex-wrap"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex items-center gap-2 text-[12.5px]"
                style={{ color: "#5a6e7d" }}
              >
                <FileText size={14} />
                <span>Milestone: {payment.milestone}</span>
              </div>
              {payment.releaseDate && (
                <div
                  className="flex items-center gap-2 text-[12.5px]"
                  style={{ color: "#5a6e7d" }}
                >
                  <Clock size={14} />
                  <span>
                    {payment.status === "in_escrow"
                      ? "Release: "
                      : "Released: "}
                    {payment.releaseDate.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Escrow notice */}
            {payment.status === "in_escrow" && (
              <div
                className="mt-4 p-3 rounded-xl text-[12.5px]"
                style={{
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  color: "#60a5fa",
                }}
              >
                💰 Funds are securely held in escrow and will be automatically
                released when the milestone is confirmed
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <p className="text-[22px] font-bold" style={{ color: "#c4d5e0" }}>
              ${payment.amount.toLocaleString()}
            </p>
            <p className="text-[11.5px] mt-1" style={{ color: "#3a4e5e" }}>
              {payment.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WithdrawModal({ open, onClose, maxAmount }) {
  const [amount, setAmount] = useState("");

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[3000] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          backdropFilter: "blur(6px)",
          background: "rgba(10,12,16,0.55)",
        }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-[420px] rounded-2xl p-7"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.34, 1.4, 0.64, 1] }}
          style={{
            background: "#1f2229",
            border: "1px solid rgba(201,169,97,0.18)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#6b7f8f" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
            onClick={onClose}
          >
            <X size={15} strokeWidth={2.2} />
          </button>

          <h2
            className="text-[20px] font-bold mb-1"
            style={{ color: "#c4d5e0" }}
          >
            Withdraw Funds
          </h2>
          <p className="text-[13px] mb-6" style={{ color: "#5a6e7d" }}>
            Transfer your earnings to your bank account
          </p>

          <div className="space-y-4">
            <div>
              <label
                className="block text-[13px] font-semibold mb-2"
                style={{ color: "#8a9faf" }}
              >
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Max: $${maxAmount.toLocaleString()}`}
                className="w-full px-4 py-[11px] rounded-xl text-[13.5px] outline-none transition-colors"
                style={{
                  background: "#2d3139",
                  border: "1px solid rgba(201,169,97,0.25)",
                  color: "#c4d5e0",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(201,169,97,0.55)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(201,169,97,0.25)")
                }
              />
            </div>

            <div>
              <label
                className="block text-[13px] font-semibold mb-2"
                style={{ color: "#8a9faf" }}
              >
                Bank Account
              </label>
              <input
                type="text"
                placeholder="Account ending in ****1234"
                disabled
                className="w-full px-4 py-[11px] rounded-xl text-[13.5px] cursor-not-allowed"
                style={{
                  background: "rgba(45,49,57,0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#3a4e5e",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
            </div>

            <button
              className="w-full py-[12px] rounded-xl text-[14px] font-bold transition-opacity"
              style={{ background: "#c9a961", color: "#1a1d24" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              onClick={onClose}
            >
              Confirm Withdrawal
            </button>

            <p className="text-center text-[12px]" style={{ color: "#3a4e5e" }}>
              Funds will arrive in 2–3 business days
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const TABS = ["all", "pending", "in_escrow", "released"];
const TAB_LABELS = {
  all: "All",
  pending: "Pending",
  in_escrow: "In Escrow",
  released: "Released",
};

export default function ArtistPayments() {
  const navigate = useNavigate();
  const [payments] = useState(MOCK_PAYMENTS);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const totalEarnings = payments
    .filter((p) => p.status === "released")
    .reduce((s, p) => s + p.amount, 0);
  const inEscrow = payments
    .filter((p) => p.status === "in_escrow")
    .reduce((s, p) => s + p.amount, 0);
  const pending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);

  const filteredPayments =
    activeTab === "all"
      ? payments
      : payments.filter((p) => p.status === activeTab);

  const statCards = [
    {
      label: "Total Earnings",
      value: totalEarnings,
      sub: "Available for withdrawal",
      icon: <CheckCircle size={20} color="#22c55e" />,
      delay: 0.1,
    },
    {
      label: "In Escrow",
      value: inEscrow,
      sub: "Held securely",
      icon: <DollarSign size={20} color="#3b82f6" />,
      delay: 0.2,
    },
    {
      label: "Pending",
      value: pending,
      sub: "Awaiting confirmation",
      icon: <Clock size={20} color="#eab308" />,
      delay: 0.3,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .payments-scroll::-webkit-scrollbar { width: 3px; }
        .payments-scroll::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.15); border-radius: 4px; }
        .tab-btn { transition: background 0.15s ease, color 0.15s ease; }
      `}</style>

      <Sidebar />

      <div
        className="lg:ml-[248px] min-h-screen payments-scroll"
        style={{ background: "#1a1d24", color: "#c4d5e0" }}
      >
        {/* ── Header ── */}
        <div
          className="px-8 pt-8 pb-7"
          style={{ borderBottom: "1px solid rgba(201,169,97,0.10)" }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Back + Title */}
            <div className="flex items-center gap-4 mb-7">
              <button
                onClick={() => navigate("/artist/profile")}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "#8a9faf",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                }
              >
                <ArrowLeft size={17} />
              </button>
              <div>
                <h1
                  className="text-[28px] font-bold"
                  style={{ color: "#c4d5e0" }}
                >
                  Payments & Earnings
                </h1>
                <p
                  className="text-[13px] mt-[2px]"
                  style={{ color: "#5a6e7d" }}
                >
                  Manage your payments with escrow protection
                </p>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statCards.map((card) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay, duration: 0.25 }}
                >
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: "#2d3139",
                      border: "1px solid rgba(201,169,97,0.10)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[13px]"
                        style={{ color: "#5a6e7d" }}
                      >
                        {card.label}
                      </span>
                      {card.icon}
                    </div>
                    <p
                      className="text-[28px] font-bold"
                      style={{ color: "#c4d5e0" }}
                    >
                      ${card.value.toLocaleString()}
                    </p>
                    <p
                      className="text-[12px] mt-1"
                      style={{ color: "#3a4e5e" }}
                    >
                      {card.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment History ── */}
        <div className="px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Row: heading + withdraw */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-[18px] font-semibold"
                style={{ color: "#c4d5e0" }}
              >
                Payment History
              </h2>
              <button
                disabled={totalEarnings === 0}
                onClick={() => setWithdrawOpen(true)}
                className="flex items-center gap-2 px-5 py-[10px] rounded-xl text-[13.5px] font-semibold transition-opacity"
                style={{
                  background:
                    totalEarnings > 0 ? "#c9a961" : "rgba(201,169,97,0.25)",
                  color: totalEarnings > 0 ? "#1a1d24" : "#5a6e7d",
                  cursor: totalEarnings === 0 ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) =>
                  totalEarnings > 0 && (e.currentTarget.style.opacity = "0.85")
                }
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Download size={15} strokeWidth={2.2} />
                Withdraw Funds
              </button>
            </div>

            {/* Tabs */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl mb-6"
              style={{
                background: "#2d3139",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className="tab-btn px-4 py-[7px] rounded-lg text-[13px] font-medium"
                  style={{
                    background:
                      activeTab === tab
                        ? "rgba(201,169,97,0.15)"
                        : "transparent",
                    color: activeTab === tab ? "#c9a961" : "#5a6e7d",
                    border:
                      activeTab === tab
                        ? "1px solid rgba(201,169,97,0.20)"
                        : "1px solid transparent",
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-4">
              {filteredPayments.length === 0 ? (
                <div
                  className="rounded-2xl p-10 text-center text-[14px]"
                  style={{ background: "#2d3139", color: "#3a4e5e" }}
                >
                  No payments found.
                </div>
              ) : (
                filteredPayments.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <PaymentCard payment={p} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        maxAmount={totalEarnings}
      />
    </>
  );
}
