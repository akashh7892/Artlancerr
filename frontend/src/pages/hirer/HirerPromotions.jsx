import { useNavigate } from "react-router-dom";
import HirerSidebar from "./HirerSidebar";

export default function HirerPromotions() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#1a1d24",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600&display=swap');
        @keyframes cs-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* Blurred background layer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(135deg, #1a1d24 0%, #2d3139 50%, #1a1d24 100%)",
          filter: "blur(0px)",
        }}
      >
        {/* Soft gold orb */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,97,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
      </div>

      <HirerSidebar />

      {/* Frosted glass overlay over the whole content area */}
      <div
        className="flex-1 lg:ml-72"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            background: "rgba(26,29,36,0.55)",
          }}
        />

        {/* Coming Soon text */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              background:
                "linear-gradient(90deg, rgba(201,169,97,0.5), rgba(201,169,97,1), rgba(201,169,97,0.5))",
              backgroundSize: "200% 100%",
              animation: "cs-shimmer 3s linear infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Coming Soon
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(36px, 7vw, 64px)",
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Promotions
          </h1>
          <div
            style={{
              width: 40,
              height: 2,
              borderRadius: 99,
              marginTop: 4,
              background:
                "linear-gradient(90deg, transparent, #c9a961, transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
