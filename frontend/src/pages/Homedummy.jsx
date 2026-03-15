/**
 * HomeDummy.jsx  –  /home
 *
 * Artist: Browse real opportunities from backend → fill application form → sign-in gate on submit
 * Hirer:  Browse real artists from backend → post requirement form → sign-in gate on submit
 * No dummy data. Fetches from /api/public/opportunities and /api/public/artists
 *
 * Route: <Route path="/home" element={<HomeDummy />} />
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Briefcase,
  ArrowLeftRight,
  IndianRupee,
  Users,
  MapPin,
  Search,
  Filter,
  ChevronRight,
  Plus,
  ArrowRight,
  LogIn,
  Calendar,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { publicAPI } from "../services/api"; // adjust path to match your project structure

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const C = {
  bg: "#12141a",
  surface: "#1a1d24",
  card: "#22252e",
  text: "#e8e9eb",
  muted: "#8b95a3",
  gold: "#c9a961",
  goldBg: "rgba(201,169,97,0.10)",
  border: "rgba(201,169,97,0.12)",
  borderHi: "rgba(201,169,97,0.32)",
  green: "#34d399",
  blue: "#60a5fa",
  red: "#f87171",
};

/* ─── Static Options ─────────────────────────────────────────────────────── */
const ARTIST_ROLE_OPTS = [
  "Actor",
  "Director",
  "Cinematographer",
  "Screenwriter",
  "Film Editor",
  "Sound Designer",
  "Costume Designer",
  "Makeup Artist",
  "VFX Artist",
  "Dancer",
  "Choreographer",
  "Voice Artist",
  "Music Composer",
  "Producer",
  "Camera Operator",
  "Colorist",
  "Art Director",
  "Stunt Coordinator",
];
const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1 year",
  "2 years",
  "3 years",
  "4–5 years",
  "6–8 years",
  "9–12 years",
  "13–15 years",
  "15+ years",
];
const PROJECT_TYPES = [
  "Feature Film",
  "Short Film",
  "Web Series",
  "Ad Campaign",
  "Music Video",
  "Documentary",
  "Corporate Video",
  "Wedding Film",
  "OTT Content",
  "Social Media",
];
const OPP_CATEGORIES = [
  "All",
  "Acting",
  "Cinematography",
  "Dance",
  "Voice",
  "Direction",
  "Makeup",
  "VFX",
  "Writing",
  "Other",
];
const ARTIST_CATS = [
  "All",
  "Actor",
  "Director",
  "Cinematographer",
  "Makeup Artist",
  "VFX Artist",
  "Dancer",
  "Voice Artist",
];

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;}
body{margin:0;overflow-x:hidden;}
button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer;font-family:inherit;}
p{margin:0;}img{display:block;max-width:100%;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(201,169,97,0.25);border-radius:4px;}

