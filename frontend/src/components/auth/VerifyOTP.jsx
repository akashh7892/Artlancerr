import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export default function VerifyOTP() {
  const { role } = useParams(); // Get role from URL
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent pasting multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);

      // Focus last filled input or next empty
      const lastIndex = Math.min(digits.length, 5);
      const focusInput = document.getElementById(`otp-${lastIndex}`);
      if (focusInput) focusInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP verified:", otp.join(""), "for role:", role);

      // Navigate to reset password with role
      navigate(`/auth/${role}/reset-password`, {
        state: { email, otp: otp.join("") },
      });
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);

    try {
      // Simulate resending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("OTP resent to:", email, "role:", role);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a1d24] to-[#2d3139] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate(`/auth/${role}/forgot-password`)}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 text-[#808590] hover:text-[#c9a961] transition-colors flex items-center gap-2 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back
      </button>

      {/* OTP Verification Form */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg animate-contentFadeIn">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#e8e9eb] mb-2 tracking-tight">
            Verify OTP
          </h1>
          <p className="text-sm sm:text-base text-[#808590] font-light tracking-wide px-4">
            We've sent a 6-digit code to{" "}
            <span className="text-[#c9a961]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl bg-transparent border border-[#5f5641] rounded-lg text-[#e2e3e5] focus:outline-none focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] transition-colors"
                required
              />
            ))}
          </div>

          {/* Timer and Resend */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center">
            <div className="flex items-center gap-2 text-[#808590] text-sm sm:text-base">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>
                {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend}
              className={`text-sm sm:text-base transition-colors ${
                canResend
                  ? "text-[#c9a961] hover:underline cursor-pointer"
                  : "text-[#808590] cursor-not-allowed"
              }`}
            >
              Resend OTP
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isOtpComplete}
            className="group relative w-full mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-[#e2e3e5] bg-transparent border border-[#5f5641] rounded-full transition-all duration-300 font-normal tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#808590] border-t-[#e2e3e5] rounded-full animate-spin" />
              ) : (
                <>
                  Verify OTP
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-[#5f5641] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
        </form>

        {/* Help text */}
        <p className="mt-4 text-center text-xs sm:text-sm text-[#808590] font-light">
          Didn't receive the code? Check your spam folder
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
          input {
            min-height: 44px;
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
