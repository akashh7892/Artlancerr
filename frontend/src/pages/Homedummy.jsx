/**
 * HomeDummy.jsx  –  /home
 *
 * Single page showing ALL features for both Artist & Hirer roles.
 * Fully responsive: 320px phones → 480px → 640px → 768px → 1024px → 1280px+
 * Every action → auth nudge toast → /auth/:role/signup
 *
 * Route: <Route path="/home" element={<HomeDummy />} />
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Briefcase,
  ArrowLeftRight,
  Eye,
  IndianRupee,
  MessageSquare,
  Clock,
  CheckCircle2,
  Users,
  Shield,
  AlertCircle,
  MapPin,
  Search,
  Filter,
  ChevronRight,
  Plus,
  FileText,
  Video,
  ArrowRight,
  LogIn,
  BarChart2,
  Calendar,
  Award,
} from "lucide-react";

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const C = {
  bg: "#12141a",
  surface: "#1a1d24",
  card: "#22252e",
  card2: "#282c36",
  text: "#e8e9eb",
  muted: "#8b95a3",
  gold: "#c9a961",
  goldBg: "rgba(201,169,97,0.10)",
  goldGlow: "rgba(201,169,97,0.18)",
  border: "rgba(201,169,97,0.12)",
  borderHi: "rgba(201,169,97,0.32)",
  green: "#34d399",
  blue: "#60a5fa",
  orange: "#fb923c",
  red: "#f87171",
};

/* ─── Data ───────────────────────────────────────────────────────────────── */
const ARTIST_STATS = [
  {
    label: "Profile Views",
    value: "2,847",
    Icon: Eye,
    bg: "rgba(201,169,97,0.12)",
    color: C.gold,
  },
  {
    label: "Active Projects",
    value: "3",
    Icon: Briefcase,
    bg: "rgba(96,165,250,0.12)",
    color: C.blue,
  },
  {
    label: "Total Earnings",
    value: "₹1.2L",
    Icon: IndianRupee,
    bg: "rgba(52,211,153,0.12)",
    color: C.green,
  },
  {
    label: "Messages",
    value: "12",
    Icon: MessageSquare,
    bg: "rgba(251,191,36,0.12)",
    color: "#fbbf24",
  },
];
const HIRER_STATS = [
  {
    label: "Active Projects",
    value: "5",
    Icon: Briefcase,
    bg: "rgba(201,169,97,0.12)",
    color: C.gold,
  },
  {
    label: "Artists Hired",
    value: "23",
    Icon: Users,
    bg: "rgba(96,165,250,0.12)",
    color: C.blue,
  },
  {
    label: "Total Spent",
    value: "₹8.4L",
    Icon: IndianRupee,
    bg: "rgba(52,211,153,0.12)",
    color: C.green,
  },
  {
    label: "In Escrow",
    value: "₹1.1L",
    Icon: Shield,
    bg: "rgba(234,179,8,0.12)",
    color: "#facc15",
  },
];
const APPLICATIONS = [
  {
    title: "Lead Actor – Short Film",
    company: "Red Lens Studios",
    budget: "₹45,000",
    time: "2h ago",
    status: "shortlisted",
  },
  {
    title: "Cinematographer – Web Series",
    company: "Pixel Frame Pvt Ltd",
    budget: "₹80,000",
    time: "5h ago",
    status: "pending",
  },
  {
    title: "Voice Artist – Ad Campaign",
    company: "SoundHouse India",
    budget: "₹20,000",
    time: "1d ago",
    status: "accepted",
  },
  {
    title: "Choreographer – Music Video",
    company: "BeatSync Media",
    budget: "₹35,000",
    time: "2d ago",
    status: "in_review",
  },
];
const BROWSE_ARTISTS = [
  {
    name: "Arjun Mehta",
    role: "Cinematographer",
    rating: 4.9,
    city: "Mumbai",
    img: "https://i.pravatar.cc/80?img=11",
    badge: "Top Rated",
  },
  {
    name: "Priya Nair",
    role: "Lead Actress",
    rating: 4.8,
    city: "Chennai",
    img: "https://i.pravatar.cc/80?img=21",
    badge: "Featured",
  },
  {
    name: "Rahul Das",
    role: "Film Director",
    rating: 4.7,
    city: "Kolkata",
    img: "https://i.pravatar.cc/80?img=15",
    badge: null,
  },
  {
    name: "Sanya Kapoor",
    role: "Makeup Artist",
    rating: 4.9,
    city: "Delhi",
    img: "https://i.pravatar.cc/80?img=25",
    badge: "Top Rated",
  },
  {
    name: "Dev Anand",
    role: "VFX Artist",
    rating: 4.6,
    city: "Pune",
    img: "https://i.pravatar.cc/80?img=33",
    badge: null,
  },
  {
    name: "Meera Pillai",
    role: "Screenwriter",
    rating: 4.8,
    city: "Kochi",
    img: "https://i.pravatar.cc/80?img=44",
    badge: "Featured",
  },
];
const TASKS = [
  {
    project: "Monsoon Web Series",
    artist: "Arjun Mehta",
    milestone: "Episode 3 Shoot",
    amount: 75000,
    progress: 68,
    status: "in_progress",
  },
  {
    project: "Brand Campaign – Nike",
    artist: "Sanya Kapoor",
    milestone: "Post Production",
    amount: 45000,
    progress: 100,
    status: "submitted",
  },
  {
    project: "Short Film – Awaaz",
    artist: "Priya Nair",
    milestone: "Principal Photography",
    amount: 30000,
    progress: 25,
    status: "overdue",
  },
];
const REQUIREMENTS = [
  {
    title: "Lead Actor for OTT Series",
    budget: "₹60K–₹90K",
    apps: 18,
    deadline: "Dec 28",
    category: "Acting",
  },
  {
    title: "DOP for Feature Film",
    budget: "₹1.2L–₹2L",
    apps: 9,
    deadline: "Jan 5",
    category: "Cinematography",
  },
  {
    title: "Background Dancers – 10 Slots",
    budget: "₹15K each",
    apps: 34,
    deadline: "Dec 20",
    category: "Dance",
  },
];
const PAYMENTS = [
  {
    title: "Monsoon Web Series – Ep 1",
    date: "Dec 10, 2024",
    amount: "₹38,000",
    status: "Paid",
  },
  {
    title: "Brand Ad – Voiceover",
    date: "Dec 5, 2024",
    amount: "₹12,000",
    status: "Paid",
  },
  {
    title: "Music Video – Dance",
    date: "Dec 18, 2024",
    amount: "₹22,000",
    status: "Pending",
  },
];
const CATEGORIES = [
  "All",
  "🎭 Acting",
  "💃 Dance",
  "🎥 Cinema",
  "🎬 Direction",
  "🎨 Makeup",
  "🎵 Music",
  "✍️ Writing",
  "🖥️ VFX",
];
const STATUS_STYLE = {
  shortlisted: {
    bg: "rgba(139,92,246,0.15)",
    color: "#a78bfa",
    border: "rgba(139,92,246,0.25)",
  },
  pending: {
    bg: "rgba(251,146,60,0.15)",
    color: "#fb923c",
    border: "rgba(251,146,60,0.25)",
  },
  accepted: {
    bg: "rgba(52,211,153,0.15)",
    color: "#34d399",
    border: "rgba(52,211,153,0.25)",
  },
  in_review: {
    bg: "rgba(96,165,250,0.15)",
    color: "#60a5fa",
    border: "rgba(96,165,250,0.25)",
  },
  submitted: {
    bg: "rgba(34,197,94,0.1)",
    color: "#4ade80",
    border: "rgba(34,197,94,0.2)",
  },
  in_progress: {
    bg: "rgba(59,130,246,0.1)",
    color: "#60a5fa",
    border: "rgba(59,130,246,0.2)",
  },
  overdue: {
    bg: "rgba(239,68,68,0.1)",
    color: "#f87171",
    border: "rgba(239,68,68,0.2)",
  },
};

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