@keyframes fadeUp   {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp  {from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes backdropIn{from{opacity:0}to{opacity:1}}
@keyframes spin     {to{transform:rotate(360deg)}}
@keyframes shimmer  {0%{background-position:200% 0}100%{background-position:-200% 0}}

.hd{min-height:100vh;background:#12141a;font-family:'Plus Jakarta Sans','Segoe UI',sans-serif;color:#e8e9eb;overflow-x:hidden;}

/* NAV */
.hd-nav{position:sticky;top:0;z-index:200;background:rgba(18,20,26,0.94);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid rgba(201,169,97,0.12);}
.hd-nav-inner{max-width:1280px;margin:0 auto;height:72px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;}
@media(min-width:480px){.hd-nav-inner{height:78px;padding:0 18px;}}
@media(min-width:768px){.hd-nav-inner{height:84px;padding:0 28px;gap:14px;}}
@media(min-width:1024px){.hd-nav-inner{padding:0 40px;}}
.hd-logo{display:flex;align-items:center;gap:7px;flex-shrink:0;}
.hd-logo-icon{width:48px;height:32px;border-radius:7px;flex-shrink:0;background:transparent;display:flex;align-items:center;justify-content:center;}
.hd-logo-img{width:100%;height:100%;object-fit:contain;border-radius:inherit;}
.hd-logo-text{font-size:15px;font-weight:800;color:#e8e9eb;font-family:'Playfair Display',serif;letter-spacing:-0.01em;white-space:nowrap;}
@media(min-width:768px){.hd-logo-icon{width:32px;height:32px;}.hd-logo-text{font-size:17px;}}
.hd-toggle{display:flex;gap:2px;padding:3px;background:rgba(255,255,255,0.05);border-radius:11px;border:1px solid rgba(201,169,97,0.12);flex-shrink:0;}
.hd-toggle-btn{padding:5px 9px;border-radius:8px;border:none;font-size:11.5px;font-weight:700;display:flex;align-items:center;gap:4px;transition:all .18s;white-space:nowrap;}
@media(min-width:400px){.hd-toggle-btn{padding:5px 12px;font-size:12px;}}
@media(min-width:640px){.hd-toggle-btn{padding:6px 16px;font-size:12.5px;gap:5px;}}
.hd-nav-auth{display:flex;gap:5px;flex-shrink:0;}
.hd-nav-signin{padding:5px 9px;border-radius:8px;border:1px solid rgba(201,169,97,0.12);background:transparent;color:#8b95a3;font-size:11.5px;font-weight:600;transition:border-color .15s,color .15s;white-space:nowrap;}
.hd-nav-signin:hover{border-color:rgba(201,169,97,0.32);color:#e8e9eb;}
.hd-nav-signup{padding:5px 9px;border-radius:8px;background:linear-gradient(135deg,#c9a961,#a8863d);border:none;color:#12141a;font-size:11.5px;font-weight:700;white-space:nowrap;}
@media(min-width:400px){.hd-nav-signin,.hd-nav-signup{padding:6px 12px;font-size:12px;}}
@media(min-width:640px){.hd-nav-signin,.hd-nav-signup{padding:7px 16px;font-size:12.5px;border-radius:9px;}}
@media(min-width:768px){.hd-nav-signin,.hd-nav-signup{padding:7px 18px;font-size:13px;}}

/* BANNER */
.hd-banner-wrap{max-width:1280px;margin:0 auto;padding:12px 14px 0;}
@media(min-width:480px){.hd-banner-wrap{padding:14px 18px 0;}}
@media(min-width:768px){.hd-banner-wrap{padding:18px 28px 0;}}
@media(min-width:1024px){.hd-banner-wrap{padding:22px 40px 0;}}
.hd-banner{width:100%;padding:10px 12px;background:#22252e;border:1px solid rgba(201,169,97,0.12);border-radius:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;transition:border-color .2s,background .2s;}
.hd-banner:hover{border-color:rgba(201,169,97,0.32);background:#282c36;}
@media(min-width:768px){.hd-banner{padding:12px 16px;border-radius:14px;}}
.hd-banner-left{display:flex;align-items:center;gap:9px;min-width:0;}
.hd-banner-icons{position:relative;flex-shrink:0;width:38px;height:36px;}
.hd-banner-main{width:32px;height:32px;border-radius:8px;border:1px solid rgba(201,169,97,0.12);display:flex;align-items:center;justify-content:center;}
.hd-banner-sub{position:absolute;bottom:-2px;right:-2px;width:16px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;}
.hd-banner-title{font-size:clamp(11.5px,3vw,13.5px);font-weight:700;color:#e8e9eb;white-space:nowrap;}
.hd-banner-desc{font-size:11px;color:#8b95a3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px;}
.hd-banner-pill{display:flex;align-items:center;gap:3px;flex-shrink:0;padding:4px 8px;border-radius:20px;background:rgba(201,169,97,0.10);border:1px solid rgba(201,169,97,0.32);}
.hd-banner-pill span{font-size:11px;font-weight:700;color:#c9a961;}

/* CONTENT */
.hd-content{max-width:1280px;margin:0 auto;padding:14px 14px 96px;animation:fadeUp .3s ease both;}
@media(min-width:480px){.hd-content{padding:16px 18px 100px;}}
@media(min-width:768px){.hd-content{padding:20px 28px 104px;}}
@media(min-width:1024px){.hd-content{padding:24px 40px 110px;}}
.view-stack{display:flex;flex-direction:column;gap:16px;}
@media(min-width:640px){.view-stack{gap:20px;}}

/* HERO */
.hero-section{border-radius:18px;background:linear-gradient(135deg,#1a1d24 0%,#22252e 60%,rgba(201,169,97,0.06) 100%);border:1px solid rgba(201,169,97,0.15);padding:28px 22px;position:relative;overflow:hidden;}
.hero-section::before{content:'';position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(201,169,97,0.08) 0%,transparent 70%);pointer-events:none;}
@media(min-width:640px){.hero-section{padding:36px 32px;}}
.hero-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:20px;background:rgba(201,169,97,0.10);border:1px solid rgba(201,169,97,0.25);margin-bottom:12px;}
.hero-badge span{font-size:11px;font-weight:700;color:#c9a961;}
.hero-title{font-size:clamp(22px,5vw,34px);font-weight:700;color:#e8e9eb;font-family:'Playfair Display',serif;line-height:1.2;margin-bottom:10px;}
.hero-sub{font-size:clamp(13px,3vw,15px);color:#8b95a3;margin-bottom:20px;line-height:1.55;max-width:520px;}
.hero-actions{display:flex;gap:10px;flex-wrap:wrap;}

/* CARD */
.card{background:#22252e;border:1px solid rgba(201,169,97,0.12);border-radius:16px;padding:16px;}
@media(min-width:640px){.card{padding:20px;border-radius:18px;}}

/* SEC TITLE */
.sec-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.sec-h{margin:0;font-size:clamp(13px,3.5vw,16px);font-weight:700;color:#e8e9eb;}
.sec-action{display:flex;align-items:center;gap:3px;font-size:clamp(11px,2.5vw,12.5px);font-weight:600;color:#c9a961;background:none;border:none;padding:0;flex-shrink:0;}

/* SEARCH */
.search-row{display:flex;gap:7px;margin-bottom:11px;}
.search-wrap{flex:1;position:relative;min-width:0;}
.search-ic{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:#8b95a3;pointer-events:none;}
.filter-btn{padding:8px 10px;border-radius:9px;background:rgba(201,169,97,0.10);border:1px solid rgba(201,169,97,0.32);color:#c9a961;font-size:11.5px;font-weight:600;display:flex;align-items:center;gap:4px;flex-shrink:0;}

/* CHIPS */
.chips{display:flex;gap:5px;overflow-x:auto;padding-bottom:3px;margin-bottom:14px;scrollbar-width:none;}
.chips::-webkit-scrollbar{display:none;}
.chip{padding:4px 10px;border-radius:20px;border:none;background:rgba(255,255,255,0.05);color:#8b95a3;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0;transition:all .15s;}
.chip.on{background:linear-gradient(135deg,#c9a961,#a8863d);color:#12141a;}

/* OPP CARD */
.opp-card{padding:14px;border-radius:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,169,97,0.12);transition:background .15s,border-color .15s;}
.opp-card:hover{background:rgba(201,169,97,0.04);border-color:rgba(201,169,97,0.25);}
.opp-top{display:flex;justify-content:space-between;align-items:flex-start;gap:7px;margin-bottom:5px;}
.opp-title{font-size:clamp(12.5px,3vw,14px);font-weight:700;color:#e8e9eb;line-height:1.3;}
.opp-cat{font-size:10px;padding:2px 7px;border-radius:20px;flex-shrink:0;background:rgba(201,169,97,0.10);color:#c9a961;border:1px solid rgba(201,169,97,0.32);white-space:nowrap;}
.opp-company{font-size:11.5px;color:#8b95a3;margin-bottom:6px;}
.opp-desc{font-size:12px;color:#8b95a3;line-height:1.5;margin-bottom:10px;}
.opp-meta{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;}
.mi{font-size:clamp(10px,2.5vw,12px);color:#8b95a3;display:flex;align-items:center;gap:3px;}
.opp-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;}

/* ARTIST ROW */
.lst{display:flex;flex-direction:column;gap:9px;}
.artist-row{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;background:rgba(255,255,255,0.018);border:1px solid rgba(201,169,97,0.12);transition:background .15s;cursor:pointer;}
.artist-row:hover{background:rgba(201,169,97,0.04);}
.a-avatar{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid rgba(201,169,97,0.32);flex-shrink:0;background:#22252e;}
.a-body{flex:1;min-width:0;}
.a-name{font-size:13.5px;font-weight:700;color:#e8e9eb;}
.a-role{font-size:11.5px;color:#8b95a3;margin-bottom:4px;}
.a-skills{display:flex;gap:5px;flex-wrap:wrap;}
.a-skill{font-size:10px;padding:2px 6px;border-radius:5px;background:rgba(255,255,255,0.05);color:#8b95a3;border:1px solid rgba(255,255,255,0.06);}
.a-badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:20px;white-space:nowrap;}
.a-rating{display:flex;align-items:center;gap:3px;}
.a-rating span{font-size:11px;font-weight:600;color:#c9a961;}

/* BUTTONS */
.btn-gold{padding:8px 16px;border-radius:9px;background:linear-gradient(135deg,#c9a961,#a8863d);border:none;color:#12141a;font-size:12.5px;font-weight:700;display:inline-flex;align-items:center;gap:5px;transition:filter .15s;}
.btn-gold:hover{filter:brightness(1.08);}
.btn-gold.sm{padding:6px 12px;font-size:11.5px;border-radius:8px;}
.btn-gold.full{width:100%;justify-content:center;}
.btn-outline{padding:8px 16px;border-radius:9px;background:transparent;border:1px solid rgba(201,169,97,0.12);color:#8b95a3;font-size:12.5px;font-weight:600;display:inline-flex;align-items:center;gap:5px;transition:border-color .15s,color .15s;}
.btn-outline:hover{border-color:rgba(201,169,97,0.32);color:#e8e9eb;}
.btn-outline.sm{padding:6px 12px;font-size:11.5px;border-radius:8px;}
.btn-outline.full{width:100%;justify-content:center;}

/* SKELETON */
.skel{background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
.skel-card{padding:14px;border-radius:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,169,97,0.08);margin-bottom:9px;}
.skel-line{border-radius:6px;margin-bottom:8px;}

/* EMPTY / ERROR */
.empty-state{text-align:center;padding:40px 20px;color:#8b95a3;}
.empty-icon{width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;}
.empty-title{font-size:14px;font-weight:600;color:#e8e9eb;margin-bottom:5px;}
.empty-sub{font-size:12.5px;}

/* MODAL — always centered card, never bottom sheet */
@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.modal-backdrop{position:fixed;inset:0;z-index:800;background:rgba(10,12,18,0.80);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:flex-start;justify-content:center;padding:80px 16px 16px;animation:backdropIn .18s ease both;}
@media(min-width:640px){.modal-backdrop{padding:90px 16px 16px;}}
.modal-card{position:relative;width:100%;max-width:500px;max-height:88vh;display:flex;flex-direction:column;background:#1a1d24;border:1px solid rgba(201,169,97,0.22);border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.03);animation:modalIn .22s cubic-bezier(.34,1.18,.64,1) both;overflow:hidden;}
.modal-card.lg{max-width:560px;}
.modal-card-head{flex-shrink:0;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:18px 18px 0;}
@media(min-width:480px){.modal-card-head{padding:22px 22px 0;}}
.modal-card-body{flex:1;overflow-y:auto;padding:16px 18px 20px;}
@media(min-width:480px){.modal-card-body{padding:18px 22px 22px;}}
.modal-card-body::-webkit-scrollbar{width:3px;}
.modal-card-body::-webkit-scrollbar-thumb{background:rgba(201,169,97,0.2);border-radius:3px;}
.modal-title{font-size:clamp(15px,4vw,19px);font-weight:700;color:#e8e9eb;font-family:'Playfair Display',serif;line-height:1.2;}
.modal-sub{font-size:12px;color:#8b95a3;margin-top:3px;}
.modal-close{width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;color:#8b95a3;flex-shrink:0;transition:background .15s,color .15s;}
.modal-close:hover{background:rgba(255,255,255,0.10);color:#e8e9eb;}

/* FORM */
.form-stack{display:flex;flex-direction:column;gap:14px;}
.form-group{display:flex;flex-direction:column;gap:5px;}
.form-label{font-size:12px;font-weight:600;color:#8b95a3;}
.form-input,.form-select,.form-textarea{padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#e8e9eb;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;width:100%;transition:border-color .15s;}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:rgba(201,169,97,0.45);}
.form-input::placeholder,.form-textarea::placeholder{color:rgba(139,149,163,0.45);}
.form-select{appearance:none;cursor:pointer;}
.form-select option{background:#22252e;color:#e8e9eb;}
.form-textarea{resize:vertical;min-height:80px;}
.form-select-wrap{position:relative;}
.form-select-wrap::after{content:'';position:absolute;right:12px;top:50%;transform:translateY(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid #8b95a3;pointer-events:none;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
@media(max-width:400px){.form-row{grid-template-columns:1fr;}}
.form-hint{font-size:11px;color:rgba(139,149,163,0.6);}

/* SIGN-IN WALL */
.signin-wall{padding:22px 18px;border-radius:14px;background:rgba(201,169,97,0.06);border:1px solid rgba(201,169,97,0.20);text-align:center;}
.signin-wall-icon{width:44px;height:44px;border-radius:11px;background:rgba(201,169,97,0.12);border:1px solid rgba(201,169,97,0.25);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;}
.signin-wall-title{font-size:15px;font-weight:700;color:#e8e9eb;margin-bottom:5px;}
.signin-wall-sub{font-size:12.5px;color:#8b95a3;margin-bottom:16px;}
.signin-wall-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;}

/* BOTTOM BAR */
.hd-bar{position:fixed;bottom:0;left:0;right:0;z-index:100;background:rgba(18,20,26,0.97);backdrop-filter:blur(16px);border-top:1px solid rgba(201,169,97,0.12);padding:9px 14px;}
.hd-bar-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;}
@media(min-width:480px){.hd-bar{padding:10px 18px;}}
@media(min-width:768px){.hd-bar{padding:11px 28px;}}
.bar-title{font-size:clamp(12px,3vw,13.5px);font-weight:700;color:#e8e9eb;margin-bottom:1px;}
.bar-sub{font-size:clamp(10px,2.5vw,11.5px);color:#8b95a3;}
.bar-btns{display:flex;gap:7px;flex-shrink:0;}
.bar-si{padding:7px 12px;border-radius:8px;background:transparent;border:1px solid rgba(201,169,97,0.12);color:#8b95a3;font-size:12px;font-weight:600;}
.bar-su{padding:7px 13px;border-radius:8px;background:linear-gradient(135deg,#c9a961,#a8863d);border:none;color:#12141a;font-size:12px;font-weight:700;display:flex;align-items:center;gap:5px;}
@media(min-width:480px){.bar-si,.bar-su{padding:8px 15px;font-size:12.5px;border-radius:9px;}}
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function ST({ children, action, onAction }) {
  return (
    <div className="sec-title">
      <h2 className="sec-h">{children}</h2>
      {action && (
        <button className="sec-action" onClick={onAction}>
          {action}
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

function SignInWall({ role, navigate, title, desc }) {
  return (
    <div className="signin-wall">
      <div className="signin-wall-icon">
        <LogIn size={20} style={{ color: C.gold }} />
      </div>
      <p className="signin-wall-title">{title || "Sign in to continue"}</p>
      <p className="signin-wall-sub">
        {desc || "Create a free account to access this feature"}
      </p>
      <div className="signin-wall-btns">
        <button
          className="btn-outline sm"
          onClick={() => navigate(`/auth/${role}/login`)}
        >
          Sign In
        </button>
        <button
          className="btn-gold sm"
          onClick={() => navigate(`/auth/${role}/signup`)}
        >
          Get Started Free <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

/* ─── Skeletons ──────────────────────────────────────────────────────────── */
function OppSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="skel-card">
      <div className="skel skel-line" style={{ height: 14, width: "60%" }} />
      <div className="skel skel-line" style={{ height: 11, width: "40%" }} />
      <div className="skel skel-line" style={{ height: 11, width: "90%" }} />
      <div
        className="skel skel-line"
        style={{ height: 11, width: "75%", marginBottom: 12 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <div
          className="skel skel-line"
          style={{ height: 11, width: 70, marginBottom: 0 }}
        />
        <div
          className="skel skel-line"
          style={{ height: 11, width: 70, marginBottom: 0 }}
        />
      </div>
    </div>
  ));
}

function ArtistSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="skel-card"
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <div
        className="skel"
        style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div className="skel skel-line" style={{ height: 13, width: "50%" }} />
        <div className="skel skel-line" style={{ height: 11, width: "35%" }} />
        <div style={{ display: "flex", gap: 5 }}>
          <div
            className="skel skel-line"
            style={{ height: 20, width: 50, borderRadius: 5, marginBottom: 0 }}
          />
          <div
            className="skel skel-line"
            style={{ height: 20, width: 50, borderRadius: 5, marginBottom: 0 }}
          />
        </div>
      </div>
    </div>
  ));
}

/* ─── Post Requirement Modal ─────────────────────────────────────────────── */
function PostRequirementModal({ role, navigate, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    category: "",
    projectType: "",
    budgetMin: "",
    budgetMax: "",
    location: "",
    deadline: "",
    slots: "1",
    description: "",
    requirements: "",
    contactName: "",
    contactEmail: "",
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-card-head">
          <div>
            <p className="modal-title">Post a Requirement</p>
            <p className="modal-sub">Find the right talent for your project</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="modal-card-body">
          {step === 1 ? (
            <div className="form-stack">
              <div className="form-group">
                <label className="form-label">Role / Position Title *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Lead Actor for Feature Film"
                  value={form.title}
                  onChange={(e) => set("title")(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <div className="form-select-wrap">
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => set("category")(e.target.value)}
                    >
                      <option value="">Select role</option>
                      {ARTIST_ROLE_OPTS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <div className="form-select-wrap">
                    <select
                      className="form-select"
                      value={form.projectType}
                      onChange={(e) => set("projectType")(e.target.value)}
                    >
                      <option value="">Select type</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Budget Range (₹)</label>
                <div className="form-row">
                  <input
                    className="form-input"
                    placeholder="Min e.g. 20000"
                    value={form.budgetMin}
                    onChange={(e) => set("budgetMin")(e.target.value)}
                  />
                  <input
                    className="form-input"
                    placeholder="Max e.g. 60000"
                    value={form.budgetMax}
                    onChange={(e) => set("budgetMax")(e.target.value)}
                  />
                </div>
                <p className="form-hint">Leave blank if negotiable</p>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location / City</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Mumbai or Remote"
                    value={form.location}
                    onChange={(e) => set("location")(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set("deadline")(e.target.value)}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">No. of Slots</label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.slots}
                  onChange={(e) => set("slots")(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Project Description *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your project, timeline, shoot dates…"
                  value={form.description}
                  onChange={(e) => set("description")(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specific Requirements</label>
                <textarea
                  className="form-textarea"
                  placeholder="Must-have skills, equipment, language requirements…"
                  value={form.requirements}
                  onChange={(e) => set("requirements")(e.target.value)}
                  rows={2}
                />
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 10,
                  }}
                >
                  Your Contact Details
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      className="form-input"
                      placeholder="Full name"
                      value={form.contactName}
                      onChange={(e) => set("contactName")(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="you@studio.com"
                      value={form.contactEmail}
                      onChange={(e) => set("contactEmail")(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                <button
                  className="btn-outline sm"
                  onClick={onClose}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  className="btn-gold"
                  onClick={() => setStep(2)}
                  style={{ flex: 2, justifyContent: "center" }}
                >
                  Preview & Post
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(201,169,97,0.15)",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 6,
                  }}
                >
                  {form.title || "Untitled Requirement"}
                </p>
                {form.category && (
                  <p
                    style={{ fontSize: 11.5, color: C.muted, marginBottom: 3 }}
                  >
                    Role: {form.category}
                  </p>
                )}
                {(form.budgetMin || form.budgetMax) && (
                  <p
                    style={{ fontSize: 11.5, color: C.muted, marginBottom: 3 }}
                  >
                    Budget: ₹{form.budgetMin}
                    {form.budgetMax ? `–₹${form.budgetMax}` : "+"}
                  </p>
                )}
                {form.location && (
                  <p
                    style={{ fontSize: 11.5, color: C.muted, marginBottom: 3 }}
                  >
                    Location: {form.location}
                  </p>
                )}
                {form.description && (
                  <p
                    style={{
                      fontSize: 11.5,
                      color: C.muted,
                      marginTop: 6,
                      lineHeight: 1.5,
                    }}
                  >
                    {form.description.slice(0, 120)}
                    {form.description.length > 120 ? "…" : ""}
                  </p>
                )}
              </div>
              <SignInWall
                role={role}
                navigate={navigate}
                title="Sign in to publish"
                desc="Your requirement is ready — sign in to post it and start receiving applications."
              />
              <button
                className="btn-outline full"
                onClick={() => setStep(1)}
                style={{ marginTop: 10, justifyContent: "center" }}
              >
                ← Edit Requirement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARTIST VIEW — real data from /api/public/opportunities
═══════════════════════════════════════════════════════════════════════════ */
function ArtistView({ navigate }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchOpps = useCallback(async (category, searchTerm, pageNum) => {
    setLoading(true);
    setError("");
    try {
      const data = await publicAPI.getOpportunities({
        category,
        search: searchTerm,
        page: pageNum,
        limit: 10,
      });
      const list = Array.isArray(data)
        ? data
        : data.opportunities || data.data || [];
      const pages = data.totalPages || 1;
      setOpps((prev) => (pageNum === 1 ? list : [...prev, ...list]));
      setHasMore(pageNum < pages);
    } catch {
      setError("Could not load opportunities. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchOpps(cat, search, 1);
    }, 350);
    return () => clearTimeout(t);
  }, [cat, search, fetchOpps]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchOpps(cat, search, next);
  };

  const fmtBudget = (opp) => {
    if (opp.budgetMin && opp.budgetMax)
      return `₹${Number(opp.budgetMin).toLocaleString()}–₹${Number(opp.budgetMax).toLocaleString()}`;
    if (opp.budgetMin) return `₹${Number(opp.budgetMin).toLocaleString()}+`;
    if (opp.budget) return `₹${Number(opp.budget).toLocaleString()}`;
    return "Negotiable";
  };
  const fmtDeadline = (opp) => {
    const d = opp.deadline || opp.endDate;
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="view-stack">
      <div className="hero-section">
        <div className="hero-badge">
          <span>Live Opportunities</span>
        </div>
        <h1 className="hero-title">
          Find your next
          <br />
          big opportunity
        </h1>
        <p className="hero-sub">
          Browse live requirements from top production houses, ad agencies, and
          indie filmmakers across India.
        </p>
        <div className="hero-actions">
          <button
            className="btn-gold"
            onClick={() => navigate("/auth/artist/signup")}
          >
            Join Free & Apply
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate("/auth/artist/login")}
          >
            <LogIn size={13} /> Sign In
          </button>
        </div>
      </div>

      <div className="card">
        <ST
          action="Sign in for full access"
          onAction={() => navigate("/auth/artist/login")}
        >
          Browse Live Opportunities
        </ST>

        <div className="search-row">
          <div className="search-wrap">
            <Search size={13} className="search-ic" />
            <input
              className="form-input"
              style={{
                paddingLeft: 30,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,169,97,0.12)",
                borderRadius: 9,
                fontSize: 12.5,
              }}
              placeholder="Search roles, companies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <Filter size={12} /> Filter
          </button>
        </div>

        <div className="chips">
          {OPP_CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip${cat === c ? " on" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="lst">
          {loading && page === 1 && <OppSkeleton />}

          {!loading && !error && opps.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Briefcase size={20} style={{ color: C.muted }} />
              </div>
              <p className="empty-title">No opportunities found</p>
              <p className="empty-sub">
                Try a different category or search term
              </p>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <div className="empty-icon">
                <AlertCircle size={20} style={{ color: C.red }} />
              </div>
              <p className="empty-title" style={{ color: C.red }}>
                Failed to load
              </p>
              <p className="empty-sub">{error}</p>
              <button
                className="btn-outline sm"
                onClick={() => {
                  setPage(1);
                  fetchOpps(cat, search, 1);
                }}
                style={{ marginTop: 12 }}
              >
                Retry
              </button>
            </div>
          )}

          {opps.map((opp) => (
            <div key={opp._id} className="opp-card">
              <div className="opp-top">
                <p className="opp-title">{opp.title}</p>
                <span className="opp-cat">
                  {opp.category || opp.artCategory || "General"}
                </span>
              </div>
              <p className="opp-company">
                {opp.hirer?.companyName ||
                  opp.hirer?.name ||
                  opp.postedBy?.name ||
                  "Studio"}
              </p>
              {opp.description && (
                <p className="opp-desc">
                  {opp.description.slice(0, 120)}
                  {opp.description.length > 120 ? "…" : ""}
                </p>
              )}
              <div className="opp-meta">
                <span className="mi">
                  <IndianRupee size={10} style={{ color: C.gold }} />
                  {fmtBudget(opp)}
                </span>
                {opp.applicationCount != null && (
                  <span className="mi">
                    <Users size={10} />
                    {opp.applicationCount} applicants
                  </span>
                )}
                {opp.location && (
                  <span className="mi">
                    <MapPin size={10} />
                    {opp.location}
                  </span>
                )}
                {fmtDeadline(opp) && (
                  <span className="mi">
                    <Calendar size={10} />
                    Deadline {fmtDeadline(opp)}
                  </span>
                )}
              </div>
              <div className="opp-foot">
                <span className="mi" style={{ fontSize: 11 }}>
                  {opp.maxSlots
                    ? `${opp.maxSlots} slot${opp.maxSlots > 1 ? "s" : ""}`
                    : "Open"}
                  {opp.projectType ? ` · ${opp.projectType}` : ""}
                </span>
                <button
                  className="btn-gold sm"
                  onClick={() => navigate("/auth/artist/login")}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}

          {loading && page > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0",
              }}
            >
              <Loader2
                size={20}
                style={{ color: C.gold, animation: "spin 1s linear infinite" }}
              />
            </div>
          )}
        </div>

        {hasMore && !loading && (
          <button
            className="btn-outline full"
            onClick={loadMore}
            style={{ marginTop: 14, justifyContent: "center" }}
          >
            Load More
          </button>
        )}

        <div style={{ marginTop: 16 }}>
          <SignInWall
            role="artist"
            navigate={navigate}
            title="Sign up to apply instantly"
            desc="Create a free artist profile and apply to all live opportunities."
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HIRER VIEW — real data from /api/public/artists
═══════════════════════════════════════════════════════════════════════════ */
function HirerView({ navigate }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchArtists = useCallback(async (category, searchTerm, pageNum) => {
    setLoading(true);
    setError("");
    try {
      const data = await publicAPI.getArtists({
        artCategory: category,
        search: searchTerm,
        page: pageNum,
        limit: 12,
      });
      const list = Array.isArray(data) ? data : data.artists || data.data || [];
      const pages = data.totalPages || 1;
      setArtists((prev) => (pageNum === 1 ? list : [...prev, ...list]));
      setHasMore(pageNum < pages);
    } catch {
      setError("Could not load artists. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchArtists(cat, search, 1);
    }, 350);
    return () => clearTimeout(t);
  }, [cat, search, fetchArtists]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchArtists(cat, search, next);
  };

  const fmtRate = (a) => {
    if (a.rates?.daily) return `₹${Number(a.rates.daily).toLocaleString()}/day`;
    if (a.dailyRate) return `₹${Number(a.dailyRate).toLocaleString()}/day`;
    return null;
  };

  return (
    <div className="view-stack">
      <div className="hero-section">
        <div className="hero-badge">
          <span>Hirer Dashboard Preview</span>
        </div>
        <h1 className="hero-title">
          Discover & hire India's
          <br />
          finest film talent
        </h1>
        <p className="hero-sub">
          Post requirements, browse verified artists, and manage your entire
          production workflow — all in one place.
        </p>
        <div className="hero-actions">
          <button className="btn-gold" onClick={() => setShowPostModal(true)}>
            <Plus size={13} /> Post a Requirement
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate("/auth/hirer/login")}
          >
            <LogIn size={13} /> Sign In
          </button>
        </div>
      </div>

      <div className="card">
        <ST
          action="Sign in for full access"
          onAction={() => navigate("/auth/hirer/login")}
        >
          Browse Verified Artists
        </ST>

        <div className="search-row">
          <div className="search-wrap">
            <Search size={13} className="search-ic" />
            <input
              className="form-input"
              style={{
                paddingLeft: 30,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,169,97,0.12)",
                borderRadius: 9,
                fontSize: 12.5,
              }}
              placeholder="Search by name, role, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <Filter size={12} /> Filter
          </button>
        </div>

        <div className="chips">
          {ARTIST_CATS.map((c) => (
            <button
              key={c}
              className={`chip${cat === c ? " on" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="lst">
          {loading && page === 1 && <ArtistSkeleton />}

          {!loading && !error && artists.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={20} style={{ color: C.muted }} />
              </div>
              <p className="empty-title">No artists found</p>
              <p className="empty-sub">
                Try a different category or search term
              </p>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <div className="empty-icon">
                <AlertCircle size={20} style={{ color: C.red }} />
              </div>
              <p className="empty-title" style={{ color: C.red }}>
                Failed to load
              </p>
              <p className="empty-sub">{error}</p>
              <button
                className="btn-outline sm"
                onClick={() => {
                  setPage(1);
                  fetchArtists(cat, search, 1);
                }}
                style={{ marginTop: 12 }}
              >
                Retry
              </button>
            </div>
          )}

          {artists.map((artist) => {
            const rate = fmtRate(artist);
            const skills = Array.isArray(artist.skills) ? artist.skills : [];
            const isTopRated = (artist.rating || 0) >= 4.7;
            return (
              <div
                key={artist._id}
                className="artist-row"
                onClick={() => navigate("/auth/hirer/signup")}
                style={{ cursor: "pointer" }}
              >
                {artist.avatar ? (
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="a-avatar"
                  />
                ) : (
                  <div
                    className="a-avatar"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Users size={18} style={{ color: C.muted }} />
                  </div>
                )}
                <div className="a-body">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 5,
                      marginBottom: 2,
                    }}
                  >
                    <div>
                      <p className="a-name">{artist.name}</p>
                      <p className="a-role">
                        {artist.artCategory || artist.role || "Artist"}
                        {artist.location ? ` · ${artist.location}` : ""}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      {artist.rating > 0 && (
                        <div className="a-rating">
                          <Star
                            size={10}
                            fill={C.gold}
                            style={{ color: C.gold }}
                          />
                          <span>{Number(artist.rating).toFixed(1)}</span>
                        </div>
                      )}
                      {isTopRated && (
                        <span
                          className="a-badge"
                          style={{
                            background: "rgba(201,169,97,0.15)",
                            color: C.gold,
                            border: "1px solid rgba(201,169,97,0.3)",
                          }}
                        >
                          Top Rated
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <div className="a-skills">
                      {skills.slice(0, 3).map((s, i) => (
                        <span key={i} className="a-skill">
                          {s}
                        </span>
                      ))}
                      {artist.experience && (
                        <span className="a-skill">{artist.experience}</span>
                      )}
                    </div>
                    {rate && (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: C.gold,
                          flexShrink: 0,
                        }}
                      >
                        {rate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && page > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0",
              }}
            >
              <Loader2
                size={20}
                style={{ color: C.gold, animation: "spin 1s linear infinite" }}
              />
            </div>
          )}
        </div>

        {hasMore && !loading && (
          <button
            className="btn-outline full"
            onClick={loadMore}
            style={{ marginTop: 14, justifyContent: "center" }}
          >
            Load More
          </button>
        )}

        <div style={{ marginTop: 16 }}>
          <SignInWall
            role="hirer"
            navigate={navigate}
            title="Access all verified artists"
            desc="Sign up free to contact artists, post requirements, and manage payments securely."
          />
        </div>
      </div>

      {showPostModal && (
        <PostRequirementModal
          role="hirer"
          navigate={navigate}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeDummy() {
  const navigate = useNavigate();
  const [role, setRole] = useState(
    () => sessionStorage.getItem("hd_role") || "artist",
  );

  const switchRole = (r) => {
    sessionStorage.setItem("hd_role", r);
    setRole(r);
  };

  const isArtist = role === "artist";

  return (
    <div className="hd">
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="hd-nav">
        <div className="hd-nav-inner">
          <div className="hd-logo">
            <div className="hd-logo-icon">
              <img
                src="/logo.png"
                alt="Flip Logo"
                className="hd-logo-img"
                style={{ width: "75px", height: "48px" }}
              />
            </div>
            <span className="hd-logo-text"></span>
          </div>

          <div className="hd-toggle">
            {["artist", "hirer"].map((r) => (
              <button
                key={r}
                className="hd-toggle-btn"
                onClick={() => switchRole(r)}
                style={{
                  background:
                    role === r
                      ? `linear-gradient(135deg,${C.gold},#a8863d)`
                      : "transparent",
                  color: role === r ? "#12141a" : C.muted,
                }}
              >
                {r === "artist"}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <div className="hd-nav-auth">
            <button
              className="hd-nav-signin"
              onClick={() => navigate(`/auth/${role}/login`)}
            >
              Sign In
            </button>
            <button
              className="hd-nav-signup"
              onClick={() => navigate(`/auth/${role}/signup`)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* SWITCH BANNER */}
      <div className="hd-banner-wrap">
        <button
          className="hd-banner"
          onClick={() => switchRole(isArtist ? "hirer" : "artist")}
        >
          <div className="hd-banner-left">
            <div className="hd-banner-icons">
              <div
                className="hd-banner-main"
                style={{
                  background: isArtist
                    ? "rgba(139,163,144,0.12)"
                    : "rgba(201,169,97,0.12)",
                }}
              >
                {isArtist ? (
                  <Star size={12} style={{ color: "#8ba390" }} />
                ) : (
                  <Briefcase size={12} style={{ color: C.gold }} />
                )}
              </div>
              <div
                className="hd-banner-sub"
                style={{
                  background: isArtist ? C.goldBg : "rgba(139,163,144,0.15)",
                  border: `1px solid ${isArtist ? C.borderHi : "rgba(139,163,144,0.3)"}`,
                }}
              >
                {isArtist ? (
                  <Briefcase size={8} style={{ color: C.gold }} />
                ) : (
                  <Star size={8} style={{ color: "#8ba390" }} />
                )}
              </div>
            </div>
            <div>
              <p className="hd-banner-title">
                Switch to {isArtist ? "Hirer" : "Artist"} Mode
              </p>
              <p className="hd-banner-desc">
                {isArtist
                  ? "Post requirements & discover talent"
                  : "Manage your profile & track applications"}
              </p>
            </div>
          </div>
          <div className="hd-banner-pill">
            <ArrowLeftRight size={9} style={{ color: C.gold }} />
            <span>Switch</span>
            <ChevronRight size={9} style={{ color: C.gold }} />
          </div>
        </button>
      </div>

      {/* CONTENT */}
      <div className="hd-content">
        {isArtist ? (
          <ArtistView navigate={navigate} />
        ) : (
          <HirerView navigate={navigate} />
        )}
      </div>

      {/* BOTTOM BAR */}
      <div className="hd-bar">
        <div className="hd-bar-inner">
          <div>
            <p className="bar-title">
              {isArtist ? "Ready to get hired?" : "Ready to find talent?"}
            </p>
            <p className="bar-sub">
              Join 100+ {isArtist ? "artists" : "hirers"} on Flip — it's free
            </p>
          </div>
          <div className="bar-btns">
            <button
              className="bar-si"
              onClick={() => navigate(`/auth/${role}/login`)}
            >
              Sign In
            </button>
            <button
              className="bar-su"
              onClick={() => navigate(`/auth/${role}/signup`)}
            >
              Get Started <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
