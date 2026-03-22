import { motion, AnimatePresence } from "motion/react";
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
  X,
  Eye,
  Edit3,
  Save,
  User,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  Star,
  Search,
  Trash2,
  Share2,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#2d3139",
  cardDeep: "#22252e",
  input: "#1a1d24",
  border: "rgba(201,169,97,0.15)",
  gold: "#c9a961",
  goldGlow: "rgba(201,169,97,0.18)",
  goldDim: "rgba(201,169,97,0.10)",
  text: "#ffffff",
  muted: "#9ca3af",
  mutedLight: "#6b7280",
  success: "#4ade80",
  successBg: "rgba(74,222,128,0.12)",
  successBorder: "rgba(74,222,128,0.25)",
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.12)",
  warn: "#fbbf24",
  warnBg: "rgba(251,191,36,0.12)",
  info: "#93c5fd",
  infoBg: "rgba(147,197,253,0.12)",
};

// ─── Project type groups ──────────────────────────────────────────────────────
const PROJECT_TYPE_GROUPS = [
  {
    group: "🎬 Production Types",
    items: [
      "Film & TV Production",
      "Advertising & Commercial Shoots",
      "Music Videos",
      "Event Videography",
      "Wedding Cinematography",
      "Documentary Production",
      "Streaming Content Production",
      "Corporate Video Production",
      "Training Content Creation",
      "Marketing Media Teams",
      "Internal Communication Studios",
    ],
  },
  {
    group: "🎭 Performing Arts",
    items: [
      "Actor",
      "Lead Actor",
      "Supporting Actor",
      "Background Artist",
      "Voice Artist",
      "Dancer",
      "Choreographer",
      "Stunt Coordinator",
    ],
  },
  {
    group: "🎥 Film Crew",
    items: [
      "Director",
      "Assistant Director",
      "Cinematographer",
      "Camera Operator",
      "Lighting Director",
      "Colorist",
      "Film Editor",
      "Sound Designer",
    ],
  },
  {
    group: "✍️ Writing & Creative",
    items: [
      "Screenwriter",
      "Dialogue Writer",
      "Lyricist",
      "Writer",
      "Casting Director",
      "Producer",
      "Art Director",
      "Production Designer",
      "Costume Designer",
      "Makeup Artist",
    ],
  },
  {
    group: "💻 Digital & Tech",
    items: [
      "VFX Artist",
      "3D Animation Teams",
      "Game Cinematics",
      "Motion Capture Crews",
      "Virtual Production Specialists",
      "Unreal Engine Artists",
      "Music Composer",
    ],
  },
  {
    group: "📱 Creator Economy",
    items: [
      "YouTubers Hiring Editors",
      "Influencers Hiring Videographers",
      "Podcast Production Teams",
      "Social Media Content Studios",
      "Brand Creator Collaborations",
    ],
  },
  { group: "🎯 Other", items: ["Other"] },
];
const ALL_PROJECT_TYPES = PROJECT_TYPE_GROUPS.flatMap((g) =>
  g.items.map((item) => ({ value: item, label: item, group: g.group })),
);

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
    color: "#c9a961",
    bg: "rgba(201,169,97,0.12)",
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
function ShareSheet({ post, onClose }) {
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

  if (!post) return null;

  // ── Correct share URL — uses the public /artist/opportunity/:id route ──
  const shareUrl =
    typeof window !== "undefined" && post._id
      ? `${window.location.origin}/artist/opportunity/${post._id}`
      : `${window.location.origin}/artist/opportunities`;

  // ── Rich share message with all details + working link ──
  const shareMessage = [
    `🎬 ${post.title}`,
    post.type ? `Role: ${post.type}` : null,
    post.location ? `📍 ${post.location}` : null,
    post.budget ? `💰 Budget: ${post.budget}` : null,
    post.duration ? `⏱️ Duration: ${post.duration}` : null,
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
          title: post.title,
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
    <AnimatePresence>
      <motion.div
        key="pr-share-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3000,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <motion.div
          key="pr-share-sheet"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 560,
            background: "linear-gradient(180deg,#22252e 0%,#1a1d24 100%)",
            borderRadius: "24px 24px 0 0",
            border: "1px solid rgba(201,169,97,0.18)",
            borderBottom: "none",
            boxShadow: "0 -24px 80px rgba(0,0,0,0.7)",
            fontFamily: "inherit",
            overflow: "hidden",
          }}
        >
          {/* Gold top accent */}
          <div
            style={{
              height: 3,
              background:
                "linear-gradient(90deg,transparent,#c9a961,#e8c97a,transparent)",
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
                    color: "rgba(201,169,97,0.65)",
                  }}
                >
                  Share Opportunity
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.title}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>
                  {post.type || "Requirement"}
                  {post.location ? ` • ${post.location}` : ""}
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
                  color: C.muted,
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
                border: "1px solid rgba(201,169,97,0.12)",
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
                  color: "rgba(201,169,97,0.55)",
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
                  color: C.muted,
                  fontFamily: "inherit",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.65,
                }}
              >
                {shareMessage}
              </pre>
            </div>

            {/* Instagram copy toast */}
            <AnimatePresence>
              {instaCopied && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 10,
                    marginBottom: 12,
                    background: "rgba(228,64,95,0.1)",
                    border: "1px solid rgba(228,64,95,0.25)",
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
                </motion.div>
              )}
            </AnimatePresence>

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
                <motion.button
                  key={platform.id}
                  initial={{ opacity: 0, y: 10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.035,
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                  }}
                  whileTap={{ scale: 0.9 }}
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
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
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
                    }}
                  >
                    {platform.icon}
                  </motion.div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.muted,
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {platform.label}
                  </span>
                </motion.button>
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
            <motion.button
              whileTap={{ scale: 0.97 }}
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
                background: copied
                  ? "rgba(201,169,97,0.12)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${copied ? "rgba(201,169,97,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: copied ? C.gold : "#fff",
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
            </motion.button>

            {/* Native share (mobile) */}
            {typeof navigator !== "undefined" && navigator.share && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNativeShare}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: `linear-gradient(135deg,${C.gold},#a8863d)`,
                  border: "none",
                  borderRadius: 10,
                  color: "#1a1d24",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                }}
              >
                <Share2 size={14} strokeWidth={2.2} />
                {nativeShared ? "Shared!" : "Share via…"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Project Type Picker ──────────────────────────────────────────────────────
function ProjectTypePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? ALL_PROJECT_TYPES.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 14,
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
          background: C.input,
          border: `1px solid ${open ? C.gold : C.border}`,
          color: value ? C.text : C.muted,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          boxShadow: open ? `0 0 0 3px ${C.goldGlow}` : "none",
          transition: "border-color 0.2s",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {value || "Select project type / role"}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: C.muted,
            flexShrink: 0,
            marginLeft: 8,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              zIndex: 999,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
              overflow: "hidden",
              transformOrigin: "top",
            }}
          >
            {/* Search */}
            <div
              style={{
                padding: "9px 12px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Search size={14} style={{ color: C.muted, flexShrink: 0 }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles & types…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: C.text,
                  fontFamily: "inherit",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={13} style={{ color: C.muted }} />
                </button>
              )}
            </div>

            {/* Options */}
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {filtered ? (
                filtered.length === 0 ? (
                  <p
                    style={{
                      padding: "18px",
                      textAlign: "center",
                      color: C.muted,
                      fontSize: 13,
                      margin: 0,
                    }}
                  >
                    No results for "{query}"
                  </p>
                ) : (
                  filtered.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 14px",
                        border: "none",
                        fontSize: 13.5,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        background:
                          value === opt.value ? C.goldDim : "transparent",
                        color: value === opt.value ? C.gold : C.text,
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        if (value !== opt.value)
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          value === opt.value ? C.goldDim : "transparent";
                      }}
                    >
                      {opt.label}
                      <span
                        style={{ fontSize: 11, color: C.muted, marginLeft: 7 }}
                      >
                        {opt.group}
                      </span>
                    </button>
                  ))
                )
              ) : (
                PROJECT_TYPE_GROUPS.map((grp) => (
                  <div key={grp.group}>
                    <div
                      style={{
                        padding: "7px 14px 3px",
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: C.gold,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        background: "rgba(201,169,97,0.05)",
                        borderTop: `1px solid ${C.border}`,
                      }}
                    >
                      {grp.group}
                    </div>
                    {grp.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleSelect(item)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "9px 14px 9px 20px",
                          border: "none",
                          fontSize: 13.5,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          background:
                            value === item ? C.goldDim : "transparent",
                          color: value === item ? C.gold : C.text,
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          if (value !== item)
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            value === item ? C.goldDim : "transparent";
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared form sub-components ───────────────────────────────────────────────
function FieldLabel({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: C.muted,
        marginBottom: 7,
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
  readOnly,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={14}
          style={{
            position: "absolute",
            left: 12,
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
        readOnly={readOnly}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          borderRadius: 10,
          padding: Icon ? "11px 14px 11px 36px" : "11px 14px",
          fontSize: 14,
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
          background: readOnly ? "rgba(255,255,255,0.03)" : C.input,
          border: `1px solid ${focused && !readOnly ? C.gold : C.border}`,
          color: C.text,
          boxShadow: focused && !readOnly ? `0 0 0 3px ${C.goldGlow}` : "none",
          cursor: readOnly ? "default" : "text",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
    </div>
  );
}

function Textarea({ value, onChange, placeholder, required, readOnly }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={4}
      readOnly={readOnly}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        borderRadius: 10,
        padding: "11px 14px",
        fontSize: 14,
        outline: "none",
        resize: "vertical",
        lineHeight: 1.6,
        fontFamily: "inherit",
        boxSizing: "border-box",
        minHeight: 100,
        background: readOnly ? "rgba(255,255,255,0.03)" : C.input,
        border: `1px solid ${focused && !readOnly ? C.gold : C.border}`,
        color: C.text,
        boxShadow: focused && !readOnly ? `0 0 0 3px ${C.goldGlow}` : "none",
        cursor: readOnly ? "default" : "text",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    />
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending: { bg: C.warnBg, color: C.warn, Icon: Clock3, label: "Pending" },
  hired: {
    bg: C.successBg,
    color: C.success,
    Icon: CheckCircle2,
    label: "Accepted",
  },
  accepted: {
    bg: C.successBg,
    color: C.success,
    Icon: CheckCircle2,
    label: "Accepted",
  },
  rejected: {
    bg: C.dangerBg,
    color: C.danger,
    Icon: XCircle,
    label: "Rejected",
  },
  shortlisted: {
    bg: C.infoBg,
    color: C.info,
    Icon: Star,
    label: "Shortlisted",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 9999,
        background: s.bg,
        color: s.color,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <s.Icon size={12} strokeWidth={2.2} />
      {s.label}
    </span>
  );
}

// ─── Modal shell ──────────────────────────────────────────────────────────────
function ModalShell({ onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: C.cardDeep,
            borderRadius: "18px 18px 0 0",
            border: `1px solid ${C.border}`,
            width: "100%",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
          className="pr-modal-sheet"
        >
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg,${C.gold},transparent)`,
              borderRadius: "14px 14px 0 0",
            }}
          />
          {/* drag handle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "8px 0 2px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 4,
              }}
            />
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Applications Modal ───────────────────────────────────────────────────────
function ApplicationsModal({ post, onClose, onViewAll }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    if (!post?._id) {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await hirerAPI
          .getApplications({ opportunityId: post._id })
          .catch(() => hirerAPI.getApplications());
        const all = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        const filtered = all.filter((a) => {
          const id = a.opportunityId || a.opportunity?._id || a.opportunity;
          return !id || String(id) === String(post._id);
        });
        if (mounted) setApps(filtered);
      } catch {
        if (mounted) setError("Could not load applications.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [post]);

  const updateStatus = async (appId, status) => {
    setBusyId(appId);
    try {
      const updated = await hirerAPI.updateApplicationStatus(appId, { status });
      setApps((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, ...updated, status } : a)),
      );
    } catch (_) {
    } finally {
      setBusyId("");
    }
  };

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div
        style={{
          padding: "14px 18px 12px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: C.goldDim,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Users size={13} style={{ color: C.gold }} />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: C.text,
              }}
            >
              Applications
            </h2>
          </div>
          <p
            style={{ margin: 0, fontSize: 12, color: C.muted, paddingLeft: 34 }}
          >
            {post?.title}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            cursor: "pointer",
            color: C.muted,
            width: 30,
            height: 30,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <Loader2
              size={22}
              style={{
                color: C.gold,
                margin: "0 auto 10px",
                display: "block",
                animation: "prSpin 1s linear infinite",
              }}
            />
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Loading…</p>
          </div>
        ) : error ? (
          <p
            style={{
              color: C.danger,
              fontSize: 13,
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            {error}
          </p>
        ) : apps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <Users
              size={32}
              style={{
                color: "rgba(156,163,175,0.2)",
                margin: "0 auto 10px",
                display: "block",
              }}
            />
            <p style={{ color: C.muted, fontSize: 13.5, margin: "0 0 4px" }}>
              No applications yet
            </p>
            <p style={{ color: C.mutedLight, fontSize: 12, margin: 0 }}>
              Artists who apply will appear here
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {apps.map((app, i) => {
              const artist = app.artist || app.applicant || {};
              const name =
                artist.name || artist.fullName || artist.username || "Artist";
              const email = artist.email || app.email || "";
              const phone = artist.phone || app.phone || "";
              const location = artist.location || app.location || "";
              const avatar = artist.profileImage || artist.avatar || "";
              const portfolio =
                artist.portfolio || artist.portfolioUrl || app.portfolio || "";
              const note = app.coverLetter || app.note || app.message || "";
              const appliedAt = app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "";
              const status = app.status || "pending";
              const isBusy = busyId === app._id;

              return (
                <motion.div
                  key={app._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                      marginBottom: 9,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        minWidth: 0,
                      }}
                    >
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `2px solid ${C.border}`,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg,${C.gold},#a8863d)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <User size={14} style={{ color: "#1a1d24" }} />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: C.text,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "3px 8px",
                            marginTop: 2,
                          }}
                        >
                          {location && (
                            <span
                              style={{
                                fontSize: 11,
                                color: C.muted,
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              <MapPin size={9} style={{ color: C.gold }} />
                              {location}
                            </span>
                          )}
                          {appliedAt && (
                            <span style={{ fontSize: 11, color: C.muted }}>
                              {appliedAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {(email || phone || portfolio) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px 12px",
                        marginBottom: 9,
                      }}
                    >
                      {email && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 11.5,
                            color: C.muted,
                          }}
                        >
                          <Mail size={10} style={{ color: C.gold }} />
                          {email}
                        </span>
                      )}
                      {phone && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 11.5,
                            color: C.muted,
                          }}
                        >
                          <Phone size={10} style={{ color: C.gold }} />
                          {phone}
                        </span>
                      )}
                      {portfolio && (
                        <a
                          href={portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 11.5,
                            color: C.gold,
                            textDecoration: "none",
                          }}
                        >
                          <ExternalLink size={10} />
                          Portfolio
                        </a>
                      )}
                    </div>
                  )}

                  {note && (
                    <p
                      style={{
                        margin: "0 0 9px",
                        fontSize: 12,
                        color: C.muted,
                        lineHeight: 1.5,
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: 7,
                        padding: "7px 9px",
                        borderLeft: `2px solid ${C.border}`,
                      }}
                    >
                      {note}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      {
                        s: "hired",
                        label: "Accept",
                        bg: C.successBg,
                        color: C.success,
                        Icon: CheckCircle2,
                      },
                      {
                        s: "rejected",
                        label: "Reject",
                        bg: C.dangerBg,
                        color: C.danger,
                        Icon: XCircle,
                      },
                      {
                        s: "pending",
                        label: "Pending",
                        bg: C.warnBg,
                        color: C.warn,
                        Icon: Clock3,
                      },
                    ].map(({ s, label, bg, color, Icon: Ic }) => (
                      <button
                        key={s}
                        disabled={
                          isBusy ||
                          status === s ||
                          (s === "hired" && status === "accepted")
                        }
                        onClick={() => updateStatus(app._id, s)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "6px 11px",
                          borderRadius: 7,
                          border: "none",
                          background: bg,
                          color,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: isBusy || status === s ? 0.5 : 1,
                        }}
                      >
                        <Ic size={11} />
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ margin: 0, fontSize: 12.5, color: C.muted }}>
          {!loading && !error && (
            <>
              <span style={{ color: C.gold, fontWeight: 600 }}>
                {apps.length}
              </span>{" "}
              application{apps.length !== 1 ? "s" : ""}
            </>
          )}
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onViewAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 16px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            color: C.text,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          View All <ChevronRight size={13} />
        </motion.button>
      </div>
    </ModalShell>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ post, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: post?.title || "",
    type: post?.type || "",
    description: post?.description || "",
    location: post?.location || "",
    budget: post?.budget || "",
    duration: post?.duration || "",
    startDate: post?.startDate ? post.startDate.slice(0, 10) : "",
    maxSlots: post?.maxSlots ?? "",
    availableSlots: post?.availableSlots ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const setField = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: typeof e === "string" ? e : e.target.value,
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        maxSlots: Number(form.maxSlots) || 0,
        availableSlots: Number(form.availableSlots) || 0,
      };
      await hirerAPI.updateOpportunity(post._id, payload);
      setSaved(true);
      setTimeout(() => {
        onSaved({ ...post, ...payload });
        onClose();
      }, 1100);
    } catch (err) {
      setError(err.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div
        style={{
          padding: "14px 18px 12px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: C.goldDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Edit3 size={13} style={{ color: C.gold }} />
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: C.text,
              }}
            >
              Edit Requirement
            </h2>
            <p style={{ margin: 0, fontSize: 11.5, color: C.muted }}>
              {post?.title}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            cursor: "pointer",
            color: C.muted,
            width: 30,
            height: 30,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        <form id="edit-form" onSubmit={handleSave}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <FieldLabel>Project Title</FieldLabel>
              <TextInput
                icon={Briefcase}
                value={form.title}
                onChange={setField("title")}
                placeholder="Project title"
                required
              />
            </div>
            <div>
              <FieldLabel>Project Type / Role</FieldLabel>
              <ProjectTypePicker
                value={form.type}
                onChange={(v) => setForm((p) => ({ ...p, type: v }))}
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={form.description}
                onChange={setField("description")}
                placeholder="Describe your requirement…"
                required
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
              className="pr-grid2"
            >
              <div>
                <FieldLabel>Location</FieldLabel>
                <TextInput
                  icon={MapPin}
                  value={form.location}
                  onChange={setField("location")}
                  placeholder="City, State"
                />
              </div>
              <div>
                <FieldLabel>Budget Range</FieldLabel>
                <TextInput
                  value={form.budget}
                  onChange={setField("budget")}
                  placeholder="₹5,000 – ₹8,000"
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
              className="pr-grid2"
            >
              <div>
                <FieldLabel>Duration</FieldLabel>
                <TextInput
                  icon={Clock}
                  value={form.duration}
                  onChange={setField("duration")}
                  placeholder="e.g. 3 weeks"
                />
              </div>
              <div>
                <FieldLabel>Start Date</FieldLabel>
                <TextInput
                  icon={Calendar}
                  type="date"
                  value={form.startDate}
                  onChange={setField("startDate")}
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
              className="pr-grid2"
            >
              <div>
                <FieldLabel>Max Slots</FieldLabel>
                <TextInput
                  icon={Users}
                  type="number"
                  value={form.maxSlots}
                  onChange={setField("maxSlots")}
                  placeholder="5"
                />
              </div>
              <div>
                <FieldLabel>Available Slots</FieldLabel>
                <TextInput
                  icon={Users}
                  type="number"
                  value={form.availableSlots}
                  onChange={setField("availableSlots")}
                  placeholder="3"
                />
              </div>
            </div>
            {error && (
              <p style={{ color: C.danger, fontSize: 13, margin: 0 }}>
                {error}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "10px 16px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            color: C.text,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <motion.button
          form="edit-form"
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={saving || saved}
          style={{
            padding: "10px 18px",
            background: saved
              ? C.successBg
              : `linear-gradient(135deg,${C.gold},#a8863d)`,
            border: saved ? `1px solid ${C.successBorder}` : "none",
            borderRadius: 8,
            color: saved ? C.success : "#1a1d24",
            fontSize: 13,
            fontWeight: 700,
            cursor: saving || saved ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: saving ? 0.8 : 1,
          }}
        >
          {saved ? (
            <>
              <CheckCircle2 size={13} /> Saved!
            </>
          ) : saving ? (
            <>
              <Loader2
                size={13}
                style={{ animation: "prSpin 1s linear infinite" }}
              />
              Saving…
            </>
          ) : (
            <>
              <Save size={13} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </ModalShell>
  );
}

// ─── Main PostRequirement page ────────────────────────────────────────────────
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
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [viewAppsPost, setViewAppsPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const [sharePost, setSharePost] = useState(null); // ← share state

  const setField = (key) => (e) =>
    setFormData((p) => ({
      ...p,
      [key]: typeof e === "string" ? e : e.target.value,
    }));

  // Load recent posts
  useEffect(() => {
    let mounted = true;
    setLoadingPosts(true);
    hirerAPI
      .getOpportunities()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res) ? res : [];
        setRecentPosts(
          list.map((o) => ({
            ...o,
            _meta: `${new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${Number(o.applicationCount || 0)} application${Number(o.applicationCount || 0) !== 1 ? "s" : ""}`,
          })),
        );
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadingPosts(false);
      });
    return () => {
      mounted = false;
    };
  }, [submitted]);

  const parseBudget = (b) => {
    const nums = String(b || "")
      .replace(/,/g, "")
      .match(/\d+(\.\d+)?/g)
      ?.map(Number);
    if (!nums?.length) return { min: 0, max: 0 };
    return nums.length === 1
      ? { min: nums[0], max: nums[0] }
      : { min: Math.min(...nums), max: Math.max(...nums) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const { min, max } = parseBudget(formData.budget);
      await hirerAPI.postOpportunity({
        ...formData,
        budgetMin: min,
        budgetMax: max,
        maxSlots: Number(formData.maxSlots),
        availableSlots: Number(formData.availableSlots),
        startDate: formData.startDate || undefined,
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
    } catch (err) {
      setSubmitError(err.message || "Could not post requirement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostSaved = (updated) => {
    if (!updated?._id) return;
    setRecentPosts((prev) =>
      prev.map((x) => (x._id === updated._id ? { ...x, ...updated } : x)),
    );
  };

  const handleDeletePost = async (post) => {
    if (!post?._id) return;
    const confirmed = window.confirm(
      `Delete "${post.title || "this post"}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    setDeletingId(post._id);
    try {
      await hirerAPI.deleteOpportunity(post._id);
      setRecentPosts((prev) => prev.filter((x) => x._id !== post._id));
      if (editPost?._id === post._id) setEditPost(null);
      if (viewAppsPost?._id === post._id) setViewAppsPost(null);
    } catch (err) {
      alert(err?.message || "Could not delete post.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg }}>
      <HirerSidebar />

      {/* ── Share Sheet ── */}
      {sharePost && (
        <ShareSheet post={sharePost} onClose={() => setSharePost(null)} />
      )}

      <div className="pr-main">
        <div className="pr-page">
          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 22 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => navigate("/hirer/dashboard")}
                style={{
                  padding: 9,
                  borderRadius: 9,
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                  color: C.text,
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  marginTop: 30,
                }}
              >
                <ArrowLeft size={16} />
              </motion.button>
              <div>
                <h1 className="pr-title" style={{ marginTop: 30 }}>
                  Post a Requirement
                </h1>
                <p style={{ color: C.muted, fontSize: 13.5, margin: 0 }}>
                  Find the perfect talent for your project
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Post Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "clamp(16px,4vw,26px)",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 34,
                height: 3,
                background: `linear-gradient(90deg,${C.gold},transparent)`,
                borderRadius: 2,
                marginBottom: 18,
              }}
            />

            <form onSubmit={handleSubmit}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div>
                  <FieldLabel>Project Title</FieldLabel>
                  <TextInput
                    icon={Briefcase}
                    value={formData.title}
                    onChange={setField("title")}
                    placeholder="Add title for your project and Tasks"
                    required
                  />
                </div>
                <div>
                  <FieldLabel>Project Type / Role</FieldLabel>
                  <ProjectTypePicker
                    value={formData.type}
                    onChange={(v) => setFormData((p) => ({ ...p, type: v }))}
                  />
                </div>
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    value={formData.description}
                    onChange={setField("description")}
                    placeholder="Describe your project requirements in detail…"
                    required
                  />
                </div>

                <div className="pr-grid2">
                  <div>
                    <FieldLabel>Location</FieldLabel>
                    <TextInput
                      icon={MapPin}
                      value={formData.location}
                      onChange={setField("location")}
                      placeholder="City, State"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel>Budget Range</FieldLabel>
                    <TextInput
                      value={formData.budget}
                      onChange={setField("budget")}
                      placeholder="₹5,000 – ₹8,000"
                      required
                    />
                  </div>
                </div>
                <div className="pr-grid2">
                  <div>
                    <FieldLabel>Project Duration</FieldLabel>
                    <TextInput
                      icon={Clock}
                      value={formData.duration}
                      onChange={setField("duration")}
                      placeholder="e.g. 3 weeks"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel>Start Date</FieldLabel>
                    <TextInput
                      icon={Calendar}
                      type="date"
                      value={formData.startDate}
                      onChange={setField("startDate")}
                      required
                    />
                  </div>
                </div>
                <div className="pr-grid2">
                  <div>
                    <FieldLabel>Max Slots</FieldLabel>
                    <TextInput
                      icon={Users}
                      type="number"
                      value={formData.maxSlots}
                      onChange={setField("maxSlots")}
                      placeholder="5"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel>Available Slots</FieldLabel>
                    <TextInput
                      icon={Users}
                      type="number"
                      value={formData.availableSlots}
                      onChange={setField("availableSlots")}
                      placeholder="3"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: 13,
                    background: submitted
                      ? "rgba(74,222,128,0.85)"
                      : `linear-gradient(135deg,${C.gold} 0%,#a8863d 100%)`,
                    color: "#1a1d24",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "background 0.35s",
                    opacity: isSubmitting ? 0.75 : 1,
                  }}
                >
                  {submitted ? (
                    <>
                      <CheckCircle size={16} /> Requirement Posted!
                    </>
                  ) : isSubmitting ? (
                    <>Posting…</>
                  ) : (
                    <>
                      <FileText size={16} /> Post Requirement
                    </>
                  )}
                </motion.button>

                {submitError && (
                  <p style={{ color: C.danger, margin: 0, fontSize: 13 }}>
                    {submitError}
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          {/* ── Recent Posts ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: C.text,
                marginBottom: 12,
              }}
            >
              Your Recent Posts
            </h2>

            {loadingPosts ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 28,
                }}
              >
                <Loader2
                  size={22}
                  style={{
                    color: C.gold,
                    animation: "prSpin 1s linear infinite",
                  }}
                />
              </div>
            ) : recentPosts.length === 0 ? (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 28,
                  textAlign: "center",
                }}
              >
                <FileText
                  size={26}
                  style={{
                    color: "rgba(156,163,175,0.2)",
                    margin: "0 auto 10px",
                    display: "block",
                  }}
                />
                <p
                  style={{ color: C.muted, fontSize: 13.5, margin: "0 0 3px" }}
                >
                  No posts yet
                </p>
                <p style={{ color: C.mutedLight, fontSize: 12, margin: 0 }}>
                  Your posted requirements will appear here
                </p>
              </div>
            ) : (
              recentPosts.map((post, i) => (
                <motion.div
                  key={post._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    marginBottom: 10,
                  }}
                >
                  {/* Post title row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: C.text,
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </h3>
                    <span
                      style={{
                        padding: "2px 10px",
                        background: C.successBg,
                        color: C.success,
                        borderRadius: 9999,
                        fontSize: 11.5,
                        fontWeight: 600,
                        border: `1px solid ${C.successBorder}`,
                        flexShrink: 0,
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 10px",
                      color: C.muted,
                      fontSize: 12.5,
                    }}
                  >
                    {post._meta}
                  </p>

                  {/* Info pills */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginBottom: 12,
                      overflowX: "auto",
                      paddingBottom: 2,
                    }}
                  >
                    {post.type && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11.5,
                          color: C.muted,
                          background: C.goldDim,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <Briefcase size={10} style={{ color: C.gold }} />
                        {post.type}
                      </span>
                    )}
                    {post.location && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11.5,
                          color: C.muted,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={10} style={{ color: C.gold }} />
                        {post.location}
                      </span>
                    )}
                    {post.budget && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11.5,
                          color: C.muted,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <IndianRupee size={10} style={{ color: C.gold }} />
                        {post.budget}
                      </span>
                    )}
                    {post.duration && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11.5,
                          color: C.muted,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        <Clock size={10} style={{ color: C.gold }} />
                        {post.duration}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {/* View Applications */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setViewAppsPost(post)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "9px 14px",
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        color: C.text,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        flex: "1 1 auto",
                        justifyContent: "center",
                        minWidth: 120,
                      }}
                    >
                      <Eye size={13} />
                      View Applications
                      {Number(post.applicationCount) > 0 && (
                        <span
                          style={{
                            background: C.gold,
                            color: "#1a1d24",
                            borderRadius: 10,
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: "1px 6px",
                          }}
                        >
                          {post.applicationCount}
                        </span>
                      )}
                    </motion.button>

                    {/* Edit */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setEditPost(post)}
                      disabled={deletingId === post._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "9px 14px",
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        color: C.text,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        flex: "1 1 auto",
                        justifyContent: "center",
                        minWidth: 80,
                        opacity: deletingId === post._id ? 0.6 : 1,
                      }}
                    >
                      <Edit3 size={13} /> Edit
                    </motion.button>

                    {/* Share */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSharePost(post)}
                      disabled={deletingId === post._id}
                      title="Share this opportunity"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "9px 14px",
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        color: C.text,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        flex: "1 1 auto",
                        justifyContent: "center",
                        minWidth: 80,
                        opacity: deletingId === post._id ? 0.6 : 1,
                        transition:
                          "border-color 0.18s, color 0.18s, background 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(201,169,97,0.5)";
                        e.currentTarget.style.color = C.gold;
                        e.currentTarget.style.background = C.goldDim;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.color = C.text;
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Share2 size={13} strokeWidth={1.8} /> Share
                    </motion.button>

                    {/* Delete */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDeletePost(post)}
                      disabled={deletingId === post._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "9px 14px",
                        background: "transparent",
                        border: `1px solid ${C.danger}`,
                        borderRadius: 8,
                        color: C.danger,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        flex: "1 1 auto",
                        justifyContent: "center",
                        minWidth: 90,
                        opacity: deletingId === post._id ? 0.7 : 1,
                      }}
                    >
                      {deletingId === post._id ? (
                        <>
                          <Loader2
                            size={13}
                            style={{ animation: "prSpin 1s linear infinite" }}
                          />
                          Deleting
                        </>
                      ) : (
                        <>
                          <Trash2 size={13} />
                          Delete
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {viewAppsPost && (
        <ApplicationsModal
          post={viewAppsPost}
          onClose={() => setViewAppsPost(null)}
          onViewAll={() => {
            navigate(`/hirer/applications?opportunityId=${viewAppsPost._id}`);
            setViewAppsPost(null);
          }}
        />
      )}
      {editPost && (
        <EditModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onSaved={handlePostSaved}
        />
      )}

      <style>{`
        .pr-main { flex: 1; overflow-x: hidden; }
        .pr-page { max-width: 820px; margin: 0 auto; padding: 18px 14px 70px; }
        @media (min-width: 480px) { .pr-page { padding: 22px 20px 70px; } }
        @media (min-width: 768px) { .pr-page { padding: 28px 26px 60px; } }
        @media (min-width: 1024px) { .pr-main { margin-left: 288px; } .pr-page { padding: 36px 32px 60px; } }

        .pr-title { font-size: clamp(20px,4vw,28px); font-weight: 700; margin: 0 0 4px; color: #ffffff; letter-spacing: -0.02em; }
        .pr-grid2 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 480px) { .pr-grid2 { grid-template-columns: 1fr 1fr; } }

        .pr-modal-sheet { max-width: 640px !important; }
        @media (min-width: 640px) {
          .pr-modal-sheet { border-radius: 16px !important; max-height: 88vh !important; box-shadow: 0 24px 80px rgba(0,0,0,0.65) !important; }
        }

        * { box-sizing: border-box; }
        input, select, textarea, button { -webkit-tap-highlight-color: transparent; font-family: inherit; }
        input::placeholder, textarea::placeholder { color: #6b7280; }
        select option { background: ${C.card}; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.55) sepia(0.3) saturate(2) hue-rotate(5deg); cursor: pointer; }

        @keyframes prSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
