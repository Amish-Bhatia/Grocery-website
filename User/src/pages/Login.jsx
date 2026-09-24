import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";
import Newsletter from '../Components/Newsletter';
import PageBanner from "../Components/PageBanner";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password.",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/login", { email, password });
      if (data?.token && data?.user) {
        login(data.user, data.token);
        Swal.fire({
          icon: "success",
          title: "Signed In Successfully",
          text: `Welcome back, ${data.user.name || "Customer"}!`,
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(redirect, { replace: true });
      } else {
        throw new Error(data?.message || "Login failed");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err?.data?.message || err?.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBanner breadcrumbs={[{ label: "Account" }, { label: "Sign In" }]} />
      <div className="w-full bg-[#f9fafb] py-14 px-4 font-sans flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-100 p-8 sm:p-9 shadow-sm">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>

          {/* Password with Eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember me & Forget Password */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#00B207] focus:ring-[#00B207]"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-gray-500 hover:text-[#00B207] transition-colors"
            >
              Forget Password
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full !mt-5 bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-bold text-sm transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Don't have account?{" "}
          <Link
            to={`/signup${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-bold text-gray-900 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
      <Newsletter/>
      </>
  );
}
