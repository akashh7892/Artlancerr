import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center relative animate-fadeIn">
      <div className="text-center animate-contentFadeIn">
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <img src="/logo.jpeg" alt="Logo" className="w-16 h-16" />
            <h1 className="text-7xl font-normal text-[#e8e9eb] tracking-tight">
              Artlancing
            </h1>
          </div>
          <span className="block text-2xl text-[#808590] font-light tracking-wide">
            Where talent meets the film industry.
          </span>
        </div>

        <div className="flex gap-8 justify-center items-center">
          <Link
            to="/intro"
            className="group relative px-20 py-5 text-xl text-[#e2e3e5] bg-transparent border-[1.5px] border-[#5f5641] rounded-full cursor-pointer transition-all duration-300 font-normal tracking-wide overflow-hidden"
          >
            <span className="relative z-10">Artist</span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>

          <Link
            to="/intro"
            className="group relative px-20 py-5 text-xl text-[#e2e3e5] bg-transparent border-[1.5px] border-[#5f5641] rounded-full cursor-pointer transition-all duration-300 font-normal tracking-wide overflow-hidden"
          >
            <span className="relative z-10">Hirer</span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#808590] text-xl cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20">
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
      `}</style>
    </div>
  );
};

export default Landing;
