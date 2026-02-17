import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  CalendarSearch,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
  ChevronLeft,
} from "lucide-react";

const ACTIONS = [
  {
    label: "Update Portfolio",
    desc: "Add your latest projects, reels, or artwork to attract new clients and opportunities.",
    icon: Briefcase,
    path: "/artist/portfolio",
    tag: "Portfolio",
    stat: "Last updated 3d ago",
  },
  {
    label: "Browse Opportunities",
    desc: "Discover gigs, collaborations and projects tailored to your skills and style.",
    icon: CalendarSearch,
    path: "/artist/opportunity",
    tag: "Explore",
    stat: "12 new listings",
  },
  {
    label: "Check Messages",
    desc: "Reply to client inquiries and stay on top of active project conversations.",
    icon: MessageSquare,
    path: "/artist/message",
    tag: "Inbox",
    stat: "3 unread",
  },
];

const TIPS = [
  { icon: Zap, text: "Complete your profile to get 3× more views" },
  { icon: TrendingUp, text: "Artists who post weekly earn 40% more" },
  { icon: Star, text: "Top-rated artists get priority in search" },
];

export default function Plusicon() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes blob1    { 0%,100%{transform:translate(0,0) scale(1);}  50%{transform:translate(30px,-20px) scale(1.08);} }
        @keyframes blob2    { 0%,100%{transform:translate(0,0) scale(1);}  50%{transform:translate(-20px,25px) scale(1.06);} }
        @keyframes blob3    { 0%,100%{transform:translate(0,0) scale(1);}  50%{transform:translate(15px,20px)  scale(1.05);} }
        @keyframes shimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

        .page-wrap   { animation: fadeIn  0.3s ease forwards; }
        .card-wrap   { animation: fadeUp  0.38s cubic-bezier(0.34,1.3,0.64,1) 0.05s both; }
        .tip-item    { animation: fadeUp  0.3s ease both; }
        .tip-item:nth-child(1){ animation-delay:0.35s; }
        .tip-item:nth-child(2){ animation-delay:0.42s; }
        .tip-item:nth-child(3){ animation-delay:0.49s; }
        .action-row  { animation: fadeUp  0.3s ease both; }
        .action-row:nth-child(1){ animation-delay:0.15s; }
        .action-row:nth-child(2){ animation-delay:0.22s; }
        .action-row:nth-child(3){ animation-delay:0.29s; }

        .blob1 { animation: blob1 8s ease-in-out infinite; }
        .blob2 { animation: blob2 10s ease-in-out infinite; }
        .blob3 { animation: blob3 7s  ease-in-out infinite; }

        .action-btn { transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .action-btn:hover {
          background: rgba(201,169,97,0.08) !important;
          transform: translateY(-2px);
          border-color: rgba(201,169,97,0.28) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        .action-btn:hover .arr-icon { opacity:1 !important; transform:translateX(0) !important; }
        .arr-icon { opacity:0; transform:translateX(-6px); transition: opacity 0.2s ease, transform 0.2s ease; }

        .back-btn { transition: color 0.15s, transform 0.15s; }
        .back-btn:hover { color: #c9a961 !important; transform: translateX(-3px); }

        .gold-tag {
          background: linear-gradient(90deg, rgba(201,169,97,0.15), rgba(201,169,97,0.08), rgba(201,169,97,0.15));
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      <div
        className="page-wrap relative min-h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          background: "#171a20",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* ── Decorative blurred background blobs ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large gold blob top-right */}
          <div
            className="blob1 absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-[0.07]"
            style={{
              background:
                "radial-gradient(circle, #c9a961 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Teal blob bottom-left */}
          <div
            className="blob2 absolute -bottom-40 -left-20 w-[480px] h-[480px] rounded-full opacity-[0.05]"
            style={{
              background:
                "radial-gradient(circle, #4ab8c8 0%, transparent 70%)",
              filter: "blur(70px)",
            }}
          />
          {/* Gold blob center-left */}
          <div
            className="blob3 absolute top-1/2 -left-40 w-[380px] h-[380px] rounded-full opacity-[0.06]"
            style={{
              background:
                "radial-gradient(circle, #c9a961 0%, transparent 70%)",
              filter: "blur(55px)",
            }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,213,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,213,224,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* ── Back button ── */}
        <button
          onClick={() => navigate("/artist/dashboard")}
          className="back-btn absolute top-6 left-6 flex items-center gap-1.5 border-0 bg-transparent outline-none cursor-pointer"
          style={{ color: "#5a6e7d" }}
        >
          <ChevronLeft size={16} strokeWidth={2} />
          <span className="text-[13px] font-medium">Back</span>
        </button>

        {/* ── Main card ── */}
        <div
          className="card-wrap relative z-10 w-full max-w-[400px] mx-4 rounded-2xl p-7"
          style={{
            background: "rgba(31,34,41,0.92)",
            border: "1px solid rgba(201,169,97,0.14)",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Card header */}
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} style={{ color: "#c9a961" }} />
            <span
              className="text-[10.5px] font-bold tracking-[0.2em] uppercase"
              style={{ color: "rgba(201,169,97,0.6)" }}
            >
              Quick Actions
            </span>
          </div>

          <h1
            className="text-[22px] font-bold leading-tight mb-1"
            style={{
              color: "#c4d5e0",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            What would you like to do?
          </h1>
          <p
            className="text-[13px] leading-relaxed mb-6"
            style={{ color: "#4e6070" }}
          >
            Jump straight into your most important tasks — no digging through
            menus.
          </p>

          {/* Divider */}
          <div
            className="mb-5 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(201,169,97,0.2), transparent)",
            }}
          />

          {/* Action rows */}
          <div className="flex flex-col gap-3">
            {ACTIONS.map(({ label, desc, icon: Icon, path, tag, stat }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="action-btn action-row flex items-start gap-4 w-full px-4 py-4 rounded-xl text-left border-0 outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(201,169,97,0.07)",
                }}
              >
                {/* Icon */}
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 mt-[1px]"
                  style={{
                    background: "rgba(201,169,97,0.10)",
                    border: "1px solid rgba(201,169,97,0.12)",
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    style={{ color: "#c9a961" }}
                  />
                </span>

                {/* Text block */}
                <span className="flex flex-col flex-1 min-w-0">
                  <span className="flex items-center gap-2 mb-[3px]">
                    <span
                      className="text-[14.5px] font-semibold"
                      style={{ color: "#c4d5e0" }}
                    >
                      {label}
                    </span>
                    <span
                      className="gold-tag text-[9.5px] font-bold px-[7px] py-[2px] rounded-full tracking-wider uppercase"
                      style={{ color: "rgba(201,169,97,0.8)" }}
                    >
                      {tag}
                    </span>
                  </span>
                  <span
                    className="text-[12px] leading-snug mb-2"
                    style={{ color: "#4e6070" }}
                  >
                    {desc}
                  </span>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "rgba(201,169,97,0.45)" }}
                  >
                    {stat}
                  </span>
                </span>

                {/* Arrow */}
                <ArrowRight
                  size={16}
                  className="arr-icon mt-[2px] flex-shrink-0"
                  style={{ color: "#c9a961" }}
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div
            className="my-5 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(201,169,97,0.15), transparent)",
            }}
          />

          {/* Tips section */}
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp size={13} style={{ color: "rgba(201,169,97,0.5)" }} />
            <span
              className="text-[10.5px] font-bold tracking-[0.18em] uppercase"
              style={{ color: "rgba(201,169,97,0.4)" }}
            >
              Pro Tips
            </span>
          </div>
          <div className="flex flex-col gap-[8px] mt-3">
            {TIPS.map(({ icon: TipIcon, text }) => (
              <div key={text} className="tip-item flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0"
                  style={{ background: "rgba(201,169,97,0.07)" }}
                >
                  <TipIcon
                    size={12}
                    strokeWidth={2}
                    style={{ color: "rgba(201,169,97,0.55)" }}
                  />
                </span>
                <span
                  className="text-[12px] leading-snug"
                  style={{ color: "#3d5160" }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
