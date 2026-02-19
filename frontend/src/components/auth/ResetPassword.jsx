import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../services/api";

export default function ResetPassword() {
  const { role } = useParams(); // Get role from URL
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!resetToken) {
        throw new Error("Missing reset token. Please restart password recovery.");
      }

      await authAPI.resetPassword(resetToken, formData.password);
      setIsSuccess(true);

      // Navigate to login after 2 seconds
      setTimeout(() => {
        navigate(`/auth/${role}/login`);
      }, 2000);
    } catch (error) {
      console.error("Password reset failed:", error);
      setError(error.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center p-4 animate-fadeIn">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl text-[#e8e9eb] mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-sm sm:text-base text-[#808590] font-light mb-4">
            Your password has been reset successfully. Redirecting to login...
          </p>
          <div className="w-8 h-8 mx-auto border-3 border-[#5f5641] border-t-[#c9a961] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() =>
          navigate(`/auth/${role}/verify-otp`, { state: { email } })
        }
        className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 text-[#808590] hover:text-[#c9a961] transition-colors flex items-center gap-2 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back
      </button>

      {/* Reset Password Form */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg animate-contentFadeIn">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#e8e9eb] mb-2 tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm sm:text-base text-[#808590] font-light tracking-wide">
            Create a new password for{" "}
            <span className="text-[#c9a961]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-xs sm:text-sm font-light text-[#808590] mb-1 sm:mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808590]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full bg-transparent border border-[#5f5641] rounded-lg py-2 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-12 text-sm sm:text-base text-[#e2e3e5] placeholder-[#808590]/50 focus:outline-none focus:border-[#c9a961] transition-colors font-light"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808590] hover:text-[#e2e3e5] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs sm:text-sm font-light text-[#808590] mb-1 sm:mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808590]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full bg-transparent border border-[#5f5641] rounded-lg py-2 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-12 text-sm sm:text-base text-[#e2e3e5] placeholder-[#808590]/50 focus:outline-none focus:border-[#c9a961] transition-colors font-light"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808590] hover:text-[#e2e3e5] transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password requirements */}
          <div className="text-xs sm:text-sm text-[#808590] font-light space-y-1">
            <p
              className={formData.password.length >= 8 ? "text-green-500" : ""}
            >
              • At least 8 characters
            </p>
            <p
              className={
                /[A-Z]/.test(formData.password) ? "text-green-500" : ""
              }
            >
              • At least one uppercase letter
            </p>
            <p
              className={
                /[0-9]/.test(formData.password) ? "text-green-500" : ""
              }
            >
              • At least one number
            </p>
          </div>

          {/* Password match validation */}
          {formData.password && formData.confirmPassword && (
            <p
              className={`text-xs sm:text-sm font-light ${
                formData.password === formData.confirmPassword
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {formData.password === formData.confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading ||
              formData.password !== formData.confirmPassword ||
              formData.password.length < 8 ||
              !/[A-Z]/.test(formData.password) ||
              !/[0-9]/.test(formData.password)
            }
            className="group relative w-full mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-[#e2e3e5] bg-transparent border border-[#5f5641] rounded-full transition-all duration-300 font-normal tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#808590] border-t-[#e2e3e5] rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
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
          a,
          input {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
