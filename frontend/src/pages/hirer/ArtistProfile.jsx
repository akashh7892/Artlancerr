import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  Clock,
  MessageSquare,
  CheckCircle,
  Users,
  Calendar,
  IndianRupee,
  Play,
  Heart,
  Share2,
  ExternalLink,
  Package,
  Camera,
  Lightbulb,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  CalendarDays,
  Award,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// Design Tokens and Constants
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  borderHover: "rgba(201,169,97,0.4)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  goldBg: "rgba(201,169,97,0.10)",
  text: "#ffffff",
  muted: "#9ca3af",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.08)",
  successBorder: "rgba(74,222,128,0.2)",
  danger: "#f87171",
  dangerBg: "rgba(239,68,68,0.10)",
  dangerBorder: "rgba(239,68,68,0.2)",
};

// Full DATA MAPPING AND TRANSFORMATION LOGIC FOR ARTIST PROFILE
const FALLBACK_ARTIST = {
  id: "",
  name: "",
  role: "",
  location: "",
  experience: "",
  rating: null,
  reviewCount: 0,
  profileViews: 0,
  photo: "",
  coverPhoto: "",
  skills: [],
  category: "",
  available: false,
  bio: "",
  projects: 0,
  responseTime: "",
  dailyRate: "",
  weeklyRate: "",
  projectRate: "",
  topRated: false,
  bookedDates: [],
  equipment: [],
  portfolio: [],
  reviews_list: [],
};

const parseBookedDays = (blockedDates = []) => {
  if (!Array.isArray(blockedDates)) return [];
  const days = blockedDates
    .map((d) => {
      const date = new Date(d);
      return Number.isNaN(date.getTime()) ? null : date.getDate();
    })
    .filter((d) => Number.isInteger(d) && d > 0 && d < 32);
  return [...new Set(days)];
};

// Always uses ₹ symbol
const asMoney = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  const s = String(value).trim();
  if (!s) return fallback;
  // Remove any existing $ prefix and replace with ₹
  const clean = s.startsWith("₹")
    ? s.slice(1)
    : s.startsWith("₹")
      ? s.slice(1)
      : s;
  return `₹${clean}`;
};

const mapPortfolioItem = (item) => ({
  title: item?.title || item?.projectName || "Portfolio Work",
  type: item?.category || item?.workType || "Project",
  thumb: item?.thumbnailUrl || item?.mediaUrl || null,
});

const mapEquipmentItem = (item, idx) => ({
  id: item?._id || item?.id || `eq-${idx}`,
  name: item?.name || "Equipment",
  model: item?.model || "",
  category: item?.category || "Other",
  rental: item?.rental || "",
  available: item?.rentalOn !== false,
  img: item?.img || null,
});

const mapArtistProfile = (apiArtist, fallback = FALLBACK_ARTIST) => {
  const blockedDates = apiArtist?.availability?.blockedDates || [];
  const freeDates = apiArtist?.availability?.freeDates || [];
  const profileViews = Number(apiArtist?.profileViews || 0);
  const backendReviews = Array.isArray(apiArtist?.reviews)
    ? apiArtist.reviews
    : [];
  const reviewCount = backendReviews.length;
  const avgRating =
    reviewCount > 0
      ? Number(
          (
            backendReviews.reduce((sum, r) => sum + Number(r?.rating || 0), 0) /
            reviewCount
          ).toFixed(1),
        )
      : null;
  const dailyRate = asMoney(apiArtist?.rates?.daily, fallback.dailyRate || "");
  const weeklyRate = asMoney(
    apiArtist?.rates?.weekly,
    fallback.weeklyRate || "",
  );

  return {
    ...fallback,
    id: apiArtist?._id || fallback.id,
    _id: apiArtist?._id || fallback._id,
    name: apiArtist?.name || fallback.name,
    role: apiArtist?.artCategory || fallback.role,
    location: apiArtist?.location || fallback.location,
    experience: apiArtist?.experience || fallback.experience,
    photo: apiArtist?.avatar || fallback.photo,
    bio: apiArtist?.bio || fallback.bio,
    skills: [apiArtist?.artCategory || fallback.role].filter(Boolean),
    rating: avgRating,
    reviewCount,
    profileViews,
    projects: Math.max(1, Math.floor(profileViews / 10)),
    available: Array.isArray(freeDates)
      ? freeDates.length > 0
      : fallback.available,
    dailyRate,
    weeklyRate,
    projectRate:
      apiArtist?.rates?.project || fallback.projectRate || "Negotiable",
    bookedDates: parseBookedDays(blockedDates),
    equipment: Array.isArray(apiArtist?.equipment)
      ? apiArtist.equipment.map(mapEquipmentItem)
      : fallback.equipment,
    portfolio: Array.isArray(apiArtist?.portfolio)
      ? apiArtist.portfolio.map(mapPortfolioItem)
      : fallback.portfolio,
    reviews_list: backendReviews,
    topRated: (apiArtist?.profileViews || 0) > 100 || fallback.topRated,
    website: apiArtist?.website || fallback.website,
    instagram: apiArtist?.instagram || fallback.instagram,
    twitter: apiArtist?.twitter || fallback.twitter,
    youtube: apiArtist?.youtube || fallback.youtube,
  };
};

