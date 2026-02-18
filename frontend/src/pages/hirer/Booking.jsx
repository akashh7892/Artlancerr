import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  Package,
  Printer,
  Download,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import HirerSidebar from "./HirerSidebar";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  goldBg: "rgba(201,169,97,0.10)",
  text: "#ffffff",
  muted: "#9ca3af",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.10)",
  successBorder: "rgba(74,222,128,0.2)",
  warning: "#facc15",
  warningBg: "rgba(250,204,21,0.10)",
  warningBorder: "rgba(250,204,21,0.2)",
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.10)",
  dangerBorder: "rgba(248,113,113,0.2)",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    id: "1",
    status: "confirmed",
    artist: {
      name: "Sarah Johnson",
      role: "Cinematographer",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop",
      contact: "+1 (555) 123-4567",
    },
    project: {
      title: "Music Video Production",
      description: "3-day music video shoot for emerging artist",
      location: "Downtown LA Studio, 123 Main St",
    },
    dates: { start: "2026-02-22", end: "2026-02-24", duration: "3 days" },
    rates: { artistDaily: 800, days: 3, equipmentTotal: 450 },
    equipment: [
      { name: "Sony FX6", price: 400 },
      { name: "Aputure 600D Pro", price: 150 },
    ],
    crew: [
      {
        name: "Sarah Johnson",
        role: "Cinematographer",
        callTime: "07:00 AM",
        contact: "+1 (555) 123-4567",
      },
      {
        name: "Mike Chen",
        role: "1st AC",
        callTime: "07:00 AM",
        contact: "+1 (555) 234-5678",
      },
      {
        name: "Emma Davis",
        role: "Gaffer",
        callTime: "06:30 AM",
        contact: "+1 (555) 345-6789",
      },
    ],
    paymentMilestones: [
      {
        label: "Deposit (50%)",
        amount: 1625,
        status: "paid",
        date: "2026-02-15",
      },
      {
        label: "Final Payment (50%)",
        amount: 1625,
        status: "pending",
        dueDate: "2026-02-25",
      },
    ],
  },
  {
    id: "2",
    status: "pending",
    artist: {
      name: "Marcus Lee",
      role: "Choreographer",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
      contact: "+1 (555) 987-6543",
    },
    project: {
      title: "Dance Performance",
      description: "Choreography for live theater production",
      location: "Grand Theater, 456 Arts Ave",
    },
    dates: { start: "2026-03-10", end: "2026-03-15", duration: "6 days" },
    rates: { artistDaily: 600, days: 6, equipmentTotal: 0 },
    equipment: [],
    crew: [],
    paymentMilestones: [],
  },
  {
    id: "3",
    status: "past",
    artist: {
      name: "Emma Chen",
      role: "Makeup Artist",
      photo:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&fit=crop",
      contact: "+1 (555) 654-3210",
    },
    project: {
      title: "Brand Commercial Shoot",
      description: "Full day commercial for cosmetics brand",
      location: "Studio B, 789 Film Row",
    },
    dates: { start: "2026-01-10", end: "2026-01-10", duration: "1 day" },
    rates: { artistDaily: 500, days: 1, equipmentTotal: 0 },
    equipment: [],
    crew: [
      {
        name: "Emma Chen",
        role: "Makeup Artist",
        callTime: "05:00 AM",
        contact: "+1 (555) 654-3210",
      },
    ],
    paymentMilestones: [
      {
        label: "Full Payment",
        amount: 500,
        status: "paid",
        date: "2026-01-11",
      },
    ],
  },
];

const calcTotal = (b) =>
  b.rates.artistDaily * b.rates.days + b.rates.equipmentTotal;

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    confirmed: {
      bg: C.successBg,
      color: C.success,
      border: C.successBorder,
      label: "Confirmed",
    },
    pending: {
      bg: C.warningBg,
      color: C.warning,
      border: C.warningBorder,
      label: "Pending",
    },
    past: {
      bg: "rgba(156,163,175,0.1)",
      color: C.muted,
      border: "rgba(156,163,175,0.2)",
      label: "Completed",
    },
    cancelled: {
      bg: C.dangerBg,
      color: C.danger,
      border: C.dangerBorder,
      label: "Cancelled",
    },
  };
  const s = map[status] || map.past;
  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Avatar with fallback ─────────────────────────────────────────────────────
