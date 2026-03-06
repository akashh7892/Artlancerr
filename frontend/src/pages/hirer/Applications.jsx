import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Star,
  Eye,
  X,
  User,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Briefcase,
  ChevronDown,
  Users,
  Loader2,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// ─── Status styles ────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  pending: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  hired: { bg: "rgba(74,222,128,0.15)", color: "#4ade80" },
  accepted: { bg: "rgba(74,222,128,0.15)", color: "#4ade80" },
  rejected: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  shortlisted: { bg: "rgba(147,197,253,0.15)", color: "#93c5fd" },
  in_review: { bg: "rgba(196,181,253,0.15)", color: "#c4b5fd" },
};

const labelForStatus = (s) =>
  s === "hired" || s === "accepted"
    ? "Accepted"
    : String(s || "pending").replace("_", " ");

// ─── Applicant Detail Panel ───────────────────────────────────────────────────
function ApplicantPanel({ app, onClose, onUpdateStatus, busyId }) {
  if (!app) return null;

  const artist = app.artist || app.applicant || {};
  const opp = app.opportunity || {};
  const status = String(app.status || "pending").toLowerCase();
  const name = artist.name || artist.fullName || artist.username || "Artist";
  const email = artist.email || app.email || "";
  const phone = artist.phone || app.phone || "";
  const location = artist.location || app.location || "";
  const bio = artist.bio || artist.about || "";
  const skills = Array.isArray(artist.skills) ? artist.skills : [];
  const portfolio =
    artist.portfolio || artist.portfolioUrl || app.portfolio || "";
  const instagram = artist.instagram || artist.instagramUrl || "";
  const youtube = artist.youtube || artist.youtubeUrl || "";
  const website = artist.website || artist.websiteUrl || "";
  const experience = artist.experience || artist.yearsOfExperience || "";
  const note = app.coverLetter || app.note || app.message || "";
  const appliedAt = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const avatar = artist.profileImage || artist.avatar || artist.photo || "";
  const isBusy = busyId === app._id;
  const sStyle = STATUS_STYLE[status] || STATUS_STYLE.pending;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* Panel */}
      <div className="detail-panel">
        {/* Gold top bar */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #c9a961, #a8863d, transparent)",
          }}
        />

        {/* Drag handle — mobile only */}
        <div className="drag-handle-wrap">
          <div
            style={{
              width: 36,
              height: 4,
              background: "rgba(255,255,255,0.13)",
              borderRadius: 4,
            }}
          />
        </div>

        {/* Header */}
        <div className="panel-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 0,
            }}
          >
            {avatar ? (
              <img src={avatar} alt={name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <User size={20} style={{ color: "#1a1d24" }} />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h2 className="panel-name">{name}</h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "3px 10px",
                  marginTop: 3,
                }}
              >
                {location && (
                  <span className="meta-chip">
                    <MapPin size={11} style={{ color: "#c9a961" }} />
                    {location}
                  </span>
                )}
                {experience && (
                  <span className="meta-chip">{experience} exp</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ flexShrink: 0 }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Applied-for strip */}
        <div className="applied-strip">
          <div style={{ minWidth: 0 }}>
            <p className="strip-label">Applied for</p>
            <p className="strip-title">
              {opp.title || app.opportunityTitle || "—"}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {appliedAt && <span className="meta-chip">{appliedAt}</span>}
            <span
              className="status-badge-lg"
              style={{ background: sStyle.bg, color: sStyle.color }}
            >
              {labelForStatus(status)}
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="panel-body">
          {/* Contact */}
          {(email || phone || portfolio || instagram || youtube || website) && (
            <section className="panel-section">
              <p className="section-label">Contact &amp; Links</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {email && (
                  <a href={`mailto:${email}`} className="link-row">
                    <Mail
                      size={14}
                      style={{ color: "#c9a961", flexShrink: 0 }}
                    />
                    {email}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="link-row">
                    <Phone
                      size={14}
                      style={{ color: "#c9a961", flexShrink: 0 }}
                    />
                    {phone}
                  </a>
                )}
                {portfolio && (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-row link-gold"
                  >
                    <ExternalLink size={14} style={{ flexShrink: 0 }} />
                    View Portfolio
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-row"
                  >
                    <Instagram
                      size={14}
                      style={{ color: "#e1306c", flexShrink: 0 }}
                    />
                    Instagram
                  </a>
                )}
                {youtube && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-row"
                  >
                    <Youtube
                      size={14}
                      style={{ color: "#ff0000", flexShrink: 0 }}
                    />
                    YouTube
                  </a>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-row"
                  >
                    <Globe
                      size={14}
                      style={{ color: "#c9a961", flexShrink: 0 }}
                    />
                    Website
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Bio */}
          {bio && (
            <section className="panel-section">
              <p className="section-label">About</p>
              <p className="body-text">{bio}</p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="panel-section">
              <p className="section-label">Skills</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((sk, i) => (
                  <span key={i} className="skill-chip">
                    {sk}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Cover note */}
          {note && (
            <section className="panel-section">
              <p className="section-label">Cover Note</p>
              <p className="cover-note">{note}</p>
            </section>
          )}

          {!bio &&
            !note &&
            skills.length === 0 &&
            !email &&
            !phone &&
            !portfolio && (
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "28px 0",
                }}
              >
                No additional details available.
              </p>
            )}
        </div>

        {/* Action footer */}
        <div className="panel-footer">
          {[
            {
              s: "hired",
              label: "Accept",
              bg: "rgba(74,222,128,0.15)",
              color: "#4ade80",
              Icon: CheckCircle2,
            },
            {
              s: "rejected",
              label: "Reject",
              bg: "rgba(248,113,113,0.15)",
              color: "#f87171",
              Icon: XCircle,
            },
            {
              s: "pending",
              label: "Pending",
              bg: "rgba(251,191,36,0.15)",
              color: "#fbbf24",
              Icon: Clock3,
            },
          ].map(({ s, label, bg, color, Icon: BtnIcon }) => {
            const isActive =
              status === s || (s === "hired" && status === "accepted");
            return (
              <button
                key={s}
                disabled={isBusy || isActive}
                onClick={() => onUpdateStatus(app._id, s)}
                className="footer-action-btn"
                style={{
                  background: isActive ? bg : "rgba(255,255,255,0.06)",
                  color: isActive ? color : "#6b7280",
                  border: isActive ? `1px solid ${color}40` : "none",
                  opacity: isBusy ? 0.6 : 1,
                  cursor: isBusy || isActive ? "default" : "pointer",
                }}
              >
                <BtnIcon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Applications() {
  const [searchParams] = useSearchParams();
  const preselectedOppId = searchParams.get("opportunityId") || "";

  const [items, setItems] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOppId, setSelectedOppId] = useState(preselectedOppId);
  const [detailApp, setDetailApp] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [appsData, oppsData] = await Promise.all([
          hirerAPI.getApplications().catch(() => []),
          hirerAPI.getOpportunities().catch(() => []),
        ]);
        if (!mounted) return;
        setItems(Array.isArray(appsData) ? appsData : []);
        setOpportunities(Array.isArray(oppsData) ? oppsData : []);
      } catch {
        if (mounted) {
          setItems([]);
          setOpportunities([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter by selected post, then by status tab
  const filtered = useMemo(() => {
    let list = items;
    if (selectedOppId) {
      list = list.filter((app) => {
        const id = app.opportunityId || app.opportunity?._id || app.opportunity;
        return String(id) === String(selectedOppId);
      });
    }
    if (filter !== "all") {
      list = list.filter((app) => {
        const s = String(app.status || "pending").toLowerCase();
        if (filter === "hired") return s === "hired" || s === "accepted";
        return s === filter;
      });
    }
    return list;
  }, [items, selectedOppId, filter]);

  // Tab counts scoped to selected post
  const counts = useMemo(() => {
    const base = selectedOppId
      ? items.filter(
          (a) =>
            String(a.opportunityId || a.opportunity?._id || a.opportunity) ===
            String(selectedOppId),
        )
      : items;
    return {
      all: base.length,
      pending: base.filter((a) => (a.status || "pending") === "pending").length,
      hired: base.filter((a) => ["hired", "accepted"].includes(a.status))
        .length,
      rejected: base.filter((a) => a.status === "rejected").length,
    };
  }, [items, selectedOppId]);

  const updateStatus = async (applicationId, status) => {
    setBusyId(applicationId);
    try {
      const updated = await hirerAPI.updateApplicationStatus(applicationId, {
        status,
      });
      setItems((prev) =>
        prev.map((item) =>
          item._id === applicationId ? { ...item, ...updated, status } : item,
        ),
      );
      setDetailApp((prev) =>
        prev?._id === applicationId ? { ...prev, ...updated, status } : prev,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId("");
    }
  };

  const selectedOpp = opportunities.find((o) => o._id === selectedOppId);

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#1a1d24",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <HirerSidebar />

      <div className="apps-wrap">
        <div className="apps-inner">
          {/* Page title */}
          <div style={{ marginBottom: 20 }}>
            <h1 className="page-title">Applications</h1>
            <p className="page-sub">
              {selectedOpp ? (
                <>
                  Showing applications for{" "}
                  <span style={{ color: "#c9a961", fontWeight: 600 }}>
                    {selectedOpp.title}
                  </span>
                </>
              ) : (
                "Review applications and set status to Accepted, Rejected, or Pending."
              )}
            </p>
          </div>

          {/* Post selector dropdown */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Briefcase
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#c9a961",
                pointerEvents: "none",
              }}
            />
            <select
              value={selectedOppId}
              onChange={(e) => {
                setSelectedOppId(e.target.value);
                setFilter("all");
                setDetailApp(null);
              }}
              className="post-select"
            >
              <option value="">All posts</option>
              {opportunities.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Status tabs */}
          <div className="tabs-row">
            {[
              { key: "all", label: "All", count: counts.all },
              { key: "pending", label: "Pending", count: counts.pending },
              { key: "hired", label: "Accepted", count: counts.hired },
              { key: "rejected", label: "Rejected", count: counts.rejected },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`tab-btn${filter === key ? " tab-active" : ""}`}
              >
                {label}
                <span
                  className={`tab-count${filter === key ? " tab-count-active" : ""}`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "56px 0",
              }}
            >
              <Loader2
                size={26}
                style={{
                  color: "#c9a961",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Users
                size={30}
                style={{
                  color: "rgba(156,163,175,0.22)",
                  margin: "0 auto 10px",
                  display: "block",
                }}
              />
              <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 3px" }}>
                {selectedOppId
                  ? "No applications for this post yet"
                  : "No applications found."}
              </p>
              {filter !== "all" && (
                <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>
                  Try a different status filter
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((app) => {
                const status = String(app.status || "pending").toLowerCase();
                const sStyle = STATUS_STYLE[status] || STATUS_STYLE.pending;
                const artist = app.artist || {};
                const opp = app.opportunity || {};
                const name = artist.name || artist.username || "Artist";
                const location = artist.location || "";
                const avatar = artist.profileImage || artist.avatar || "";
                const appliedAt = app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
                  : "";
                const note = app.coverLetter || app.note || app.message || "";
                const isBusy = busyId === app._id;
                const isOpen = detailApp?._id === app._id;

                return (
                  <div
                    key={app._id}
                    className="app-card"
                    style={{
                      border: `1px solid ${isOpen ? "rgba(201,169,97,0.5)" : "rgba(201,169,97,0.15)"}`,
                    }}
                  >
                    {/* Artist row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      {avatar ? (
                        <img src={avatar} alt={name} className="card-avatar" />
                      ) : (
                        <div className="card-avatar-ph">
                          <User size={16} style={{ color: "#1a1d24" }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <p className="card-name">{name}</p>
                          <span
                            className="status-badge-sm"
                            style={{
                              background: sStyle.bg,
                              color: sStyle.color,
                            }}
                          >
                            {labelForStatus(status)}
                          </span>
                        </div>

                        {/* Show opportunity only in "All posts" mode */}
                        {!selectedOppId &&
                          (opp.title || app.opportunityTitle) && (
                            <p className="card-opp">
                              <Briefcase
                                size={11}
                                style={{ marginRight: 3, color: "#c9a961" }}
                              />
                              {opp.title || app.opportunityTitle}
                            </p>
                          )}

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "2px 10px",
                            marginTop: 3,
                          }}
                        >
                          {location && (
                            <span className="meta-chip">
                              <MapPin size={10} style={{ color: "#c9a961" }} />
                              {location}
                            </span>
                          )}
                          {appliedAt && (
                            <span className="meta-chip">{appliedAt}</span>
                          )}
                        </div>
                        {note && <p className="card-note">{note}</p>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="card-actions">
                      <button
                        onClick={() => setDetailApp(isOpen ? null : app)}
                        className="btn-details"
                        style={{
                          background: isOpen
                            ? "rgba(201,169,97,0.1)"
                            : "transparent",
                          borderColor: isOpen
                            ? "#c9a961"
                            : "rgba(201,169,97,0.15)",
                          color: isOpen ? "#c9a961" : "#c5cad3",
                        }}
                      >
                        <Eye size={13} /> Details
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => updateStatus(app._id, "hired")}
                        className="btn-status"
                        style={{
                          background: "rgba(74,222,128,0.18)",
                          color: "#4ade80",
                          opacity: isBusy ? 0.6 : 1,
                        }}
                      >
                        <CheckCircle2 size={13} /> Accept
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="btn-status"
                        style={{
                          background: "rgba(248,113,113,0.18)",
                          color: "#f87171",
                          opacity: isBusy ? 0.6 : 1,
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => updateStatus(app._id, "pending")}
                        className="btn-status"
                        style={{
                          background: "rgba(251,191,36,0.18)",
                          color: "#fbbf24",
                          opacity: isBusy ? 0.6 : 1,
                        }}
                      >
                        <Clock3 size={13} /> Keep Pending
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Applicant detail panel */}
      {detailApp && (
        <ApplicantPanel
          app={detailApp}
          onClose={() => setDetailApp(null)}
          onUpdateStatus={updateStatus}
          busyId={busyId}
        />
      )}

      <style>{`
        /* ── Sidebar offset ─── */
        .apps-wrap {
          flex: 1;
          overflow-x: hidden;
          padding: 20px 16px 48px;
        }
        @media (min-width: 640px)  { .apps-wrap { padding: 24px 24px 56px; } }
        @media (min-width: 1024px) { .apps-wrap { margin-left: 288px; padding: 28px 32px 64px; } }

        .apps-inner { max-width: 860px; margin: 0 auto; }

        /* ── Heading ─── */
        .page-title { font-size: clamp(20px,4vw,24px); font-weight:700; color:#fff; margin:0 0 4px; }
        .page-sub   { font-size: 13.5px; color:#9ca3af; margin:0; line-height:1.5; }

        /* ── Post selector ─── */
        .post-select {
          width: 100%;
          padding: 10px 36px 10px 34px;
          background: #2d3139;
          border: 1px solid rgba(201,169,97,0.15);
          border-radius: 10px;
          color: #c5cad3;
          font-size: 13.5px;
          appearance: none;
          cursor: pointer;
          outline: none;
          font-family: inherit;
        }
        .post-select option { background: #2d3139; color: #fff; }

        /* ── Tabs ─── */
        .tabs-row {
          display: flex;
          gap: 6px;
          margin-bottom: 18px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .tabs-row::-webkit-scrollbar { display: none; }

        .tab-btn {
          padding: 7px 12px;
          border-radius: 8px; border: none;
          cursor: pointer; flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          color: #c5cad3;
          font-size: 13px; font-weight: 600;
          display: flex; align-items: center; gap: 5px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          transition: background 0.15s, color 0.15s;
        }
        .tab-btn.tab-active {
          background: rgba(201,169,97,0.12);
          color: #c9a961;
          outline: 1px solid rgba(201,169,97,0.2);
        }
        .tab-count {
          background: rgba(255,255,255,0.08);
          color: #6b7280;
          font-size: 11px; font-weight: 700;
          border-radius: 10px; padding: 1px 7px;
        }
        .tab-count.tab-count-active {
          background: rgba(201,169,97,0.22);
          color: #c9a961;
        }

        /* ── Empty state ─── */
        .empty-state {
          border-radius: 12px; padding: 40px 20px; text-align: center;
          background: #2d3139; border: 1px solid rgba(201,169,97,0.15);
        }

        /* ── App card ─── */
        .app-card {
          border-radius: 12px;
          padding: 14px 16px;
          background: #2d3139;
          transition: border-color 0.2s;
        }
        @media (min-width: 640px) { .app-card { padding: 16px 20px; } }

        .card-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          object-fit: cover; border: 2px solid rgba(201,169,97,0.2); flex-shrink: 0;
        }
        .card-avatar-ph {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #c9a961, #a8863d);
          display: flex; align-items: center; justify-content: center;
        }
        .card-name {
          margin: 0; font-size: 14px; font-weight: 600; color: #fff;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          max-width: calc(100% - 90px);
        }
        .card-opp {
          display: flex; align-items: center;
          margin: 2px 0 0; font-size: 12px; color: #c9a961;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .card-note {
          margin: 5px 0 0; font-size: 12px; color: #9ca3af; line-height: 1.45;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .meta-chip {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11.5px; color: #9ca3af;
        }

        /* ── Card action row ─── */
        .card-actions { display: flex; flex-wrap: wrap; gap: 6px; }

        .btn-details {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 13px; border-radius: 8px; border: 1px solid;
          font-size: 12.5px; font-weight: 500; cursor: pointer;
          flex: 1 1 auto; justify-content: center; min-width: 80px;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .btn-status {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 13px; border-radius: 8px; border: none;
          font-size: 12.5px; font-weight: 600; cursor: pointer;
          flex: 1 1 auto; justify-content: center; min-width: 80px;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }
        .btn-status:disabled { opacity: 0.55; cursor: default; }

        /* ── Status badges ─── */
        .status-badge-sm {
          display: inline-flex; align-items: center;
          padding: 3px 9px; border-radius: 20px;
          font-size: 11.5px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
        }
        .status-badge-lg {
          display: inline-flex; align-items: center;
          padding: 4px 12px; border-radius: 20px;
          font-size: 12.5px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
        }

        /* ── Detail panel ─── */
        /* Mobile: slides up as a bottom sheet */
        .detail-panel {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          height: 88vh;
          z-index: 300;
          background: #22252e;
          border: 1px solid rgba(201,169,97,0.15);
          border-radius: 14px 14px 0 0;
          box-shadow: 0 -8px 48px rgba(0,0,0,0.55);
          display: flex; flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        /* Desktop: slides in from right */
        @media (min-width: 768px) {
          .detail-panel {
            left: auto; top: 0; right: 0; bottom: 0;
            width: clamp(320px, 40vw, 480px);
            height: 100vh;
            border-radius: 0;
            border-left: 1px solid rgba(201,169,97,0.15);
            border-top: none; border-bottom: none; border-right: none;
            animation: slideInRight 0.28s cubic-bezier(0.4,0,0.2,1);
          }
          .drag-handle-wrap { display: none !important; }
        }

        .drag-handle-wrap { display: flex; justify-content: center; padding: 8px 0 2px; }

        .panel-header {
          padding: 14px 20px 12px;
          border-bottom: 1px solid rgba(201,169,97,0.15);
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 10px;
        }
        .panel-name {
          margin: 0 0 2px;
          font-size: clamp(15px,3vw,18px); font-weight: 700; color: #fff;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .avatar-img {
          width: 48px; height: 48px; border-radius: 50%;
          object-fit: cover; border: 2px solid rgba(201,169,97,0.2); flex-shrink: 0;
        }
        .avatar-placeholder {
          width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #c9a961, #a8863d);
          display: flex; align-items: center; justify-content: center;
        }

        .applied-strip {
          padding: 10px 20px;
          background: rgba(201,169,97,0.08);
          border-bottom: 1px solid rgba(201,169,97,0.15);
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 6px;
        }
        .strip-label { margin:0; font-size:10.5px; color:#9ca3af; text-transform:uppercase; letter-spacing:.06em; font-weight:600; }
        .strip-title { margin:2px 0 0; font-size:13px; font-weight:600; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .panel-body {
          flex: 1; overflow-y: auto;
          padding: 18px 20px;
          -webkit-overflow-scrolling: touch;
        }
        .panel-section { margin-bottom: 18px; }
        .section-label { margin:0 0 9px; font-size:10.5px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:.06em; }
        .body-text     { margin:0; font-size:13.5px; color:#9ca3af; line-height:1.65; }
        .cover-note    { margin:0; font-size:13.5px; color:#9ca3af; line-height:1.65; background:rgba(255,255,255,0.03); border-radius:10px; padding:12px 14px; border-left:3px solid #c9a961; }
        .skill-chip    { padding:4px 12px; background:rgba(201,169,97,0.1); border:1px solid rgba(201,169,97,0.15); border-radius:20px; font-size:12.5px; color:#c9a961; font-weight:500; }

        .link-row {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px; border: 1px solid rgba(201,169,97,0.15);
          color: #fff; text-decoration: none; font-size: 13px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .link-gold { color: #c9a961; }

        .panel-footer {
          padding: 12px 20px;
          border-top: 1px solid rgba(201,169,97,0.15);
          display: flex; gap: 8px;
        }
        .footer-action-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
          padding: 10px 0; border-radius: 9px;
          font-size: 13px; font-weight: 600;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
          transition: background 0.15s, color 0.15s;
        }

        .icon-btn {
          background: rgba(255,255,255,0.06); border: none; cursor: pointer; color: #9ca3af;
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }

        /* ── Animations ─── */
        @keyframes slideUp      { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes slideInRight { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes spin         { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

        * { box-sizing: border-box; }
        input, select, textarea, button { -webkit-tap-highlight-color: transparent; }
        select option { background: #2d3139; color: #ffffff; }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,97,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