const CAT_ICONS = {
  Camera,
  Lens: Package,
  Lighting: Lightbulb,
  Audio: Package,
  Grip: Package,
  Other: Package,
};
const CAT_COLORS = {
  Camera: "#60a5fa",
  Lens: "#a78bfa",
  Lighting: "#fbbf24",
  Audio: "#34d399",
  Grip: "#f97316",
  Other: C.gold,
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function SectionCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.42 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        padding: "clamp(18px, 3vw, 26px)",
        marginBottom: "22px",
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, children, subtitle }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {Icon && <Icon size={16} color={C.gold} />}
        <h2
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "700",
            color: C.text,
          }}
        >
          {children}
        </h2>
      </div>
      {subtitle && (
        <p
          style={{ margin: "4px 0 0 24px", fontSize: "12.5px", color: C.muted }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        background: C.input,
        border: `1px solid ${C.border}`,
        borderRadius: "10px",
      }}
    >
      <Icon size={14} color={C.gold} />
      <div>
        <div
          style={{
            fontSize: "10px",
            color: C.muted,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: C.text,
            marginTop: "2px",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function RateTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: "9px",
        border: `1px solid ${active ? C.gold : C.border}`,
        background: active ? C.goldBg : "transparent",
        color: active ? C.gold : C.muted,
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}

function PortfolioCard({ item }) {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "11px",
        overflow: "hidden",
        position: "relative",
        aspectRatio: "16/10",
        cursor: "pointer",
        border: `1px solid ${C.border}`,
      }}
    >
      {imgErr ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: C.input,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Play size={22} color={C.muted} />
        </div>
      ) : (
        <img
          src={item.thumb}
          alt={item.title}
          onError={() => setImgErr(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${hovered ? 0.62 : 0.38})`,
          transition: "background 0.3s",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "12px",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            fontWeight: "700",
            color: C.gold,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            marginBottom: "3px",
          }}
        >
          {item.type}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#fff" }}>
          {item.title}
        </span>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: C.gold,
              fontSize: "11px",
            }}
          >
            <ExternalLink size={11} /> View Project
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ReviewCard({ review }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div
      style={{
        padding: "16px",
        background: C.input,
        border: `1px solid ${C.border}`,
        borderRadius: "11px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "11px",
          marginBottom: "10px",
        }}
      >
        {imgErr ? (
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: C.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={16} color={C.muted} />
          </div>
        ) : (
          <img
            src={review.photo}
            alt={review.name}
            onError={() => setImgErr(true)}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: C.text }}>
            {review.name}
          </div>
          <div style={{ fontSize: "11px", color: C.muted }}>{review.date}</div>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < review.rating ? C.gold : "transparent"}
              color={i < review.rating ? C.gold : C.muted}
            />
          ))}
        </div>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: C.muted,
          lineHeight: "1.6",
        }}
      >
        {review.text}
      </p>
    </div>
  );
}

function AvailabilityCalendar({ bookedDates = [] }) {
  const [current, setCurrent] = useState({ year: 2026, month: 1 });
  const bookedSet = new Set(bookedDates);

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => new Date(y, m, 1).getDay();

  const prevMonth = () =>
    setCurrent((c) => {
      const m = c.month === 0 ? 11 : c.month - 1;
      const y = c.month === 0 ? c.year - 1 : c.year;
      return { year: y, month: m };
    });
  const nextMonth = () =>
    setCurrent((c) => {
      const m = c.month === 11 ? 0 : c.month + 1;
      const y = c.month === 11 ? c.year + 1 : c.year;
      return { year: y, month: m };
    });

  const totalDays = daysInMonth(current.year, current.month);
  const startDay = firstDay(current.year, current.month);
  const cells = Array.from({ length: startDay + totalDays }, (_, i) =>
    i < startDay ? null : i - startDay + 1,
  );
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) => {
    const now = new Date();
    return (
      current.year === now.getFullYear() &&
      current.month === now.getMonth() &&
      d === now.getDate()
    );
  };

  const availableCount = totalDays - bookedSet.size;

  return (
    <SectionCard delay={0.2}>
      <SectionTitle
        icon={CalendarDays}
        subtitle="Green = available  ·  Red = booked by another project"
      >
        Availability Calendar
      </SectionTitle>

      {/* Summary chips */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            background: C.successBg,
            border: `1px solid ${C.successBorder}`,
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: C.success,
            }}
          />
          <span
            style={{ fontSize: "12px", fontWeight: "600", color: C.success }}
          >
            {availableCount} days available
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            background: C.dangerBg,
            border: `1px solid ${C.dangerBorder}`,
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: C.danger,
            }}
          />
          <span
            style={{ fontSize: "12px", fontWeight: "600", color: C.danger }}
          >
            {bookedSet.size} days booked
          </span>
        </div>
      </div>

      {/* Nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={prevMonth}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.border}`,
            color: C.text,
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
        >
          <PrevIcon size={13} /> Prev
        </button>
        <span style={{ fontSize: "14px", fontWeight: "700", color: C.text }}>
          {MONTHS[current.month]} {current.year}
        </span>
        <button
          onClick={nextMonth}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.border}`,
            color: C.text,
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
        >
          Next <NextIcon size={13} />
        </button>
      </div>

      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "6px",
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: "600",
              color: C.muted,
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
        }}
      >
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const isBooked = bookedSet.has(day);
          const today = isToday(day);
          return (
            <div
              key={day}
              style={{
                aspectRatio: "1",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "600",
                background: isBooked ? C.dangerBg : C.successBg,
                color: isBooked ? C.danger : C.success,
                border: today
                  ? `2px solid ${C.gold}`
                  : isBooked
                    ? `1px solid ${C.dangerBorder}`
                    : `1px solid ${C.successBorder}`,
                userSelect: "none",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginTop: "14px",
        }}
      >
        {[
          {
            color: "rgba(74,222,128,0.5)",
            border: "rgba(74,222,128,0.5)",
            label: "Available",
          },
          {
            color: "rgba(248,113,113,0.5)",
            border: "rgba(248,113,113,0.4)",
            label: "Booked",
          },
          { color: "transparent", border: C.gold, label: "Today", extra: true },
        ].map(({ color, border, label, extra }) => (
          <span
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11.5px",
              color: C.muted,
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                background: color,
                border: `${extra ? "2px" : "1px"} solid ${border}`,
                flexShrink: 0,
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

// Equipment Section (with rental availability)
function EquipmentSection({ equipment = [] }) {
  const [selectedEquip, setSelectedEquip] = useState(null);

  if (!equipment.length) return null;

  const availableItems = equipment.filter((e) => e.available);

  return (
    <SectionCard delay={0.25}>
      <SectionTitle
        icon={Package}
        subtitle="Equipment available for rent alongside this artist's services"
      >
        Equipment & Gear
      </SectionTitle>

      {/* Available count */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 12px",
          marginBottom: "16px",
          background: C.goldBg,
          border: `1px solid ${C.border}`,
          borderRadius: "20px",
        }}
      >
        <Package size={12} color={C.gold} />
        <span style={{ fontSize: "12px", fontWeight: "600", color: C.gold }}>
          {availableItems.length} of {equipment.length} items available to rent
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "14px",
        }}
      >
        {equipment.map((item) => {
          const CatIcon = CAT_ICONS[item.category] || Package;
          const catColor = CAT_COLORS[item.category] || C.gold;
          const isSelected = selectedEquip === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={
                item.available
                  ? { y: -3, boxShadow: `0 8px 24px rgba(0,0,0,0.3)` }
                  : {}
              }
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                background: C.input,
                border: `1px solid ${isSelected ? C.gold : item.available ? C.border : "rgba(255,255,255,0.04)"}`,
                opacity: item.available ? 1 : 0.45,
                filter: item.available ? "none" : "grayscale(0.5)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Image / Icon */}
              <div
                style={{
                  height: "130px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.025)",
                  overflow: "hidden",
                }}
              >
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <CatIcon
                    size={42}
                    strokeWidth={1.2}
                    style={{
                      color: item.available
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  />
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: "700",
                        color: item.available
                          ? C.text
                          : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "11px",
                        color: item.available
                          ? C.muted
                          : "rgba(139,163,175,0.4)",
                      }}
                    >
                      {item.model}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: item.available
                        ? `${catColor}18`
                        : "rgba(255,255,255,0.04)",
                      color: item.available
                        ? catColor
                        : "rgba(255,255,255,0.2)",
                      border: `1px solid ${item.available ? `${catColor}30` : "rgba(255,255,255,0.06)"}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: "10px", color: C.muted }}>
                      Rental Rate
                    </p>
                    <p
                      style={{
                        margin: "1px 0 0",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: item.available
                          ? C.gold
                          : "rgba(201,169,97,0.35)",
                      }}
                    >
                      {item.rental ? `₹${item.rental}/day` : "—"}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "3px 9px",
                      borderRadius: "20px",
                      background: item.available ? C.successBg : C.dangerBg,
                      border: `1px solid ${item.available ? C.successBorder : C.dangerBorder}`,
                    }}
                  >
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: item.available ? C.success : C.danger,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: item.available ? C.success : C.danger,
                      }}
                    >
                      {item.available ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>

                {/* Add to booking toggle */}
                {item.available && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setSelectedEquip(isSelected ? null : item.id)
                    }
                    style={{
                      width: "100%",
                      padding: "7px",
                      borderRadius: "8px",
                      border: `1px solid ${isSelected ? C.gold : C.border}`,
                      background: isSelected ? C.goldBg : "transparent",
                      color: isSelected ? C.gold : C.muted,
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {isSelected ? "Added to Booking" : "+ Add to Booking"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Booking note */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          background: C.goldBg,
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12.5px",
            color: C.muted,
            lineHeight: "1.5",
          }}
        >
          <span style={{ fontWeight: "700", color: C.gold }}>Note: </span>
          Equipment rates are in addition to the artist's service rate. Selected
          items will be included in your booking request.
        </p>
      </div>
    </SectionCard>
  );
}

