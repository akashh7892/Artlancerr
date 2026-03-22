import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Clock,
  Calendar,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Star,
  Tag,
  Layers,
  Loader2,
} from "lucide-react";

const C = {
  bg: "#1a1d24",
  card: "#22252e",
  cardDeep: "#191c23",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
  gold: "#b3a961",
  goldDim: "rgba(179,169,97,0.12)",
  border: "rgba(179,169,97,0.10)",
  inputBorder: "rgba(255,255,255,0.08)",
};

export default function OpportunityPublicView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const rawApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(
    /\/+$/,
    "",
  );
  const apiRoot = rawApiBaseUrl
    ? rawApiBaseUrl.endsWith("/api")
      ? rawApiBaseUrl
      : `${rawApiBaseUrl}/api`
    : "/api";

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has a valid token/session
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (token) {
          // Verify token with backend
          const response = await fetch(`${apiRoot}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            // Clear invalid token
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [apiRoot]);

  useEffect(() => {
    if (!id) {
      setError("Invalid link.");
      setLoading(false);
      return;
    }
    fetch(`${apiRoot}/opportunities/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?._id) setOpp(data);
        else setError("This opportunity could not be found.");
      })
      .catch(() => setError("Could not load opportunity. Please try again."))
      .finally(() => setLoading(false));
  }, [id, apiRoot]);

  // Handle apply button click
  const handleApply = () => {
    if (isAuthenticated) {
      // User is signed in, go directly to opportunities
      navigate(`/artist/opportunities`);
    } else {
      // User is not signed in, redirect to login with return URL
      navigate(`/auth/artist/login?redirect=/artist/opportunities`);
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Loader2
          size={28}
          style={{ color: C.gold, animation: "pub-spin 1s linear infinite" }}
        />
        <p
          style={{
            color: C.lightText,
            fontFamily: "sans-serif",
            fontSize: 14,
            margin: 0,
          }}
        >
          Loading opportunity…
        </p>
        <style>{`@keyframes pub-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );

  if (error || !opp)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          padding: 24,
        }}
      >
        <div style={{ fontSize: 40 }}>🎬</div>
        <p
          style={{
            color: "#f87171",
            fontSize: 15,
            margin: 0,
            textAlign: "center",
          }}
        >
          {error || "Opportunity not found."}
        </p>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 22px",
            background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
            border: "none",
            borderRadius: 10,
            color: "#1a1d24",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Browse All Opportunities
        </button>
      </div>
    );

  const responsibilities = opp.responsibilities || [];
  const perks = opp.perks || [];
  const tags = opp.tags || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes pub-fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .pub-card { animation: pub-fadeUp 0.35s ease both; }
        .pub-apply-btn { transition: filter 0.18s, transform 0.15s; }
        .pub-apply-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .pub-apply-btn:active { transform: scale(0.97); }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            borderBottom: `1px solid ${C.inputBorder}`,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: C.bg,
            zIndex: 10,
          }}
        >
          <button
            onClick={() => navigate("/home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "transparent",
              border: `1px solid ${C.inputBorder}`,
              borderRadius: 9,
              color: C.lightText,
              padding: "7px 13px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} /> Browse All
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: C.goldDim,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 11 }}>
                <img src="/logo.png" className="img-fluid rounded-top" alt="" />
              </span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>
              Flip
            </span>
          </div>
        </div>

        <div
          style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 60px" }}
        >
          {/* Main card */}
          <div
            className="pub-card"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            {/* Gold accent */}
            <div
              style={{
                height: 3,
                background: `linear-gradient(90deg, ${C.gold}, #cfc060, transparent)`,
              }}
            />

            <div style={{ padding: "20px 22px 22px" }}>
              {/* Type badge */}
              {opp.type && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 11px",
                    borderRadius: 20,
                    background: C.goldDim,
                    color: C.gold,
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 12,
                    border: `1px solid rgba(179,169,97,0.2)`,
                    letterSpacing: "0.03em",
                  }}
                >
                  {opp.type}
                </span>
              )}

              <h1
                style={{
                  color: C.darkText,
                  fontSize: "clamp(20px, 5vw, 26px)",
                  fontWeight: 700,
                  margin: "0 0 6px",
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1.25,
                }}
              >
                {opp.title}
              </h1>
              {opp.company && (
                <p
                  style={{
                    color: C.lightText,
                    fontSize: 13.5,
                    margin: "0 0 18px",
                  }}
                >
                  {opp.company}
                </p>
              )}

              {/* Meta grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {[
                  { Icon: MapPin, label: "Location", val: opp.location },
                  { Icon: IndianRupee, label: "Budget", val: opp.budget },
                  { Icon: Clock, label: "Duration", val: opp.duration },
                  {
                    Icon: Calendar,
                    label: "Start",
                    val: opp.startDate
                      ? new Date(opp.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "ASAP",
                  },
                ]
                  .filter((x) => x.val)
                  .map(({ Icon, label, val }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 9,
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: 10,
                        border: `1px solid ${C.inputBorder}`,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          background: C.goldDim,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={12} style={{ color: C.gold }} />
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 10,
                            fontWeight: 700,
                            color: C.lightText,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 2,
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: C.darkText,
                          }}
                        >
                          {val}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Description */}
              {opp.description && (
                <div style={{ marginBottom: responsibilities.length ? 20 : 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                    }}
                  >
                    <Layers size={13} style={{ color: C.gold }} />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: C.darkText,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      About this project
                    </p>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      color: C.lightText,
                      lineHeight: 1.75,
                    }}
                  >
                    {opp.description}
                  </p>
                </div>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <div
                  style={{ marginTop: 18, marginBottom: perks.length ? 18 : 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 10,
                    }}
                  >
                    <Briefcase size={13} style={{ color: C.gold }} />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: C.darkText,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Responsibilities
                    </p>
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {responsibilities.map((r, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <CheckCircle2
                          size={13}
                          style={{ color: C.gold, flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: C.lightText,
                            lineHeight: 1.6,
                          }}
                        >
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Perks */}
              {perks.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 10,
                    }}
                  >
                    <Star size={13} style={{ color: C.gold }} />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: C.darkText,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      What you get
                    </p>
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                    }}
                  >
                    {perks.map((p, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: C.gold,
                            flexShrink: 0,
                            marginTop: 6,
                          }}
                        />
                        <span style={{ fontSize: 13, color: C.lightText }}>
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                    }}
                  >
                    <Tag size={13} style={{ color: C.gold }} />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: C.darkText,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Tags
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11.5,
                          padding: "4px 11px",
                          borderRadius: 20,
                          background: "rgba(255,255,255,0.05)",
                          color: C.lightText,
                          border: `1px solid ${C.inputBorder}`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA card */}
          <div
            className="pub-card"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "20px 22px",
              animationDelay: "0.08s",
            }}
          >
            {isAuthenticated ? (
              // Show for authenticated users
              <>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.darkText,
                  }}
                >
                  Ready to apply?
                </p>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 13,
                    color: C.lightText,
                  }}
                >
                  Click below to view this opportunity and submit your
                  application.
                </p>

                <button
                  className="pub-apply-btn"
                  onClick={handleApply}
                  style={{
                    width: "100%",
                    padding: "13px",
                    background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                    border: "none",
                    borderRadius: 10,
                    color: "#1a1d24",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  View & Apply Now
                </button>
              </>
            ) : (
              // Show for non-authenticated users
              <>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.darkText,
                  }}
                >
                  Interested in this role?
                </p>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 13,
                    color: C.lightText,
                  }}
                >
                  Sign in or create a free account to apply instantly.
                </p>

                <button
                  className="pub-apply-btn"
                  onClick={handleApply}
                  style={{
                    width: "100%",
                    padding: "13px",
                    background: `linear-gradient(135deg, ${C.gold}, #cfc060)`,
                    border: "none",
                    borderRadius: 10,
                    color: "#1a1d24",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    marginBottom: 10,
                  }}
                >
                  Sign In to Apply
                </button>

                <button
                  className="pub-apply-btn"
                  onClick={() => navigate(`/auth/artist/signup`)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "transparent",
                    border: `1px solid ${C.inputBorder}`,
                    borderRadius: 10,
                    color: C.darkText,
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  New here? Create a free account
                </button>

                <p
                  style={{
                    margin: "12px 0 0",
                    textAlign: "center",
                    fontSize: 11.5,
                    color: C.lightText,
                  }}
                >
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/home")}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.gold,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Browse all opportunities
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
