import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  CalendarSearch,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

/* ── Dynamic actions — pass via props or replace with API fetch ── */
const getActions = (basePath = "/artist") => [
  {
    label: "Update Portfolio",
    desc: "Add your latest projects, reels, or artwork to attract new clients and opportunities.",
    icon: Briefcase,
    path: `${basePath}/portfolio`,
    tag: "Portfolio",
  },
  {
    label: "Browse Opportunities",
    desc: "Discover gigs, collaborations and projects tailored to your skills and style.",
    icon: CalendarSearch,
    path: `${basePath}/opportunity`,
    tag: "Explore",
  },
  {
    label: "Check Messages",
    desc: "Reply to client inquiries and stay on top of active project conversations.",
    icon: MessageSquare,
    path: `${basePath}/message`,
    tag: "Inbox",
  },
];
export default function Plusicon({
  basePath = "/artist",
  actions,
  backPath,
  onBack,
}) {
  const navigate = useNavigate();

  const ACTIONS =
    Array.isArray(actions) && actions.length > 0
      ? actions
      : getActions(basePath);

  const resolvedBack = backPath ?? `${basePath}/dashboard`;

  const goBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(resolvedBack);
  };

  const goTo = (path) => {
    if (!path) return;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes pi-fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pi-fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes pi-blob1   { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.08)} }
        @keyframes pi-blob2   { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,25px) scale(1.06)} }
        @keyframes pi-blob3   { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(15px,20px)  scale(1.05)} }
        @keyframes pi-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        /* ── Page ── */
        .pi-page {
          min-height: 100svh;
          width: 100%;
          background: #171a20;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 16px 48px;
          position: relative;
          overflow: hidden;
          animation: pi-fadeIn 0.3s ease forwards;
        }
        @media (min-width: 480px) {
          .pi-page { padding: 64px 24px 64px; }
        }

        /* ── Blobs ── */
        .pi-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .pi-b1 {
          top: -120px; right: -100px;
          width: 440px; height: 440px; opacity: .07;
          background: radial-gradient(circle, #c9a961 0%, transparent 70%);
          filter: blur(55px);
          animation: pi-blob1 8s ease-in-out infinite;
        }
        .pi-b2 {
          bottom: -150px; left: -80px;
          width: 400px; height: 400px; opacity: .05;
          background: radial-gradient(circle, #4ab8c8 0%, transparent 70%);
          filter: blur(65px);
          animation: pi-blob2 10s ease-in-out infinite;
        }
        .pi-b3 {
          top: 50%; left: -150px;
          width: 320px; height: 320px; opacity: .055;
          background: radial-gradient(circle, #c9a961 0%, transparent 70%);
          filter: blur(50px);
          animation: pi-blob3 7s ease-in-out infinite;
        }
        .pi-grid {
          position: absolute; inset: 0; opacity: .025; pointer-events: none;
          background-image:
            linear-gradient(rgba(196,213,224,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,213,224,.5) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* ── Content ── */
        .pi-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
        }

        /* ── Back ── */
        .pi-back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          color: #5a6e7d;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 0 0 28px;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          transition: color .15s ease, transform .15s ease;
        }
        .pi-back:hover { color: #c9a961; transform: translateX(-3px); }
        .pi-back:active { color: #c9a961; }

        /* ── Header ── */
        .pi-header {
          margin-bottom: 22px;
          animation: pi-fadeUp .35s ease .05s both;
        }
        .pi-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .pi-eyebrow-text {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: rgba(201,169,97,.58);
        }
        .pi-h1 {
          margin: 0 0 8px;
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 5vw, 24px);
          font-weight: 700;
          color: #c4d5e0;
          line-height: 1.25;
        }
        .pi-subtitle {
          margin: 0;
          font-size: 13px;
          line-height: 1.65;
          color: #4e6070;
        }

        /* ── Divider ── */
        .pi-divider {
          height: 1px;
          margin-bottom: 18px;
          background: linear-gradient(90deg, rgba(201,169,97,.22), transparent);
        }

        /* ── Cards ── */
        .pi-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pi-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 15px 13px;
          border-radius: 16px;
          border: 1px solid rgba(201,169,97,.07);
          background: rgba(255,255,255,.026);
          cursor: pointer;
          text-align: left;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          transition:
            background   .2s ease,
            border-color .2s ease,
            transform    .2s cubic-bezier(.34,1.4,.64,1),
            box-shadow   .2s ease;
          animation: pi-fadeUp .3s ease both;
        }
        .pi-card:nth-child(1){ animation-delay: .12s; }
        .pi-card:nth-child(2){ animation-delay: .20s; }
        .pi-card:nth-child(3){ animation-delay: .28s; }
        @media (hover: hover) {
          .pi-card:hover {
            background: rgba(201,169,97,.08);
            border-color: rgba(201,169,97,.28);
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(0,0,0,.28);
          }
          .pi-card:hover .pi-arr {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .pi-card:active {
          transform: scale(.97);
          background: rgba(201,169,97,.10);
          border-color: rgba(201,169,97,.30);
        }
        @media (min-width: 480px) {
          .pi-card { padding: 17px 15px; gap: 16px; border-radius: 18px; }
        }

        /* Icon */
        .pi-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 13px;
          flex-shrink: 0;
          margin-top: 1px;
          background: rgba(201,169,97,.10);
          border: 1px solid rgba(201,169,97,.13);
        }
        @media (min-width: 480px) {
          .pi-icon { width: 44px; height: 44px; border-radius: 14px; }
        }

        /* Body */
        .pi-card-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .pi-card-title-row {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .pi-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #c4d5e0;
        }
        .pi-tag {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 999px;
          color: rgba(201,169,97,.82);
          background: linear-gradient(90deg,
            rgba(201,169,97,.15),
            rgba(201,169,97,.07),
            rgba(201,169,97,.15));
          background-size: 200% 100%;
          animation: pi-shimmer 2.8s linear infinite;
        }
        .pi-card-desc {
          font-size: 12px;
          line-height: 1.5;
          color: #4a6070;
          margin-bottom: 5px;
        }
        .pi-card-stat {
          font-size: 11px;
          font-weight: 500;
          color: rgba(201,169,97,.45);
        }

        /* Arrow */
        .pi-arr {
          flex-shrink: 0;
          margin-top: 3px;
          opacity: 0;
          transform: translateX(-7px);
          transition: opacity .2s ease, transform .2s ease;
          color: #c9a961;
        }
        @media (hover: none) {
          .pi-arr { opacity: .35; transform: translateX(0); }
        }
      `}</style>

      <div className="pi-page">
        {/* Background */}
        <div className="pi-blob pi-b1" />
        <div className="pi-blob pi-b2" />
        <div className="pi-blob pi-b3" />
        <div className="pi-grid" />

        <div className="pi-content">
          {/* Back */}
          <button className="pi-back" onClick={goBack} aria-label="Go back">
            <ChevronLeft size={15} strokeWidth={2} />
            Back
          </button>

          {/* Header */}
          <div className="pi-header">
            <div className="pi-eyebrow">
              <Sparkles size={13} style={{ color: "#c9a961" }} />
              <span className="pi-eyebrow-text">Quick Actions</span>
            </div>
            <h1 className="pi-h1">What would you like to do?</h1>
            <p className="pi-subtitle">
              Jump straight into your most important tasks — no digging through
              menus.
            </p>
          </div>

          <div className="pi-divider" />

          {/* Cards */}
          <div className="pi-cards">
            {ACTIONS.map(
              ({ label, desc, icon: Icon, path, tag, stat }, idx) => (
                <button
                  key={`${label}-${idx}`}
                  className="pi-card"
                  onClick={() => goTo(path)}
                  aria-label={label}
                >
                  {/* Icon box */}
                  <span className="pi-icon">
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      style={{ color: "#c9a961" }}
                    />
                  </span>

                  {/* Text */}
                  <span className="pi-card-body">
                    <span className="pi-card-title-row">
                      <span className="pi-card-title">{label}</span>
                      <span className="pi-tag">{tag}</span>
                    </span>
                    <span className="pi-card-desc">{desc}</span>
                    {stat && <span className="pi-card-stat">{stat}</span>}
                  </span>

                  {/* Arrow */}
                  <ArrowRight size={16} className="pi-arr" />
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