// Main page
export default function ArtistProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const initialArtist = useMemo(
    () => ({ ...FALLBACK_ARTIST, ...(state?.artist || {}) }),
    [state],
  );
  const [artist, setArtist] = useState(initialArtist);
  const [loadingProfile, setLoadingProfile] = useState(Boolean(id));
  const [profileError, setProfileError] = useState("");

  const [activeRate, setActiveRate] = useState("Daily Rate");
  const [saved, setSaved] = useState(false);
  const [coverErr, setCoverErr] = useState(false);
  const [photoErr, setPhotoErr] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!id) {
        setLoadingProfile(false);
        return;
      }
      try {
        setLoadingProfile(true);
        setProfileError("");
        const data = await hirerAPI.getArtistProfile(id);
        if (mounted) {
          setArtist(mapArtistProfile(data, initialArtist));
        }
      } catch (error) {
        if (mounted) {
          setProfileError(error.message || "Could not load artist profile");
        }
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [id, initialArtist]);

  useEffect(() => {
    setCoverErr(false);
    setPhotoErr(false);
  }, [artist.photo, artist.coverPhoto]);

  const rateValue = {
    "Daily Rate": artist.dailyRate || "—",
    "Weekly Rate": artist.weeklyRate || "—",
    "Project Rate": artist.projectRate || "Negotiable",
  }[activeRate];

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: C.bg,
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      <HirerSidebar />

      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto">
          <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
            {/* Cover image */}
            <div
              style={{
                position: "relative",
                height: "clamp(160px, 26vw, 280px)",
                overflow: "hidden",
              }}
            >
              {coverErr || !artist.coverPhoto ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, #1a1d24, ${C.card})`,
                  }}
                />
              ) : (
                <img
                  src={artist.coverPhoto}
                  alt="cover"
                  onError={() => setCoverErr(true)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(26,29,36,0.25) 0%, rgba(26,29,36,0.82) 100%)",
                }}
              />

              {/* Back button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/hirer/browse-artists")}
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  padding: "9px",
                  background: "rgba(26,29,36,0.8)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${C.border}`,
                  borderRadius: "9px",
                  color: C.text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ArrowLeft size={17} />
              </motion.button>

              {/* Top-right actions */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  display: "flex",
                  gap: "8px",
                }}
              >
                {[
                  {
                    icon: Heart,
                    onClick: () => setSaved(!saved),
                    active: saved,
                    activeColor: "#f87171",
                  },
                  { icon: Share2, onClick: () => {}, active: false },
                ].map(({ icon: Icon, onClick, active, activeColor }, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClick}
                    style={{
                      padding: "9px",
                      background: "rgba(26,29,36,0.8)",
                      backdropFilter: "blur(8px)",
                      border: `1px solid ${active ? "rgba(239,68,68,0.4)" : C.border}`,
                      borderRadius: "9px",
                      color: active ? activeColor : C.text,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon
                      size={16}
                      fill={active ? activeColor : "transparent"}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div
              style={{
                maxWidth: "960px",
                margin: "0 auto",
                padding: "0 clamp(14px, 3vw, 30px) 48px",
              }}
            >
              {loadingProfile && (
                <div
                  style={{
                    marginTop: "14px",
                    marginBottom: "12px",
                    color: C.muted,
                    fontSize: "13px",
                  }}
                >
                  Loading latest artist profile...
                </div>
              )}
              {profileError && (
                <div
                  style={{
                    marginTop: "14px",
                    marginBottom: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(239,68,68,0.25)",
                    background: "rgba(239,68,68,0.08)",
                    color: "#fca5a5",
                    fontSize: "13px",
                  }}
                >
                  {profileError}
                </div>
              )}

              {/* Hero card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "16px",
                  padding: "clamp(18px, 3vw, 28px)",
                  marginTop: "-56px",
                  position: "relative",
                  marginBottom: "22px",
                }}
              >
                {/* Avatar + name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    {photoErr ? (
                      <div
                        style={{
                          width: "76px",
                          height: "76px",
                          borderRadius: "50%",
                          background: C.input,
                          border: `3px solid ${C.card}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Users size={30} color={C.muted} />
                      </div>
                    ) : (
                      <img
                        src={artist.photo}
                        alt={artist.name}
                        onError={() => setPhotoErr(true)}
                        style={{
                          width: "76px",
                          height: "76px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `3px solid ${C.card}`,
                        }}
                      />
                    )}
                    {artist.available && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          right: "2px",
                          width: "15px",
                          height: "15px",
                          background: C.success,
                          borderRadius: "50%",
                          border: `2px solid ${C.card}`,
                        }}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: "140px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <h1
                        style={{
                          margin: 0,
                          fontSize: "clamp(18px, 3vw, 24px)",
                          fontWeight: "700",
                          color: C.text,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {artist.name}
                      </h1>
                      {artist.topRated && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 9px",
                            background: C.goldBg,
                            border: `1px solid ${C.border}`,
                            borderRadius: "20px",
                            fontSize: "10px",
                            fontWeight: "700",
                            color: C.gold,
                          }}
                        >
                          <CheckCircle size={10} /> Top Rated
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        color: C.gold,
                        fontSize: "14px",
                        fontWeight: "600",
                        margin: "3px 0 5px",
                      }}
                    >
                      {artist.role}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: C.muted,
                        fontSize: "13px",
                        lineHeight: "1.5",
                        maxWidth: "500px",
                      }}
                    >
                      {artist.bio}
                    </p>
                  </div>

                  <span
                    style={{
                      padding: "7px 16px",
                      background: artist.available
                        ? C.successBg
                        : "rgba(156,163,175,0.1)",
                      color: artist.available ? C.success : C.muted,
                      border: `1px solid ${artist.available ? C.successBorder : "rgba(156,163,175,0.2)"}`,
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700",
                      alignSelf: "flex-start",
                    }}
                  >
                    {artist.available ? "Available now" : "Currently Busy"}
                  </span>
                </div>

                {/* Skills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "7px",
                    marginBottom: "16px",
                  }}
                >
                  {artist.skills.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "4px 12px",
                        background: C.input,
                        border: `1px solid ${C.border}`,
                        borderRadius: "7px",
                        color: C.text,
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  {[
                    {
                      icon: Star,
                      text: artist.rating
                        ? `${artist.rating} (${artist.reviewCount} reviews)`
                        : `${artist.profileViews} profile views`,
                      gold: true,
                    },
                    { icon: Briefcase, text: `${artist.projects} projects` },
                    { icon: Clock, text: artist.responseTime },
                    { icon: MapPin, text: artist.location },
                  ].map(({ icon: Icon, text, gold }, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "13px",
                        color: C.muted,
                      }}
                    >
                      <Icon
                        size={13}
                        color={gold ? C.gold : C.muted}
                        fill={gold ? C.gold : "transparent"}
                      />
                      <span
                        style={gold ? { color: C.text, fontWeight: "600" } : {}}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rates + CTAs */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: "16px",
                    borderTop: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}
                  >
                    {["Daily Rate", "Weekly Rate", "Project Rate"].map((r) => (
                      <RateTab
                        key={r}
                        label={r}
                        active={activeRate === r}
                        onClick={() => setActiveRate(r)}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: C.gold,
                      }}
                    >
                      {rateValue}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        navigate("/hirer/messages", { state: { artist } })
                      }
                      style={{
                        padding: "9px 16px",
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: "9px",
                        color: C.text,
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = C.gold)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = C.border)
                      }
                    >
                      <MessageSquare size={14} /> Message
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.03,
                        boxShadow: `0 4px 20px rgba(201,169,97,0.28)`,
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/hirer/bookings")}
                      style={{
                        padding: "9px 20px",
                        background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
                        border: "none",
                        borderRadius: "9px",
                        color: "#1a1d24",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Calendar size={14} /> Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Stat pills */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "10px",
                  marginBottom: "22px",
                }}
              >
                <StatPill
                  icon={Star}
                  label="Rating"
                  value={artist.rating ? `${artist.rating} / 5.0` : "N/A"}
                />
                <StatPill
                  icon={Briefcase}
                  label="Projects Done"
                  value={`${artist.projects}+`}
                />
                <StatPill
                  icon={Users}
                  label="Experience"
                  value={artist.experience || "—"}
                />
                <StatPill
                  icon={Clock}
                  label="Response Time"
                  value={artist.responseTime || "—"}
                />
                <StatPill
                  icon={IndianRupee}
                  label="Daily Rate"
                  value={artist.dailyRate || "—"}
                />
              </motion.div>

              {/* Portfolio */}
              <SectionCard delay={0.14}>
                <SectionTitle>Portfolio</SectionTitle>
                {(artist.portfolio || []).length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {(artist.portfolio || []).map((item, i) => (
                      <PortfolioCard key={i} item={item} />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: `1px solid ${C.border}`,
                      color: C.muted,
                      fontSize: "13px",
                      background: C.input,
                    }}
                  >
                    No portfolio items published yet.
                  </div>
                )}
              </SectionCard>

              <AvailabilityCalendar bookedDates={artist.bookedDates || []} />
              <EquipmentSection equipment={artist.equipment || []} />

              {/* Reviews */}
              <SectionCard delay={0.3}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "700",
                      color: C.text,
                    }}
                  >
                    Reviews
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "3px 10px",
                      background: C.goldBg,
                      border: `1px solid ${C.border}`,
                      borderRadius: "20px",
                    }}
                  >
                    <Star size={11} fill={C.gold} color={C.gold} />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: C.gold,
                      }}
                    >
                      {artist.rating ?? "N/A"}
                    </span>
                    <span style={{ fontSize: "11px", color: C.muted }}>
                      {artist.reviewCount} reviews
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {(artist.reviews_list || []).length > 0 ? (
                    (artist.reviews_list || []).map((r, i) => (
                      <ReviewCard key={i} review={r} />
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        border: `1px solid ${C.border}`,
                        color: C.muted,
                        fontSize: "13px",
                        background: C.input,
                      }}
                    >
                      No verified reviews available yet.
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Sticky bottom bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                style={{
                  position: "sticky",
                  bottom: "16px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px",
                  padding: "16px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: "700",
                      color: C.text,
                    }}
                  >
                    {artist.name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "12px",
                      color: C.muted,
                    }}
                  >
                    {artist.available
                      ? "Available for projects"
                      : "Currently unavailable"}
                    {artist.dailyRate
                      ? ` · ₹${artist.dailyRate.toString().replace("$", "")}/day`
                      : ""}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <motion.button
                    whileHover={{ borderColor: C.gold, color: C.gold }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      navigate("/hirer/messages", { state: { artist } })
                    }
                    style={{
                      padding: "10px 18px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: "9px",
                      color: C.text,
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                  >
                    <MessageSquare size={14} /> Message
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 4px 20px rgba(201,169,97,0.3)`,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/hirer/bookings")}
                    style={{
                      padding: "10px 22px",
                      background: `linear-gradient(135deg, ${C.gold}, #a8863d)`,
                      border: "none",
                      borderRadius: "9px",
                      color: "#1a1d24",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Calendar size={14} /> Book Now
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.2); border-radius: 3px; }
      `}</style>
    </div>
  );
}
