import { motion } from "motion/react";
import {
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  ArrowLeft,
  Users,
  Briefcase,
  ChevronDown,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  text: "#ffffff",
  muted: "#9ca3af",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.1)",
  successBorder: "rgba(74,222,128,0.2)",
};

const baseInput = {
  width: "100%",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: C.muted,
        marginBottom: "7px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );
}


function TextInput({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={15}
          style={{
            position: "absolute",
            left: "13px",
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? C.gold : C.muted,
            transition: "color 0.2s",
            pointerEvents: "none",
          }}
        />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...baseInput,
          background: C.input,
          border: `1px solid ${focused ? C.gold : C.border}`,
          color: C.text,
          paddingLeft: Icon ? "38px" : "14px",
          boxShadow: focused ? `0 0 0 3px ${C.goldGlow}` : "none",
        }}
      />
    </div>
  );
}

function Textarea({ value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={5}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...baseInput,
        background: C.input,
        border: `1px solid ${focused ? C.gold : C.border}`,
        color: C.text,
        resize: "none",
        lineHeight: "1.6",
        boxShadow: focused ? `0 0 0 3px ${C.goldGlow}` : "none",
      }}
    />
  );
}


function SelectInput({ value, onChange, options, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...baseInput,
          background: C.input,
          border: `1px solid ${focused ? C.gold : C.border}`,
          color: value ? C.text : C.muted,
          paddingRight: "38px",
          appearance: "none",
          cursor: "pointer",
          boxShadow: focused ? `0 0 0 3px ${C.goldGlow}` : "none",
        }}
      >
        <option
          value=""
          disabled
          style={{ background: C.card, color: C.muted }}
        >
          {placeholder}
        </option>
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            style={{ background: C.card, color: C.text }}
          >
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        style={{
          position: "absolute",
          right: "13px",
          top: "50%",
          transform: "translateY(-50%)",
          color: focused ? C.gold : C.muted,
          pointerEvents: "none",
          transition: "color 0.2s",
        }}
      />
    </div>
  );
}


const PROJECT_TYPES = [
  { value: "Film & TV Production", label: "Film & TV Production" },
  {
    value: "Advertising & Commercial Shoots",
    label: "Advertising & Commercial Shoots",
  },
  { value: "Music Videos", label: "Music Videos" },
  { value: "Event Videography", label: "Event Videography" },
  { value: "Wedding Cinematography", label: "Wedding Cinematography" },
  { value: "Documentary Production", label: "Documentary Production" },
  {
    value: "Streaming Content Production",
    label: "Streaming Content Production",
  },
  { value: "YouTubers Hiring Editors", label: "YouTubers Hiring Editors" },
  {
    value: "Influencers Hiring Videographers",
    label: "Influencers Hiring Videographers",
  },
  { value: "Podcast Production Teams", label: "Podcast Production Teams" },
  {
    value: "Social Media Content Studios",
    label: "Social Media Content Studios",
  },
  {
    value: "Brand Creator Collaborations",
    label: "Brand Creator Collaborations",
  },
  { value: "Game Cinematics", label: "Game Cinematics" },
  { value: "Motion Capture Crews", label: "Motion Capture Crews" },
  { value: "3D Animation Teams", label: "3D Animation Teams" },
  {
    value: "Virtual Production Specialists",
    label: "Virtual Production Specialists",
  },
  { value: "Unreal Engine Artists", label: "Unreal Engine Artists" },
  { value: "Corporate Video Production", label: "Corporate Video Production" },
  { value: "Training Content Creation", label: "Training Content Creation" },
  { value: "Marketing Media Teams", label: "Marketing Media Teams" },
  {
    value: "Internal Communication Studios",
    label: "Internal Communication Studios",
  },
  { value: "acting", label: "Acting" },
  { value: "dance", label: "Dance / Choreography" },
  { value: "cinematography", label: "Cinematography" },
  { value: "music", label: "Music / Audio" },
  { value: "costume", label: "Costume Design" },
  { value: "makeup", label: "Makeup Artist" },
  { value: "editing", label: "Editing" },
  { value: "other", label: "Other" },
];

