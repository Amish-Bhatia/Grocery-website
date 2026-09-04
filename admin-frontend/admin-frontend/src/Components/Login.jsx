import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import apimethods from "../Methods/ApiClient";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState("");

  const [showOtp, setShowOtp] = useState(false);

  const [emailError, setEmailError] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const [otpError, setOtpError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/login", {
        email,
        password,
      });

      alert(data.message || "OTP sent to your email.");

      setShowOtp(true);
    } catch (error) {
      console.error("Login error:", error);

      setPasswordError(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setOtpError("");

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", data.token);

      if (data.user?.name) {
        localStorage.setItem("adminName", data.user.name);
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("OTP verification error:", error);

      setOtpError(error.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex min-h-screen bg-white">

        <div className="flex w-full items-center justify-center px-6 py-12 sm:px-10 md:w-1/2 lg:px-16">

          <form onSubmit={showOtp ? handleVerifyOtp : handleLogin} className="w-full max-w-md">

            <div className="mb-8 flex justify-center">
              <img src="/Logo.svg" alt="Grocery Store Logo" className="h-auto max-w-[190px] object-contain" />
            </div>

            <div className="mb-8 text-center">

              <h1 className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-900 bg-clip-text text-3xl font-bold text-transparent">Welcome Back</h1>

              <p className="mt-2 text-xl font-medium text-slate-700">Log In</p>

            </div>

            <div className="mb-5">

              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>

              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={showOtp} placeholder="Enter your email" className="h-12 w-full rounded-lg border border-emerald-300 bg-emerald-50/50 px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60" />

              {emailError && <p className="mt-1.5 text-xs text-red-600">{emailError}</p>}

            </div>

            <div className="mb-2">

              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>

              <div className="relative">

                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={showOtp} placeholder="Enter your password" className="h-12 w-full rounded-lg border border-emerald-300 bg-emerald-50/50 px-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60" />

                <button type="button" onClick={() => setShowPassword((previous) => !previous)} disabled={showOtp} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-emerald-700">{showPassword ? "Hide" : "Show"}</button>

              </div>

              {passwordError && <p className="mt-1.5 text-xs leading-4 text-red-600">{passwordError}</p>}

            </div>

            {showOtp && (
              <div className="mb-5 mt-5">

                <label htmlFor="otp" className="mb-2 block text-sm font-medium text-slate-700">Enter OTP</label>

                <input id="otp" type="text" inputMode="numeric" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit OTP" className="h-12 w-full rounded-lg border border-emerald-300 bg-emerald-50/50 px-4 text-center text-sm tracking-[6px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />

                {otpError && <p className="mt-1.5 text-xs text-red-600">{otpError}</p>}

              </div>
            )}

            <div className="mb-6 flex justify-end">

              <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm font-medium text-slate-500 transition hover:text-emerald-700">Forgot Password?</button>

            </div>

            <button type="submit" disabled={loading} className="h-12 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 text-sm font-semibold text-white shadow-md transition hover:from-emerald-700 hover:to-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Please wait..." : showOtp ? "Verify OTP" : "Log In"}</button>

          </form>

        </div>

        <div className="hidden w-1/2 p-4 md:block">

          <div className="h-full overflow-hidden rounded-2xl">

            <img src="/right-img.jpg" alt="Fresh vegetables" className="h-full w-full object-cover" />

          </div>

        </div>

      </div>

    </div>
  );
}