/* Reset */
*, *::before, *::after { box-sizing:border-box; }
body { margin:0; overflow-x:hidden; }
button { -webkit-tap-highlight-color:transparent; touch-action:manipulation; cursor:pointer; font-family:inherit; }
p { margin:0; }
img { display:block; max-width:100%; }
::-webkit-scrollbar { width:4px; height:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(201,169,97,0.25); border-radius:4px; }

/* Animations */
@keyframes nudge  { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

/* ── Root ─────────────────────────────────────────────────────────────────── */
.hd {
  min-height:100vh;
  background:#12141a;
  font-family:'Plus Jakarta Sans','Segoe UI',sans-serif;
  color:#e8e9eb;
  overflow-x:hidden;
}

/* ── Navbar ───────────────────────────────────────────────────────────────── */
.hd-nav {
  position:sticky; top:0; z-index:200;
  background:rgba(18,20,26,0.94);
  backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
  border-bottom:1px solid rgba(201,169,97,0.12);
}
.hd-nav-inner {
  max-width:1280px; margin:0 auto;
  height:52px;
  padding:0 14px;
  display:flex; align-items:center; justify-content:space-between; gap:8px;
}
@media(min-width:480px){ .hd-nav-inner{ height:56px; padding:0 18px; } }
@media(min-width:768px){ .hd-nav-inner{ height:60px; padding:0 28px; gap:14px; } }
@media(min-width:1024px){ .hd-nav-inner{ padding:0 40px; } }

/* Logo */
.hd-logo { display:flex; align-items:center; gap:7px; flex-shrink:0; }
.hd-logo-icon {
  width:28px; height:28px; border-radius:7px; flex-shrink:0;
  background:linear-gradient(135deg,#c9a961,#a8863d);
  display:flex; align-items:center; justify-content:center;
}
.hd-logo-text {
  font-size:15px; font-weight:800; color:#e8e9eb;
  font-family:'Playfair Display',serif; letter-spacing:-0.01em;
  white-space:nowrap;
}
@media(min-width:480px){ .hd-logo-icon{width:30px;height:30px;border-radius:8px;} .hd-logo-text{font-size:16px;} }
@media(min-width:768px){ .hd-logo-icon{width:32px;height:32px;border-radius:9px;} .hd-logo-text{font-size:17px;} }

/* Role toggle */
.hd-toggle {
  display:flex; gap:2px; padding:3px;
  background:rgba(255,255,255,0.05);
  border-radius:11px; border:1px solid rgba(201,169,97,0.12);
  flex-shrink:0;
}
.hd-toggle-btn {
  padding:5px 9px; border-radius:8px; border:none;
  font-size:11.5px; font-weight:700;
  display:flex; align-items:center; gap:4px;
  transition:all .18s; white-space:nowrap;
}
@media(min-width:400px){ .hd-toggle-btn{ padding:5px 12px; font-size:12px; } }
@media(min-width:640px){ .hd-toggle-btn{ padding:6px 16px; font-size:12.5px; gap:5px; } }

/* Nav auth */
.hd-nav-auth { display:flex; gap:5px; flex-shrink:0; }
.hd-nav-signin {
  padding:5px 9px; border-radius:8px;
  border:1px solid rgba(201,169,97,0.12);
  background:transparent; color:#8b95a3;
  font-size:11.5px; font-weight:600;
  transition:border-color .15s,color .15s;
  white-space:nowrap;
}
.hd-nav-signin:hover { border-color:rgba(201,169,97,0.32); color:#e8e9eb; }
.hd-nav-signup {
  padding:5px 9px; border-radius:8px;
  background:linear-gradient(135deg,#c9a961,#a8863d);
  border:none; color:#12141a;
  font-size:11.5px; font-weight:700;
  white-space:nowrap;
}
@media(min-width:400px){ .hd-nav-signin,.hd-nav-signup{ padding:6px 12px; font-size:12px; } }
@media(min-width:640px){ .hd-nav-signin,.hd-nav-signup{ padding:7px 16px; font-size:12.5px; border-radius:9px; } }
@media(min-width:768px){ .hd-nav-signin,.hd-nav-signup{ padding:7px 18px; font-size:13px; } }

/* ── Switch Banner ────────────────────────────────────────────────────────── */
.hd-banner-wrap {
  max-width:1280px; margin:0 auto;
  padding:12px 14px 0;
}
@media(min-width:480px){ .hd-banner-wrap{ padding:14px 18px 0; } }
@media(min-width:768px){ .hd-banner-wrap{ padding:18px 28px 0; } }
@media(min-width:1024px){ .hd-banner-wrap{ padding:22px 40px 0; } }

.hd-banner {
  width:100%; padding:10px 12px;
  background:#22252e; border:1px solid rgba(201,169,97,0.12);
  border-radius:12px;
  display:flex; align-items:center; justify-content:space-between; gap:8px;
  text-align:left; transition:border-color .2s,background .2s;
}
.hd-banner:hover { border-color:rgba(201,169,97,0.32); background:#282c36; }
@media(min-width:480px){ .hd-banner{ padding:11px 14px; border-radius:13px; } }
@media(min-width:768px){ .hd-banner{ padding:12px 16px; border-radius:14px; } }

.hd-banner-left { display:flex; align-items:center; gap:9px; min-width:0; }

.hd-banner-icons { position:relative; flex-shrink:0; width:38px; height:36px; }
.hd-banner-main  {
  width:32px; height:32px; border-radius:8px;
  border:1px solid rgba(201,169,97,0.12);
  display:flex; align-items:center; justify-content:center;
}
.hd-banner-sub   {
  position:absolute; bottom:-2px; right:-2px;
  width:16px; height:16px; border-radius:4px;
  display:flex; align-items:center; justify-content:center;
}
@media(min-width:480px){
  .hd-banner-icons{ width:42px; height:39px; }
  .hd-banner-main { width:35px; height:35px; border-radius:9px; }
  .hd-banner-sub  { width:18px; height:18px; border-radius:5px; }
}

.hd-banner-title { font-size:clamp(11.5px,3vw,13.5px); font-weight:700; color:#e8e9eb; white-space:nowrap; }
.hd-banner-desc  { font-size:11px; color:#8b95a3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
@media(min-width:480px){ .hd-banner-desc{ font-size:11.5px; } }

.hd-banner-pill {
  display:flex; align-items:center; gap:3px; flex-shrink:0;
  padding:4px 8px; border-radius:20px;
  background:rgba(201,169,97,0.10); border:1px solid rgba(201,169,97,0.32);
}
.hd-banner-pill span { font-size:11px; font-weight:700; color:#c9a961; }
@media(min-width:480px){ .hd-banner-pill{ padding:4px 10px; gap:4px; } .hd-banner-pill span{ font-size:11.5px; } }

/* ── Main content ─────────────────────────────────────────────────────────── */
.hd-content {
  max-width:1280px; margin:0 auto;
  padding:14px 14px 96px;
  animation:fadeUp .3s ease both;
}
@media(min-width:480px){ .hd-content{ padding:16px 18px 100px; } }
@media(min-width:768px){ .hd-content{ padding:20px 28px 104px; } }
@media(min-width:1024px){ .hd-content{ padding:24px 40px 110px; } }

/* ── View stack ───────────────────────────────────────────────────────────── */
.view-stack { display:flex; flex-direction:column; gap:14px; }
@media(min-width:480px){ .view-stack{ gap:16px; } }
@media(min-width:640px){ .view-stack{ gap:20px; } }
@media(min-width:1024px){ .view-stack{ gap:24px; } }

/* View heading */
.view-title {
  font-size:clamp(19px,5vw,28px); font-weight:700; color:#e8e9eb;
  font-family:'Playfair Display',serif; margin:0 0 4px;
}
.view-sub { font-size:clamp(11.5px,3vw,13.5px); color:#8b95a3; }

/* Hirer top-row with button */
.hirer-header {
  display:flex; align-items:flex-start;
  justify-content:space-between; gap:10px; flex-wrap:wrap;
}

/* ── Stats grid ───────────────────────────────────────────────────────────── */
.stat-grid {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:9px;
}
@media(min-width:480px){ .stat-grid{ gap:11px; } }
@media(min-width:640px){ .stat-grid{ grid-template-columns:repeat(4,1fr); gap:13px; } }
@media(min-width:1024px){ .stat-grid{ gap:16px; } }

.stat-card {
  background:#22252e; border:1px solid rgba(201,169,97,0.12);
  border-radius:13px; padding:13px;
  display:flex; flex-direction:column; gap:9px;
}
@media(min-width:480px){ .stat-card{ padding:15px; border-radius:14px; } }
@media(min-width:768px){ .stat-card{ padding:17px; border-radius:16px; gap:11px; } }

.stat-icon { width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
@media(min-width:480px){ .stat-icon{ width:32px; height:32px; border-radius:8px; } }
@media(min-width:768px){ .stat-icon{ width:34px; height:34px; border-radius:9px; } }

.stat-val { font-size:clamp(16px,4.5vw,22px); font-weight:700; color:#e8e9eb; margin-bottom:2px; }
.stat-lbl { font-size:clamp(10px,2.5vw,12px); color:#8b95a3; }

/* ── Card shell ───────────────────────────────────────────────────────────── */
.card {
  background:#22252e; border:1px solid rgba(201,169,97,0.12);
  border-radius:15px; padding:14px;
}
@media(min-width:480px){ .card{ padding:16px; border-radius:16px; } }
@media(min-width:640px){ .card{ padding:18px; border-radius:18px; } }
@media(min-width:768px){ .card{ padding:20px; border-radius:20px; } }

/* ── Section title ────────────────────────────────────────────────────────── */
.sec-title { display:flex; align-items:center; justify-content:space-between; margin-bottom:13px; }
.sec-h { margin:0; font-size:clamp(13px,3.5vw,16px); font-weight:700; color:#e8e9eb; }
.sec-action {
  display:flex; align-items:center; gap:3px;
  font-size:clamp(11px,2.5vw,12.5px); font-weight:600; color:#c9a961;
  background:none; border:none; padding:0; flex-shrink:0;
}

/* ── Search row ───────────────────────────────────────────────────────────── */
.search-row { display:flex; gap:7px; margin-bottom:11px; }
.search-wrap { flex:1; position:relative; min-width:0; }
.search-ic { position:absolute; left:9px; top:50%; transform:translateY(-50%); color:#8b95a3; pointer-events:none; }
.search-fake {
  padding:8px 9px 8px 28px;
  border-radius:9px; background:rgba(255,255,255,0.04);
  border:1px solid rgba(201,169,97,0.12);
  color:#8b95a3; font-size:clamp(11px,3vw,13px);
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
@media(min-width:480px){ .search-fake{ padding:9px 10px 9px 30px; } }
.filter-btn {
  padding:8px 10px; border-radius:9px;
  background:rgba(201,169,97,0.10); border:1px solid rgba(201,169,97,0.32);
  color:#c9a961; font-size:11.5px; font-weight:600;
  display:flex; align-items:center; gap:4px; flex-shrink:0;
}
@media(min-width:480px){ .filter-btn{ padding:8px 12px; font-size:12px; } }

/* ── Chips ────────────────────────────────────────────────────────────────── */
.chips { display:flex; gap:5px; overflow-x:auto; padding-bottom:3px; margin-bottom:12px; scrollbar-width:none; }
.chips::-webkit-scrollbar { display:none; }
.chip {
  padding:4px 10px; border-radius:20px; border:none;
  background:rgba(255,255,255,0.05); color:#8b95a3;
  font-size:11px; font-weight:600; white-space:nowrap; flex-shrink:0;
  transition:all .15s;
}
.chip.on { background:linear-gradient(135deg,#c9a961,#a8863d); color:#12141a; }
@media(min-width:480px){ .chip{ padding:5px 12px; font-size:11.5px; } }

/* ── List stack ───────────────────────────────────────────────────────────── */
.lst { display:flex; flex-direction:column; gap:8px; }
@media(min-width:480px){ .lst{ gap:9px; } }

/* ── Requirement card ─────────────────────────────────────────────────────── */
.req-card {
  padding:12px; border-radius:11px;
  background:rgba(255,255,255,0.02); border:1px solid rgba(201,169,97,0.12);
  transition:background .15s;
}
.req-card:hover { background:rgba(201,169,97,0.04); }
@media(min-width:480px){ .req-card{ padding:13px; } }
@media(min-width:768px){ .req-card{ padding:14px; } }

.req-top { display:flex; justify-content:space-between; align-items:flex-start; gap:7px; margin-bottom:6px; }
.req-title { font-size:clamp(12px,3vw,13.5px); font-weight:700; color:#e8e9eb; line-height:1.35; }
.req-cat   { font-size:10px; padding:2px 7px; border-radius:20px; flex-shrink:0; background:rgba(201,169,97,0.10); color:#c9a961; border:1px solid rgba(201,169,97,0.32); white-space:nowrap; }
.req-meta  { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:8px; }
.apply-btn {
  padding:5px 12px; border-radius:8px;
  background:linear-gradient(135deg,#c9a961,#a8863d);
  border:none; color:#12141a; font-size:11.5px; font-weight:700;
}
@media(min-width:480px){ .apply-btn{ padding:6px 14px; font-size:12px; } }

/* Meta item */
.mi { font-size:clamp(10px,2.5vw,12px); color:#8b95a3; display:flex; align-items:center; gap:3px; }

/* ── Application row ──────────────────────────────────────────────────────── */
.app-row {
  display:flex; align-items:center; gap:10px; padding:11px;
  border-radius:11px;
  background:rgba(255,255,255,0.018); border:1px solid rgba(201,169,97,0.12);
  transition:background .15s;
}
.app-row:hover { background:rgba(201,169,97,0.04); }
@media(min-width:480px){ .app-row{ gap:11px; padding:12px; } }
@media(min-width:768px){ .app-row{ gap:12px; padding:13px; } }

.app-ic {
  width:38px; height:38px; border-radius:9px; flex-shrink:0;
  background:rgba(201,169,97,0.10); border:1px solid rgba(201,169,97,0.12);
  display:flex; align-items:center; justify-content:center;
}
@media(min-width:480px){ .app-ic{ width:40px; height:40px; } }
@media(min-width:768px){ .app-ic{ width:42px; height:42px; } }

.app-body { flex:1; min-width:0; }
.app-top  { display:flex; align-items:flex-start; justify-content:space-between; gap:5px; margin-bottom:2px; }
.app-ttl  { font-size:clamp(11.5px,3vw,13.5px); font-weight:600; color:#e8e9eb; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.app-co   { font-size:11px; color:#8b95a3; margin-bottom:4px; }
.app-meta { display:flex; gap:9px; flex-wrap:wrap; }
@media(min-width:480px){ .app-co{ font-size:11.5px; margin-bottom:5px; } }

.sbadge { font-size:9.5px; font-weight:700; padding:2px 6px; border-radius:20px; flex-shrink:0; text-transform:capitalize; white-space:nowrap; }
@media(min-width:480px){ .sbadge{ font-size:10px; padding:2px 7px; } }
@media(min-width:640px){ .sbadge{ font-size:10.5px; padding:2px 8px; } }

/* ── Two-col layout ───────────────────────────────────────────────────────── */
.two-col { display:grid; grid-template-columns:1fr; gap:14px; }
@media(min-width:768px){ .two-col{ grid-template-columns:1fr 1fr; gap:16px; } }
@media(min-width:1024px){ .two-col{ gap:20px; } }

/* ── Profile strength ─────────────────────────────────────────────────────── */
.prog-track { width:100%; height:6px; border-radius:20px; overflow:hidden; background:rgba(255,255,255,0.07); margin-bottom:8px; }
.prog-fill  { height:100%; border-radius:20px; background:linear-gradient(90deg,#c9a961,#e0d070); }
.prog-pct   { font-size:24px; font-weight:700; color:#e8e9eb; margin-bottom:8px; }
.card-sub   { font-size:12px; color:#8b95a3; margin-bottom:8px; }
.cl-row { display:flex; align-items:center; gap:7px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.cl-dot {
  width:16px; height:16px; border-radius:50%; flex-shrink:0;
  background:rgba(255,255,255,0.06); border:1px solid rgba(201,169,97,0.12);
  display:flex; align-items:center; justify-content:center;
}
.cl-dot.done { background:rgba(52,211,153,0.15); border-color:rgba(52,211,153,0.3); }
.cl-lbl { font-size:12px; color:#e8e9eb; }
.cl-lbl.done { color:#8b95a3; text-decoration:line-through; }
@media(min-width:480px){ .cl-lbl{ font-size:12.5px; } .cl-dot{ width:17px; height:17px; } }

/* ── Payments ─────────────────────────────────────────────────────────────── */
.pay-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.pay-ttl { font-size:clamp(11.5px,3vw,13px); font-weight:600; color:#e8e9eb; margin-bottom:2px; }
.pay-dt  { font-size:10.5px; color:#8b95a3; }
.pay-amt { font-size:clamp(12.5px,3vw,13.5px); font-weight:700; color:#e8e9eb; margin-bottom:3px; text-align:right; }
.pay-st  { font-size:10px; font-weight:700; padding:2px 7px; border-radius:20px; float:right; }

/* ── Artist grid ──────────────────────────────────────────────────────────── */
.artist-grid {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px; margin-top:4px;
}
@media(min-width:400px){ .artist-grid{ grid-template-columns:repeat(3,1fr); } }
@media(min-width:640px){ .artist-grid{ grid-template-columns:repeat(4,1fr); gap:10px; } }
@media(min-width:900px){ .artist-grid{ grid-template-columns:repeat(6,1fr); } }
@media(min-width:1024px){ .artist-grid{ gap:12px; } }

.a-card {
  border-radius:11px; padding:11px 9px; text-align:center;
  background:rgba(255,255,255,0.025); border:1px solid rgba(201,169,97,0.12);
  transition:all .18s; position:relative;
}
.a-card:hover { background:rgba(201,169,97,0.06); border-color:rgba(201,169,97,0.32); }
@media(min-width:480px){ .a-card{ padding:12px 10px; border-radius:12px; } }
@media(min-width:768px){ .a-card{ padding:13px 11px; border-radius:13px; } }

.a-badge {
  position:absolute; top:6px; right:6px;
  font-size:8px; font-weight:700; padding:1px 5px; border-radius:20px;
}
@media(min-width:480px){ .a-badge{ font-size:8.5px; } }

.a-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; border:2px solid rgba(201,169,97,0.32); margin:0 auto 6px; }
@media(min-width:480px){ .a-avatar{ width:48px; height:48px; } }
@media(min-width:640px){ .a-avatar{ width:52px; height:52px; } }

.a-name { font-size:11.5px; font-weight:700; color:#e8e9eb; margin-bottom:2px; }
.a-role { font-size:10px; color:#8b95a3; margin-bottom:5px; }
.a-rating { display:flex; align-items:center; justify-content:center; gap:3px; margin-bottom:4px; }
.a-rating span { font-size:10.5px; font-weight:600; color:#c9a961; }
.a-city { display:flex; align-items:center; justify-content:center; gap:2px; }
.a-city span { font-size:9.5px; color:#8b95a3; }
@media(min-width:640px){ .a-name{font-size:12px;} .a-role{font-size:10.5px;} }

/* ── Task card ────────────────────────────────────────────────────────────── */
.task-card { padding:13px; border-radius:11px; background:rgba(255,255,255,0.02); border:1px solid rgba(201,169,97,0.12); }
@media(min-width:480px){ .task-card{ padding:14px; border-radius:12px; } }
@media(min-width:768px){ .task-card{ padding:16px; border-radius:13px; } }

.task-top { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:9px; flex-wrap:wrap; }
.task-proj { font-size:clamp(12.5px,3vw,14px); font-weight:700; color:#e8e9eb; margin-bottom:2px; }
.task-sub  { font-size:11px; color:#8b95a3; }
@media(min-width:480px){ .task-sub{ font-size:11.5px; } }
.task-prog-hd { display:flex; justify-content:space-between; font-size:11.5px; color:#8b95a3; margin-bottom:4px; }
.task-prog-hd span:last-child { color:#e8e9eb; }
.task-foot { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:7px; margin-top:10px; }

/* ── Requirements row ─────────────────────────────────────────────────────── */
.rr { padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); transition:opacity .15s; }
.rr:hover { opacity:.75; }
.rr-top { display:flex; justify-content:space-between; align-items:flex-start; gap:7px; margin-bottom:4px; }
.rr-ttl  { font-size:clamp(12px,3vw,13.5px); font-weight:600; color:#e8e9eb; }
.rr-apps { font-size:10px; padding:2px 7px; border-radius:20px; background:rgba(201,169,97,0.10); color:#c9a961; border:1px solid rgba(201,169,97,0.32); flex-shrink:0; }
.rr-meta { display:flex; gap:12px; font-size:11.5px; color:#8b95a3; flex-wrap:wrap; }

/* ── Quick stats ──────────────────────────────────────────────────────────── */
.qs-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.qs-left { display:flex; align-items:center; gap:8px; }
.qs-ic   { width:25px; height:25px; border-radius:6px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.qs-lbl  { font-size:clamp(10.5px,2.5vw,12.5px); color:#8b95a3; }
.qs-val  { font-size:clamp(12.5px,3vw,14px); font-weight:700; color:#e8e9eb; }

/* ── Buttons ──────────────────────────────────────────────────────────────── */
.btn-gold {
  padding:8px 16px; border-radius:9px;
  background:linear-gradient(135deg,#c9a961,#a8863d);
  border:none; color:#12141a; font-size:12.5px; font-weight:700;
  display:inline-flex; align-items:center; gap:5px;
  transition:filter .15s;
}
.btn-gold:hover { filter:brightness(1.08); }
.btn-gold.sm  { padding:6px 11px; font-size:11.5px; border-radius:8px; }
.btn-gold.full{ width:100%; justify-content:center; }
@media(min-width:640px){ .btn-gold{ padding:9px 18px; font-size:13px; } .btn-gold.sm{ padding:6px 12px; } }

.btn-outline {
  padding:8px 16px; border-radius:9px;
  background:transparent; border:1px solid rgba(201,169,97,0.12);
  color:#8b95a3; font-size:12.5px; font-weight:600;
  display:inline-flex; align-items:center; gap:5px;
  transition:border-color .15s,color .15s;
}
.btn-outline:hover { border-color:rgba(201,169,97,0.32); color:#e8e9eb; }
.btn-outline.sm   { padding:6px 11px; font-size:11.5px; border-radius:8px; }
.btn-outline.full { width:100%; justify-content:center; }
@media(min-width:640px){ .btn-outline{ padding:9px 18px; font-size:13px; } .btn-outline.sm{ padding:6px 12px; } }

.btn-danger {
  padding:6px 11px; border-radius:8px;
  border:1px solid rgba(239,68,68,0.25); color:#f87171;
  background:transparent; font-size:11.5px; font-weight:600;
  display:inline-flex; align-items:center; gap:4px;
}
@media(min-width:480px){ .btn-danger{ padding:6px 12px; } }

/* ── Bottom CTA bar ───────────────────────────────────────────────────────── */
.hd-bar {
  position:fixed; bottom:0; left:0; right:0; z-index:100;
  background:rgba(18,20,26,0.97);
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  border-top:1px solid rgba(201,169,97,0.12);
  padding:9px 14px;
}
.hd-bar-inner {
  max-width:1280px; margin:0 auto;
  display:flex; align-items:center; justify-content:space-between; gap:10px;
}
@media(min-width:480px){ .hd-bar{ padding:10px 18px; } }
@media(min-width:768px){ .hd-bar{ padding:11px 28px; } }
@media(min-width:1024px){ .hd-bar{ padding:12px 40px; } }

.bar-title { font-size:clamp(12px,3vw,13.5px); font-weight:700; color:#e8e9eb; margin-bottom:1px; }
.bar-sub   { font-size:clamp(10px,2.5vw,11.5px); color:#8b95a3; }
.bar-btns  { display:flex; gap:7px; flex-shrink:0; }
.bar-si {
  padding:7px 12px; border-radius:8px;
  background:transparent; border:1px solid rgba(201,169,97,0.12);
  color:#8b95a3; font-size:12px; font-weight:600;
}
.bar-su {
  padding:7px 13px; border-radius:8px;
  background:linear-gradient(135deg,#c9a961,#a8863d);
  border:none; color:#12141a; font-size:12px; font-weight:700;
  display:flex; align-items:center; gap:5px;
}
@media(min-width:480px){ .bar-si,.bar-su{ padding:8px 15px; font-size:12.5px; border-radius:9px; gap:6px; } }
@media(min-width:640px){ .bar-si,.bar-su{ padding:8px 18px; font-size:13px; } }

/* ── Auth nudge ───────────────────────────────────────────────────────────── */
.nudge {
  position:fixed; bottom:68px; left:50%; transform:translateX(-50%);
  z-index:3000; width:calc(100% - 20px); max-width:400px;
  background:#22252e; border:1px solid rgba(201,169,97,0.32);
  border-radius:14px; padding:12px 13px;
  box-shadow:0 14px 44px rgba(0,0,0,0.7);
  display:flex; align-items:center; gap:10px;
  animation:nudge .3s cubic-bezier(.34,1.4,.64,1) both;
}
@media(min-width:480px){ .nudge{ bottom:74px; width:calc(100% - 28px); max-width:420px; padding:13px 14px; border-radius:15px; } }

.nudge-ic {
  width:34px; height:34px; border-radius:8px; flex-shrink:0;
  background:rgba(201,169,97,0.10); border:1px solid rgba(201,169,97,0.32);
  display:flex; align-items:center; justify-content:center;
}
.nudge-body { flex:1; min-width:0; }
.nudge-ttl { font-size:12.5px; font-weight:700; color:#e8e9eb; }
.nudge-sub { font-size:10.5px; color:#8b95a3; margin-top:2px; }
.nudge-acts { display:flex; gap:6px; flex-shrink:0; }
.n-later {
  padding:5px 8px; border-radius:7px;
  background:transparent; border:1px solid rgba(201,169,97,0.12);
  color:#8b95a3; font-size:11px;
}
.n-signup {
  padding:5px 10px; border-radius:7px;
  background:linear-gradient(135deg,#c9a961,#a8863d);
  border:none; color:#12141a; font-size:11px; font-weight:700; white-space:nowrap;
}
`;

/* ─── Tiny components ────────────────────────────────────────────────────── */
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

function SC({ label, value, Icon, bg, color }) {
  return (
    <div className="stat-card">
      <span className="stat-icon" style={{ background: bg }}>
        <Icon size={15} style={{ color }} />
      </span>
      <div>
        <p className="stat-val">{value}</p>
        <p className="stat-lbl">{label}</p>
      </div>
    </div>
  );
}

function Nudge({ role, onDismiss, navigate }) {
  return (
    <div className="nudge">
      <div className="nudge-ic">
        <LogIn size={16} style={{ color: C.gold }} />
      </div>
      <div className="nudge-body">
        <p className="nudge-ttl">Sign in to continue</p>
        <p className="nudge-sub">Create a free account to use this feature</p>
      </div>
      <div className="nudge-acts">
        <button className="n-later" onClick={onDismiss}>
          Later
        </button>
        <button
          className="n-signup"
          onClick={() => navigate(`/auth/${role}/signup`)}
        >
          Sign Up Free
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARTIST VIEW
═══════════════════════════════════════════════════════════════════════════ */
function ArtistView({ g, nav }) {
  const [cat, setCat] = useState("All");
  return (
    <div className="view-stack">
      <div>
        <h1 className="view-title">Artist Dashboard 🎬</h1>
        <p className="view-sub">
          Preview your workspace — sign in to unlock full access
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {ARTIST_STATS.map((s) => (
          <SC
            key={s.label}
            label={s.label}
            value={s.value}
            Icon={s.Icon}
            bg={s.bg}
            color={s.color}
          />
        ))}
      </div>

      {/* Browse Opportunities */}
      <div className="card">
        <ST action="Browse All" onAction={g}>
          🔍 Browse Opportunities
        </ST>
        <div className="search-row">
          <div className="search-wrap">
            <Search size={13} className="search-ic" />
            <div className="search-fake" onClick={g}>
              Search roles, productions…
            </div>
          </div>
          <button className="filter-btn" onClick={g}>
            <Filter size={12} /> Filter
          </button>
        </div>
        <div className="chips">
          {CATEGORIES.map((c) => (
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
          {REQUIREMENTS.map((r, i) => (
            <div key={i} className="req-card" onClick={g}>
              <div className="req-top">
                <p className="req-title">{r.title}</p>
                <span className="req-cat">{r.category}</span>
              </div>
              <div className="req-meta">
                <span className="mi">
                  <IndianRupee size={10} style={{ color: C.gold }} />
                  {r.budget}
                </span>
                <span className="mi">
                  <Users size={10} />
                  {r.apps} applicants
                </span>
                <span className="mi">
                  <Calendar size={10} />
                  Deadline {r.deadline}
                </span>
              </div>
              <button
                className="apply-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  g();
                }}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div className="card">
        <ST action="View All" onAction={g}>
          📋 Active Applications
        </ST>
        <div className="lst">
          {APPLICATIONS.map((a, i) => {
            const s = STATUS_STYLE[a.status] || STATUS_STYLE.pending;
            return (
              <div key={i} className="app-row" onClick={g}>
                <div className="app-ic">
                  <Briefcase size={15} style={{ color: C.gold }} />
                </div>
                <div className="app-body">
                  <div className="app-top">
                    <p className="app-ttl">{a.title}</p>
                    <span
                      className="sbadge"
                      style={{
                        background: s.bg,
                        color: s.color,
                        border: `1px solid ${s.border}`,
                      }}
                    >
                      {a.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="app-co">{a.company}</p>
                  <div className="app-meta">
                    <span className="mi">
                      <IndianRupee size={9} style={{ color: C.gold }} />
                      {a.budget}
                    </span>
                    <span className="mi">
                      <Clock size={9} />
                      {a.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile + Payments */}
      <div className="two-col">
        <div className="card">
          <ST action="Edit Profile" onAction={g}>
            ⭐ Profile Strength
          </ST>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: "75%" }} />
          </div>
          <p className="prog-pct">75%</p>
          <p className="card-sub">Complete these to get more opportunities:</p>
          {[
            { label: "Add portfolio samples", done: true },
            { label: "Set availability calendar", done: true },
            { label: "Add equipment list", done: false },
            { label: "Get 3 verified reviews", done: false },
          ].map((item) => (
            <div key={item.label} className="cl-row">
              <div className={`cl-dot${item.done ? " done" : ""}`}>
                {item.done && (
                  <CheckCircle2 size={9} style={{ color: C.green }} />
                )}
              </div>
              <p className={`cl-lbl${item.done ? " done" : ""}`}>
                {item.label}
              </p>
            </div>
          ))}
          <button
            className="btn-gold full"
            onClick={g}
            style={{ marginTop: 13 }}
          >
            Complete Profile
          </button>
        </div>

        <div className="card">
          <ST action="View All" onAction={g}>
            💰 Recent Payments
          </ST>
          {PAYMENTS.map((p, i) => (
            <div key={i} className="pay-row">
              <div>
                <p className="pay-ttl">{p.title}</p>
                <p className="pay-dt">{p.date}</p>
              </div>
              <div>
                <p className="pay-amt">{p.amount}</p>
                <span
                  className="pay-st"
                  style={{
                    background:
                      p.status === "Paid"
                        ? "rgba(52,211,153,0.15)"
                        : "rgba(251,146,60,0.15)",
                    color: p.status === "Paid" ? C.green : C.orange,
                    border: `1px solid ${p.status === "Paid" ? "rgba(52,211,153,0.25)" : "rgba(251,146,60,0.25)"}`,
                  }}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
          <button
            className="btn-outline full"
            onClick={g}
            style={{ marginTop: 13 }}
          >
            View All Payments
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HIRER VIEW
═══════════════════════════════════════════════════════════════════════════ */
function HirerView({ g, nav }) {
  return (
    <div className="view-stack">
      <div className="hirer-header">
        <div>
          <h1 className="view-title">Hirer Dashboard 🎥</h1>
          <p className="view-sub">
            Preview your workspace — sign in to manage real projects
          </p>
        </div>
        <button className="btn-gold" onClick={g}>
          <Plus size={13} /> Post Requirement
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {HIRER_STATS.map((s) => (
          <SC
            key={s.label}
            label={s.label}
            value={s.value}
            Icon={s.Icon}
            bg={s.bg}
            color={s.color}
          />
        ))}
      </div>

      {/* Browse Artists */}
      <div className="card">
        <ST action="Browse All" onAction={g}>
          🎭 Browse Artists
        </ST>
        <div className="search-row">
          <div className="search-wrap">
            <Search size={13} className="search-ic" />
            <div className="search-fake" onClick={g}>
              Search artists by name, skill, city…
            </div>
          </div>
          <button className="filter-btn" onClick={g}>
            <Filter size={12} /> Filter
          </button>
        </div>
        <div className="artist-grid">
          {BROWSE_ARTISTS.map((a, i) => (
            <div key={i} className="a-card" onClick={g}>
              {a.badge && (
                <span
                  className="a-badge"
                  style={{
                    background:
                      a.badge === "Top Rated"
                        ? "rgba(201,169,97,0.2)"
                        : "rgba(96,165,250,0.2)",
                    color: a.badge === "Top Rated" ? C.gold : C.blue,
                    border: `1px solid ${a.badge === "Top Rated" ? "rgba(201,169,97,0.4)" : "rgba(96,165,250,0.3)"}`,
                  }}
                >
                  {a.badge}
                </span>
              )}
              <img src={a.img} alt={a.name} className="a-avatar" />
              <p className="a-name">{a.name}</p>
              <p className="a-role">{a.role}</p>
              <div className="a-rating">
                <Star size={9} fill={C.gold} style={{ color: C.gold }} />
                <span>{a.rating}</span>
              </div>
              <div className="a-city">
                <MapPin size={8} style={{ color: C.muted }} />
                <span>{a.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Tracking */}
      <div className="card">
        <ST action="View All" onAction={g}>
          ⚙️ Task Tracking & Payment Release
        </ST>
        <div className="lst">
          {TASKS.map((t, i) => {
            const s = STATUS_STYLE[t.status] || STATUS_STYLE.in_progress;
            return (
              <div key={i} className="task-card">
                <div className="task-top">
                  <div>
                    <p className="task-proj">{t.project}</p>
                    <p className="task-sub">
                      {t.artist} · {t.milestone}
                    </p>
                  </div>
                  <span
                    className="sbadge"
                    style={{
                      background: s.bg,
                      color: s.color,
                      border: `1px solid ${s.border}`,
                    }}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <div className="task-prog-hd">
                    <span>Progress</span>
                    <span>{t.progress}%</span>
                  </div>
                  <div className="prog-track" style={{ marginBottom: 0 }}>
                    <div
                      className="prog-fill"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>
                <div className="task-foot">
                  <span className="mi">
                    <IndianRupee size={11} style={{ color: C.gold }} />₹
                    {t.amount.toLocaleString()}
                  </span>
                  {t.status === "submitted" ? (
                    <button className="btn-gold sm" onClick={g}>
                      <CheckCircle2 size={11} />
                      Release Payment
                    </button>
                  ) : t.status === "overdue" ? (
                    <button className="btn-danger" onClick={g}>
                      <AlertCircle size={11} />
                      Contact Artist
                    </button>
                  ) : (
                    <button className="btn-outline sm" onClick={g}>
                      <Eye size={11} />
                      View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirements + Quick Stats */}
      <div className="two-col">
        <div className="card">
          <ST action="Post New" onAction={g}>
            📋 My Requirements
          </ST>
          {REQUIREMENTS.map((r, i) => (
            <div key={i} className="rr" onClick={g}>
              <div className="rr-top">
                <p className="rr-ttl">{r.title}</p>
                <span className="rr-apps">{r.apps} apps</span>
              </div>
              <div className="rr-meta">
                <span>{r.budget}</span>
                <span className="mi">
                  <Calendar size={9} />
                  {r.deadline}
                </span>
              </div>
            </div>
          ))}
          <button
            className="btn-gold full"
            onClick={g}
            style={{ marginTop: 13 }}
          >
            <Plus size={13} />
            Post New Requirement
          </button>
        </div>

        <div className="card">
          <ST>📊 This Month</ST>
          {[
            {
              label: "Requirements Posted",
              value: "3",
              Icon: FileText,
              color: C.gold,
            },
            {
              label: "Applications Received",
              value: "61",
              Icon: Users,
              color: C.blue,
            },
            { label: "Artists Hired", value: "4", Icon: Award, color: C.green },
            {
              label: "Budget Spent",
              value: "₹2.8L",
              Icon: IndianRupee,
              color: C.orange,
            },
          ].map((item) => (
            <div key={item.label} className="qs-row">
              <div className="qs-left">
                <div className="qs-ic">
                  <item.Icon size={12} style={{ color: item.color }} />
                </div>
                <span className="qs-lbl">{item.label}</span>
              </div>
              <span className="qs-val">{item.value}</span>
            </div>
          ))}
          <button
            className="btn-outline full"
            onClick={g}
            style={{ marginTop: 13 }}
          >
            <BarChart2 size={13} />
            View Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

/*
MAIN
 */
export default function HomeDummy() {
  const navigate = useNavigate();
  const [role, setRole] = useState(
    () => sessionStorage.getItem("hd_role") || "artist",
  );
  const [nudge, setNudge] = useState(false);
  const [timer, setTimer] = useState(null);

  const switchRole = (r) => {
    sessionStorage.setItem("hd_role", r);
    setRole(r);
  };

  const guard = () => {
    setNudge(true);
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => setNudge(false), 4200));
  };

  const isArtist = role === "artist";

  return (
    <div className="hd">
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav className="hd-nav">
        <div className="hd-nav-inner">
          {/* Logo */}
          <div className="hd-logo">
            <div className="hd-logo-icon">
              <img src="/logo.jpeg" alt="Flip Logo" className="hd-logo-img" />
            </div>
            <span className="hd-logo-text">Flip</span>
          </div>

          {/* Role toggle */}
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
                {r === "artist" ? <Star size={10} /> : <Briefcase size={10} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Auth */}
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

      {/* ── SWITCH BANNER ── */}
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

      {/* ── CONTENT ── */}
      <div className="hd-content">
        {isArtist ? (
          <ArtistView g={guard} nav={navigate} />
        ) : (
          <HirerView g={guard} nav={navigate} />
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="hd-bar">
        <div className="hd-bar-inner">
          <div>
            <p className="bar-title">
              {isArtist ? "Ready to get hired?" : "Ready to find talent?"}
            </p>
            <p className="bar-sub">
              Join 12,000+ {isArtist ? "artists" : "hirers"} on Flip — it's free
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

      {/* ── NUDGE ── */}
      {nudge && (
        <Nudge
          role={role}
          onDismiss={() => setNudge(false)}
          navigate={navigate}
        />
      )}
    </div>
  );
}
