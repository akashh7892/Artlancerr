import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center relative animate-fadeIn px-4 sm:px-6 lg:px-8">
      <div className="text-center animate-contentFadeIn w-full max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16">
          {/* Logo and Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24"
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#e8e9eb] tracking-tight text-center"></h1>
          </div>

          {/* Tagline */}
          <span className="block text-lg sm:text-xl md:text-2xl text-[#808590] font-light tracking-wide px-4">
            Where talent meets opportunities
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center px-4">
          {/* Artist Button */}
          <Link
            to="/intro/artist"
            className="group relative w-full sm:w-auto px-8 sm:px-12 md:px-16 lg:px-20 py-4 sm:py-5 text-base sm:text-lg md:text-xl text-[#e2e3e5] bg-transparent border-[1.5px] border-[#5f5641] rounded-full cursor-pointer transition-all duration-300 font-normal tracking-wide overflow-hidden"
          >
            <span className="relative z-10 block">Artist</span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>

          {/* Hirer Button */}
          <Link
            to="/intro/hirer"
            className="group relative w-full sm:w-auto px-8 sm:px-12 md:px-16 lg:px-20 py-4 sm:py-5 text-base sm:text-lg md:text-xl text-[#e2e3e5] bg-transparent border-[1.5px] border-[#5f5641] rounded-full cursor-pointer transition-all duration-300 font-normal tracking-wide overflow-hidden"
          >
            <span className="relative z-10 block">Hirer</span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
        </div>

        <p className="mt-8 text-xs sm:text-sm text-[#808590]/60 font-light">
          Choose your role to continue
        </p>
      </div>

      {/* Help Button */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#808590] text-base sm:text-lg md:text-xl cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20">
        ?
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes contentFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in;
        }
        .animate-contentFadeIn {
          animation: contentFadeIn 1.2s ease-in;
        }
        @media (max-width: 640px) {
          button,
          a {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
