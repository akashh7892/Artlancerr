import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

const STATUS_STYLE = {
  pending: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  hired: { bg: "rgba(74,222,128,0.15)", color: "#4ade80" },
  rejected: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  shortlisted: { bg: "rgba(147,197,253,0.15)", color: "#93c5fd" },
  in_review: { bg: "rgba(196,181,253,0.15)", color: "#c4b5fd" },
};

const labelForStatus = (status) => (status === "hired" ? "Accepted" : String(status || "pending").replace("_", " "));

export default function HirerApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await hirerAPI.getApplications();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((app) => String(app.status || "pending").toLowerCase() === filter);
  }, [items, filter]);

  const updateStatus = async (applicationId, status) => {
    setBusyId(applicationId);
    try {
      const updated = await hirerAPI.updateApplicationStatus(applicationId, { status });
      setItems((prev) => prev.map((item) => (item._id === applicationId ? { ...item, ...updated } : item)));
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#1a1d24", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <HirerSidebar />
      <div className="flex-1 lg:ml-72 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-white">Applications</h1>
            <p className="text-sm text-[#9ca3af] mt-1">Review applications and set status to Accepted, Rejected, or Pending.</p>
          </div>

          <div className="flex gap-2 mb-4">
            {["all", "pending", "hired", "rejected"].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: filter === key ? "rgba(201,169,97,0.2)" : "rgba(255,255,255,0.06)",
                  color: filter === key ? "#f4d38f" : "#c5cad3",
                }}
              >
                {key === "all" ? "All" : key === "hired" ? "Accepted" : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="w-10 h-10 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
          ) : filtered.length === 0 ? (
            <div className="rounded-xl p-6 text-sm text-[#9ca3af]" style={{ background: "#2d3139", border: "1px solid rgba(201,169,97,0.15)" }}>
              No applications found.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app) => {
                const status = String(app.status || "pending").toLowerCase();
                const style = STATUS_STYLE[status] || STATUS_STYLE.pending;
                const artist = app.artist || {};
                const opp = app.opportunity || {};
                return (
                  <div key={app._id} className="rounded-xl p-4" style={{ background: "#2d3139", border: "1px solid rgba(201,169,97,0.15)" }}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-semibold">{artist.name || artist.username || "Artist"}</p>
                        <p className="text-sm text-[#b8bec8]">{opp.title || "Opportunity"}</p>
                        <p className="text-xs text-[#8f97a4] mt-1">{artist.location || ""}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: style.bg, color: style.color }}>
                        {labelForStatus(status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        disabled={busyId === app._id}
                        onClick={() => updateStatus(app._id, "hired")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-60"
                        style={{ background: "rgba(74,222,128,0.18)", color: "#4ade80" }}
                      >
                        <CheckCircle2 size={14} /> Accept
                      </button>
                      <button
                        disabled={busyId === app._id}
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-60"
                        style={{ background: "rgba(248,113,113,0.18)", color: "#f87171" }}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button
                        disabled={busyId === app._id}
                        onClick={() => updateStatus(app._id, "pending")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-60"
                        style={{ background: "rgba(251,191,36,0.18)", color: "#fbbf24" }}
                      >
                        <Clock3 size={14} /> Keep Pending
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