export default function PostRequirement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    budget: "",
    duration: "",
    startDate: "",
    maxSlots: "",
    availableSlots: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [recentPosts, setRecentPosts] = useState([]);

  const set = (key) => (e) =>
    setFormData((prev) => ({
      ...prev,
      [key]: typeof e === "string" ? e : e.target.value,
    }));

  useEffect(() => {
    let m = true;
    hirerAPI
      .getOpportunities()
      .then((res) => {
        if (!m) return;
        const list = Array.isArray(res) ? res : [];
        const mapped = list.slice(0, 3).map((o) => ({
          title: o.title || "Requirement",
          meta: `Posted ${new Date(o.createdAt).toLocaleDateString()} ${Number(o.applicationCount || 0)} applications`,
        }));
        setRecentPosts(mapped);
      })
      .catch(() => {});
    return () => {
      m = false;
    };
  }, []);

  const parseBudgetRange = (budget) => {
    const nums = String(budget || "")
      .replace(/,/g, "")
      .match(/\d+(\.\d+)?/g)
      ?.map((n) => Number(n));

    if (!nums || nums.length === 0) {
      return { min: 0, max: 0 };
    }

    if (nums.length === 1) {
      return { min: nums[0], max: nums[0] };
    }

    return { min: Math.min(...nums), max: Math.max(...nums) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const { min, max } = parseBudgetRange(formData.budget);
      await hirerAPI.postOpportunity({
        title: formData.title,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        budget: formData.budget,
        budgetMin: min,
        budgetMax: max,
        duration: formData.duration,
        startDate: formData.startDate || undefined,
        maxSlots: Number(formData.maxSlots),
        availableSlots: Number(formData.availableSlots),
      });

      setSubmitted(true);
      setFormData({
        title: "",
        type: "",
        description: "",
        location: "",
        budget: "",
        duration: "",
        startDate: "",
        maxSlots: "",
        availableSlots: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setSubmitError(error.message || "Could not post requirement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.bg }}>
      {/* Sidebar identical pattern to HirerDashboard */}
      <HirerSidebar />

      {/* Main content offset by sidebar width on lg+ */}
      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1 overflow-auto">
          <div style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
            <div
              style={{
                maxWidth: "860px",
                margin: "0 auto",
                padding: "clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px)",
              }}
            >
             
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{ marginBottom: "32px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.08, backgroundColor: C.card }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/hirer/browse-artists")}
                    style={{
                      padding: "9px",
                      borderRadius: "9px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      cursor: "pointer",
                      color: C.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s",
                      flexShrink: 0,
                      marginTop: "5px",
                    }}
                  >
                    <ArrowLeft size={17} />
                  </motion.button>

                  <div>
                    <h1
                      style={{
                        fontSize: "clamp(22px, 3.5vw, 32px)",
                        fontWeight: "700",
                        margin: "0 0 6px",
                        color: C.text,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Post a Requirement
                    </h1>
                    <p style={{ margin: 0, color: C.muted, fontSize: "14px" }}>
                      Find the perfect talent for your project
                    </p>
                  </div>
                </div>
              </motion.div>


              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px",
                  padding: "clamp(20px, 3vw, 32px)",
                  marginBottom: "28px",
                }}
              >
                {/* Gold accent bar */}
                <div
                  style={{
                    width: "40px",
                    height: "3px",
                    background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                    borderRadius: "2px",
                    marginBottom: "24px",
                  }}
                />

                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "22px",
                    }}
                  >
                    {/* Title */}
                    <div>
                      <Label>Project Title</Label>
                      <TextInput
                        icon={Briefcase}
                        value={formData.title}
                        onChange={set("title")}
                        placeholder="e.g., Lead Actor for Indie Film"
                        required
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <Label>Project Type</Label>
                      <SelectInput
                        value={formData.type}
                        onChange={set("type")}
                        options={PROJECT_TYPES}
                        placeholder="Select project type"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={set("description")}
                        placeholder="Describe your project requirements in detail..."
                        required
                      />
                    </div>

                    {/* Location + Budget */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "18px",
                      }}
                    >
                      <div>
                        <Label>Location</Label>
                        <TextInput
                          icon={MapPin}
                          value={formData.location}
                          onChange={set("location")}
                          placeholder="City, State"
                          required
                        />
                      </div>
                      <div>
                        <Label>Budget Range</Label>
                        <TextInput
                          value={formData.budget}
                          onChange={set("budget")}
                          placeholder="e.g., ₹5,000 - ₹8,000"
                          required
                        />
                      </div>
                    </div>

                    {/* Duration + Start Date */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "18px",
                      }}
                    >
                      <div>
                        <Label>Project Duration</Label>
                        <TextInput
                          icon={Clock}
                          value={formData.duration}
                          onChange={set("duration")}
                          placeholder="e.g., 3 weeks"
                          required
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <TextInput
                          icon={Calendar}
                          type="date"
                          value={formData.startDate}
                          onChange={set("startDate")}
                          required
                        />
                      </div>
                    </div>

                    {/* Slots */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "18px",
                      }}
                    >
                      <div>
                        <Label>Max Slots</Label>
                        <TextInput
                          icon={Users}
                          type="number"
                          value={formData.maxSlots}
                          onChange={set("maxSlots")}
                          placeholder="e.g., 5"
                          required
                        />
                      </div>
                      <div>
                        <Label>Available Slots</Label>
                        <TextInput
                          icon={Users}
                          type="number"
                          value={formData.availableSlots}
                          onChange={set("availableSlots")}
                          placeholder="e.g., 3"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{
                        scale: 1.015,
                        boxShadow: `0 6px 24px rgba(201,169,97,0.3)`,
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: "100%",
                        padding: "13px",
                        background: submitted
                          ? "rgba(74,222,128,0.85)"
                          : `linear-gradient(135deg, ${C.gold} 0%, #a8863d 100%)`,
                        color: "#1a1d24",
                        fontWeight: "700",
                        fontSize: "14px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        marginTop: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "background 0.35s, box-shadow 0.2s",
                        opacity: isSubmitting ? 0.75 : 1,
                      }}
                    >
                      {submitted ? (
                        <>
                          <CheckCircle size={16} />
                          Requirement Posted!
                        </>
                      ) : isSubmitting ? (
                        <>Posting...</>
                      ) : (
                        <>
                          <FileText size={16} />
                          Post Requirement
                        </>
                      )}
                    </motion.button>

                    {submitError && (
                      <p
                        style={{
                          color: "#f87171",
                          margin: 0,
                          fontSize: "13px",
                        }}
                      >
                        {submitError}
                      </p>
                    )}
                  </div>
                </form>
              </motion.div>

  
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45 }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: C.text,
                    marginBottom: "14px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Your Recent Posts
                </h2>

                {recentPosts.map((post, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 + i * 0.07 }}
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: "12px",
                      padding: "20px 22px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: "600",
                          color: C.text,
                        }}
                      >
                        {post.title}
                      </h3>
                      <span
                        style={{
                          padding: "3px 11px",
                          background: C.successBg,
                          color: C.success,
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: `1px solid ${C.successBorder}`,
                        }}
                      >
                        Active
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "0 0 14px",
                        color: C.muted,
                        fontSize: "13px",
                      }}
                    >
                      {post.meta}
                    </p>

                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      {["View Applications", "Edit"].map((label) => (
                        <motion.button
                          key={label}
                          whileHover={{ borderColor: C.gold, color: C.gold }}
                          style={{
                            padding: "7px 16px",
                            background: "transparent",
                            border: `1px solid ${C.border}`,
                            borderRadius: "8px",
                            color: C.text,
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "border-color 0.2s, color 0.2s",
                          }}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Global overrides */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.55) sepia(0.3) saturate(2) hue-rotate(5deg);
          cursor: pointer;
        }
        input::placeholder, textarea::placeholder { color: #6b7280; }
        * { box-sizing: border-box; }
        select option { background: #2d3139; color: #ffffff; }
      `}</style>
    </div>
  );
}
