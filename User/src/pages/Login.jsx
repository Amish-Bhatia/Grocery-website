import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apimethods.postApi("/login", { email, password });
      setMessage(data?.message || "OTP sent to your email!");
      setStep("otp");
    } catch (err) {
      setError(err?.data?.message || err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apimethods.postApi("/verify-otp", { email, otp });
      if (data?.token && data?.user) {
        login(data.user, data.token);
        navigate("/");
      } else {
        setError(data?.message || "Verification failed");
      }
    } catch (err) {
      setError(err?.data?.message || err?.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FCFCFC] py-16 font-[sans-serif] flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md mx-auto px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00B207] mb-4 font-medium transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <img
                src="/Logo.svg"
                alt="Ecobazar"
                className="h-8 mx-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === "credentials" ? "Sign In" : "Enter Verification OTP"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {step === "credentials"
                ? "Access your Ecobazar customer account"
                : `We sent a 6-digit OTP code to ${email}`}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 text-[#00B207] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#00B207]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#00B207]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#00B207] hover:bg-[#009606] text-white py-3 rounded-full font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Sending OTP..." : "Send OTP & Login"}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  6-Digit OTP Code
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400">
                    <ShieldCheck size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full text-sm tracking-widest text-center font-bold border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#00B207]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#00B207] hover:bg-[#009606] text-white py-3 rounded-full font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Verifying..." : "Verify & Enter"}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="text-xs text-gray-500 hover:text-gray-900 mt-2 text-center"
              >
                &larr; Back to login
              </button>
            </form>
          )}

          {/* ============================================================
              REMOVED: "Open Admin Portal" link per requirements
              Admin staff should use the admin frontend URL directly.
              ============================================================ */}

          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
            <span>Don&apos;t have an account? </span>
            <Link
              to="/signup"
              className="text-[#00B207] font-semibold hover:underline"
            >
              Create one here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
