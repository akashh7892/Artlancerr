import { Navigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth();
  const { role: urlRole } = useParams();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1d24]">
        <div className="w-10 h-10 border-2 border-[#b3a961] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const targetRole = requiredRole || urlRole || "artist";
    return <Navigate to={`/auth/${targetRole}/login`} state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === "artist" ? "/artist/dashboard" : "/hirer/dashboard"} replace />;
  }

  return children;
}
