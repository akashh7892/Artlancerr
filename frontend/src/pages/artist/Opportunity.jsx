import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  Users,
  Tag,
  CheckCircle2,
  AlertCircle,
  Send,
  ExternalLink,
  Star,
  Layers,
  Filter,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const C = {
  bg: "#1a1d24",
  card: "#22252e",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#b3a961",
  goldDim: "rgba(179,169,97,0.12)",
  border: "rgba(179,169,97,0.10)",
  inputBg: "#1a1d24",
  inputBorder: "rgba(255,255,255,0.08)",
  panelBg: "#1e2129",
  panelBg2: "#191c23",
};

const FILTERS = [
  "All",
  "Film & TV Production",
  "Advertising & Commercial Shoots",
  "Music Videos",
  "Cinematographer",
  "Director",
  "Actor",
  "Lead Actor",
  "Supporting Actor",
  "Dancer",
  "Choreographer",
  "Producer",
  "Screenwriter",
  "Film Editor",
  "Sound Designer",
  "Costume Designer",
  "Makeup Artist",
  "Production Designer",
  "Stunt Coordinator",
  "Voice Artist",
  "Background Artist",
  "Art Director",
  "Lighting Director",
  "Assistant Director",
  "Camera Operator",
  "Colorist",
  "VFX Artist",
  "Music Composer",
  "Lyricist",
  "Writer",
  "Casting Director",
  "Dialogue Writer",
  "Event Videography",
  "Wedding Cinematography",
  "Documentary Production",
  "Streaming Content Production",
  "YouTubers Hiring Editors",
  "Influencers Hiring Videographers",
  "Podcast Production Teams",
  "Social Media Content Studios",
  "Brand Creator Collaborations",
  "Game Cinematics",
  "Motion Capture Crews",
  "3D Animation Teams",
  "Virtual Production Specialists",
  "Unreal Engine Artists",
  "Corporate Video Production",
  "Training Content Creation",
  "Marketing Media Teams",
  "Internal Communication Studios",
];

const LOCATIONS = [
  "All locations",
  "Remote",
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Chandigarh, Punjab",
  "Kochi, Kerala",
  "Bhopal, Madhya Pradesh",
  "Indore, Madhya Pradesh",
  "Nagpur, Maharashtra",
  "Visakhapatnam, Andhra Pradesh",
  "Surat, Gujarat",
  "Vadodara, Gujarat",
  "Coimbatore, Tamil Nadu",
  "Guwahati, Assam",
  "Patna, Bihar",
  "Bhubaneswar, Odisha",
  "Thiruvananthapuram, Kerala",
  "Dehradun, Uttarakhand",
  "Ranchi, Jharkhand",
  "Amritsar, Punjab",
  "Mysuru, Karnataka",
  "Mangaluru, Karnataka",
  "Noida, Uttar Pradesh",
  "Gurugram, Haryana",
  "Faridabad, Haryana",
  "Ghaziabad, Uttar Pradesh",
  "Agra, Uttar Pradesh",
  "Varanasi, Uttar Pradesh",
];
const DURATIONS = [
  "Any duration",
  "Less than 1 week",
  "1-4 weeks",
  "1+ months",
  "Ongoing",
];
const POSTED = ["Any time", "Last 24 hours", "Last week", "Last month"];

// ── Social Platforms Config ───────────────────────────────────────────────────
const SHARE_PLATFORMS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    bg: "rgba(37,211,102,0.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (text, url) =>
      `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    color: "#26A5E4",
    bg: "rgba(38,165,228,0.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    getUrl: (text, url) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    color: "#e8e9eb",
    bg: "rgba(232,233,235,0.08)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (text, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    bg: "rgba(10,102,194,0.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (text, url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    bg: "rgba(24,119,242,0.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (text, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E4405F",
    bg: "rgba(228,64,95,0.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    action: "copy",
    getUrl: () => null,
  },
  {
    id: "threads",
    label: "Threads",
    color: "#e8e9eb",
    bg: "rgba(232,233,235,0.08)",
    icon: (
      <svg viewBox="0 0 192 192" fill="currentColor" width="22" height="22">
        <path d="M141.537 88.988a66.667 66.667 0 00-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.15-23.806 1.371-39.104 15.264-38.053 34.568.527 9.792 5.625 18.218 14.35 23.718 7.404 4.709 16.935 7.006 26.881 6.466 13.098-.703 23.376-5.709 30.552-14.873 5.464-6.994 8.921-16.055 10.472-27.492 6.28 3.79 10.927 8.821 13.449 14.874 4.503 10.697 4.763 28.237-9.138 42.097-12.22 12.183-26.85 17.448-49.01 17.61-24.534-.176-43.128-8.057-55.264-23.43C29.102 138.265 23.516 118.409 23.333 93c.183-25.409 5.77-45.265 16.596-59.01C51.063 19.617 69.657 11.737 94.19 11.561c24.714.178 43.687 8.102 56.378 23.55 6.222 7.685 10.932 17.41 14.08 29.055l16.338-4.35c-3.825-14.106-9.834-26.198-18.003-36.132C147.034 8.47 123.737-.182 94.3 0h-.12C65.002.182 41.86 9.006 26.33 26.198 12.534 41.495 5.418 63.16 5.191 90.98v.12c.227 27.82 7.343 49.485 21.139 64.782 15.529 17.192 38.672 26.016 67.97 26.198h.12c26.032-.164 44.413-7.012 59.496-22.054 19.965-19.916 19.365-44.853 12.803-60.168-4.493-10.675-13.173-19.396-25.182-25.87zM100.35 141.44c-10.137.577-20.652-3.988-21.212-13.768-.424-7.885 5.598-16.694 23.967-17.717 2.098-.12 4.155-.177 6.173-.177 5.918 0 11.453.573 16.47 1.67-1.876 23.407-14.71 29.444-25.398 29.992z" />
      </svg>
    ),
    getUrl: (text, url) =>
      `https://www.threads.net/intent/post?text=${encodeURIComponent(text + " " + url)}`,
  },
  {
    id: "email",
    label: "Email",
    color: "#b3a961",
    bg: "rgba(179,169,97,0.12)",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        width="22"
        height="22"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    getUrl: (text, url) =>
      `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + "\n\nCheck it out: " + url)}`,
  },
];

