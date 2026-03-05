import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  Camera,
  IndianRupee,
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
import { artistAPI, getUser, setUser, uploadFile } from "../../services/api";

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
const CATEGORIES = ["Camera", "Lens", "Lighting", "Audio", "Grip", "Other"];
const CAT_ICONS = { Camera: Camera, Lens: Package, Lighting: Lightbulb };
const CAT_COLORS = { Camera: "#60a5fa", Lens: "#a78bfa", Lighting: "#fbbf24" };
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

const DEFAULT_EQUIPMENT = [];

function dateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function getMonthFreeDates(year, month, blockedDates) {
  const blockedSet = new Set(blockedDates);
  const total = new Date(year, month + 1, 0).getDate();
  const free = [];
  for (let d = 1; d <= total; d += 1) {
    const key = dateKey(year, month, d);
    if (!blockedSet.has(key)) free.push(key);
  }
  return free;
}

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

function SaveBtn({ label, onClick, saving = false }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="w-full py-[13px] rounded-xl text-[14px] font-bold border-0 outline-none cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
        color: "#1a1d24",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {saving ? "Saving..." : label}
    </button>
  );
}

function BasicInfo({ basicInfo, onChange, onSave, saving, onAvatarPick, avatarUploading }) {
  const set = (k) => (v) => onChange((prev) => ({ ...prev, [k]: v }));
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl p-6 flex items-center gap-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="relative flex-shrink-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-[88px] h-[88px] rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `3px solid rgba(179,169,97,0.35)`,
              cursor: "pointer",
            }}
          >
            {basicInfo.avatar ? (
              <img
                src={basicInfo.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Camera size={28} style={{ color: C.lightText }} />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarPick}
          />
        </div>
        <div>
          <p
            className="text-[15px] font-bold mb-[3px]"
            style={{ color: C.darkText }}
          >
            Profile
          </p>
          <p className="text-[12.5px] mb-3" style={{ color: C.lightText }}>
            Update your public profile details
          </p>
          {avatarUploading && (
            <p className="text-[12px]" style={{ color: C.gold }}>
              Uploading photo...
            </p>
          )}
        </div>
      </div>

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
            value={basicInfo.name}
            onChange={set("name")}
            placeholder="Your full name"
          />
          <Input
            label="Primary Role"
            value={basicInfo.artCategory}
            onChange={set("artCategory")}
            placeholder="e.g. Cinematographer"
          />
          <Input
            label="Experience"
            value={basicInfo.experience}
            onChange={set("experience")}
            placeholder="e.g. 5+ years"
            icon={Briefcase}
          />
          <Input
            label="Location"
            value={basicInfo.location}
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
            value={basicInfo.bio}
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
          />
        </div>
      </div>

      <SaveBtn label="Save Profile" onClick={onSave} saving={saving} />
    </div>
  );
}

