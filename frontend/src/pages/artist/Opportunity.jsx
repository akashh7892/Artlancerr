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
  Share2,
  Copy,
  Check,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

// ─── Design tokens ────────────────────────────────────────────────────────────
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

// ─── Filter data ──────────────────────────────────────────────────────────────
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

// ─── Social platform definitions ──────────────────────────────────────────────
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
    getUrl: (msg) => `https://wa.me/?text=${encodeURIComponent(msg)}`,
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
    getUrl: (msg, url) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`,
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
    getUrl: (msg, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(url)}`,
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
    getUrl: (_, url) =>
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
    getUrl: (_, url) =>
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
    getUrl: (msg) =>
      `https://www.threads.net/intent/post?text=${encodeURIComponent(msg)}`,
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
    getUrl: (msg) =>
      `mailto:?subject=${encodeURIComponent("Film Opportunity — Check this out!")}&body=${encodeURIComponent(msg)}`,
  },
];

// ─── Share Sheet ──────────────────────────────────────────────────────────────
function ShareSheet({ opp, onClose }) {
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);
  const [nativeShared, setNativeShared] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!opp) return null;

  // ── Correct share URL — uses the public /artist/opportunity/:id route ──
  const shareUrl =
    typeof window !== "undefined" && opp._id
      ? `${window.location.origin}/artist/opportunity/${opp._id}`
      : `${window.location.origin}/artist/opportunities`;

  // ── Rich share message with all details + working link ──
  const shareMessage = [
    `🎬 ${opp.title}`,
    opp.company ? `🏢 ${opp.company}` : null,
    opp.type ? `Role: ${opp.type}` : null,
    opp.location ? `📍 ${opp.location}` : null,
    opp.budget ? `💰 Budget: ${opp.budget}` : null,
    opp.duration ? `⏱️ Duration: ${opp.duration}` : null,
    ``,
    `View & apply here 👇`,
    shareUrl,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: opp.title,
          text: shareMessage,
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

  const handlePlatformClick = (platform) => {
    if (platform.action === "copy") {
      navigator.clipboard
        .writeText(shareMessage)
        .then(() => {
          setInstaCopied(true);
          setTimeout(() => setInstaCopied(false), 2800);
        })
        .catch(() => {});
      return;
    }
    const url = platform.getUrl(shareMessage, shareUrl);
    if (url)
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=520");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          animation: "ssBackdrop 0.2s ease both",
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2100,
          maxWidth: 560,
          margin: "0 auto",
          background: "linear-gradient(180deg,#1e2129 0%,#191c23 100%)",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(179,169,97,0.18)",
          borderBottom: "none",
          boxShadow: "0 -24px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          animation: "ssSlideUp 0.38s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Gold top accent */}
        <div
          style={{
            height: 3,
            background:
              "linear-gradient(90deg,transparent,#b3a961,#cfc060,transparent)",
            borderRadius: "24px 24px 0 0",
          }}
        />

        {/* Drag handle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0 4px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        </div>

        <div style={{ padding: "4px 20px 32px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: "0 0 3px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(179,169,97,0.65)",
                }}
              >
                Share Opportunity
              </p>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.darkText,
                  fontFamily: "'Playfair Display',serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {opp.title}
              </h3>
              <p
                style={{ margin: "2px 0 0", fontSize: 12, color: C.lightText }}
              >
                {opp.company}
                {opp.location ? ` • ${opp.location}` : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                border: "none",
                cursor: "pointer",
                color: C.lightText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s,transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          {/* Message preview */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(179,169,97,0.12)",
              borderRadius: 10,
              padding: "10px 12px",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                margin: "0 0 5px",
                fontSize: 10.5,
                fontWeight: 700,
                color: "rgba(179,169,97,0.55)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              What gets shared
            </p>
            <pre
              style={{
                margin: 0,
                fontSize: 11.5,
                color: C.lightText,
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                lineHeight: 1.65,
              }}
            >
              {shareMessage}
            </pre>
          </div>

          {/* Instagram copy toast */}
          {instaCopied && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 10,
                marginBottom: 12,
                background: "rgba(228,64,95,0.1)",
                border: "1px solid rgba(228,64,95,0.25)",
                animation: "ssBackdrop 0.2s ease both",
              }}
            >
              <Check
                size={13}
                strokeWidth={2.5}
                style={{ color: "#E4405F", flexShrink: 0 }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#E4405F",
                }}
              >
                Copied! Open Instagram and paste in your story or bio.
              </p>
            </div>
          )}

          {/* Platform grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "10px 6px",
              marginBottom: 16,
            }}
          >
            {SHARE_PLATFORMS.map((platform, i) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform)}
                title={platform.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  animation: `ssIconPop 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.035}s both`,
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    background: platform.bg,
                    border: `1px solid ${platform.color}28`,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: platform.color,
                    transition: "filter 0.18s, transform 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "brightness(1.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "none";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {platform.icon}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: C.lightText,
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {platform.label}
                </span>
              </button>
            ))}
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 12,
            }}
          />

          {/* Copy full message */}
          <button
            onClick={handleCopy}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: copied ? C.goldDim : "rgba(255,255,255,0.05)",
              border: `1px solid ${copied ? "rgba(179,169,97,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: copied ? C.gold : C.darkText,
              transition: "all 0.2s",
              marginBottom:
                typeof navigator !== "undefined" && navigator.share ? 8 : 0,
            }}
          >
            {copied ? (
              <>
                <Check size={14} strokeWidth={2.5} /> Message Copied!
              </>
            ) : (
              <>
                <Copy size={14} strokeWidth={1.8} /> Copy Full Message
              </>
            )}
          </button>

          {/* Native share (mobile) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <button
              onClick={handleNativeShare}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: `linear-gradient(135deg,${C.gold},#cfc060)`,
                color: "#1a1d24",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Share2 size={15} strokeWidth={2.2} />
              {nativeShared ? "Shared!" : "Share via…"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Utility components ───────────────────────────────────────────────────────
function StyledSelect({ value, onChange, options }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          borderRadius: 10,
          outline: "none",
          appearance: "none",
          cursor: "pointer",
          background: C.inputBg,
          border: `1px solid ${C.inputBorder}`,
          color: C.darkText,
          padding: "10px 36px 10px 14px",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "13.5px",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(179,169,97,0.4)")}
        onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#1e2129" }}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: C.lightText,
        }}
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

  const arrowBtn = (active) => ({
    background: active ? C.card : "transparent",
    border: `1px solid ${active ? C.inputBorder : "transparent"}`,
    color: active ? C.darkText : "transparent",
    cursor: active ? "pointer" : "default",
    pointerEvents: active ? "auto" : "none",
    flexShrink: 0,
    transition: "all 0.15s",
    width: 32,
    height: 32,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
      }}
    >
      <button style={arrowBtn(canLeft)} onClick={() => scroll(-1)}>
        <ChevronLeft size={16} strokeWidth={2} />
      </button>
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          flex: 1,
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "max-content",
          }}
        >
          {filters.map((f) => {
            const active = selected === f;
            return (
              <button
                key={f}
                onClick={() => onSelect(f)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  fontSize: 12,
                  background: active
                    ? `linear-gradient(135deg,${C.gold},#cfc060)`
                    : C.card,
                  color: active ? "#1a1d24" : C.lightText,
                  border: active
                    ? "1px solid transparent"
                    : `1px solid ${C.inputBorder}`,
                  transition: "background 0.18s,color 0.18s,border-color 0.18s",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
      <button style={arrowBtn(canRight)} onClick={() => scroll(1)}>
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <span style={{ color: C.gold }}>{icon}</span>
      <h4
        style={{
          margin: 0,
          fontSize: 12.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: C.darkText,
        }}
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
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
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
  const days = (Date.now() - d.getTime()) / 86_400_000;
  if (filter === "Last 24 hours") return days <= 1;
  if (filter === "Last week") return days <= 7;
  if (filter === "Last month") return days <= 30;
  return true;
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
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

  const metaItems = [
    opp.location && { Icon: MapPin, label: "Location", val: opp.location },
    opp.budget && { Icon: IndianRupee, label: "Budget", val: opp.budget },
    opp.duration && { Icon: Clock, label: "Duration", val: opp.duration },
    opp.createdAt && { Icon: Calendar, label: "Posted", val: posted },
  ].filter(Boolean);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1700,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
          animation: "ssBackdrop 0.25s ease both",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100dvh",
          zIndex: 1800,
          width: "min(100vw,520px)",
          background: C.panelBg2,
          borderLeft: `1px solid ${C.border}`,
          boxShadow: "-12px 0 60px rgba(0,0,0,0.55)",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both",
        }}
      >
        {/* Gold top bar */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg,${C.gold},#cfc060,transparent)`,
            flexShrink: 0,
          }}
        />

        {/* Header */}
        <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 9999,
                  marginBottom: 8,
                  background: C.goldDim,
                  color: C.gold,
                  border: "1px solid rgba(179,169,97,0.2)",
                }}
              >
                {opp.type}
              </span>
              <h2
                style={{
                  margin: "0 0 4px",
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: C.darkText,
                  fontFamily: "'Playfair Display',serif",
                }}
              >
                {opp.title}
              </h2>
              <p style={{ margin: 0, fontSize: 12.5, color: C.lightText }}>
                {opp.company}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {/* Share icon in header */}
              <button
                onClick={() => onShare(opp)}
                title="Share"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  cursor: "pointer",
                  color: C.lightText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s,color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = C.lightText;
                }}
              >
                <Share2 size={14} strokeWidth={2} />
              </button>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  cursor: "pointer",
                  color: C.lightText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s,transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
              >
                <X size={15} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Meta grid */}
          {metaItems.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                padding: 12,
                borderRadius: 10,
                marginBottom: 16,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.inputBorder}`,
              }}
            >
              {metaItems.map(({ Icon, label, val }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: C.goldDim,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Icon
                      size={12}
                      strokeWidth={1.8}
                      style={{ color: C.gold }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: C.lightText,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.darkText,
                      }}
                    >
                      {val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 4,
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              marginBottom: 0,
            }}
          >
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: 600,
                  textTransform: "capitalize",
                  outline: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
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

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            scrollbarWidth: "thin",
            scrollbarColor: `${C.border} transparent`,
          }}
        >
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {opp.description && (
                <div>
                  <SectionTitle
                    icon={<Layers size={13} />}
                    title="Project Overview"
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: C.lightText,
                    }}
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
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {responsibilities.map((r, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <CheckCircle2
                          size={13}
                          strokeWidth={2}
                          style={{ color: C.gold, flexShrink: 0, marginTop: 2 }}
                        />
                        <span style={{ fontSize: 12.5, color: C.lightText }}>
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
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {perks.map((p, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: C.gold,
                            flexShrink: 0,
                            marginTop: 6,
                          }}
                        />
                        <span style={{ fontSize: 12.5, color: C.lightText }}>
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
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {opp.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: "4px 10px",
                          borderRadius: 9999,
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
                    style={{
                      textAlign: "center",
                      padding: "24px 0",
                      fontSize: 12.5,
                      color: "rgba(139,163,144,0.4)",
                    }}
                  >
                    No additional details provided.
                  </p>
                )}
            </div>
          )}

          {tab === "requirements" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {requirements.length > 0 && (
                <div>
                  <SectionTitle
                    icon={<CheckCircle2 size={13} />}
                    title="Requirements"
                  />
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {requirements.map((r, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: 12,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.025)",
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: C.goldDim,
                            border: "1px solid rgba(179,169,97,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.gold,
                            }}
                          >
                            {i + 1}
                          </span>
                        </div>
                        <span style={{ fontSize: 12.5, color: C.lightText }}>
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {opp.experienceLevel && (
                <div>
                  <SectionTitle
                    icon={<Users size={13} />}
                    title="Experience Level"
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 14px",
                      borderRadius: 10,
                      display: "inline-block",
                      background: C.goldDim,
                      color: C.gold,
                      border: "1px solid rgba(179,169,97,0.2)",
                    }}
                  >
                    {opp.experienceLevel}
                  </span>
                </div>
              )}
              {opp.applicationNote && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: 12,
                    borderRadius: 10,
                    background: "rgba(179,169,97,0.06)",
                    border: "1px solid rgba(179,169,97,0.15)",
                  }}
                >
                  <AlertCircle
                    size={15}
                    style={{ color: C.gold, flexShrink: 0, marginTop: 2 }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: C.lightText,
                    }}
                  >
                    {opp.applicationNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "about" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {opp.companyDescription && (
                <div>
                  <SectionTitle
                    icon={<Building2 size={13} />}
                    title="About the Company"
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: C.lightText,
                    }}
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
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
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.025)",
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontWeight: 600,
                            color: C.lightText,
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: C.darkText,
                          }}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.gold,
                    textDecoration: "none",
                  }}
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
          style={{
            padding: "12px 20px 24px",
            flexShrink: 0,
            borderTop: `1px solid ${C.inputBorder}`,
          }}
        >
          {/* Share this opportunity button */}
          <button
            onClick={() => onShare(opp)}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: 10,
              cursor: "pointer",
              background: "transparent",
              border: `1px solid ${C.inputBorder}`,
              color: C.darkText,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
              transition: "border-color 0.18s,color 0.18s,background 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(179,169,97,0.5)";
              e.currentTarget.style.color = C.gold;
              e.currentTarget.style.background = C.goldDim;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.inputBorder;
              e.currentTarget.style.color = C.darkText;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Share2 size={14} strokeWidth={1.8} />
            Share this Opportunity
          </button>

          {opp.hasApplied ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px",
                borderRadius: 10,
                background: "rgba(179,169,97,0.1)",
                border: "1px solid rgba(179,169,97,0.2)",
              }}
            >
              <CheckCircle2 size={15} style={{ color: C.gold }} />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.gold }}>
                Application Submitted
              </span>
            </div>
          ) : (
            <button
              onClick={() => onApply(opp._id)}
              disabled={!opp._id || applyingId === opp._id}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: `linear-gradient(135deg,${C.gold},#cfc060)`,
                color: "#1a1d24",
                fontSize: 13.5,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: !opp._id ? 0.65 : 1,
                transition: "filter 0.18s,transform 0.18s",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.filter = "brightness(1.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <Send size={14} strokeWidth={2.2} />
              {applyingId === opp._id
                ? "Submitting..."
                : "Apply for this Project"}
            </button>
          )}
          <p
            style={{
              textAlign: "center",
              margin: "8px 0 0",
              fontSize: 11,
              color: "rgba(139,163,144,0.45)",
            }}
          >
            Your profile will be shared with the poster
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Main Opportunities page ──────────────────────────────────────────────────
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
  const [shareOpp, setShareOpp] = useState(null); // ← share state

  const rawBase = String(import.meta.env.VITE_API_BASE_URL || "").replace(
    /\/+$/,
    "",
  );
  const apiRoot = rawBase
    ? rawBase.endsWith("/api")
      ? rawBase
      : `${rawBase}/api`
    : "/api";

  // Fetch opportunities
  useEffect(() => {
    const ctrl = new AbortController();
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
          { signal: ctrl.signal },
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
    return () => ctrl.abort();
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

  // Client-side filtering
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

  // Shared button hover helper
  const hoverGold = (e) => {
    e.currentTarget.style.borderColor = "rgba(179,169,97,0.5)";
    e.currentTarget.style.color = C.gold;
    e.currentTarget.style.background = C.goldDim;
  };
  const unhoverGold = (e) => {
    e.currentTarget.style.borderColor = C.inputBorder;
    e.currentTarget.style.color = C.darkText;
    e.currentTarget.style.background = "transparent";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes ssBackdrop  { from{opacity:0} to{opacity:1} }
        @keyframes ssSlideUp   { from{transform:translateY(100%) scale(0.97);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
        @keyframes ssIconPop   { 0%{transform:scale(0.5) translateY(6px);opacity:0} 70%{transform:scale(1.12);opacity:1} 100%{transform:scale(1);opacity:1} }
        @keyframes slideInRight{ from{transform:translateX(100%);opacity:0.4} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        .opp-card { transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; animation: fadeUp 0.32s ease both; }
        .opp-card:hover { border-color: rgba(179,169,97,0.35) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.32); transform: translateY(-1px); }

        .range-track { position: relative; height: 4px; border-radius: 9999px; }
        .range-thumb { -webkit-appearance:none; appearance:none; width:100%; height:4px; background:transparent; outline:none; position:absolute; top:0; left:0; pointer-events:none; }
        .range-thumb::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#b3a961; cursor:pointer; pointer-events:all; box-shadow:0 1px 6px rgba(0,0,0,0.4); }
        .range-thumb::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#b3a961; cursor:pointer; border:none; }
      `}</style>

      <Sidebar />

      {/* ── Share Sheet ── */}
      {shareOpp && (
        <ShareSheet opp={shareOpp} onClose={() => setShareOpp(null)} />
      )}

      {/* ── Advanced Filters Sheet ── */}
      {sheetOpen && (
        <>
          <div
            onClick={() => setSheetOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1500,
              background: "rgba(0,0,0,0.4)",
              animation: "ssBackdrop 0.25s ease both",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100dvh",
              zIndex: 1600,
              width: "min(100vw,360px)",
              background: C.panelBg,
              borderLeft: `1px solid ${C.border}`,
              boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              animation: "slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "20px 20px 16px",
                borderBottom: `1px solid ${C.inputBorder}`,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: "0 0 2px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.darkText,
                  }}
                >
                  Advanced Filters
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: C.lightText }}>
                  Refine your search
                </p>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  cursor: "pointer",
                  color: C.lightText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s,transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "rotate(0)";
                }}
              >
                <X size={14} strokeWidth={2.2} />
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                {
                  label: "Category",
                  el: (
                    <StyledSelect
                      value={selectedFilter}
                      onChange={setSelectedFilter}
                      options={FILTERS}
                    />
                  ),
                },
                {
                  label: "Location",
                  el: (
                    <StyledSelect
                      value={locationFilter}
                      onChange={setLocationFilter}
                      options={LOCATIONS}
                    />
                  ),
                },
                {
                  label: "Project Duration",
                  el: (
                    <StyledSelect
                      value={durationFilter}
                      onChange={setDurationFilter}
                      options={DURATIONS}
                    />
                  ),
                },
                {
                  label: "Posted Within",
                  el: (
                    <StyledSelect
                      value={postedFilter}
                      onChange={setPostedFilter}
                      options={POSTED}
                    />
                  ),
                },
              ].map(({ label, el }) => (
                <div key={label}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: C.darkText,
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  {el}
                </div>
              ))}

              {/* Budget range */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.darkText,
                    marginBottom: 8,
                  }}
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
                    style={{
                      position: "absolute",
                      top: 0,
                      height: "100%",
                      borderRadius: 9999,
                      background: C.gold,
                      left: `${(budgetMin / 30000) * 100}%`,
                      right: `${100 - (budgetMax / 30000) * 100}%`,
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
              style={{
                padding: "12px 20px 24px",
                borderTop: `1px solid ${C.inputBorder}`,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <button
                onClick={() => setSheetOpen(false)}
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: `linear-gradient(135deg,${C.gold},#cfc060)`,
                  color: "#1a1d24",
                  fontSize: 13.5,
                  fontWeight: 700,
                  transition: "filter 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.filter = "brightness(1.08)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
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
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${C.inputBorder}`,
                    color: C.lightText,
                    fontSize: 13,
                    fontWeight: 600,
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
        onShare={(opp) => {
          setDetailOpp(null);
          setShareOpp(opp);
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
        className="lg:ml-[248px]"
      >
        <div style={{ padding: "24px 16px", maxWidth: 1100, margin: "0 auto" }}>
          {/* Page header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              animation: "fadeUp 0.3s ease both",
            }}
          >
            <button
              onClick={() => navigate("/artist/dashboard")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: "none",
                cursor: "pointer",
                color: C.darkText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 30,
                marginLeft: 10,
                transition: "background 0.15s,color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = C.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = C.darkText;
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>
            <div
              style={{ flex: 1, minWidth: 0, marginTop: 30, marginLeft: 10 }}
            >
              <h1
                style={{
                  margin: "0 0 2px",
                  fontFamily: "'Playfair Display',serif",
                  fontWeight: 700,
                  color: C.darkText,
                  fontSize: "clamp(18px,5vw,28px)",
                }}
              >
                Browse Opportunities
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: C.lightText }}>
                Find your next creative project
              </p>
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: C.card,
                border: `1px solid ${activeFilterCount > 0 ? "rgba(179,169,97,0.4)" : C.inputBorder}`,
                color: activeFilterCount > 0 ? C.gold : C.darkText,
                flexShrink: 0,
                marginTop: 30,
                marginLeft: 10,
                transition: "border-color 0.18s",
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
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: C.gold,
                    color: "#1a1d24",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div
            style={{
              position: "relative",
              marginBottom: 16,
              animation: "fadeUp 0.32s 0.04s ease both",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: C.lightText,
              }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, company or category..."
              style={{
                width: "100%",
                borderRadius: 10,
                outline: "none",
                background: C.card,
                border: `1px solid ${C.inputBorder}`,
                color: C.darkText,
                padding: "10px 14px 10px 40px",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: "13.5px",
                boxSizing: "border-box",
                transition: "border-color 0.18s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(179,169,97,0.4)")
              }
              onBlur={(e) => (e.target.style.borderColor = C.inputBorder)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  cursor: "pointer",
                  color: C.lightText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <FilterTabs
            filters={FILTERS}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
          />

          {/* Result count */}
          <p style={{ margin: "0 0 12px", fontSize: 12, color: C.lightText }}>
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

          {/* Loading / error states */}
          {isLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                borderRadius: 16,
                background: C.card,
                border: `1px solid ${C.border}`,
                marginBottom: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 13.5, color: C.lightText }}>
                Loading opportunities...
              </p>
            </div>
          )}
          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "12px",
                borderRadius: 16,
                background: C.card,
                border: "1px solid rgba(239,68,68,0.25)",
                marginBottom: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 13, color: "#f87171" }}>
                {error}
              </p>
            </div>
          )}

          {/* Opportunity cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((opp, i) => (
              <div
                key={opp._id || opp.id}
                className="opp-card"
                style={{
                  borderRadius: 16,
                  padding: "16px 20px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  animationDelay: `${0.05 + i * 0.04}s`,
                }}
              >
                {/* Card top */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 2,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontWeight: 700,
                          color: C.darkText,
                          fontSize: "clamp(14px,3.5vw,16px)",
                          lineHeight: 1.3,
                        }}
                      >
                        {opp.title}
                      </h3>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          background: C.goldDim,
                          color: C.gold,
                          border: "1px solid rgba(179,169,97,0.2)",
                          flexShrink: 0,
                        }}
                      >
                        {opp.type}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: C.lightText }}>
                      {opp.company}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: C.lightText,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {opp.posted || getPostedLabel(opp.createdAt)}
                  </span>
                </div>

                {/* Meta row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: 8,
                    marginBottom: 16,
                  }}
                  className="sm:grid-cols-4"
                >
                  {[
                    { Icon: MapPin, val: opp.location },
                    { Icon: IndianRupee, val: opp.budget },
                    { Icon: Clock, val: opp.duration },
                    { Icon: Calendar, val: "ASAP" },
                  ].map(({ Icon, val }, idx) => (
                    <div
                      key={idx}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Icon
                        size={12}
                        strokeWidth={1.8}
                        style={{ color: C.lightText, flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: 11.5,
                          color: C.lightText,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {/* Apply */}
                  <button
                    onClick={() => handleApply(opp._id)}
                    disabled={
                      !opp._id || applyingId === opp._id || opp.hasApplied
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: `linear-gradient(135deg,${C.gold},#cfc060)`,
                      color: "#1a1d24",
                      fontWeight: 700,
                      fontSize: 12.5,
                      opacity: !opp._id || opp.hasApplied ? 0.65 : 1,
                      transition: "filter 0.18s,transform 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.filter = "brightness(1.1)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    {opp.hasApplied
                      ? "✓ Applied"
                      : applyingId === opp._id
                        ? "Applying..."
                        : "Apply Now"}
                  </button>

                  {/* View Details */}
                  <button
                    onClick={() => setDetailOpp(opp)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background: "transparent",
                      border: `1px solid ${C.inputBorder}`,
                      color: C.darkText,
                      fontWeight: 600,
                      fontSize: 12.5,
                      transition:
                        "border-color 0.18s,color 0.18s,background 0.18s",
                    }}
                    onMouseEnter={hoverGold}
                    onMouseLeave={unhoverGold}
                  >
                    View Details
                  </button>

                  {/* Share — right-aligned */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareOpp(opp);
                    }}
                    title="Share this opportunity"
                    style={{
                      marginLeft: "auto",
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      cursor: "pointer",
                      background: "transparent",
                      border: `1px solid ${C.inputBorder}`,
                      color: C.lightText,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition:
                        "border-color 0.18s,color 0.18s,background 0.18s,transform 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(179,169,97,0.5)";
                      e.currentTarget.style.color = C.gold;
                      e.currentTarget.style.background = C.goldDim;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.inputBorder;
                      e.currentTarget.style.color = C.lightText;
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <Share2 size={15} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "56px 16px",
                  borderRadius: 16,
                  background: C.card,
                  border: `1px solid ${C.border}`,
                }}
              >
                <Search
                  size={32}
                  strokeWidth={1.2}
                  style={{
                    color: "rgba(139,163,144,0.3)",
                    display: "block",
                    margin: "0 auto 12px",
                  }}
                />
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.darkText,
                  }}
                >
                  No opportunities found
                </p>
                <p style={{ margin: 0, fontSize: 12.5, color: C.lightText }}>
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
