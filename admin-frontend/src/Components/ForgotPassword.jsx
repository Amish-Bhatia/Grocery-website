import { useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setMessage("");

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.message || "Unable to send reset link.");
        return;
      }

      setMessage("Password reset link has been sent to your email.");
    } catch (err) {
      console.log("Forgot password error:", err);
      setEmailError("Unable to reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] flex items-center justify-center">
      <div className="flex w-full min-h-screen overflow-hidden bg-white">

        {/* Left Form */}
        <div className="flex w-full flex-col items-center justify-center px-8 py-12 sm:px-12 md:w-[48%] lg:px-16">
          <form onSubmit={handleSubmit} className="w-full max-w-[360px]">

            {/* Logo */}
            <div className="mb-9 flex justify-center">
              <div className="flex items-center gap-2">
                <img
                  src="/Logo.svg"
                  alt="Logo"
                  className="w-max px-4"
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-[27px] font-semibold leading-tight text-[#07963d]">
                Forgot Password
              </h1>

              <p className="mt-2 text-[21px] font-medium text-[#3f3f3f]">
                Reset Password
              </p>
            </div>

            {/* Description */}
            <p className="mb-7 text-center text-[12px] leading-5 text-[#777777]">
              Enter your registered email address and we'll send you a password
              reset link.
            </p>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="forgot-email"
                className="mb-2 block text-[13px] font-medium text-[#444444]"
              >
                Enter Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-[46px] w-full rounded-[7px] border border-[#28b957] bg-[#f1fff3] px-4 text-[14px] text-[#333333] placeholder:text-[#aaa] outline-none transition focus:border-[#009b3a] focus:ring-2 focus:ring-[#00a63c]/10"
              />

              {emailError && (
                <p className="mt-1.5 text-[11px] leading-4 text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            {/* Success Message */}
            {message && (
              <p className="mb-5 rounded-[7px] bg-[#f1fff3] px-4 py-3 text-center text-[11px] text-[#07963d]">
                {message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-[46px] w-full rounded-[7px] bg-gradient-to-r from-[#00a63c] to-[#006b32] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(0,150,60,0.18)] transition-all duration-200 hover:from-[#009538] hover:to-[#005c2b] hover:shadow-[0_6px_16px_rgba(0,150,60,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {/* Back to Login */}
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="border-0 bg-transparent p-0 text-[12px] font-medium text-[#555555] transition hover:text-[#008f39]"
              >
                ← Back to Login
              </button>
            </div>

          </form>
        </div>

        {/* Right Image */}
        <div className="hidden w-[52%] h-screen p-3 pl-0 md:block">
          <div className="h-full w-full overflow-hidden rounded-[12px]">
            <img
              src="/right-img.svg"
              alt="Fresh vegetables"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Mobile Image */}
        <div className="w-full px-6 pb-6 md:hidden">
          <img
            src="/right-img.svg"
            alt="Fresh vegetables"
            className="h-[300px] w-full rounded-[10px] object-cover object-center"
          />
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;