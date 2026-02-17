import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { role } = useParams(); // Get role from URL
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Load saved email if "remember me" was checked previously
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Prefill email from forgot password flow if available
  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Login data:", { ...formData, role });

      // Redirect to the role-specific dashboard
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        general: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate(`/auth/${role}/forgot-password`, {
      state: { email: formData.email },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative animate-fadeIn">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg animate-contentFadeIn">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#e8e9eb] mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-[#808590] font-light tracking-wide">
            Sign in as {role === "artist" ? "an Artist" : "a Hirer"}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-xs sm:text-sm text-red-500 text-center">
              {errors.general}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                required
                className={`w-full bg-transparent border rounded-lg py-2 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base text-[#e2e3e5] placeholder-[#808590]/50 focus:outline-none focus:border-[#c9a961] transition-colors font-light ${
                  errors.email ? "border-red-500" : "border-[#5f5641]"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
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
                required
                className={`w-full bg-transparent border rounded-lg py-2 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-12 text-sm sm:text-base text-[#e2e3e5] placeholder-[#808590]/50 focus:outline-none focus:border-[#c9a961] transition-colors font-light ${
                  errors.password ? "border-red-500" : "border-[#5f5641]"
                }`}
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3 h-3 sm:w-4 sm:h-4 accent-[#5f5641] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs sm:text-sm font-light text-[#808590] cursor-pointer hover:text-[#e2e3e5] transition-colors"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs sm:text-sm text-[#c9a961] hover:underline font-light transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-[#e2e3e5] bg-transparent border border-[#5f5641] rounded-full transition-all duration-300 font-normal tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#808590] border-t-[#e2e3e5] rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[#808590] font-light">
          Don't have an account?{" "}
          <button
            onClick={() => navigate(`/auth/${role}/signup`)}
            className="text-[#c9a961] hover:underline font-normal transition-colors"
          >
            Sign Up
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