function Rates({ rates, onChange, onSave, saving }) {
  const set = (k) => (v) => onChange((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl p-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-5">
          <span style={{ color: C.gold, fontSize: "17px", fontWeight: "bold" }}>
            ₹
          </span>
          <h3 className="text-[15px] font-bold" style={{ color: C.darkText }}>
            Your Rates
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Daily Rate"
            value={rates.daily}
            onChange={set("daily")}
            placeholder="₹800"
          />
          <Input
            label="Weekly Rate"
            value={rates.weekly}
            onChange={set("weekly")}
            placeholder="₹4500"
          />
          <Input
            label="Project Rate"
            value={rates.project}
            onChange={set("project")}
            placeholder="negotiable"
          />
        </div>
      </div>

      <SaveBtn label="Save Rates" onClick={onSave} saving={saving} />
    </div>
  );
}

function Availability({ availability, onChange, onSave, saving, syncing }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const saveTimer = useRef(null);

  const blockedSet = useMemo(
    () => new Set(availability.blockedDates || []),
    [availability.blockedDates],
  );

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => new Date(y, m, 1).getDay();

  const prevMonth = () =>
    setCurrent((c) => ({
      year: c.month === 0 ? c.year - 1 : c.year,
      month: c.month === 0 ? 11 : c.month - 1,
    }));
  const nextMonth = () =>
    setCurrent((c) => ({
      year: c.month === 11 ? c.year + 1 : c.year,
      month: c.month === 11 ? 0 : c.month + 1,
    }));

  const toggleDay = (d) => {
    const key = dateKey(current.year, current.month, d);
    const next = new Set(blockedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    const blockedDates = Array.from(next).sort();
    const freeDates = getMonthFreeDates(
      current.year,
      current.month,
      blockedDates,
    );
    onChange({ blockedDates, freeDates });
  };

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const freeDates = getMonthFreeDates(
        current.year,
        current.month,
        availability.blockedDates || [],
      );
      onSave({ blockedDates: availability.blockedDates || [], freeDates });
    }, 350);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [availability.blockedDates, current.month, current.year]);

  const totalDays = daysInMonth(current.year, current.month);
  const startDay = firstDay(current.year, current.month);
  const cells = Array.from({ length: startDay + totalDays }, (_, i) =>
    i < startDay ? null : i - startDay + 1,
  );
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl p-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <CalendarDays size={17} style={{ color: C.gold }} />
            <h3 className="text-[15px] font-bold" style={{ color: C.darkText }}>
              Availability Calendar
            </h3>
          </div>
          <p
            className="text-[11px]"
            style={{ color: syncing ? C.gold : C.lightText }}
          >
            {syncing ? "Syncing..." : "Synced"}
          </p>
        </div>
        <p className="text-[12.5px] mb-5" style={{ color: C.lightText }}>
          Click dates to mark them blocked/available. Updates sync to DB
          automatically.
        </p>

        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="flex items-center gap-1 px-3 py-[6px] rounded-lg text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: C.darkText,
              border: `1px solid ${C.inputBorder}`,
            }}
          >
            <PrevIcon size={14} /> Previous
          </button>
          <p className="text-[15px] font-bold" style={{ color: C.darkText }}>
            {MONTHS[current.month]} {current.year}
          </p>
          <button
            onClick={nextMonth}
            className="flex items-center gap-1 px-3 py-[6px] rounded-lg text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: C.darkText,
              border: `1px solid ${C.inputBorder}`,
            }}
          >
            Next <NextIcon size={14} />
          </button>
        </div>

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

        <div className="grid grid-cols-7 gap-[6px]">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const key = dateKey(current.year, current.month, day);
            const isBlocked = blockedSet.has(key);
            const isToday =
              day === today.getDate() &&
              current.month === today.getMonth() &&
              current.year === today.getFullYear();

            return (
              <button
                key={key}
                onClick={() => toggleDay(day)}
                className="aspect-square rounded-xl flex items-center justify-center text-[13px] font-semibold border-0 outline-none cursor-pointer"
                style={{
                  background: isBlocked
                    ? "rgba(239,68,68,0.18)"
                    : "rgba(34,197,94,0.15)",
                  color: isBlocked ? "#f87171" : "#4ade80",
                  border: isToday
                    ? `2px solid ${C.gold}`
                    : isBlocked
                      ? "1px solid rgba(239,68,68,0.3)"
                      : "1px solid rgba(34,197,94,0.25)",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <SaveBtn
        label="Save Availability Now"
        onClick={() => {
          const freeDates = getMonthFreeDates(
            current.year,
            current.month,
            availability.blockedDates || [],
          );
          onSave({ blockedDates: availability.blockedDates || [], freeDates });
        }}
        saving={saving}
      />
    </div>
  );
}

function AddEquipmentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    category: "Camera",
    name: "",
    model: "",
    img: "",
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({
      clientId: `tmp-${Date.now()}`,
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
      style={{ backdropFilter: "blur(6px)", background: "rgba(10,12,16,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] mx-4 rounded-2xl p-7"
        style={{
          background: "#22252e",
          border: "1px solid rgba(179,169,97,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full border-0 outline-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.06)", color: "#8ba390" }}
        >
          <X size={15} strokeWidth={2.2} />
        </button>

        <h2 className="text-[18px] font-bold mb-1" style={{ color: "#e8e9eb" }}>
          Add Equipment
        </h2>
        <p className="text-[13px] mb-5" style={{ color: "#8ba390" }}>
          Add gear that clients can rent along with your services
        </p>

        <div className="flex flex-col gap-4">
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

          <Input
            label="Equipment Name"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g., Sony FX6"
          />
          <Input
            label="Model"
            value={form.model}
            onChange={set("model")}
            placeholder="e.g., ILME-FX6V"
          />
          <Input
            label="Daily Rental Price"
            value={form.rental}
            onChange={set("rental")}
            placeholder="₹400"
          />
          <Input
            label="Image URL (Optional)"
            value={form.img}
            onChange={set("img")}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handleAdd}
            className="py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #b3a961, #cfc060)",
              color: "#1a1d24",
            }}
          >
            Add Equipment
          </button>
          <button
            onClick={onClose}
            className="py-[11px] rounded-xl text-[13.5px] font-semibold border-0 outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#e8e9eb",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Equipment({ equipment, onChange, onSave, saving }) {
  const [showModal, setShowModal] = useState(false);

  const itemId = (item) => item._id || item.clientId;
  const toggle = (id) =>
    onChange((prev) =>
      prev.map((e) =>
        String(itemId(e)) === String(id) ? { ...e, rentalOn: !e.rentalOn } : e,
      ),
    );
  const remove = (id) =>
    onChange((prev) => prev.filter((e) => String(itemId(e)) !== String(id)));
  const addItem = (item) => onChange((prev) => [...prev, item]);

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
              className="flex items-center gap-1.5 px-4 py-[7px] rounded-lg text-[12.5px] font-semibold border-0 outline-none cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                color: "#1a1d24",
              }}
            >
              <Plus size={14} strokeWidth={2.5} /> Add Equipment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {equipment.map(
              ({
                _id,
                clientId,
                name,
                model,
                category,
                rental,
                rentalOn,
                img,
              }) => {
                const id = _id || clientId;
                const CatIcon = CAT_ICONS[category] || Package;
                const catColor = CAT_COLORS[category] || C.gold;
                return (
                  <div
                    key={id}
                    className="rounded-xl overflow-hidden flex flex-col"
                    style={{
                      background: C.inputBg,
                      border: `1px solid ${rentalOn ? C.inputBorder : "rgba(255,255,255,0.04)"}`,
                      opacity: rentalOn ? 1 : 0.45,
                    }}
                  >
                    <div
                      className="w-full h-[160px] flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CatIcon
                          size={44}
                          strokeWidth={1.2}
                          style={{ color: "rgba(255,255,255,0.12)" }}
                        />
                      )}
                    </div>

                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className="text-[13.5px] font-bold"
                            style={{ color: C.darkText }}
                          >
                            {name}
                          </p>
                          <p
                            className="text-[11.5px]"
                            style={{ color: C.lightText }}
                          >
                            {model}
                          </p>
                        </div>
                        <span
                          className="text-[10.5px] font-bold px-2 py-[3px] rounded-full"
                          style={{
                            background: `${catColor}18`,
                            color: catColor,
                            border: `1px solid ${catColor}30`,
                          }}
                        >
                          {category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p
                          className="text-[13px] font-semibold"
                          style={{ color: C.darkText }}
                        >
                          ₹{rental}/day
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggle(id)}
                            className="relative flex-shrink-0 border-0 outline-none cursor-pointer"
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
                              }}
                            />
                          </button>
                          <button
                            onClick={() => remove(id)}
                            className="flex items-center justify-center w-7 h-7 rounded-lg border-0 outline-none cursor-pointer"
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "1px solid rgba(239,68,68,0.2)",
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

        <SaveBtn label="Save Equipment" onClick={onSave} saving={saving} />
      </div>
    </>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const [basicInfo, setBasicInfo] = useState({
    name: "",
    artCategory: "",
    experience: "",
    location: "",
    bio: "",
    avatar: "",
  });
  const [rates, setRates] = useState({ daily: "", weekly: "", project: "" });
  const [availability, setAvailability] = useState({
    blockedDates: [],
    freeDates: [],
  });
  const [equipment, setEquipment] = useState(DEFAULT_EQUIPMENT);

  const [savingBasic, setSavingBasic] = useState(false);
  const [savingRates, setSavingRates] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [syncingAvailability, setSyncingAvailability] = useState(false);
  const [savingEquipment, setSavingEquipment] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const local = getUser();
        if (local) {
          setBasicInfo((prev) => ({ ...prev, name: local.name || prev.name }));
        }

        const profile = await artistAPI.getProfile();
        setBasicInfo({
          name: profile.name || "",
          artCategory: profile.artCategory || "",
          experience: profile.experience || "",
          location: profile.location || "",
          bio: profile.bio || "",
          avatar: profile.avatar || "",
        });
        setRates({
          daily: profile.rates?.daily || "",
          weekly: profile.rates?.weekly || "",
          project: profile.rates?.project || "",
        });
        setAvailability({
          blockedDates: Array.isArray(profile.availability?.blockedDates)
            ? profile.availability.blockedDates
            : [],
          freeDates: Array.isArray(profile.availability?.freeDates)
            ? profile.availability.freeDates
            : [],
        });
        if (Array.isArray(profile.equipment) && profile.equipment.length > 0) {
          setEquipment(
            profile.equipment.map((item, idx) => ({
              ...item,
              clientId: item._id || `db-${idx}`,
            })),
          );
        } else {
          setEquipment(DEFAULT_EQUIPMENT);
        }
      } catch (error) {
        console.error("Failed to load profile page data", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveBasicInfo = async () => {
    setSavingBasic(true);
    try {
      await artistAPI.updateProfile({
        name: basicInfo.name,
        artCategory: basicInfo.artCategory,
        experience: basicInfo.experience,
        location: basicInfo.location,
        bio: basicInfo.bio,
        avatar: basicInfo.avatar,
      });
    } finally {
      setSavingBasic(false);
    }
  };

  const handleAvatarPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) return;

    setUploadingAvatar(true);
    try {
      const uploaded = await uploadFile(file, {
        bucket: "profile-images",
        type: "profile",
        fieldName: "file",
      });
      const updated = await artistAPI.updateProfile({ avatar: uploaded.url });
      const avatarUrl = updated?.avatar || uploaded.url;
      setBasicInfo((prev) => ({ ...prev, avatar: avatarUrl }));

      const localUser = getUser();
      if (localUser) {
        setUser({ ...localUser, avatar: avatarUrl });
      }
    } catch (error) {
      console.error("Failed to upload profile photo", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveRates = async () => {
    setSavingRates(true);
    try {
      await artistAPI.updateProfile({ rates });
    } finally {
      setSavingRates(false);
    }
  };

  const saveAvailability = async (payload = availability) => {
    setSavingAvailability(true);
    setSyncingAvailability(true);
    try {
      await artistAPI.updateProfile({ availability: payload });
      setAvailability(payload);
    } finally {
      setSyncingAvailability(false);
      setSavingAvailability(false);
    }
  };

  const saveEquipment = async () => {
    setSavingEquipment(true);
    try {
      await artistAPI.updateProfile({
        equipment: equipment.map((item) => ({
          name: item.name || "",
          model: item.model || "",
          category: item.category || "Other",
          rental: item.rental || "",
          rentalOn: Boolean(item.rentalOn),
          img: item.img || null,
        })),
      });
    } finally {
      setSavingEquipment(false);
    }
  };

  const tabContent = [
    <BasicInfo
      key="basic"
      basicInfo={basicInfo}
      onChange={setBasicInfo}
      onSave={saveBasicInfo}
      saving={savingBasic}
      onAvatarPick={handleAvatarPick}
      avatarUploading={uploadingAvatar}
    />,
    <Rates
      key="rates"
      rates={rates}
      onChange={setRates}
      onSave={saveRates}
      saving={savingRates}
    />,
    <Availability
      key="availability"
      availability={availability}
      onChange={setAvailability}
      onSave={saveAvailability}
      saving={savingAvailability}
      syncing={syncingAvailability}
    />,
    <Equipment
      key="equipment"
      equipment={equipment}
      onChange={setEquipment}
      onSave={saveEquipment}
      saving={savingEquipment}
    />,
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
          <div className="mb-6" style={{ animation: "fadeUp 0.28s ease both" }}>
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="flex items-center gap-1 mb-3 border-0 bg-transparent outline-none cursor-pointer transition-all"
              style={{ color: C.lightText }}
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

          <div className="profile-content" key={activeTab}>
            {loading ? (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  color: C.lightText,
                }}
              >
                Loading profile data...
              </div>
            ) : (
              tabContent[activeTab]
            )}
          </div>
        </div>
      </div>
    </>
  );
}
