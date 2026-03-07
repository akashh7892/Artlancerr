import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  XCircle,
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
  Star,
  Calendar,
  MessageSquare,
  Award,
  Layers,
  Play,
  Twitter,
  Link2,
} from "lucide-react";
import HirerSidebar from "./HirerSidebar";
import { hirerAPI } from "../../services/api";

// ─── Status config ─────────────────────────────────────────────────────────────
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v) => (v && String(v).trim() ? String(v).trim() : null);

// ─── Portfolio thumbnail ───────────────────────────────────────────────────────
function PortfolioThumb({ item }) {
  const [err, setErr] = useState(false);
  const thumb = item?.thumbnailUrl || item?.mediaUrl || item?.imageUrl || null;
  const title = item?.title || item?.projectName || "Work";
  const type = item?.category || item?.workType || null;
  const link = item?.link || item?.url || null;

  return (
    <a
      href={link || undefined}
      target={link ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16/10",
          border: "1px solid rgba(201,169,97,0.15)",
          background: "#1a1d24",
          cursor: link ? "pointer" : "default",
        }}
      >
        {thumb && !err ? (
          <img
            src={thumb}
            alt={title}
            onError={() => setErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={20} style={{ color: "rgba(156,163,175,0.4)" }} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "8px 10px",
          }}
        >
          {type && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#c9a961",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {type}
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
          {link && (
            <span
              style={{
                fontSize: 10,
                color: "#c9a961",
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginTop: 2,
              }}
            >
              <ExternalLink size={9} /> View
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

// ─── Full Artist Detail Panel ──────────────────────────────────────────────────
function ApplicantPanel({ app, onClose, onUpdateStatus, busyId }) {
  if (!app) return null;

  const artist = app.artist || app.applicant || {};
  const opp = app.opportunity || {};
  const status = String(app.status || "pending").toLowerCase();
  const isBusy = busyId === app._id;
  const sStyle = STATUS_STYLE[status] || STATUS_STYLE.pending;

  // ── All artist fields ──
  const name =
    fmt(artist.name || artist.fullName || artist.username) || "Artist";
  const email = fmt(artist.email || app.email);
  const phone = fmt(artist.phone || app.phone);
  const location = fmt(artist.location || app.location);
  const bio = fmt(artist.bio || artist.about);
  const experience = fmt(artist.experience || artist.yearsOfExperience);
  const role = fmt(artist.artCategory || artist.role || artist.category);
  const avatar = fmt(artist.profileImage || artist.avatar || artist.photo);
  const coverPhoto = fmt(artist.coverPhoto || artist.coverImage);
  const responseTime = fmt(artist.responseTime);
  const note = fmt(app.coverLetter || app.note || app.message);

  // Rates
  const dailyRate = fmt(artist?.rates?.daily || app?.rates?.daily);
  const weeklyRate = fmt(artist?.rates?.weekly || app?.rates?.weekly);
  const projectRate = fmt(artist?.rates?.project || app?.rates?.project);

  // Social / links
  const portfolio = fmt(
    artist.portfolio || artist.portfolioUrl || app.portfolio,
  );
  const instagram = fmt(artist.instagram || artist.instagramUrl);
  const youtube = fmt(artist.youtube || artist.youtubeUrl);
  const website = fmt(artist.website || artist.websiteUrl);
  const twitter = fmt(artist.twitter || artist.twitterUrl);

  // Skills array
  const skills = [
    ...(role ? [role] : []),
    ...(Array.isArray(artist.skills) ? artist.skills : []),
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  // Portfolio items array
  const portfolioItems = Array.isArray(artist.portfolio)
    ? artist.portfolio
    : Array.isArray(app.portfolio)
      ? app.portfolio
      : [];

  // Reviews
  const reviews = Array.isArray(artist.reviews) ? artist.reviews : [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? Number(
          (
            reviews.reduce((s, r) => s + Number(r?.rating || 0), 0) /
            reviewCount
          ).toFixed(1),
        )
      : null;

  // Equipment
  const equipment = Array.isArray(artist.equipment) ? artist.equipment : [];

  // Applied date
  const appliedAt = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Avatar fallback
  const [avatarErr, setAvatarErr] = useState(false);
  const [coverErr, setCoverErr] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "92vh",
          zIndex: 300,
          background: "#22252e",
          border: "1px solid rgba(201,169,97,0.18)",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -8px 56px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideUp 0.28s cubic-bezier(0.4,0,0.2,1)",
          // Desktop: right sidebar
          ...(window.innerWidth >= 768
            ? {
                left: "auto",
                top: 0,
                right: 0,
                bottom: 0,
                width: "clamp(360px, 44vw, 540px)",
                height: "100vh",
                borderRadius: 0,
                borderLeft: "1px solid rgba(201,169,97,0.18)",
                borderTop: "none",
                borderBottom: "none",
                borderRight: "none",
                animation: "slideInRight 0.28s cubic-bezier(0.4,0,0.2,1)",
              }
            : {}),
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #c9a961, #a8863d, transparent)",
            flexShrink: 0,
          }}
        />

        {/* Drag handle – mobile */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "8px 0 2px",
            flexShrink: 0,
          }}
          className="mobile-handle"
        >
          <div
            style={{
              width: 36,
              height: 4,
              background: "rgba(255,255,255,0.13)",
              borderRadius: 4,
            }}
          />
        </div>

        {/* ── Cover photo strip ── */}
        <div
          style={{
            position: "relative",
            height: 110,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {coverPhoto && !coverErr ? (
            <img
              src={coverPhoto}
              alt="cover"
              onError={() => setCoverErr(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #1a1d24, #2d3139)",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 30%, #22252e 100%)",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              background: "rgba(26,29,36,0.8)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(201,169,97,0.2)",
              borderRadius: 9,
              color: "#9ca3af",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Avatar + name (overlaps cover) ── */}
        <div
          style={{
            padding: "0 20px 14px",
            marginTop: -44,
            flexShrink: 0,
            borderBottom: "1px solid rgba(201,169,97,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ position: "relative" }}>
              {avatar && !avatarErr ? (
                <img
                  src={avatar}
                  alt={name}
                  onError={() => setAvatarErr(true)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #22252e",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#c9a961,#a8863d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid #22252e",
                  }}
                >
                  <User size={28} style={{ color: "#1a1d24" }} />
                </div>
              )}
            </div>

            {/* Status badge */}
            <span
              style={{
                padding: "5px 13px",
                borderRadius: 20,
                background: sStyle.bg,
                color: sStyle.color,
                fontSize: 12,
                fontWeight: 700,
                alignSelf: "flex-start",
                marginTop: 48,
              }}
            >
              {labelForStatus(status)}
            </span>
          </div>

          <h2
            style={{
              margin: "10px 0 2px",
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {name}
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
            {role && (
              <span style={{ fontSize: 13, fontWeight: 600, color: "#c9a961" }}>
                {role}
              </span>
            )}
            {location && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "#9ca3af",
                }}
              >
                <MapPin size={11} style={{ color: "#c9a961" }} />
                {location}
              </span>
            )}
            {experience && (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {experience} exp
              </span>
            )}
            {avgRating !== null && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 12,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                <Star size={11} fill="#c9a961" color="#c9a961" />
                {avgRating} ({reviewCount})
              </span>
            )}
          </div>
        </div>

        {/* ── Applied-for strip ── */}
        <div
          style={{
            padding: "10px 20px",
            flexShrink: 0,
            background: "rgba(201,169,97,0.07)",
            borderBottom: "1px solid rgba(201,169,97,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Applied for
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {opp.title || app.opportunityTitle || "—"}
            </p>
          </div>
          {appliedAt && (
            <span style={{ fontSize: 11.5, color: "#9ca3af", flexShrink: 0 }}>
              {appliedAt}
            </span>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 20px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Rates */}
          {(dailyRate || weeklyRate || projectRate) && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Rates</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))",
                  gap: 8,
                }}
              >
                {dailyRate && <RateChip label="Daily" value={dailyRate} />}
                {weeklyRate && <RateChip label="Weekly" value={weeklyRate} />}
                {projectRate && (
                  <RateChip label="Project" value={projectRate} />
                )}
              </div>
            </section>
          )}

          {/* Bio */}
          {bio && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>About</p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  color: "#9ca3af",
                  lineHeight: 1.65,
                }}
              >
                {bio}
              </p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Skills &amp; Category</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((sk, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 12px",
                      background: "rgba(201,169,97,0.1)",
                      border: "1px solid rgba(201,169,97,0.15)",
                      borderRadius: 20,
                      fontSize: 12.5,
                      color: "#c9a961",
                      fontWeight: 500,
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Contact */}
          {(email || phone) && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Contact</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {email && (
                  <a href={`mailto:${email}`} style={linkRow}>
                    <Mail
                      size={13}
                      style={{ color: "#c9a961", flexShrink: 0 }}
                    />
                    {email}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} style={linkRow}>
                    <Phone
                      size={13}
                      style={{ color: "#c9a961", flexShrink: 0 }}
                    />
                    {phone}
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Social & Links */}
          {(portfolio || instagram || youtube || website || twitter) && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Links &amp; Social</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {portfolio && (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...linkRow, color: "#c9a961" }}
                  >
                    <ExternalLink size={13} style={{ flexShrink: 0 }} />
                    View Portfolio
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkRow}
                  >
                    <Instagram
                      size={13}
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
                    style={linkRow}
                  >
                    <Youtube
                      size={13}
                      style={{ color: "#ff0000", flexShrink: 0 }}
                    />
                    YouTube
                  </a>
                )}
                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkRow}
                  >
                    <Twitter
                      size={13}
                      style={{ color: "#1da1f2", flexShrink: 0 }}
                    />
                    Twitter / X
                  </a>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkRow}
                  >
                    <Globe
                      size={13}
                      style={{ color: "#c9a961", flexShrink: 0 }}
                    />
                    Website
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Portfolio items grid */}
          {portfolioItems.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Portfolio Work</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
                  gap: 8,
                }}
              >
                {portfolioItems.map((item, i) => (
                  <PortfolioThumb key={i} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Availability */}
          {(artist?.availability?.freeDates?.length > 0 ||
            artist?.availability?.blockedDates?.length > 0) && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Availability</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {artist.availability.freeDates?.length > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 12px",
                      background: "rgba(74,222,128,0.08)",
                      border: "1px solid rgba(74,222,128,0.2)",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#4ade80",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4ade80",
                      }}
                    />
                    {artist.availability.freeDates.length} free dates
                  </span>
                )}
                {artist.availability.blockedDates?.length > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 12px",
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#f87171",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#f87171",
                      }}
                    />
                    {artist.availability.blockedDates.length} booked dates
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Response time */}
          {responseTime && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Response Time</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 13px",
                  background: "#1a1d24",
                  border: "1px solid rgba(201,169,97,0.15)",
                  borderRadius: 9,
                  fontSize: 13,
                  color: "#fff",
                }}
              >
                <Clock3 size={13} style={{ color: "#c9a961" }} />
                {responseTime}
              </div>
            </section>
          )}

          {/* Equipment */}
          {equipment.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Equipment &amp; Gear</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {equipment.map((eq, i) => (
                  <div
                    key={eq._id || i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 13px",
                      background: "#1a1d24",
                      border: "1px solid rgba(201,169,97,0.12)",
                      borderRadius: 9,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {eq.name || "Equipment"}
                      </p>
                      {eq.model && (
                        <p
                          style={{
                            margin: "1px 0 0",
                            fontSize: 11,
                            color: "#9ca3af",
                          }}
                        >
                          {eq.model}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {eq.rental && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#c9a961",
                          }}
                        >
                          ₹{eq.rental}/day
                        </p>
                      )}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: eq.rentalOn !== false ? "#4ade80" : "#f87171",
                        }}
                      >
                        {eq.rentalOn !== false ? "Available" : "Booked"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Reviews ({reviewCount})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reviews.slice(0, 3).map((r, i) => {
                  const rName =
                    r.name || r.reviewerName || r.hirer?.name || "Anonymous";
                  const rText = r.text || r.comment || r.message || "";
                  const rRating = Number(r.rating || 0);
                  const rDate = r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "";
                  return (
                    <div
                      key={r._id || i}
                      style={{
                        padding: "11px 13px",
                        background: "#1a1d24",
                        border: "1px solid rgba(201,169,97,0.12)",
                        borderRadius: 9,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          {rName}
                        </span>
                        <div style={{ display: "flex", gap: 2 }}>
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              size={10}
                              fill={j < rRating ? "#c9a961" : "transparent"}
                              color={j < rRating ? "#c9a961" : "#6b7280"}
                            />
                          ))}
                        </div>
                      </div>
                      {rText && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12.5,
                            color: "#9ca3af",
                            lineHeight: 1.55,
                          }}
                        >
                          {rText}
                        </p>
                      )}
                      {rDate && (
                        <p
                          style={{
                            margin: "5px 0 0",
                            fontSize: 10.5,
                            color: "#6b7280",
                          }}
                        >
                          {rDate}
                        </p>
                      )}
                    </div>
                  );
                })}
                {reviews.length > 3 && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#9ca3af",
                      textAlign: "center",
                    }}
                  >
                    +{reviews.length - 3} more reviews on full profile
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Cover note */}
          {note && (
            <section style={{ marginBottom: 20 }}>
              <p style={labelStyle}>Cover Note</p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  color: "#9ca3af",
                  lineHeight: 1.65,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  borderLeft: "3px solid #c9a961",
                }}
              >
                {note}
              </p>
            </section>
          )}

          {/* Truly empty */}
          {!bio &&
            !note &&
            skills.length === 0 &&
            !email &&
            !phone &&
            !portfolio &&
            portfolioItems.length === 0 &&
            reviews.length === 0 && (
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "32px 0",
                }}
              >
                No additional details available for this applicant.
              </p>
            )}
        </div>

        {/* ── Action footer ── */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid rgba(201,169,97,0.15)",
            display: "flex",
            gap: 8,
            flexShrink: 0,
            background: "#22252e",
          }}
        >
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
              label: "Keep Pending",
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
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "10px 0",
                  borderRadius: 9,
                  background: isActive ? bg : "rgba(255,255,255,0.05)",
                  color: isActive ? color : "#6b7280",
                  border: isActive
                    ? `1px solid ${color}40`
                    : "1px solid rgba(255,255,255,0.06)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  opacity: isBusy ? 0.6 : 1,
                  cursor: isBusy || isActive ? "default" : "pointer",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                <BtnIcon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Rate chip ─────────────────────────────────────────────────────────────────
