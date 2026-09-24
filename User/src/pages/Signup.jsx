import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";
import Newsletter from "../Components/Newsletter";
import PageBanner from "../Components/PageBanner";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (!acceptTerms) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please accept the terms and conditions to proceed.",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/signup", {
        name: email.split("@")[0],
        email,
        password,
      });

      if (data?.token && data?.user) {
        login(data.user, data.token);
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Welcome to Ecobazar!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(redirect, { replace: true });
      } else {
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "You can now sign in to your account.",
          timer: 1800,
          showConfirmButton: false,
        });
        navigate(`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`, { replace: true });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err?.data?.message || err?.message || "Could not create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBanner breadcrumbs={[{ label: "Account" }, { label: "Create Account" }]} />
      <div className="w-full bg-[#f9fafb] py-14 px-4 font-sans flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-100 p-8 sm:p-9 shadow-sm">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create Account
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

            {/* Confirm Password with Eye toggle */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Accept terms checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#00B207] focus:ring-[#00B207]"
                />
                <span>Accept all terms & Conditions</span>
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full !mt-5 bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-bold text-sm transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Already have account{" "}
            <Link
              to={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="font-bold text-gray-900 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Newsletter />
    </>
  );
}
