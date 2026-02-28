import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { role } = useParams(); // Get role from URL
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  }, [role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });
      authLogin(data);
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative animate-fadeIn">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg animate-contentFadeIn">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#e8e9eb] mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-[#808590] font-light tracking-wide">
            Join as {role === "artist" ? "an Artist" : "a Hirer"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-xs sm:text-sm text-red-500 text-center">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-light text-[#808590] mb-1 sm:mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808590]" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-[#5f5641] rounded-lg py-2 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base text-[#e2e3e5] placeholder-[#808590]/50 focus:outline-none focus:border-[#c9a961] transition-colors font-light"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-light text-[#808590] mb-1 sm:mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808590]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
                className="w-full bg-transparent border border-[#5f5641] rounded-lg py-2 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base text-[#e2e3e5] placeholder-[#808590]/50 focus:outline-none focus:border-[#c9a961] transition-colors font-light"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs sm:text-sm font-light text-[#808590] mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808590]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808590]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
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

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2 mt-4">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-3 h-3 sm:w-4 sm:h-4 mt-1 accent-[#5f5641]"
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm font-light text-[#808590]"
            >
              I agree to the{" "}
              <a href="#" className="text-[#c9a961] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#c9a961] hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading || formData.password !== formData.confirmPassword
            }
            className="group relative w-full mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-[#e2e3e5] bg-transparent border border-[#5f5641] rounded-full transition-all duration-300 font-normal tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#808590] border-t-[#e2e3e5] rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[#808590] font-light">
          Already have an account?{" "}
          <button
            onClick={() => navigate(`/auth/${role}/login`)}
            className="text-[#c9a961] hover:underline font-normal"
          >
            Sign In
          </button>
        </p>
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
          input,
          [role="button"] {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
