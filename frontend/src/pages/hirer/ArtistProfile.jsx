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
  Instagram,
  Youtube,
  Globe,
  Twitter,
  Mail,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// ─── Design tokens ────────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strips any leading currency symbol and re-prefixes with ₹ */
const asMoney = (value) => {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s) return null;
  const clean = s.replace(/^[₹$£€]/, "");
  return clean ? `₹${clean}` : null;
};

/** Returns day-of-month integers from ISO date strings */
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

/** Maps a raw API artist object to the shape this UI needs.
 *  Returns ONLY real data – no invented placeholders. */
const mapArtistProfile = (api) => {
  if (!api) return null;

  const reviews = Array.isArray(api.reviews) ? api.reviews : [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? Number(
          (
            reviews.reduce((s, r) => s + Number(r?.rating || 0), 0) /
            reviewCount
          ).toFixed(1),
        )
      : null;

  const blockedDates = api?.availability?.blockedDates || [];
  const freeDates = api?.availability?.freeDates || [];

  // Skills: use artCategory + any explicit skills array
  const skills = [
    ...(api.artCategory ? [api.artCategory] : []),
    ...(Array.isArray(api.skills) ? api.skills : []),
  ].filter((v, i, a) => v && a.indexOf(v) === i); // unique non-empty

  // Social links
  const socials = {
    instagram: api.instagram || api.instagramUrl || null,
    youtube: api.youtube || api.youtubeUrl || null,
    website: api.website || api.websiteUrl || null,
    twitter: api.twitter || api.twitterUrl || null,
  };

  return {
    _id: api._id || null,
    name: api.name || null,
    role: api.artCategory || api.role || null,
    location: api.location || null,
    experience: api.experience || null,
    photo: api.avatar || api.profileImage || api.photo || null,
    coverPhoto: api.coverPhoto || api.coverImage || null,
    bio: api.bio || api.about || null,
    skills,
    rating: avgRating,
    reviewCount,
    profileViews: Number(api.profileViews || 0),
    available: Array.isArray(freeDates) ? freeDates.length > 0 : false,
    dailyRate: asMoney(api?.rates?.daily),
    weeklyRate: asMoney(api?.rates?.weekly),
    projectRate: api?.rates?.project || null,
    responseTime: api.responseTime || null,
    topRated: Number(api.profileViews || 0) > 100,
    bookedDates: parseBookedDays(blockedDates),
    equipment: Array.isArray(api.equipment)
      ? api.equipment.map((item, idx) => ({
          id: item?._id || item?.id || `eq-${idx}`,
          name: item?.name || null,
          model: item?.model || null,
          category: item?.category || "Other",
          rental: item?.rental || item?.rentalRate || null,
          available: item?.rentalOn !== false,
          img: item?.img || item?.imageUrl || null,
        }))
      : [],
    portfolio: Array.isArray(api.portfolio)
      ? api.portfolio.map((item) => ({
          title: item?.title || item?.projectName || null,
          type: item?.category || item?.workType || null,
          thumb: item?.thumbnailUrl || item?.mediaUrl || item?.imageUrl || null,
          link: item?.link || item?.url || null,
        }))
      : [],
    reviews_list: reviews,
    email: api.email || null,
    phone: api.phone || null,
    ...socials,
  };
};

// ─── Calendar constants ───────────────────────────────────────────────────────
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

// ─── Reusable UI primitives ───────────────────────────────────────────────────
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
  if (!value) return null;
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

// ─── Portfolio card ───────────────────────────────────────────────────────────
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
      {imgErr || !item.thumb ? (
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
          alt={item.title || "Portfolio"}
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
        {item.type && (
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
        )}
        {item.title && (
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#fff" }}>
            {item.title}
          </span>
        )}
        {hovered && item.link && (
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: C.gold,
              fontSize: "11px",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={11} /> View Project
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const [imgErr, setImgErr] = useState(false);
  const name =
    review.name || review.reviewerName || review.hirer?.name || "Anonymous";
  const photo = review.photo || review.avatar || review.hirer?.avatar || null;
  const date =
    review.date || review.createdAt
      ? new Date(review.date || review.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";
  const text = review.text || review.comment || review.message || "";
  const rating = Number(review.rating || 0);

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
        {photo && !imgErr ? (
          <img
            src={photo}
            alt={name}
            onError={() => setImgErr(true)}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
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
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: C.text }}>
            {name}
          </div>
          {date && (
            <div style={{ fontSize: "11px", color: C.muted }}>{date}</div>
          )}
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < rating ? C.gold : "transparent"}
              color={i < rating ? C.gold : C.muted}
            />
          ))}
        </div>
      </div>
      {text && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: C.muted,
            lineHeight: "1.6",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// ─── Availability calendar ────────────────────────────────────────────────────
function AvailabilityCalendar({ bookedDates = [] }) {
  const now = new Date();
  const [current, setCurrent] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
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

  const isToday = (d) =>
    current.year === now.getFullYear() &&
    current.month === now.getMonth() &&
    d === now.getDate();
  const availableCount = totalDays - bookedSet.size;

  return (
    <SectionCard delay={0.2}>
      <SectionTitle
        icon={CalendarDays}
        subtitle="Green = available  ·  Red = booked by another project"
      >
        Availability Calendar
      </SectionTitle>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: `${availableCount} days available`,
            bg: C.successBg,
            border: C.successBorder,
            dot: C.success,
            color: C.success,
          },
          {
            label: `${bookedSet.size} days booked`,
            bg: C.dangerBg,
            border: C.dangerBorder,
            dot: C.danger,
            color: C.danger,
          },
        ].map(({ label, bg, border, dot, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: dot,
              }}
            />
            <span style={{ fontSize: "12px", fontWeight: "600", color }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        {[
          { label: "← Prev", onClick: prevMonth },
          { label: `${MONTHS[current.month]} ${current.year}`, isTitle: true },
          { label: "Next →", onClick: nextMonth },
        ].map(({ label, onClick, isTitle }) =>
          isTitle ? (
            <span
              key={label}
              style={{ fontSize: "14px", fontWeight: "700", color: C.text }}
            >
              {label}
            </span>
          ) : (
            <button
              key={label}
              onClick={onClick}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.border}`,
                color: C.text,
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {label}
            </button>
          ),
        )}
      </div>

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

// ─── Equipment section ────────────────────────────────────────────────────────
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
        Equipment &amp; Gear
      </SectionTitle>

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
              whileHover={item.available ? { y: -3 } : {}}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                background: C.input,
                border: `1px solid ${isSelected ? C.gold : item.available ? C.border : "rgba(255,255,255,0.04)"}`,
                opacity: item.available ? 1 : 0.45,
                filter: item.available ? "none" : "grayscale(0.5)",
                transition: "border-color 0.2s",
              }}
            >
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
                    style={{ color: "rgba(255,255,255,0.12)" }}
                  />
                )}
              </div>
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
                    {item.name && (
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
                    )}
                    {item.model && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "11px",
                          color: C.muted,
                        }}
                      >
                        {item.model}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: `${catColor}18`,
                      color: catColor,
                      border: `1px solid ${catColor}30`,
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

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  const pulse = { animation: "pulse 1.8s ease-in-out infinite" };
  const shimmer = { background: "rgba(255,255,255,0.06)", borderRadius: "8px" };
  return (
    <div style={{ padding: "clamp(14px,3vw,30px)" }}>
      <div
        style={{
          ...shimmer,
          height: "280px",
          marginBottom: "22px",
          borderRadius: "14px",
          ...pulse,
        }}
      />
      <div
        style={{
          ...shimmer,
          height: "120px",
          marginBottom: "22px",
          borderRadius: "14px",
          ...pulse,
        }}
      />
      <div
        style={{
          ...shimmer,
          height: "300px",
          marginBottom: "22px",
          borderRadius: "14px",
          ...pulse,
        }}
      />
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyField({ message = "Not provided" }) {
  return (
    <span style={{ color: C.muted, fontStyle: "italic", fontSize: "13px" }}>
      {message}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ArtistProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeRate, setActiveRate] = useState("Daily Rate");
  const [saved, setSaved] = useState(false);
  const [coverErr, setCoverErr] = useState(false);
  const [photoErr, setPhotoErr] = useState(false);

  // If navigated with state, use it immediately while API loads
  useEffect(() => {
    if (state?.artist) {
      setArtist(mapArtistProfile(state.artist));
    }
  }, [state]);

  // Always fetch fresh data from API
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError("");
    hirerAPI
      .getArtistProfile(id)
      .then((data) => {
        if (mounted) setArtist(mapArtistProfile(data));
      })
      .catch((err) => {
        if (mounted) setError(err?.message || "Could not load artist profile.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    setCoverErr(false);
    setPhotoErr(false);
  }, [artist?.photo, artist?.coverPhoto]);

  // Rate display – only show tabs that have actual data
  const rateOptions = useMemo(() => {
    if (!artist) return [];
    return [
      artist.dailyRate
        ? { label: "Daily Rate", value: artist.dailyRate }
        : null,
      artist.weeklyRate
        ? { label: "Weekly Rate", value: artist.weeklyRate }
        : null,
      artist.projectRate
        ? { label: "Project Rate", value: artist.projectRate }
        : null,
    ].filter(Boolean);
  }, [artist]);

  const activeRateValue =
    rateOptions.find((r) => r.label === activeRate)?.value ??
    rateOptions[0]?.value ??
    null;

  // Auto-select first available rate tab
  useEffect(() => {
    if (
      rateOptions.length > 0 &&
      !rateOptions.find((r) => r.label === activeRate)
    ) {
      setActiveRate(rateOptions[0].label);
    }
  }, [rateOptions]);

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
              {coverErr || !artist?.coverPhoto ? (
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

              {/* Back */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
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

              {/* Actions */}
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

            {/* Main content */}
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div
                style={{
                  maxWidth: "960px",
                  margin: "0 auto",
                  padding: "clamp(14px,3vw,30px)",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(239,68,68,0.25)",
                    background: "rgba(239,68,68,0.08)",
                    color: "#fca5a5",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              </div>
            ) : !artist ? (
              <div
                style={{
                  maxWidth: "960px",
                  margin: "0 auto",
                  padding: "clamp(14px,3vw,30px)",
                  color: C.muted,
                  fontSize: "14px",
                }}
              >
                Artist not found.
              </div>
            ) : (
              <div
                style={{
                  maxWidth: "960px",
                  margin: "0 auto",
                  padding: "0 clamp(14px, 3vw, 30px) 48px",
                }}
              >
                {/* ── Hero card ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 }}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: "16px",
                    padding: "clamp(18px,3vw,28px)",
                    marginTop: "-56px",
                    position: "relative",
                    marginBottom: "22px",
                  }}
                >
                  {/* Avatar + name row */}
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
                      {photoErr || !artist.photo ? (
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
                          alt={artist.name || "Artist"}
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
                            fontSize: "clamp(18px,3vw,24px)",
                            fontWeight: "700",
                            color: C.text,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {artist.name || (
                            <EmptyField message="Name not provided" />
                          )}
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
                      {artist.role && (
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
                      )}
                      {artist.bio ? (
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
                      ) : (
                        <p
                          style={{
                            margin: 0,
                            color: "rgba(156,163,175,0.4)",
                            fontSize: "13px",
                            fontStyle: "italic",
                          }}
                        >
                          No bio provided.
                        </p>
                      )}
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
                  {artist.skills.length > 0 && (
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
                  )}

                  {/* Meta chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    {artist.rating !== null && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "13px",
                          color: C.text,
                          fontWeight: "600",
                        }}
                      >
                        <Star size={13} color={C.gold} fill={C.gold} />
                        {artist.rating} ({artist.reviewCount}{" "}
                        {artist.reviewCount === 1 ? "review" : "reviews"})
                      </div>
                    )}
                    {artist.experience && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "13px",
                          color: C.muted,
                        }}
                      >
                        <Briefcase size={13} color={C.muted} />{" "}
                        {artist.experience}
                      </div>
                    )}
                    {artist.responseTime && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "13px",
                          color: C.muted,
                        }}
                      >
                        <Clock size={13} color={C.muted} />{" "}
                        {artist.responseTime}
                      </div>
                    )}
                    {artist.location && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "13px",
                          color: C.muted,
                        }}
                      >
                        <MapPin size={13} color={C.muted} /> {artist.location}
                      </div>
                    )}
                  </div>

                  {/* Contact & social links */}
                  {(artist.email ||
                    artist.phone ||
                    artist.instagram ||
                    artist.youtube ||
                    artist.website ||
                    artist.twitter) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "18px",
                      }}
                    >
                      {artist.email && (
                        <a
                          href={`mailto:${artist.email}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            background: C.input,
                            border: `1px solid ${C.border}`,
                            borderRadius: "8px",
                            color: C.muted,
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          <Mail size={12} color={C.gold} /> {artist.email}
                        </a>
                      )}
                      {artist.phone && (
                        <a
                          href={`tel:${artist.phone}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            background: C.input,
                            border: `1px solid ${C.border}`,
                            borderRadius: "8px",
                            color: C.muted,
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          <Phone size={12} color={C.gold} /> {artist.phone}
                        </a>
                      )}
                      {artist.instagram && (
                        <a
                          href={artist.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            background: C.input,
                            border: `1px solid ${C.border}`,
                            borderRadius: "8px",
                            color: "#e1306c",
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          <Instagram size={12} /> Instagram
                        </a>
                      )}
                      {artist.youtube && (
                        <a
                          href={artist.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            background: C.input,
                            border: `1px solid ${C.border}`,
                            borderRadius: "8px",
                            color: "#ff0000",
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          <Youtube size={12} /> YouTube
                        </a>
                      )}
                      {artist.twitter && (
                        <a
                          href={artist.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            background: C.input,
                            border: `1px solid ${C.border}`,
                            borderRadius: "8px",
                            color: "#1da1f2",
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          <Twitter size={12} /> Twitter
                        </a>
                      )}
                      {artist.website && (
                        <a
                          href={artist.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "5px 12px",
                            background: C.input,
                            border: `1px solid ${C.border}`,
                            borderRadius: "8px",
                            color: C.gold,
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          <Globe size={12} /> Website
                        </a>
                      )}
                    </div>
                  )}

                  {/* Rates + CTAs */}
                  {rateOptions.length > 0 && (
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
                        style={{
                          display: "flex",
                          gap: "7px",
                          flexWrap: "wrap",
                        }}
                      >
                        {rateOptions.map((r) => (
                          <RateTab
                            key={r.label}
                            label={r.label}
                            active={activeRate === r.label}
                            onClick={() => setActiveRate(r.label)}
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
                        {activeRateValue && (
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "800",
                              color: C.gold,
                            }}
                          >
                            {activeRateValue}
                          </span>
                        )}
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
                  )}
                </motion.div>

                {/* ── Stat pills ── */}
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
                    value={
                      artist.rating !== null ? `${artist.rating} / 5.0` : null
                    }
                  />
                  <StatPill
                    icon={Users}
                    label="Reviews"
                    value={
                      artist.reviewCount > 0
                        ? `${artist.reviewCount} review${artist.reviewCount !== 1 ? "s" : ""}`
                        : null
                    }
                  />
                  <StatPill
                    icon={Briefcase}
                    label="Experience"
                    value={artist.experience}
                  />
                  <StatPill
                    icon={Clock}
                    label="Response Time"
                    value={artist.responseTime}
                  />
                  <StatPill
                    icon={IndianRupee}
                    label="Daily Rate"
                    value={artist.dailyRate}
                  />
                </motion.div>

                {/* ── Portfolio ── */}
                <SectionCard delay={0.14}>
                  <SectionTitle>Portfolio</SectionTitle>
                  {artist.portfolio.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {artist.portfolio.map((item, i) => (
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

                <AvailabilityCalendar bookedDates={artist.bookedDates} />
                <EquipmentSection equipment={artist.equipment} />

                {/* ── Reviews ── */}
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
                    {artist.rating !== null && (
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
                          {artist.rating}
                        </span>
                        <span style={{ fontSize: "11px", color: C.muted }}>
                          {artist.reviewCount}{" "}
                          {artist.reviewCount === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {artist.reviews_list.length > 0 ? (
                      artist.reviews_list.map((r, i) => (
                        <ReviewCard key={r._id || i} review={r} />
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

                {/* ── Sticky bottom bar ── */}
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
                      {artist.name || "Artist"}
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
                      {artist.dailyRate ? ` · ${artist.dailyRate}/day` : ""}
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
            )}
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
