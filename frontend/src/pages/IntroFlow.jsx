import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";

// ─── Role-specific slide content ─────────────────────────────────────────────
const SLIDES = {
  artist: [
    {
      image:
        "https://images.unsplash.com/photo-1759882608520-8c4f8cd40f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=75",
      text: "Capture moments. Create stories.",
      animation: "camera-pan",
    },
    {
      image:
        "https://images.unsplash.com/photo-1686172164593-626f19be951c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=75",
      text: "Your talent deserves the spotlight.",
      animation: "spotlight",
    },
    {
      image:
        "https://images.unsplash.com/photo-1768885511762-4f8a888b0a6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=75",
      text: "Every story begins with imagination.",
      animation: "fade",
    },
  ],
  hirer: [
    {
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=75",
      text: "Discover talent that tells your story.",
      animation: "fade",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=75",
      text: "Build your dream production team.",
      animation: "spotlight",
    },
    {
      image:
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=75",
      text: "Bring your vision to life — faster.",
      animation: "camera-pan",
    },
  ],
};

// ─── Fast image component ─────────────────────────────────────────────────────
// Shows gradient bg immediately, swaps to image once loaded.
// If load takes >300ms without finishing, it still shows (no hard timeout).
// On error → stays on gradient bg (no broken icon).
function SlideImage({ src, animation }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // Detect already-cached images instantly
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    const img = new Image();
    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    img.onload = () => setLoaded(true);
    img.onerror = () => setFailed(true);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Gradient backgrounds shown while loading (role-flavoured)
  const gradientBg =
    "linear-gradient(135deg, #1a1d24 0%, #252830 50%, #1e2128 100%)";

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Always-present gradient (shown instantly) */}
      <div style={{ position: "absolute", inset: 0, background: gradientBg }} />

      {/* Image fades in once loaded */}
      {!failed && (
        <img
          ref={imgRef}
          src={src}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.60)",
        }}
      />

      {/* Film grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')",
        }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function IntroFlow() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showEnter, setShowEnter] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  // ── Validate role — NEVER silently default ────────────────────────────────
  const rawRole = params.role;
  const role = rawRole === "hirer" ? "hirer" : "artist"; // strict mapping

  const slides = SLIDES[role];
  const accentColor = "#c9a961";

  // ── Preload all images for this role on mount ─────────────────────────────
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, [role]); // re-run if role changes

  // ── Auto-advance slides ───────────────────────────────────────────────────
  useEffect(() => {
    setCurrentScreen(0);
    setShowEnter(false);
  }, [role]);

  useEffect(() => {
    if (currentScreen < slides.length - 1) {
      const t = setTimeout(() => setCurrentScreen((s) => s + 1), 1200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowEnter(true), 600);
      return () => clearTimeout(t);
    }
  }, [currentScreen, slides.length]);

  // ── Navigation (all role-aware) ───────────────────────────────────────────
  // Both arrow button and "Explore as Guest" go to /home
  // Role is stored in sessionStorage so HomeDummy picks it up instantly
  const goHome = () => {
    sessionStorage.setItem("hd_role", role);
    navigate("/home");
  };
  const handleEnter = goHome;
  const handleExploreGuest = goHome;
  const handleSignIn = () => navigate(`/auth/${role}/signin`);

  const current = slides[currentScreen];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#0a0b0f",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        button { -webkit-tap-highlight-color: transparent; font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* ── Slide ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${role}-${currentScreen}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Background image (fast, graceful) */}
          <SlideImage src={current.image} animation={current.animation} />

          {/* Spotlight glow */}
          {current.animation === "spotlight" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.22, scale: 1.2 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accentColor}55 0%, transparent 70%)`,
                filter: "blur(60px)",
                zIndex: 1,
              }}
            />
          )}

          {/* Slide text */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              padding: "0 24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.75 }}
              style={{ textAlign: "center", maxWidth: 680 }}
            >
              {/* Role pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 15px",
                  borderRadius: 20,
                  marginBottom: 26,
                  background: "rgba(201,169,97,0.14)",
                  border: "1px solid rgba(201,169,97,0.32)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: accentColor,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: accentColor,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {role === "hirer" ? "For Hirers" : "For Artists"}
                </span>
              </motion.div>

              <h2
                style={{
                  fontSize: "clamp(26px,6.5vw,58px)",
                  color: "#ffffff",
                  marginBottom: 32,
                  lineHeight: 1.14,
                  fontFamily: "'Playfair Display', serif",
                  textShadow: "0 2px 24px rgba(0,0,0,0.55)",
                  margin: "0 0 32px",
                }}
              >
                {current.text}
              </h2>

              {/* Progress dots */}
              <div
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
              >
                {slides.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 3,
                      borderRadius: 99,
                      transition: "all .45s ease",
                      width: i === currentScreen ? 40 : 22,
                      background:
                        i === currentScreen
                          ? accentColor
                          : i < currentScreen
                            ? `${accentColor}70`
                            : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom-right: Enter + Explore as Guest ── */}
      <AnimatePresence>
        {showEnter && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            style={{
              position: "fixed",
              bottom: 36,
              right: 22,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            {/* Gold arrow → signup */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleEnter}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: accentColor,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 28px rgba(201,169,97,0.5)",
                color: "#1a1d24",
              }}
            >
              <ArrowRight style={{ width: 22, height: 22 }} />
            </motion.button>

            {/* Explore as Guest — navigates to role-correct dashboard */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              onClick={handleExploreGuest}
              style={{
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 22,
                padding: "7px 15px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.75)",
                fontSize: 12,
                fontWeight: 600,
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Eye style={{ width: 13, height: 13 }} />
              {role === "hirer"
                ? "Explore as Hirer Guest"
                : "Explore as Artist Guest"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom-left: Sign in ── */}
      <AnimatePresence>
        {showEnter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{
              position: "fixed",
              bottom: 42,
              left: 22,
              zIndex: 20,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 12.5,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Already have an account?
            </p>
            <button
              onClick={handleSignIn}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                color: accentColor,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Sign in →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