function Avatar({ src, alt, size = 64 }) {
  const [err, setErr] = useState(false);
  return err ? (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.input,
        border: `2px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Users size={size * 0.4} color={C.muted} />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
        border: `2px solid ${C.border}`,
      }}
    />
  );
}

// ─── Call Sheet Modal ─────────────────────────────────────────────────────────
function CallSheetModal({ booking, onClose }) {
  const total = calcTotal(booking);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: "16px",
          width: "100%",
          maxWidth: "760px",
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 26px",
            borderBottom: `1px solid ${C.border}`,
            position: "sticky",
            top: 0,
            background: C.card,
            zIndex: 1,
            borderRadius: "16px 16px 0 0",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "700",
              color: C.text,
            }}
          >
            Call Sheet
          </h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.print()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                color: C.text,
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.border)
              }
            >
              <Printer size={14} /> Print
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => alert("PDF download would be triggered here")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
                border: "none",
                borderRadius: "8px",
                color: "#1a1d24",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              <Download size={14} /> Download PDF
            </motion.button>
            <button
              onClick={onClose}
              style={{
                padding: "8px",
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                color: C.muted,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Call Sheet Body */}
        <div style={{ padding: "26px" }}>
          {/* Title block */}
          <div
            style={{
              textAlign: "center",
              paddingBottom: "22px",
              borderBottom: `1px solid ${C.border}`,
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "3px",
                background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
                margin: "0 auto 16px",
              }}
            />
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "24px",
                fontWeight: "800",
                color: C.text,
                letterSpacing: "0.08em",
              }}
            >
              CALL SHEET
            </h1>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "15px",
                fontWeight: "600",
                color: C.gold,
              }}
            >
              {booking.project.title}
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: C.muted }}>
              Shoot Date: {new Date(booking.dates.start).toLocaleDateString()} –{" "}
              {new Date(booking.dates.end).toLocaleDateString()}
            </p>
          </div>

          {/* Production info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {[
              { label: "Production", value: booking.project.title },
              { label: "Location", value: booking.project.location },
              { label: "Duration", value: booking.dates.duration },
              {
                label: "Director / Producer",
                value: "Your Name · +1 (555) 000-0000",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "14px",
                  background: C.input,
                  border: `1px solid ${C.border}`,
                  borderRadius: "10px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "11px",
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: "600",
                    color: C.text,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Crew */}
          {booking.crew.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: C.text,
                }}
              >
                Crew
              </h2>
              <div
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 120px 1fr",
                    padding: "10px 16px",
                    background: "rgba(255,255,255,0.04)",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {["Name", "Role", "Call Time", "Contact"].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: C.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {booking.crew.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 120px 1fr",
                      padding: "12px 16px",
                      borderBottom:
                        i < booking.crew.length - 1
                          ? `1px solid ${C.border}`
                          : "none",
                      background:
                        i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: C.text,
                      }}
                    >
                      {m.name}
                    </span>
                    <span style={{ fontSize: "13px", color: C.muted }}>
                      {m.role}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: C.gold,
                        fontWeight: "600",
                      }}
                    >
                      {m.callTime}
                    </span>
                    <span style={{ fontSize: "13px", color: C.muted }}>
                      {m.contact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {booking.equipment.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: C.text,
                }}
              >
                Equipment
              </h2>
              <div
                style={{
                  background: C.input,
                  border: `1px solid ${C.border}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {booking.equipment.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderBottom:
                        i < booking.equipment.length - 1
                          ? `1px solid ${C.border}`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Package size={14} color={C.gold} />
                      <span
                        style={{
                          fontSize: "13px",
                          color: C.text,
                          fontWeight: "500",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span style={{ fontSize: "13px", color: C.muted }}>
                      ${item.price}/day
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Schedule */}
          {booking.paymentMilestones.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: C.text,
                }}
              >
                Payment Schedule
              </h2>
              <div
                style={{
                  background: C.input,
                  border: `1px solid ${C.border}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {booking.paymentMilestones.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: C.text,
                        }}
                      >
                        {m.label}
                      </p>
                      <p
                        style={{ margin: 0, fontSize: "11px", color: C.muted }}
                      >
                        {m.status === "paid"
                          ? `✓ Paid ${m.date}`
                          : `Due ${m.dueDate}`}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: C.text,
                        }}
                      >
                        ${m.amount.toLocaleString()}
                      </span>
                      {m.status === "paid" ? (
                        <CheckCircle size={16} color={C.success} />
                      ) : (
                        <Clock size={16} color={C.warning} />
                      )}
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderTop: `2px solid ${C.border}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: C.text,
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: C.gold,
                    }}
                  >
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "15px",
                fontWeight: "700",
                color: C.text,
              }}
            >
              Notes
            </h2>
            <div
              style={{
                padding: "14px 16px",
                background: C.goldBg,
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: C.muted,
                  lineHeight: "1.6",
                }}
              >
                Please arrive 15 minutes before your call time. Parking is
                available on site. Meals will be provided. Any questions,
                contact production.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onViewCallSheet }) {
  const [photoErr, setPhotoErr] = useState(false);
  const total = calcTotal(booking);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        padding: "22px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(201,169,97,0.35)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Artist */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexShrink: 0,
          }}
        >
          {photoErr ? (
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: C.input,
                border: `2px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={28} color={C.muted} />
            </div>
          ) : (
            <img
              src={booking.artist.photo}
              alt={booking.artist.name}
              onError={() => setPhotoErr(true)}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${C.border}`,
                flexShrink: 0,
              }}
            />
          )}
          <div>
            <p
              style={{
                margin: "0 0 2px",
                fontSize: "15px",
                fontWeight: "700",
                color: C.text,
              }}
            >
              {booking.artist.name}
            </p>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "13px",
                color: C.gold,
                fontWeight: "600",
              }}
            >
              {booking.artist.role}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: C.muted }}>
              {booking.artist.contact}
            </p>
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: "240px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 4px",
                  fontSize: "17px",
                  fontWeight: "700",
                  color: C.text,
                }}
              >
                {booking.project.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: C.muted }}>
                {booking.project.description}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* Meta grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {[
              {
                icon: CalendarIcon,
                text: `${new Date(booking.dates.start).toLocaleDateString("en-GB")} - ${new Date(booking.dates.end).toLocaleDateString("en-GB")}`,
              },
              { icon: Clock, text: booking.dates.duration },
              { icon: MapPin, text: booking.project.location },
              {
                icon: DollarSign,
                text: `$${total.toLocaleString()} total`,
                bold: true,
              },
            ].map(({ icon: Icon, text, bold }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                }}
              >
                <Icon size={14} color={C.muted} />
                <span
                  style={{
                    color: bold ? C.text : C.muted,
                    fontWeight: bold ? "700" : "400",
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {booking.status === "confirmed" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onViewCallSheet(booking)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
                  border: "none",
                  borderRadius: "8px",
                  color: "#1a1d24",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                <FileText size={14} /> View Call Sheet
              </motion.button>
            )}
            {booking.status === "pending" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: C.successBg,
                    border: `1px solid ${C.successBorder}`,
                    borderRadius: "8px",
                    color: C.success,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  <CheckCircle size={14} /> Accept
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(248,113,113,0.08)",
                    border: `1px solid rgba(248,113,113,0.2)`,
                    borderRadius: "8px",
                    color: C.danger,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  <XCircle size={14} /> Decline
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ borderColor: C.gold, color: C.gold }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                color: C.text,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "border-color 0.2s, color 0.2s",
              }}
            >
              View Details <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ tab, onBrowse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        textAlign: "center",
        padding: "64px 20px",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
      }}
    >
      <CalendarIcon
        size={48}
        color={C.muted}
        style={{ margin: "0 auto 16px", opacity: 0.5 }}
      />
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "18px",
          fontWeight: "700",
          color: C.text,
        }}
      >
        No {tab} bookings
      </h3>
      <p style={{ margin: "0 0 20px", fontSize: "14px", color: C.muted }}>
        Your {tab} bookings will appear here
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBrowse}
        style={{
          padding: "10px 22px",
          background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
          border: "none",
          borderRadius: "9px",
          color: "#1a1d24",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "700",
        }}
      >
        Browse Artists
      </motion.button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Booking() {
  const navigate = useNavigate();
  const [bookings] = useState(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [callSheetBooking, setCallSheetBooking] = useState(null);

  const TABS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "pending", label: "Pending" },
    { key: "past", label: "Past" },
  ];

  const filtered = bookings.filter((b) => {
    if (activeTab === "upcoming") return b.status === "confirmed";
    if (activeTab === "pending") return b.status === "pending";
    if (activeTab === "past") return b.status === "past";
    return false;
  });

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: C.bg,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <HirerSidebar />

      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto">
          <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
            <div
              style={{
                maxWidth: "960px",
                margin: "0 auto",
                padding: "clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px)",
              }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: "28px" }}
              >
                <h1
                  style={{
                    margin: "0 0 6px",
                    fontSize: "clamp(22px, 3vw, 30px)",
                    fontWeight: "700",
                    color: C.text,
                    letterSpacing: "-0.02em",
                  }}
                >
                  My Bookings
                </h1>
                <p style={{ margin: 0, fontSize: "14px", color: C.muted }}>
                  Manage your artist bookings and call sheets
                </p>
              </motion.div>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  marginBottom: "24px",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: "10px 22px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: activeTab === tab.key ? C.gold : C.muted,
                      position: "relative",
                      transition: "color 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="bookingTab"
                        style={{
                          position: "absolute",
                          bottom: "-1px",
                          left: 0,
                          right: 0,
                          height: "2px",
                          background: C.gold,
                          borderRadius: "2px 2px 0 0",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Booking cards */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {filtered.length === 0 ? (
                  <EmptyState
                    tab={activeTab}
                    onBrowse={() => navigate("/hirer/browse-artists")}
                  />
                ) : (
                  filtered.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <BookingCard
                        booking={b}
                        onViewCallSheet={setCallSheetBooking}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Call Sheet Modal */}
      <AnimatePresence>
        {callSheetBooking && (
          <CallSheetModal
            booking={callSheetBooking}
            onClose={() => setCallSheetBooking(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.2); border-radius: 3px; }
      `}</style>
    </div>
  );
}
