import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router"; // <-- added useParams
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/common/ImageWithFallBack";

const INTRO_SCREENS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1759882608520-8c4f8cd40f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB2aWRlb2dyYXBoZXIlMjBjYW1lcmElMjBjaW5lbWF0aWN8ZW58MXx8fHwxNzcxMDYxMTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "Capture moments. Create stories.",
    animation: "camera-pan",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1686172164593-626f19be951c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBkYW5jZXIlMjBzcG90bGlnaHQlMjBzdGFnZXxlbnwxfHx8fDE3NzEwNjExOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "Your talent deserves the spotlight.",
    animation: "spotlight",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1768885511762-4f8a888b0a6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtbWFrZXIlMjBkaXJlY3RvciUyMG1vdmllJTIwc2V0fGVufDF8fHx8MTc3MTA2MTE5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    text: "Every story begins with imagination.",
    animation: "fade",
  },
];

export default function IntroFlow() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const navigate = useNavigate();
  const { role } = useParams(); // <-- get role from URL
  console.log("IntroFlow role:", role);
  useEffect(() => {
    if (currentScreen < INTRO_SCREENS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScreen((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowEnter(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleEnter = () => {
    // Navigate to signup with role from params
    navigate(`/auth/${role}/signup`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={INTRO_SCREENS[currentScreen].image}
              alt="Intro screen"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />
            {/* Film grain */}
            <div className="absolute inset-0 opacity-[0.08] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
          </div>

          {/* Spotlight effect */}
          {INTRO_SCREENS[currentScreen].animation === "spotlight" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1.2 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/40 rounded-full blur-[150px]"
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center max-w-3xl"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-8">
                {INTRO_SCREENS[currentScreen].text}
              </h2>

              {/* Progress indicators */}
              <div className="flex gap-2 justify-center">
                {INTRO_SCREENS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === currentScreen
                        ? "w-12 bg-primary"
                        : index < currentScreen
                          ? "w-8 bg-primary/60"
                          : "w-8 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Enter button */}
      <AnimatePresence>
        {showEnter && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className="fixed bottom-12 right-12 z-20 w-14 h-14 rounded-full bg-[#c9a961] text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow duration-300"
          >
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