// ── Share Sheet Component ─────────────────────────────────────────────────────
function ShareSheet({ opp, onClose }) {
  const [copied, setCopied] = useState(false);
  const [nativeShared, setNativeShared] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);

  useEffect(() => {
    if (!opp) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [opp, onClose]);

  if (!opp) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/opportunities/${opp._id || ""}`
      : "";
  const shareText = `🎬 ${opp.title} at ${opp.company}${opp.budget ? ` — ${opp.budget}` : ""}${opp.location ? ` (${opp.location})` : ""}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: opp.title,
          text: shareText,
          url: shareUrl,
        });
        setNativeShared(true);
        setTimeout(() => setNativeShared(false), 2000);
      } catch (e) {
        if (e.name !== "AbortError") handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handlePlatformClick = (platform) => {
    if (platform.action === "copy") {
      navigator.clipboard
        .writeText(shareUrl || shareText)
        .then(() => {
          setInstaCopied(true);
          setTimeout(() => setInstaCopied(false), 2500);
        })
        .catch(() => {});
      return;
    }
    const url = platform.getUrl(shareText, shareUrl);
    if (url)
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=520");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[2000] bg-black/60"
        style={{
          backdropFilter: "blur(6px)",
          animation: "fadeInBg 0.2s ease both",
        }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="share-sheet-panel fixed bottom-0 left-0 right-0 z-[2100] rounded-t-3xl"
        style={{
          background: "linear-gradient(180deg, #1e2129 0%, #191c23 100%)",
          border: "1px solid rgba(179,169,97,0.16)",
          borderBottom: "none",
          boxShadow: "0 -24px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          maxWidth: 560,
          margin: "0 auto",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #b3a961, #cfc060, transparent)",
            borderRadius: "24px 24px 0 0",
          }}
        />

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0">
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        </div>

        <div className="px-5 pt-3 pb-7">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <p
                className="text-[10.5px] font-bold uppercase tracking-widest mb-1"
                style={{ color: "rgba(179,169,97,0.65)" }}
              >
                Share Opportunity
              </p>
              <h3
                className="text-[16px] font-bold truncate leading-snug"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {opp.title}
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: C.lightText }}>
                {opp.company}
                {opp.location ? ` • ${opp.location}` : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="adv-btn-close flex items-center justify-center w-8 h-8 rounded-full border-0 outline-none cursor-pointer flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: C.lightText,
              }}
            >
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          {/* Instagram copy toast */}
          {instaCopied && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
              style={{
                background: "rgba(228,64,95,0.1)",
                border: "1px solid rgba(228,64,95,0.25)",
                animation:
                  "shareIconPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
              }}
            >
              <Check size={13} strokeWidth={2.5} style={{ color: "#E4405F" }} />
              <p
                className="text-[12px] font-semibold"
                style={{ color: "#E4405F" }}
              >
                Link copied! Open Instagram and paste in your story or bio.
              </p>
            </div>
          )}

          {/* Platform grid — 4 columns */}
          <div
            className="grid gap-y-3 gap-x-2 mb-5"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {SHARE_PLATFORMS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handlePlatformClick(p)}
                className="share-icon-btn flex flex-col items-center gap-1.5 border-0 outline-none cursor-pointer bg-transparent p-0"
                style={{ animationDelay: `${i * 0.035}s` }}
                title={p.label}
              >
                <div
                  className="share-icon-circle flex items-center justify-center rounded-2xl"
                  style={{
                    width: 54,
                    height: 54,
                    background: p.bg,
                    border: `1px solid ${p.color}26`,
                    color: p.color,
                  }}
                >
                  {p.icon}
                </div>
                <span
                  className="text-[10px] font-semibold text-center leading-tight"
                  style={{ color: C.lightText }}
                >
                  {p.label}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 14,
            }}
          />

          {/* Copy link row */}
          <div className="flex gap-2">
            <div
              className="flex-1 flex items-center gap-2 px-3 py-[10px] rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <ExternalLink
                size={13}
                strokeWidth={1.8}
                style={{ color: C.lightText, flexShrink: 0 }}
              />
              <span
                className="text-[11.5px] truncate"
                style={{
                  color: "rgba(232,233,235,0.5)",
                  fontFamily: "monospace",
                  letterSpacing: "0.01em",
                }}
              >
                {shareUrl || `${opp.company} — ${opp.title}`}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="share-copy-btn flex items-center gap-1.5 px-3 py-[10px] rounded-xl font-semibold border outline-none cursor-pointer flex-shrink-0"
              style={{
                background: copied ? C.goldDim : "rgba(255,255,255,0.05)",
                borderColor: copied
                  ? "rgba(179,169,97,0.4)"
                  : "rgba(255,255,255,0.08)",
                color: copied ? C.gold : C.darkText,
                fontSize: "12.5px",
                transition: "all 0.2s",
              }}
            >
              {copied ? (
                <>
                  <Check size={13} strokeWidth={2.5} />
                  <span
                    style={{
                      animation:
                        "shareIconPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                    }}
                  >
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy size={13} strokeWidth={1.8} />
                  Copy link
                </>
              )}
            </button>
          </div>

          {/* Native share — mobile only */}
          {typeof navigator !== "undefined" && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="mt-3 w-full py-[11px] rounded-xl font-bold border-0 outline-none cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                color: "#1a1d24",
                fontSize: "13px",
              }}
            >
              <Share2 size={15} strokeWidth={2.2} />
              {nativeShared ? "Shared!" : "More options…"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function StyledSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl outline-none appearance-none cursor-pointer"
        style={{
          background: C.inputBg,
          border: `1px solid ${C.inputBorder}`,
          color: C.darkText,
          padding: "10px 36px 10px 14px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "13.5px",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(179,169,97,0.4)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = C.inputBorder;
        }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#1e2129" }}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: C.lightText }}
      />
    </div>
  );
}

function FilterTabs({ filters, selected, onSelect }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };
  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  const arrowStyle = (active) => ({
    background: active ? C.card : "transparent",
    border: `1px solid ${active ? C.inputBorder : "transparent"}`,
    color: active ? C.darkText : "transparent",
    cursor: active ? "pointer" : "default",
    pointerEvents: active ? "auto" : "none",
    flexShrink: 0,
    transition: "all 0.15s",
  });

  return (
    <div className="flex items-center gap-2 mb-5">
      <button
        onClick={() => scroll(-1)}
        className="flex items-center justify-center w-8 h-8 rounded-xl border-0 outline-none"
        style={arrowStyle(canLeft)}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex items-center gap-2 overflow-x-auto flex-1"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex items-center gap-2 w-max">
          {filters.map((f) => {
            const active = selected === f;
            return (
              <button
                key={f}
                onClick={() => onSelect(f)}
                className="filter-tab px-3 py-[7px] rounded-xl font-semibold outline-none cursor-pointer flex-shrink-0"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${C.gold}, #cfc060)`
                    : C.card,
                  color: active ? "#1a1d24" : C.lightText,
                  border: active
                    ? "1px solid transparent"
                    : `1px solid ${C.inputBorder}`,
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => scroll(1)}
        className="flex items-center justify-center w-8 h-8 rounded-xl border-0 outline-none"
        style={arrowStyle(canRight)}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: C.gold }}>{icon}</span>
      <h4
        className="text-[12.5px] font-bold uppercase tracking-wider"
        style={{ color: C.darkText }}
      >
        {title}
      </h4>
    </div>
  );
}

function getPostedLabel(createdAt) {
  if (!createdAt) return "Recently";
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return "Recently";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function matchesDuration(duration, filter) {
  if (filter === "Any duration") return true;
  const t = String(duration || "").toLowerCase();
  if (filter === "Less than 1 week") return t.includes("day");
  if (filter === "1-4 weeks") return t.includes("week");
  if (filter === "1+ months") return t.includes("month");
  if (filter === "Ongoing") return t.includes("ongoing");
  return true;
}
function matchesPosted(createdAt, filter) {
  if (filter === "Any time" || !createdAt) return true;
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return true;
  const days = (Date.now() - d.getTime()) / 86400000;
  if (filter === "Last 24 hours") return days <= 1;
  if (filter === "Last week") return days <= 7;
  if (filter === "Last month") return days <= 30;
  return true;
}

/* ─── Detail Panel ───────────────────────────────────────────────── */
function DetailPanel({ opp, onClose, onApply, applyingId, onShare }) {
  const [tab, setTab] = useState("overview");
  if (!opp) return null;

  const posted = getPostedLabel(opp.createdAt);
  const requirements = opp.requirements || opp.skills || [];
  const responsibilities = opp.responsibilities || [];
  const perks = opp.perks || [];

  const tabs = ["overview"];
  if (requirements.length > 0 || opp.experienceLevel || opp.applicationNote)
    tabs.push("requirements");
  if (
    opp.companyDescription ||
    opp.companySize ||
    opp.industry ||
    opp.founded ||
    opp.totalJobs ||
    opp.website
  )
    tabs.push("about");

  return (
    <>
      <div
        className="detail-overlay fixed inset-0 z-[1700] bg-black/50"
        onClick={onClose}
        style={{ backdropFilter: "blur(2px)" }}
      />
      <div
        className="detail-panel fixed top-0 right-0 h-[100dvh] z-[1800] flex flex-col"
        style={{
          width: "min(100vw, 520px)",
          background: C.panelBg2,
          borderLeft: `1px solid ${C.border}`,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: "-12px 0 60px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${C.gold}, #cfc060, transparent)`,
          }}
        />

        {/* Header */}
        <div className="px-5 pt-5 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <span
                className="inline-block text-[10.5px] font-semibold px-2.5 py-[3px] rounded-full mb-2"
                style={{
                  background: C.goldDim,
                  color: C.gold,
                  border: `1px solid rgba(179,169,97,0.2)`,
                }}
              >
                {opp.type}
              </span>
              <h2
                className="text-[18px] font-bold leading-snug mb-1"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {opp.title}
              </h2>
              <p className="text-[12.5px]" style={{ color: C.lightText }}>
                {opp.company}
              </p>
            </div>
            {/* Share + Close */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onShare(opp);
                }}
                className="share-trigger-btn flex items-center justify-center w-8 h-8 rounded-full border-0 outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: C.lightText,
                }}
                title="Share opportunity"
              >
                <Share2 size={14} strokeWidth={2} />
              </button>
              <button
                onClick={onClose}
                className="adv-btn-close flex items-center justify-center w-8 h-8 rounded-full border-0 outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: C.lightText,
                }}
              >
                <X size={15} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div
            className="grid grid-cols-2 gap-2 p-3 rounded-xl mb-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.inputBorder}`,
            }}
          >
            {[
              opp.location && {
                Icon: MapPin,
                label: "Location",
                val: opp.location,
              },
              opp.budget && {
                Icon: IndianRupee,
                label: "Budget",
                val: opp.budget,
              },
              opp.duration && {
                Icon: Clock,
                label: "Duration",
                val: opp.duration,
              },
              opp.createdAt && { Icon: Calendar, label: "Posted", val: posted },
            ]
              .filter(Boolean)
              .map(({ Icon, label, val }) => (
                <div key={label} className="flex items-start gap-2">
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0 mt-0.5"
                    style={{ background: C.goldDim }}
                  >
                    <Icon
                      size={12}
                      strokeWidth={1.8}
                      style={{ color: C.gold }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: C.lightText }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-[12px] font-semibold"
                      style={{ color: C.darkText }}
                    >
                      {val}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-0"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-[7px] rounded-lg text-[11.5px] font-semibold capitalize outline-none border-0 cursor-pointer transition-all"
                style={{
                  background: tab === t ? C.card : "transparent",
                  color: tab === t ? C.darkText : C.lightText,
                  boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${C.border} transparent`,
          }}
        >
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              {opp.description && (
                <div>
                  <SectionTitle
                    icon={<Layers size={13} />}
                    title="Project Overview"
                  />
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {opp.description}
                  </p>
                </div>
              )}
              {responsibilities.length > 0 && (
                <div>
                  <SectionTitle
                    icon={<Briefcase size={13} />}
                    title="Key Responsibilities"
                  />
                  <ul className="flex flex-col gap-2">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2
                          size={13}
                          strokeWidth={2}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: C.gold }}
                        />
                        <span
                          className="text-[12.5px]"
                          style={{ color: C.lightText }}
                        >
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {perks.length > 0 && (
                <div>
                  <SectionTitle
                    icon={<Star size={13} />}
                    title="What You Get"
                  />
                  <ul className="flex flex-col gap-2">
                    {perks.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: C.gold }}
                        />
                        <span
                          className="text-[12.5px]"
                          style={{ color: C.lightText }}
                        >
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {opp.tags?.length > 0 && (
                <div>
                  <SectionTitle icon={<Tag size={13} />} title="Tags" />
                  <div className="flex flex-wrap gap-1.5">
                    {opp.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: C.lightText,
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {!opp.description &&
                responsibilities.length === 0 &&
                perks.length === 0 &&
                !opp.tags?.length && (
                  <p
                    className="text-[12.5px] py-4 text-center"
                    style={{ color: "rgba(139,163,144,0.4)" }}
                  >
                    No additional details provided.
                  </p>
                )}
            </div>
          )}

          {tab === "requirements" && (
            <div className="flex flex-col gap-4">
              <div>
                <SectionTitle
                  icon={<CheckCircle2 size={13} />}
                  title="Requirements"
                />
                <ul className="flex flex-col gap-2">
                  {requirements.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid ${C.inputBorder}`,
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: C.goldDim,
                          border: `1px solid rgba(179,169,97,0.2)`,
                        }}
                      >
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: C.gold }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <span
                        className="text-[12.5px]"
                        style={{ color: C.lightText }}
                      >
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {opp.experienceLevel && (
                <div>
                  <SectionTitle
                    icon={<Users size={13} />}
                    title="Experience Level"
                  />
                  <span
                    className="text-[12px] font-semibold px-3 py-1.5 rounded-xl inline-block"
                    style={{
                      background: C.goldDim,
                      color: C.gold,
                      border: `1px solid rgba(179,169,97,0.2)`,
                    }}
                  >
                    {opp.experienceLevel}
                  </span>
                </div>
              )}
              {opp.applicationNote && (
                <div
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(179,169,97,0.06)",
                    border: `1px solid rgba(179,169,97,0.15)`,
                  }}
                >
                  <AlertCircle
                    size={15}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: C.gold }}
                  />
                  <p
                    className="text-[12.5px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {opp.applicationNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "about" && (
            <div className="flex flex-col gap-4">
              {opp.companyDescription && (
                <div>
                  <SectionTitle
                    icon={<Building2 size={13} />}
                    title="About the Company"
                  />
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: C.lightText }}
                  >
                    {opp.companyDescription}
                  </p>
                </div>
              )}
              {[
                opp.companySize && {
                  label: "Company Size",
                  val: opp.companySize,
                },
                opp.industry && { label: "Industry", val: opp.industry },
                opp.founded && { label: "Founded", val: opp.founded },
                opp.totalJobs && { label: "Jobs Posted", val: opp.totalJobs },
              ].filter(Boolean).length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    opp.companySize && {
                      label: "Company Size",
                      val: opp.companySize,
                    },
                    opp.industry && { label: "Industry", val: opp.industry },
                    opp.founded && { label: "Founded", val: opp.founded },
                    opp.totalJobs && {
                      label: "Jobs Posted",
                      val: opp.totalJobs,
                    },
                  ]
                    .filter(Boolean)
                    .map(({ label, val }) => (
                      <div
                        key={label}
                        className="p-3 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        <p
                          className="text-[10px] uppercase tracking-wide font-semibold mb-1"
                          style={{ color: C.lightText }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-[12.5px] font-semibold"
                          style={{ color: C.darkText }}
                        >
                          {val}
                        </p>
                      </div>
                    ))}
                </div>
              )}
              {opp.website && (
                <a
                  href={opp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[12.5px] font-semibold"
                  style={{ color: C.gold }}
                >
                  <ExternalLink size={13} />
                  {opp.website}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div
          className="px-5 pb-6 pt-3 flex-shrink-0"
          style={{ borderTop: `1px solid ${C.inputBorder}` }}
        >
          {/* Share button */}
          <button
            onClick={() => {
              onClose();
              onShare(opp);
            }}
            className="share-trigger-btn w-full py-[9px] rounded-xl font-semibold border outline-none cursor-pointer flex items-center justify-center gap-2 mb-2"
            style={{
              background: "transparent",
              border: `1px solid ${C.inputBorder}`,
              color: C.darkText,
              fontSize: "13px",
            }}
          >
            <Share2 size={14} strokeWidth={1.8} />
            Share this Opportunity
          </button>

          {opp.hasApplied ? (
            <div
              className="flex items-center justify-center gap-2 py-3 rounded-xl"
              style={{
                background: "rgba(179,169,97,0.1)",
                border: `1px solid rgba(179,169,97,0.2)`,
              }}
            >
              <CheckCircle2 size={15} style={{ color: C.gold }} />
              <span
                className="text-[13.5px] font-bold"
                style={{ color: C.gold }}
              >
                Application Submitted
              </span>
            </div>
          ) : (
            <button
              onClick={() => onApply(opp._id)}
              disabled={!opp._id || applyingId === opp._id}
              className="apply-btn w-full py-[12px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                color: "#1a1d24",
                opacity: !opp._id ? 0.65 : 1,
              }}
            >
              <Send size={14} strokeWidth={2.2} />
              {applyingId === opp._id
                ? "Submitting..."
                : "Apply for this Project"}
            </button>
          )}
          <p
            className="text-center text-[11px] mt-2"
            style={{ color: "rgba(139,163,144,0.45)" }}
          >
            Your profile will be shared with the poster
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function Opportunities() {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [durationFilter, setDurationFilter] = useState("Any duration");
  const [postedFilter, setPostedFilter] = useState("Any time");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(30000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const [detailOpp, setDetailOpp] = useState(null);
  const [shareOpp, setShareOpp] = useState(null); // ← NEW

  const rawApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(
    /\/+$/,
    "",
  );
  const apiRoot = rawApiBaseUrl
    ? rawApiBaseUrl.endsWith("/api")
      ? rawApiBaseUrl
      : `${rawApiBaseUrl}/api`
    : "/api";

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedFilter !== "All") params.set("type", selectedFilter);
        if (locationFilter !== "All locations")
          params.set("location", locationFilter);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (budgetMin > 0 || budgetMax < 30000) {
          params.set("minBudget", String(budgetMin));
          params.set("maxBudget", String(budgetMax));
        }
        const res = await fetch(
          `${apiRoot}/opportunities${params.toString() ? `?${params}` : ""}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setOpportunities(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.opportunities)
              ? data.opportunities
              : [],
        );
      } catch (err) {
        if (err.name === "AbortError") return;
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [
    apiRoot,
    budgetMax,
    budgetMin,
    locationFilter,
    searchQuery,
    selectedFilter,
  ]);

  const handleApply = async (opportunityId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/artist/login");
      return;
    }
    setApplyingId(opportunityId);
    try {
      const res = await fetch(`${apiRoot}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ opportunityId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply");
      setOpportunities((prev) =>
        prev.map((o) =>
          o._id === opportunityId ? { ...o, hasApplied: true } : o,
        ),
      );
      setDetailOpp((prev) =>
        prev?._id === opportunityId ? { ...prev, hasApplied: true } : prev,
      );
    } catch (err) {
      setError(err.message || "Could not submit application");
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = opportunities.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (selectedFilter === "All" || o.type === selectedFilter) &&
      (locationFilter === "All locations" ||
        (o.location || "").includes(locationFilter.split(",")[0])) &&
      (!q ||
        (o.title || "").toLowerCase().includes(q) ||
        (o.company || "").toLowerCase().includes(q) ||
        (o.type || "").toLowerCase().includes(q)) &&
      matchesDuration(o.duration, durationFilter) &&
      matchesPosted(o.createdAt, postedFilter)
    );
  });

  const activeFilterCount = [
    selectedFilter !== "All",
    locationFilter !== "All locations",
    durationFilter !== "Any duration",
    postedFilter !== "Any time",
    budgetMin > 0 || budgetMax < 30000,
  ].filter(Boolean).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideInRight {
          from { transform:translateX(100%); opacity:0.4; }
          to   { transform:translateX(0);    opacity:1; }
        }
        @keyframes fadeInBg { from { opacity:0; } to { opacity:1; } }

        /* ── Share Sheet Animations ── */
        @keyframes shareSlideUp {
          from { transform: translateY(100%) scale(0.97); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
        @keyframes shareIconPop {
          0%   { transform: scale(0.5) translateY(6px); opacity: 0; }
          70%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .opp-header  { animation: fadeUp 0.3s ease both; }
        .opp-search  { animation: fadeUp 0.32s 0.04s ease both; }
        .opp-card    { animation: fadeUp 0.32s ease both; transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
        .opp-card:hover {
          border-color: rgba(179,169,97,0.35) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.32);
          transform: translateY(-1px);
        }

        .apply-btn { transition: filter 0.18s, transform 0.18s; }
        .apply-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .apply-btn:active { transform: scale(0.97); }

        .detail-btn { transition: border-color 0.18s, color 0.18s, background 0.18s; }
        .detail-btn:hover {
          border-color: rgba(179,169,97,0.5) !important;
          color: #b3a961 !important;
          background: rgba(179,169,97,0.06) !important;
        }

        .filter-tab { transition: background 0.18s, color 0.18s, border-color 0.18s; }
        .sheet-panel    { animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        .sheet-overlay  { animation: fadeInBg 0.25s ease both; }
        .detail-panel   { animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        .detail-overlay { animation: fadeInBg 0.25s ease both; }

        .adv-btn-close { transition: background 0.15s, transform 0.2s; }
        .adv-btn-close:hover { background: rgba(255,255,255,0.1) !important; transform: rotate(90deg); }

        .back-btn-opp { transition: background 0.15s, color 0.15s; }
        .back-btn-opp:hover { background: rgba(255,255,255,0.07) !important; color: #b3a961 !important; }

        .filter-sheet-btn { transition: filter 0.15s, transform 0.15s; }
        .filter-sheet-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* ── Share Sheet Styles ── */
        .share-sheet-panel  { animation: shareSlideUp 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
        .share-icon-btn     { animation: shareIconPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .share-icon-btn:hover .share-icon-circle { filter: brightness(1.18); transform: scale(1.09); }
        .share-icon-btn:active .share-icon-circle { transform: scale(0.92); }
        .share-icon-circle  { transition: filter 0.18s, transform 0.18s; }
        .share-copy-btn     { transition: background 0.18s, color 0.18s, border-color 0.18s; }
        .share-copy-btn:hover { border-color: rgba(179,169,97,0.5) !important; background: rgba(179,169,97,0.08) !important; }
        .share-trigger-btn  { transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.15s; }
        .share-trigger-btn:hover { border-color: rgba(179,169,97,0.5) !important; color: #b3a961 !important; background: rgba(179,169,97,0.06) !important; transform: translateY(-1px); }
        .share-trigger-btn:active { transform: scale(0.95); }

        .range-track { position: relative; height: 4px; border-radius: 9999px; }
        .range-thumb {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; background: transparent;
          outline: none; position: absolute; top: 0; left: 0; pointer-events: none;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #b3a961; cursor: pointer; pointer-events: all;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
        .range-thumb::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: #b3a961; cursor: pointer; border: none;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }

        @media (max-width: 480px) {
          .opp-meta-grid { grid-template-columns: 1fr 1fr !important; }
          .opp-actions   { flex-direction: row !important; flex-wrap: wrap; }
        }
      `}</style>

      <Sidebar />

      {/* ── Share Sheet ── */}
      <ShareSheet opp={shareOpp} onClose={() => setShareOpp(null)} />

      {/* ── Advanced Filters Sheet ── */}
      {sheetOpen && (
        <>
          <div
            className="sheet-overlay fixed inset-0 z-[1500] bg-black/40"
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="sheet-panel fixed top-0 right-0 h-[100dvh] z-[1600] flex flex-col"
            style={{
              width: "min(100vw, 360px)",
              background: C.panelBg,
              borderLeft: `1px solid ${C.border}`,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="flex items-start justify-between px-5 pt-5 pb-4"
              style={{ borderBottom: `1px solid ${C.inputBorder}` }}
            >
              <div>
                <h2
                  className="text-[16px] font-bold mb-0.5"
                  style={{ color: C.darkText }}
                >
                  Advanced Filters
                </h2>
                <p className="text-[12px]" style={{ color: C.lightText }}>
                  Refine your search
                </p>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                className="adv-btn-close flex items-center justify-center w-7 h-7 rounded-full border-0 outline-none cursor-pointer flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: C.lightText,
                }}
              >
                <X size={14} strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {[
                {
                  label: "Category",
                  node: (
                    <StyledSelect
                      value={selectedFilter}
                      onChange={setSelectedFilter}
                      options={FILTERS}
                    />
                  ),
                },
                {
                  label: "Location",
                  node: (
                    <StyledSelect
                      value={locationFilter}
                      onChange={setLocationFilter}
                      options={LOCATIONS}
                    />
                  ),
                },
                {
                  label: "Project Duration",
                  node: (
                    <StyledSelect
                      value={durationFilter}
                      onChange={setDurationFilter}
                      options={DURATIONS}
                    />
                  ),
                },
                {
                  label: "Posted Within",
                  node: (
                    <StyledSelect
                      value={postedFilter}
                      onChange={setPostedFilter}
                      options={POSTED}
                    />
                  ),
                },
              ].map(({ label, node }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label
                    className="text-[12.5px] font-semibold"
                    style={{ color: C.darkText }}
                  >
                    {label}
                  </label>
                  {node}
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label
                  className="text-[12.5px] font-semibold"
                  style={{ color: C.darkText }}
                >
                  Budget:{" "}
                  <span style={{ color: C.gold }}>
                    ₹{budgetMin.toLocaleString()} – ₹
                    {budgetMax.toLocaleString()}
                  </span>
                </label>
                <div
                  className="range-track"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${(budgetMin / 30000) * 100}%`,
                      right: `${100 - (budgetMax / 30000) * 100}%`,
                      background: C.gold,
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={30000}
                    step={500}
                    value={budgetMin}
                    onChange={(e) => {
                      const v = +e.target.value;
                      if (v < budgetMax) setBudgetMin(v);
                    }}
                    className="range-thumb"
                    style={{ zIndex: budgetMin > 15000 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={30000}
                    step={500}
                    value={budgetMax}
                    onChange={(e) => {
                      const v = +e.target.value;
                      if (v > budgetMin) setBudgetMax(v);
                    }}
                    className="range-thumb"
                    style={{ zIndex: 4 }}
                  />
                </div>
              </div>
            </div>

            <div
              className="px-5 pb-6 pt-3 flex flex-col gap-2"
              style={{ borderTop: `1px solid ${C.inputBorder}` }}
            >
              <button
                onClick={() => setSheetOpen(false)}
                className="filter-sheet-btn w-full py-[11px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                  color: "#1a1d24",
                }}
              >
                Apply Filters
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedFilter("All");
                    setLocationFilter("All locations");
                    setDurationFilter("Any duration");
                    setPostedFilter("Any time");
                    setBudgetMin(0);
                    setBudgetMax(30000);
                  }}
                  className="w-full py-[10px] rounded-xl text-[13px] font-semibold border-0 outline-none cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: C.lightText,
                    border: `1px solid ${C.inputBorder}`,
                  }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Detail Panel ── */}
      <DetailPanel
        opp={detailOpp}
        onClose={() => setDetailOpp(null)}
        onApply={handleApply}
        applyingId={applyingId}
        onShare={(opp) => setShareOpp(opp)} // ← NEW
      />

      {/* ── Main Content ── */}
      <div
        className="min-h-screen lg:ml-[248px]"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1100px]">
          {/* ── Header ── */}
          <div className="opp-header flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="back-btn-opp flex items-center justify-center w-8 h-8 rounded-xl border-0 outline-none cursor-pointer flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: C.darkText,
                marginLeft: "10px",
                marginTop: "30px",
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>
            <div className="flex-1 min-w-0">
              <h1
                className="font-bold leading-tight mb-0"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(18px, 5vw, 28px)",
                  marginLeft: "10px",
                  marginTop: "30px",
                }}
              >
                Browse Opportunities
              </h1>
              <p
                className="hidden sm:block text-[13px]"
                style={{ color: C.lightText }}
              >
                Find your next creative project
              </p>
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-2 rounded-xl font-semibold border outline-none cursor-pointer flex-shrink-0"
              style={{
                background: C.card,
                borderColor:
                  activeFilterCount > 0
                    ? "rgba(179,169,97,0.4)"
                    : C.inputBorder,
                color: activeFilterCount > 0 ? C.gold : C.darkText,
                padding: "8px 12px",
                fontSize: "13px",
                marginLeft: "10px",
                marginTop: "30px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(179,169,97,0.35)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                  activeFilterCount > 0
                    ? "rgba(179,169,97,0.4)"
                    : C.inputBorder)
              }
            >
              <SlidersHorizontal size={15} strokeWidth={2} />
              <span className="hidden sm:inline">Advanced Filters</span>
              {activeFilterCount > 0 && (
                <span
                  className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                  style={{ background: C.gold, color: "#1a1d24" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Search ── */}
          <div className="opp-search relative mb-4">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: C.lightText }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, company or category..."
              className="w-full rounded-xl outline-none"
              style={{
                background: C.card,
                border: `1px solid ${C.inputBorder}`,
                color: C.darkText,
                padding: "10px 14px 10px 38px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13.5px",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(179,169,97,0.4)")
              }
              onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full border-0 outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: C.lightText,
                }}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* ── Filter Tabs ── */}
          <FilterTabs
            filters={FILTERS}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
          />

          {/* ── Result count ── */}
          <p className="text-[12px] mb-3" style={{ color: C.lightText }}>
            <span style={{ color: C.gold, fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "opportunity" : "opportunities"}
            {selectedFilter !== "All" && (
              <>
                {" "}
                in <span style={{ color: C.darkText }}>{selectedFilter}</span>
              </>
            )}
          </p>

          {isLoading && (
            <div
              className="text-center py-8 rounded-2xl mb-3"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <p className="text-[13.5px]" style={{ color: C.lightText }}>
                Loading opportunities...
              </p>
            </div>
          )}

          {error && (
            <div
              className="text-center py-3 rounded-2xl mb-3"
              style={{
                background: C.card,
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          {/* ── Cards ── */}
          <div className="flex flex-col gap-3">
            {filtered.map((opp, i) => (
              <div
                key={opp._id || opp.id}
                className="opp-card rounded-2xl p-4 sm:p-5"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  animationDelay: `${0.05 + i * 0.04}s`,
                }}
              >
                {/* Card top row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="font-bold leading-snug"
                        style={{
                          color: C.darkText,
                          fontSize: "clamp(14px, 3.5vw, 16px)",
                        }}
                      >
                        {opp.title}
                      </h3>
                      <span
                        className="text-[10.5px] font-semibold px-2 py-[2px] rounded-full flex-shrink-0"
                        style={{
                          background: C.goldDim,
                          color: C.gold,
                          border: `1px solid rgba(179,169,97,0.2)`,
                        }}
                      >
                        {opp.type}
                      </span>
                    </div>
                    <p className="text-[12px]" style={{ color: C.lightText }}>
                      {opp.company}
                    </p>
                  </div>
                  <span
                    className="text-[11px] flex-shrink-0 mt-0.5"
                    style={{ color: C.lightText }}
                  >
                    {opp.posted || getPostedLabel(opp.createdAt)}
                  </span>
                </div>

                {/* Meta info grid */}
                <div className="opp-meta-grid grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { Icon: MapPin, val: opp.location },
                    { Icon: IndianRupee, val: opp.budget },
                    { Icon: Clock, val: opp.duration },
                    { Icon: Calendar, val: "ASAP" },
                  ].map(({ Icon, val }, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Icon
                        size={12}
                        strokeWidth={1.8}
                        style={{ color: C.lightText, flexShrink: 0 }}
                      />
                      <span
                        className="text-[11.5px] truncate"
                        style={{ color: C.lightText }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action buttons — Apply | View Details | Share */}
                <div className="opp-actions flex gap-2 items-center">
                  <button
                    onClick={() => handleApply(opp._id)}
                    disabled={
                      !opp._id || applyingId === opp._id || opp.hasApplied
                    }
                    className="apply-btn px-4 py-[8px] rounded-xl font-bold border-0 outline-none cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                      color: "#1a1d24",
                      opacity: !opp._id || opp.hasApplied ? 0.65 : 1,
                      fontSize: "12.5px",
                    }}
                  >
                    {opp.hasApplied
                      ? "✓ Applied"
                      : applyingId === opp._id
                        ? "Applying..."
                        : "Apply Now"}
                  </button>
                  <button
                    onClick={() => setDetailOpp(opp)}
                    className="detail-btn px-4 py-[8px] rounded-xl font-semibold border-0 outline-none cursor-pointer"
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.inputBorder}`,
                      color: C.darkText,
                      fontSize: "12.5px",
                    }}
                  >
                    View Details
                  </button>

                  {/* ── Share Button ── */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareOpp(opp);
                    }}
                    className="share-trigger-btn flex items-center justify-center w-[36px] h-[36px] rounded-xl border-0 outline-none cursor-pointer ml-auto flex-shrink-0"
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.inputBorder}`,
                      color: C.lightText,
                    }}
                    title="Share this opportunity"
                  >
                    <Share2 size={15} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <div
                className="text-center py-14 rounded-2xl"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
              >
                <Search
                  size={32}
                  strokeWidth={1.2}
                  className="mx-auto mb-3"
                  style={{ color: "rgba(139,163,144,0.3)" }}
                />
                <p
                  className="text-[14px] font-semibold mb-1"
                  style={{ color: C.darkText }}
                >
                  No opportunities found
                </p>
                <p className="text-[12.5px]" style={{ color: C.lightText }}>
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
