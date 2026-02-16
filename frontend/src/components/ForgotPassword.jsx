// frontend/src/components/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email if passed from login page
  useState(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, []);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP sent to:", email);
      setIsSubmitted(true);

      // Navigate to OTP verification after showing success message
      setTimeout(() => {
        navigate("/auth/verify-otp", {
          state: { email: email },
        });
      }, 1500);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate("/auth/login")}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 text-[#808590] hover:text-[#c9a961] transition-colors flex items-center gap-2 text-sm sm:text-base z-10"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back to Login
      </button>

      {/* Forgot Password Form */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg animate-contentFadeIn">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#e8e9eb] mb-2 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-sm sm:text-base text-[#808590] font-light tracking-wide px-4">
            Enter your email address and we'll send you an OTP to reset your
            password
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-light text-[#808590] mb-1 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808590]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  className={`w-full bg-transparent border rounded-lg py-2 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base text-[#e2e3e5] placeholder-[#808590]/50 focus:outline-none focus:border-[#c9a961] transition-colors font-light ${
                    error ? "border-red-500" : "border-[#5f5641]"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-[#e2e3e5] bg-transparent border border-[#5f5641] rounded-full transition-all duration-300 font-normal tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#808590] border-t-[#e2e3e5] rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </button>
          </form>
        ) : (
          // Success message while redirecting
          <div className="text-center py-8">
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
            <h3 className="text-lg sm:text-xl text-[#e8e9eb] mb-2">
              OTP Sent!
            </h3>
            <p className="text-sm sm:text-base text-[#808590] font-light mb-2">
              We've sent a 6-digit code to {email}
            </p>
            <p className="text-xs sm:text-sm text-[#808590] font-light">
              Redirecting to verification...
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#5f5641] border-t-[#c9a961] rounded-full animate-spin" />
            </div>
          </div>
        )}

        {/* Help text */}
        {!isSubmitted && (
          <p className="mt-4 text-center text-xs text-[#808590] font-light">
            We'll send a verification code to this email if it exists in our
            system.
          </p>
        )}
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
