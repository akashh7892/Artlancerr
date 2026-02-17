import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  Camera,
  DollarSign,
  CalendarDays,
  Package,
  MapPin,
  Briefcase,
  Lightbulb,
  Trash2,
  Plus,
  X,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const C = {
  bg: "#1a1d24",
  card: "#22252e",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#b3a961",
  border: "rgba(179,169,97,0.12)",
  inputBg: "#1a1d24",
  inputBorder: "rgba(255,255,255,0.08)",
};

const TABS = ["Basic Info", "Rates", "Availability", "Equipment"];

function Input({ label, value, onChange, icon: Icon, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label
          className="text-[12.5px] font-medium"
          style={{ color: C.lightText }}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <span className="absolute left-3">
            <Icon size={14} style={{ color: C.lightText }} />
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl text-[13.5px] outline-none transition-all"
          style={{
            background: C.inputBg,
            border: `1px solid ${C.inputBorder}`,
            color: C.darkText,
            padding: Icon ? "10px 14px 10px 34px" : "10px 14px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(179,169,97,0.45)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = C.inputBorder;
          }}
        />
      </div>
      {hint && (
        <p className="text-[11px]" style={{ color: "rgba(139,163,144,0.6)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function SaveBtn({ label = "Save Profile", onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-[13px] rounded-xl text-[14px] font-bold border-0 outline-none cursor-pointer transition-all"
      style={{
        background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
        color: "#1a1d24",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = "brightness(1.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "brightness(1)";
      }}
    >
      {label}
    </button>
  );
}

function BasicInfo() {
  const [form, setForm] = useState({
    name: "Alex Rivera",
    role: "Cinematographer",
    experience: "5 years",
    location: "Los Angeles, CA",
    bio: "Passionate about capturing authentic moments and telling visual stories through film.",
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      {/* Profile Photo */}
      <div
        className="rounded-2xl p-6 flex items-center gap-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="relative flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
            alt="Profile"
            className="w-[88px] h-[88px] rounded-full object-cover"
            style={{ border: `3px solid rgba(179,169,97,0.35)` }}
          />
          <span
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: C.gold, border: `2px solid ${C.card}` }}
          >
            <Camera size={13} color="#1a1d24" strokeWidth={2.5} />
          </span>
        </div>
        <div>
          <p
            className="text-[15px] font-bold mb-[3px]"
            style={{ color: C.darkText }}
          >
            Profile Photo
          </p>
          <p className="text-[12.5px] mb-3" style={{ color: C.lightText }}>
            Upload a professional photo
          </p>
          <button
            className="px-4 py-[7px] rounded-lg text-[12.5px] font-semibold border-0 outline-none cursor-pointer transition-all"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
              color: "#1a1d24",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Change Photo
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div
        className="rounded-2xl p-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <h3
          className="text-[15px] font-bold mb-5"
          style={{ color: C.darkText }}
        >
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
          />
          <Input
            label="Primary Role"
            value={form.role}
            onChange={set("role")}
            placeholder="e.g. Cinematographer"
          />
          <Input
            label="Experience"
            value={form.experience}
            onChange={set("experience")}
            placeholder="e.g. 5 years"
            icon={Briefcase}
          />
          <Input
            label="Location"
            value={form.location}
            onChange={set("location")}
            placeholder="City, State"
            icon={MapPin}
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label
            className="text-[12.5px] font-medium"
            style={{ color: C.lightText }}
          >
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio")(e.target.value)}
            rows={3}
            className="w-full rounded-xl text-[13.5px] outline-none resize-none transition-all"
            style={{
              background: C.inputBg,
              border: `1px solid ${C.inputBorder}`,
              color: C.darkText,
              padding: "10px 14px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(179,169,97,0.45)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.inputBorder;
            }}
          />
        </div>
      </div>

      <SaveBtn label="Save Profile" />
    </div>
  );
}

function Rates() {
  const [rates, setRates] = useState({
    daily: "800",
    weekly: "4500",
    project: "negotiable",
  });
  const set = (k) => (v) => setRates((r) => ({ ...r, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl p-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-5">
          <DollarSign size={17} style={{ color: C.gold }} />
          <h3 className="text-[15px] font-bold" style={{ color: C.darkText }}>
            Your Rates
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Input
              label="Daily Rate"
              value={rates.daily}
              onChange={set("daily")}
              icon={DollarSign}
              placeholder="800"
            />
            <p
              className="text-[11.5px] mt-1"
              style={{ color: "rgba(139,163,144,0.65)" }}
            >
              Per 8-hour day
            </p>
          </div>
          <div>
            <Input
              label="Weekly Rate"
              value={rates.weekly}
              onChange={set("weekly")}
              icon={DollarSign}
              placeholder="4500"
            />
            <p
              className="text-[11.5px] mt-1"
              style={{ color: "rgba(139,163,144,0.65)" }}
            >
              5-day work week
            </p>
          </div>
          <div>
            <Input
              label="Project Rate"
              value={rates.project}
              onChange={set("project")}
              icon={DollarSign}
              placeholder="negotiable"
            />
            <p
              className="text-[11.5px] mt-1"
              style={{ color: "rgba(139,163,144,0.65)" }}
            >
              Full project basis
            </p>
          </div>
        </div>

        {/* Tip box */}
        <div
          className="rounded-xl px-4 py-3 mt-2"
          style={{
            background: "rgba(179,169,97,0.06)",
            border: `1px solid rgba(179,169,97,0.14)`,
          }}
        >
          <p className="text-[13px]" style={{ color: C.lightText }}>
            <span className="font-semibold" style={{ color: C.gold }}>
              Tip:
            </span>{" "}
            Competitive rates increase your chances of getting hired. Research
            industry standards for your skill level and location.
          </p>
        </div>
      </div>

      <SaveBtn label="Save Rates" />
    </div>
  );
}

function Availability() {
  const today = new Date(2026, 1, 17); // Feb 17 2026
  const [current, setCurrent] = useState({ year: 2026, month: 1 }); // 0-indexed month
  const [booked, setBooked] = useState(new Set([19, 20, 21, 26]));

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => new Date(y, m, 1).getDay();

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

  const toggleDay = (d) => {
    setBooked((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  };

  const totalDays = daysInMonth(current.year, current.month);
  const startDay = firstDay(current.year, current.month);
  const cells = Array.from({ length: startDay + totalDays }, (_, i) =>
    i < startDay ? null : i - startDay + 1,
  );
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl p-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={17} style={{ color: C.gold }} />
          <h3 className="text-[15px] font-bold" style={{ color: C.darkText }}>
            Availability Calendar
          </h3>
        </div>
        <p className="text-[12.5px] mb-5" style={{ color: C.lightText }}>
          Click dates to mark them as booked. Green dates are available, red
          dates are booked.
        </p>

        {/* Nav */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="flex items-center gap-1 px-3 py-[6px] rounded-lg text-[12.5px] font-semibold border-0 outline-none cursor-pointer transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: C.darkText,
              border: `1px solid ${C.inputBorder}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(179,169,97,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.inputBorder;
            }}
          >
            <PrevIcon size={14} /> Previous
          </button>
          <p className="text-[15px] font-bold" style={{ color: C.darkText }}>
            {MONTHS[current.month]} {current.year}
          </p>
          <button
            onClick={nextMonth}
            className="flex items-center gap-1 px-3 py-[6px] rounded-lg text-[12.5px] font-semibold border-0 outline-none cursor-pointer transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: C.darkText,
              border: `1px solid ${C.inputBorder}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(179,169,97,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.inputBorder;
            }}
          >
            Next <NextIcon size={14} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[12px] font-semibold py-1"
              style={{ color: C.lightText }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-[6px]">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const isBooked = booked.has(day);
            const isToday =
              current.year === 2026 && current.month === 1 && day === 17;
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className="aspect-square rounded-xl flex items-center justify-center text-[13px] font-semibold border-0 outline-none cursor-pointer transition-all"
                style={{
                  background: isBooked
                    ? "rgba(239,68,68,0.18)"
                    : "rgba(34,197,94,0.15)",
                  color: isBooked ? "#f87171" : "#4ade80",
                  border: isToday
                    ? `2px solid ${C.gold}`
                    : isBooked
                      ? "1px solid rgba(239,68,68,0.3)"
                      : "1px solid rgba(34,197,94,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-5">
          <span
            className="flex items-center gap-2 text-[12.5px]"
            style={{ color: C.lightText }}
          >
            <span
              className="w-3 h-3 rounded-sm"
              style={{
                background: "rgba(34,197,94,0.5)",
                border: "1px solid rgba(34,197,94,0.5)",
              }}
            />
            Available
          </span>
          <span
            className="flex items-center gap-2 text-[12.5px]"
            style={{ color: C.lightText }}
          >
            <span
              className="w-3 h-3 rounded-sm"
              style={{
                background: "rgba(239,68,68,0.5)",
                border: "1px solid rgba(239,68,68,0.4)",
              }}
            />
            Booked
          </span>
        </div>
      </div>

      <SaveBtn label="Save Availability" />
    </div>
  );
}

const INIT_EQUIPMENT = [
  {
    id: 1,
    name: "Sony FX6",
    model: "ILME-FX6V",
    category: "Camera",
    rental: "400",
    rentalOn: true,
    img: "https://images.unsplash.com/photo-1510127034890-ba27843e008f?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Canon EF 24-70mm",
    model: "f/2.8L II USM",
    category: "Lens",
    rental: "100",
    rentalOn: true,
    img: null,
  },
  {
    id: 3,
    name: "Aputure 600D Pro",
    model: "COB LED",
    category: "Lighting",
    rental: "150",
    rentalOn: false,
    img: null,
  },
];

const CAT_ICONS = { Camera: Camera, Lens: Package, Lighting: Lightbulb };
const CAT_COLORS = { Camera: "#60a5fa", Lens: "#a78bfa", Lighting: "#fbbf24" };
const CATEGORIES = ["Camera", "Lens", "Lighting", "Audio", "Grip", "Other"];

function AddEquipmentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    category: "Camera",
    name: "",
    model: "",
    rental: "400",
    img: "",
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({
      id: Date.now(),
      name: form.name,
      model: form.model,
      category: form.category,
      rental: form.rental,
      rentalOn: true,
      img: form.img.trim() || null,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex justify-center items-center top-0"
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        background: "rgba(10,12,16,0.55)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] mx-4 rounded-2xl p-7"
        style={{
          background: "#22252e",
          border: "1px solid rgba(179,169,97,0.18)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          animation: "fadeUp 0.28s cubic-bezier(0.34,1.3,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full border-0 outline-none cursor-pointer transition-all"
          style={{ background: "rgba(255,255,255,0.06)", color: "#8ba390" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          <X size={15} strokeWidth={2.2} />
        </button>

        {/* Title */}
        <h2 className="text-[18px] font-bold mb-1" style={{ color: "#e8e9eb" }}>
          Add Equipment
        </h2>
        <p className="text-[13px] mb-5" style={{ color: "#8ba390" }}>
          Add gear that clients can rent along with your services
        </p>

        <div className="flex flex-col gap-4">
          {/* Category */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[12.5px] font-medium"
              style={{ color: "#8ba390" }}
            >
              Category
            </label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => set("category")(e.target.value)}
                className="w-full rounded-xl text-[13.5px] outline-none appearance-none cursor-pointer"
                style={{
                  background: "#1a1d24",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8e9eb",
                  padding: "10px 36px 10px 14px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#8ba390" }}
              />
            </div>
          </div>

          {/* Equipment Name */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[12.5px] font-medium"
              style={{ color: "#8ba390" }}
            >
              Equipment Name
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="e.g., Sony FX6"
              className="w-full rounded-xl text-[13.5px] outline-none"
              style={{
                background: "#1a1d24",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e8e9eb",
                padding: "10px 14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(179,169,97,0.45)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
          </div>

          {/* Model */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[12.5px] font-medium"
              style={{ color: "#8ba390" }}
            >
              Model
            </label>
            <input
              value={form.model}
              onChange={(e) => set("model")(e.target.value)}
              placeholder="e.g., ILME-FX6V"
              className="w-full rounded-xl text-[13.5px] outline-none"
              style={{
                background: "#1a1d24",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e8e9eb",
                padding: "10px 14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(179,169,97,0.45)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
          </div>

          {/* Daily Rental Price */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[12.5px] font-medium"
              style={{ color: "#8ba390" }}
            >
              Daily Rental Price
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3">
                <DollarSign size={14} style={{ color: "#8ba390" }} />
              </span>
              <input
                value={form.rental}
                onChange={(e) => set("rental")(e.target.value)}
                placeholder="400"
                className="w-full rounded-xl text-[13.5px] outline-none"
                style={{
                  background: "#1a1d24",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e8e9eb",
                  padding: "10px 14px 10px 34px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(179,169,97,0.45)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-[6px]">
            <label
              className="text-[12.5px] font-medium"
              style={{ color: "#8ba390" }}
            >
              Image URL{" "}
              <span style={{ color: "rgba(139,163,144,0.5)" }}>(Optional)</span>
            </label>
            <input
              value={form.img}
              onChange={(e) => set("img")(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl text-[13.5px] outline-none"
              style={{
                background: "#1a1d24",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e8e9eb",
                padding: "10px 14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(179,169,97,0.45)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handleAdd}
            className="py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer transition-all"
            style={{
              background: `linear-gradient(135deg, #b3a961, #cfc060)`,
              color: "#1a1d24",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Add Equipment
          </button>
          <button
            onClick={onClose}
            className="py-[11px] rounded-xl text-[13.5px] font-semibold border-0 outline-none cursor-pointer transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#e8e9eb",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Equipment() {
  const [items, setItems] = useState(INIT_EQUIPMENT);
  const [showModal, setShowModal] = useState(false);

  const toggle = (id) =>
    setItems((prev) =>
      prev.map((e) => (e.id === id ? { ...e, rentalOn: !e.rentalOn } : e)),
    );
  const remove = (id) => setItems((prev) => prev.filter((e) => e.id !== id));
  const addItem = (item) => setItems((prev) => [...prev, item]);

  return (
    <>
      {showModal && (
        <AddEquipmentModal
          onClose={() => setShowModal(false)}
          onAdd={addItem}
        />
      )}

      <div className="flex flex-col gap-5">
        <div
          className="rounded-2xl p-6"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Package size={17} style={{ color: C.gold }} />
              <h3
                className="text-[15px] font-bold"
                style={{ color: C.darkText }}
              >
                Equipment Inventory
              </h3>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-[7px] rounded-lg text-[12.5px] font-semibold border-0 outline-none cursor-pointer transition-all"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                color: "#1a1d24",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
              }}
            >
              <Plus size={14} strokeWidth={2.5} /> Add Equipment
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map(
              ({ id, name, model, category, rental, rentalOn, img }) => {
                const CatIcon = CAT_ICONS[category] || Package;
                const catColor = CAT_COLORS[category] || C.gold;
                return (
                  <div
                    key={id}
                    className="rounded-xl overflow-hidden flex flex-col transition-all duration-300"
                    style={{
                      background: C.inputBg,
                      border: `1px solid ${rentalOn ? C.inputBorder : "rgba(255,255,255,0.04)"}`,
                      opacity: rentalOn ? 1 : 0.45,
                      filter: rentalOn ? "none" : "grayscale(0.4)",
                    }}
                  >
                    {/* Image */}
                    <div
                      className="w-full h-[160px] flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {img ? (
                        <img
                          src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400"
                          alt={name}
                          className="w-full h-full object-cover"
                          style={{ opacity: rentalOn ? 1 : 0.5 }}
                        />
                      ) : (
                        <CatIcon
                          size={44}
                          strokeWidth={1.2}
                          style={{
                            color: rentalOn
                              ? "rgba(255,255,255,0.12)"
                              : "rgba(255,255,255,0.06)",
                          }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className="text-[13.5px] font-bold"
                            style={{
                              color: rentalOn
                                ? C.darkText
                                : "rgba(232,233,235,0.4)",
                            }}
                          >
                            {name}
                          </p>
                          <p
                            className="text-[11.5px]"
                            style={{
                              color: rentalOn
                                ? C.lightText
                                : "rgba(139,163,144,0.4)",
                            }}
                          >
                            {model}
                          </p>
                        </div>
                        <span
                          className="text-[10.5px] font-bold px-2 py-[3px] rounded-full flex-shrink-0"
                          style={{
                            background: rentalOn
                              ? `${catColor}18`
                              : "rgba(255,255,255,0.04)",
                            color: rentalOn
                              ? catColor
                              : "rgba(255,255,255,0.2)",
                            border: `1px solid ${rentalOn ? `${catColor}30` : "rgba(255,255,255,0.06)"}`,
                          }}
                        >
                          {category}
                        </span>
                      </div>

                      {/* Rental row */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className="text-[11px] mb-[2px]"
                            style={{
                              color: rentalOn
                                ? C.lightText
                                : "rgba(139,163,144,0.4)",
                            }}
                          >
                            Rental
                          </p>
                          <p
                            className="text-[13px] font-semibold"
                            style={{
                              color: rentalOn
                                ? C.darkText
                                : "rgba(232,233,235,0.35)",
                            }}
                          >
                            ${rental}/day
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Toggle */}
                          <button
                            onClick={() => toggle(id)}
                            className="relative flex-shrink-0 border-0 outline-none cursor-pointer transition-all duration-300"
                            style={{
                              width: "40px",
                              height: "22px",
                              borderRadius: "9999px",
                              background: rentalOn
                                ? C.gold
                                : "rgba(255,255,255,0.1)",
                            }}
                          >
                            <span
                              className="absolute top-[3px] w-4 h-4 rounded-full"
                              style={{
                                background: "#fff",
                                left: rentalOn ? "22px" : "3px",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                                transition: "left 0.25s ease",
                              }}
                            />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => remove(id)}
                            className="flex items-center justify-center w-7 h-7 rounded-lg border-0 outline-none cursor-pointer transition-all"
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "1px solid rgba(239,68,68,0.2)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.22)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.1)";
                            }}
                          >
                            <Trash2 size={13} color="#f87171" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const TAB_CONTENT = [
    <BasicInfo />,
    <Rates />,
    <Availability />,
    <Equipment />,
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .profile-content { animation: fadeUp 0.3s ease both; }
        input::placeholder, textarea::placeholder { color: rgba(139,163,144,0.45); }
        input, textarea { caret-color: #b3a961; }
      `}</style>

      <Sidebar />

      <div
        className="min-h-screen lg:ml-[248px]"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="px-6 py-8 max-w-[1100px]">
          {/* Page header */}
          <div className="mb-6" style={{ animation: "fadeUp 0.28s ease both" }}>
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="flex items-center gap-1 mb-3 border-0 bg-transparent outline-none cursor-pointer transition-all"
              style={{ color: C.lightText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.lightText;
              }}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <h1
              className="text-[26px] font-bold leading-tight mb-1"
              style={{
                color: C.darkText,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Manage Your Profile
            </h1>
            <p className="text-[14px]" style={{ color: C.lightText }}>
              Update your availability, rates, and equipment
            </p>
          </div>

          {/* Tab bar */}
          <div
            className="flex items-center gap-0 mb-6 border-b"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              animation: "fadeUp 0.32s ease both",
            }}
          >
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="px-5 py-3 text-[13.5px] font-semibold border-0 bg-transparent outline-none cursor-pointer relative transition-all"
                style={{
                  color: activeTab === i ? C.gold : C.lightText,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {tab}
                {activeTab === i && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                    style={{ background: C.gold }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="profile-content" key={activeTab}>
            {TAB_CONTENT[activeTab]}
          </div>
        </div>
      </div>
    </>
  );
}
