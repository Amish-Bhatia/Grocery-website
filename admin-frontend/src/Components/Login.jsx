import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import Swal from "sweetalert2";
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

  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address.");
      valid = false;
    }

    if (!passwordRegex.test(password)) {
      showError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
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

      localStorage.setItem("AdminName", data.user.name);
      localStorage.setItem("AdminEmail", data.user.email);

      await Swal.fire({
        title: "OTP Sent",
        text: data.message || "OTP sent to your email.",
        icon: "success",
        confirmButtonColor: "#019D3E",
      });

      setShowOtp(true);
    } catch (error) {
      console.error("Login error:", error);

      showError(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      showError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user?.role || "unknown");
      localStorage.setItem("userEmail", data.user?.email || email);

      if (data.user?.name) {
        localStorage.setItem("adminName", data.user.name);
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("OTP verification error:", error);

      showError(error.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    Swal.fire({
      title: "Login Error",
      text: message,
      icon: "error",
      confirmButtonColor: "#dc2626",
    });
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

            </div>

            <div className="mb-2">

              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>

              <div className="relative">

                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={showOtp} placeholder="Enter your password" className="h-12 w-full rounded-lg border border-emerald-300 bg-emerald-50/50 px-4 pr-12 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60" />

                <button type="button" onClick={() => setShowPassword((previous) => !previous)} disabled={showOtp} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>

              </div>

            </div>

            {showOtp && (
              <div className="mb-5 mt-5">

                <label htmlFor="otp" className="mb-2 block text-sm font-medium text-slate-700">Enter OTP</label>
                <OtpInput
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                  numInputs={6}
                  shouldAutoFocus
                  inputType="tel"
                  renderSeparator={<span className="w-2" />}
                  renderInput={(inputProps, index) => (
                    <input
                      {...inputProps}
                      aria-label={`OTP digit ${index + 1}`}
                      className="!h-12 !w-12 flex-none rounded-lg border border-emerald-300 bg-emerald-50/50 text-center text-lg font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  )}
                  containerStyle="flex"
                  inputStyle=""
                />


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