function RateChip({ label, value }) {
  const display = value && !String(value).startsWith("₹") ? `₹${value}` : value;
  return (
    <div
      style={{
        padding: "9px 12px",
        background: "#1a1d24",
        border: "1px solid rgba(201,169,97,0.15)",
        borderRadius: 9,
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 10,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "3px 0 0",
          fontSize: 14,
          fontWeight: 700,
          color: "#c9a961",
        }}
      >
        {display}
      </p>
    </div>
  );
}

// ─── Shared micro-styles ───────────────────────────────────────────────────────
const labelStyle = {
  margin: "0 0 9px",
  fontSize: 10.5,
  fontWeight: 600,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const linkRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 12px",
  background: "rgba(255,255,255,0.03)",
  borderRadius: 8,
  border: "1px solid rgba(201,169,97,0.15)",
  color: "#fff",
  textDecoration: "none",
  fontSize: 13,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

// ─── Main Applications page ────────────────────────────────────────────────────
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
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      <HirerSidebar />

      <div className="apps-wrap">
        <div className="apps-inner">
          {/* Title */}
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
                "Review and manage all applications. Click Details to see the full artist profile."
              )}
            </p>
          </div>

          {/* Post selector */}
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

          {/* Tabs */}
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
                const role = artist.artCategory || artist.role || "";
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
                const skills = Array.isArray(artist.skills)
                  ? artist.skills
                  : [];
                const experience = artist.experience || "";

                return (
                  <div
                    key={app._id}
                    className="app-card"
                    style={{
                      border: `1px solid ${isOpen ? "rgba(201,169,97,0.5)" : "rgba(201,169,97,0.15)"}`,
                    }}
                  >
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

                        {role && (
                          <p
                            style={{
                              margin: "2px 0 0",
                              fontSize: 12,
                              color: "#c9a961",
                              fontWeight: 600,
                            }}
                          >
                            {role}
                          </p>
                        )}

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
                          {experience && (
                            <span className="meta-chip">{experience}</span>
                          )}
                          {appliedAt && (
                            <span className="meta-chip">{appliedAt}</span>
                          )}
                        </div>

                        {skills.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 4,
                              marginTop: 6,
                            }}
                          >
                            {skills.slice(0, 3).map((sk, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: "2px 8px",
                                  background: "rgba(201,169,97,0.08)",
                                  border: "1px solid rgba(201,169,97,0.12)",
                                  borderRadius: 20,
                                  fontSize: 11,
                                  color: "#c9a961",
                                  fontWeight: 500,
                                }}
                              >
                                {sk}
                              </span>
                            ))}
                            {skills.length > 3 && (
                              <span style={{ fontSize: 11, color: "#6b7280" }}>
                                +{skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}

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
                        <Eye size={13} /> {isOpen ? "Hide" : "Details"}
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
                        <Clock3 size={13} /> Pending
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {detailApp && (
        <ApplicantPanel
          app={detailApp}
          onClose={() => setDetailApp(null)}
          onUpdateStatus={updateStatus}
          busyId={busyId}
        />
      )}

      <style>{`
        .apps-wrap { flex: 1; overflow-x: hidden; padding: 20px 16px 48px; }
        @media (min-width: 640px)  { .apps-wrap { padding: 24px 24px 56px; } }
        @media (min-width: 1024px) { .apps-wrap { margin-left: 288px; padding: 28px 32px 64px; } }
        .apps-inner { max-width: 860px; margin: 0 auto; }

        .page-title { font-size: clamp(20px,4vw,24px); font-weight:700; color:#fff; margin:0 0 4px; }
        .page-sub   { font-size: 13.5px; color:#9ca3af; margin:0; line-height:1.5; }

        .post-select { width:100%; padding:10px 36px 10px 34px; background:#2d3139; border:1px solid rgba(201,169,97,0.15); border-radius:10px; color:#c5cad3; font-size:13.5px; appearance:none; cursor:pointer; outline:none; font-family:inherit; }
        .post-select option { background:#2d3139; color:#fff; }

        .tabs-row { display:flex; gap:6px; margin-bottom:18px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:2px; scrollbar-width:none; }
        .tabs-row::-webkit-scrollbar { display:none; }

        .tab-btn { padding:7px 12px; border-radius:8px; border:none; cursor:pointer; flex-shrink:0; background:rgba(255,255,255,0.06); color:#c5cad3; font-size:13px; font-weight:600; display:flex; align-items:center; gap:5px; -webkit-tap-highlight-color:transparent; touch-action:manipulation; transition:background 0.15s,color 0.15s; }
        .tab-btn.tab-active { background:rgba(201,169,97,0.12); color:#c9a961; outline:1px solid rgba(201,169,97,0.2); }
        .tab-count { background:rgba(255,255,255,0.08); color:#6b7280; font-size:11px; font-weight:700; border-radius:10px; padding:1px 7px; }
        .tab-count.tab-count-active { background:rgba(201,169,97,0.22); color:#c9a961; }

        .empty-state { border-radius:12px; padding:40px 20px; text-align:center; background:#2d3139; border:1px solid rgba(201,169,97,0.15); }

        .app-card { border-radius:12px; padding:14px 16px; background:#2d3139; transition:border-color 0.2s; }
        @media (min-width: 640px) { .app-card { padding:16px 20px; } }

        .card-avatar    { width:44px; height:44px; border-radius:50%; object-fit:cover; border:2px solid rgba(201,169,97,0.2); flex-shrink:0; }
        .card-avatar-ph { width:44px; height:44px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#c9a961,#a8863d); display:flex; align-items:center; justify-content:center; }
        .card-name { margin:0; font-size:14px; font-weight:600; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:calc(100% - 90px); }
        .card-opp  { display:flex; align-items:center; margin:2px 0 0; font-size:12px; color:#c9a961; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .card-note { margin:6px 0 0; font-size:12px; color:#9ca3af; line-height:1.45; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
        .meta-chip { display:inline-flex; align-items:center; gap:3px; font-size:11.5px; color:#9ca3af; }

        .card-actions { display:flex; flex-wrap:wrap; gap:6px; }
        .btn-details { display:flex; align-items:center; gap:5px; padding:7px 13px; border-radius:8px; border:1px solid; font-size:12.5px; font-weight:500; cursor:pointer; flex:1 1 auto; justify-content:center; min-width:80px; touch-action:manipulation; transition:background 0.15s,border-color 0.15s,color 0.15s; }
        .btn-status  { display:flex; align-items:center; gap:5px; padding:7px 13px; border-radius:8px; border:none; font-size:12.5px; font-weight:600; cursor:pointer; flex:1 1 auto; justify-content:center; min-width:80px; touch-action:manipulation; }
        .btn-status:disabled { opacity:0.55; cursor:default; }

        .status-badge-sm { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:600; white-space:nowrap; flex-shrink:0; }

        @media (min-width: 768px) {
          .mobile-handle { display: none !important; }
        }

        @keyframes slideUp      { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes slideInRight { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes spin         { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

        * { box-sizing:border-box; }
        input,select,textarea,button { -webkit-tap-highlight-color:transparent; }
        select option { background:#2d3139; color:#ffffff; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,169,97,0.2); border-radius:4px; }
      `}</style>
    </div>
  );
}
