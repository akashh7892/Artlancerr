import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Video,
  Image as ImageIcon,
  X,
  ArrowLeft,
  FileText,
  Music,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { artistAPI } from "../../services/api";
import ImageUpload from "../../components/ui/ImageUpload";

// ─── Color tokens ────────────────────────────────────────────
const C = {
  bg: "#1a1d24",
  card: "#22252e",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#b3a961",
  border: "rgba(179,169,97,0.10)",
  inputBorder: "rgba(255,255,255,0.08)",
};

export default function Portfolio() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [addTitle, setAddTitle] = useState("");

  useEffect(() => {
    let mounted = true;
    artistAPI.getPortfolio().then((list) => { if (mounted) setPortfolio(Array.isArray(list) ? list : []); }).catch(() => { if (mounted) setPortfolio([]); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const detectWorkType = (mimeType = "") => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  };

  const handleUpload = (url, _id, fileMeta) => {
    artistAPI.addPortfolio({ title: addTitle || "Portfolio item", category: "General", workType: detectWorkType(fileMeta?.type || ""), mediaUrl: url }).then((item) => {
      setPortfolio((prev) => [item, ...prev]);
      setShowUpload(false);
      setAddTitle("");
    }).catch(console.error);
  };

  const removeItem = (id) => {
    artistAPI.deletePortfolio(id).then(() => setPortfolio((prev) => prev.filter((item) => item._id !== id))).catch(console.error);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .port-header  { animation: fadeUp 0.3s ease both; }
        .port-upload  { animation: fadeUp 0.35s 0.05s ease both; }
        .port-grid    { animation: fadeUp 0.4s 0.1s ease both; }

        .grid-item { animation: fadeIn 0.4s ease both; }
        .grid-item:nth-child(1) { animation-delay: 0.12s; }
        .grid-item:nth-child(2) { animation-delay: 0.20s; }
        .grid-item:nth-child(3) { animation-delay: 0.28s; }
        .grid-item:nth-child(4) { animation-delay: 0.36s; }
        .grid-item:nth-child(5) { animation-delay: 0.44s; }
        .grid-item:nth-child(6) { animation-delay: 0.52s; }

        .upload-zone {
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .upload-zone:hover {
          border-color: rgba(179,169,97,0.5) !important;
          background: rgba(179,169,97,0.04) !important;
        }

        .upload-btn {
          transition: filter 0.18s ease, transform 0.18s ease;
        }
        .upload-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .back-btn {
          transition: background 0.15s ease, color 0.15s ease;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #b3a961 !important;
        }

        .card-img {
          transition: transform 0.5s ease;
        }
        .grid-item:hover .card-img {
          transform: scale(1.08);
        }

        .card-overlay {
          transition: opacity 0.3s ease;
        }

        .action-btn {
          transition: background 0.15s ease;
        }
        .action-btn:hover {
          background: rgba(255,255,255,0.35) !important;
        }

        .type-badge {
          transition: opacity 0.2s ease;
        }
      `}</style>

      <Sidebar />

      <div
        className="min-h-screen lg:ml-[248px]"
        style={{
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="px-8 py-8 max-w-[1200px]">
          {/* ── Header ── */}
          <div className="port-header flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/artist/profile")}
              className="back-btn flex items-center justify-center w-9 h-9 rounded-xl border-0 outline-none cursor-pointer flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: C.darkText,
              }}
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>

            <div className="flex-1">
              <h1
                className="text-[28px] font-bold leading-tight mb-1"
                style={{
                  color: C.darkText,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Portfolio
              </h1>
              <p className="text-[13.5px]" style={{ color: C.lightText }}>
                Showcase your best work to potential hirers
              </p>
            </div>

            <button
              className="upload-btn flex items-center gap-2 px-5 py-[10px] rounded-xl text-[13.5px] font-bold border-0 outline-none cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                color: "#1a1d24",
              }}
              onClick={() => setShowUpload(true)}
            >
              <Upload size={16} strokeWidth={2.2} />
              Upload
            </button>
          </div>

          {showUpload && (
            <div className="mb-6 p-6 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-sm mb-2" style={{ color: C.lightText }}>Title (optional)</p>
              <input type="text" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} placeholder="e.g. Music Video Shoot" className="w-full max-w-xs rounded-lg py-2 px-3 mb-4 text-sm bg-transparent border border-[#5f5641] text-[#e2e3e5] outline-none focus:border-[#c9a961]" />
              <ImageUpload
                onUpload={handleUpload}
                accept="*/*"
                maxSizeMB={20}
                uploadOptions={{ type: "portfolio", bucket: "portfolios" }}
              />
              <button type="button" onClick={() => { setShowUpload(false); setAddTitle(""); }} className="mt-3 text-sm text-[#808590] hover:text-[#c9a961]">Cancel</button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-2 border-[#b3a961] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
          <>
          <div
            className="port-upload upload-zone mb-8 rounded-2xl p-12 text-center cursor-pointer"
            style={{
              border: `2px dashed rgba(255,255,255,0.12)`,
              background: "rgba(34,37,46,0.4)",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
          >
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(179,169,97,0.12)" }}
              >
                <Upload size={28} strokeWidth={1.8} style={{ color: C.gold }} />
              </div>
            </div>
            <h3
              className="text-[16px] font-semibold mb-2"
              style={{ color: C.darkText }}
            >
              Drag &amp; drop files here
            </h3>
            <p className="text-[13px] mb-5" style={{ color: C.lightText }}>
              or click to browse (Images and videos supported)
            </p>
            <div className="flex items-center justify-center gap-6">
              <div
                className="flex items-center gap-2"
                style={{ color: C.lightText }}
              >
                <ImageIcon size={15} strokeWidth={1.8} />
                <span className="text-[13px]">Images</span>
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: C.lightText }}
              >
                <Video size={15} strokeWidth={1.8} />
                <span className="text-[13px]">Videos</span>
              </div>
            </div>
          </div>

          {/* ── Portfolio Grid ── */}
          <div className="port-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((item) => (
              <div
                key={item._id}
                className="grid-item relative rounded-xl overflow-hidden cursor-pointer"
                style={{ aspectRatio: "4/3", background: C.card }}
                onMouseEnter={() => setHoveredId(item._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                {item.workType === "image" ? (
                  <img
                    src={item.mediaUrl || item.thumbnailUrl}
                    alt={item.title}
                    className="card-img w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[rgba(255,255,255,0.04)]">
                    {item.workType === "video" ? (
                      <Video size={42} style={{ color: "rgba(255,255,255,0.35)" }} />
                    ) : item.workType === "audio" ? (
                      <Music size={42} style={{ color: "rgba(255,255,255,0.35)" }} />
                    ) : (
                      <FileText size={42} style={{ color: "rgba(255,255,255,0.35)" }} />
                    )}
                  </div>
                )}

                {/* Hover overlay */}
                <div
                  className="card-overlay absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 50%, transparent 100%)",
                    opacity: hoveredId === item._id ? 1 : 0,
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4
                      className="text-[14px] font-semibold mb-3"
                      style={{ color: "#ffffff" }}
                    >
                      {item.title}
                    </h4>
                    <div className="flex gap-2">
                      {/* View */}
                      <a
                        className="action-btn w-8 h-8 rounded-lg flex items-center justify-center border-0 outline-none cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(6px)",
                        }}
                        href={item.mediaUrl || item.thumbnailUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ImageIcon size={15} color="#fff" strokeWidth={2} />
                      </a>
                      {/* Remove */}
                      <button
                        className="action-btn w-8 h-8 rounded-lg flex items-center justify-center border-0 outline-none cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(6px)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item._id);
                        }}
                      >
                        <X size={15} color="#fff" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Type badge — top right, always visible */}
                <div className="type-badge absolute top-3 right-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {item.workType === "video" ? (
                      <Video size={14} color="#fff" strokeWidth={2} />
                    ) : item.workType === "audio" ? (
                      <Music size={14} color="#fff" strokeWidth={2} />
                    ) : item.workType === "document" ? (
                      <FileText size={14} color="#fff" strokeWidth={2} />
                    ) : (
                      <ImageIcon size={14} color="#fff" strokeWidth={2} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {portfolio.length === 0 && (
            <div
              className="text-center py-20 rounded-2xl mt-2"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(179,169,97,0.08)" }}
              >
                <ImageIcon
                  size={28}
                  strokeWidth={1.5}
                  style={{ color: "rgba(179,169,97,0.4)" }}
                />
              </div>
              <p
                className="text-[15px] font-semibold mb-1"
                style={{ color: C.darkText }}
              >
                No portfolio items yet
              </p>
              <p className="text-[13px]" style={{ color: C.lightText }}>
                Upload your work to start showcasing it to clients
              </p>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </>
  );
}
