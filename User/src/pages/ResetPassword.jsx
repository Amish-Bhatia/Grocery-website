import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import apimethods from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualToken, setManualToken] = useState(token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activeToken = token || manualToken;

    if (!activeToken) {
      Swal.fire({
        icon: "warning",
        title: "Missing Reset Token",
        text: "Reset token is missing. Please click the link sent to your email.",
      });
      return;
    }

    if (!password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both password fields.",
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

    setLoading(true);

    try {
      const data = await apimethods.postApi("/reset", {
        token: activeToken,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset Successfully",
        text: data?.message || "You can now sign in with your new password.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text:
          err?.data?.message ||
          err?.message ||
          "Invalid or expired reset token. Please request a new link.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#fbfcfb] font-sans min-h-screen flex flex-col justify-between">
      <div>
        <PageBanner
          breadcrumbs={[{ label: "Account", path: "/login" }, { label: "Reset Password" }]}
        />

        <div className="w-full py-16 px-4 flex items-center justify-center">
          <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 p-8 sm:p-9 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Set New Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 leading-relaxed">
              Create a new strong password for your Ecobazar account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!token && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    required
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Paste your reset token here"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
                  />
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full !mt-5 bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-bold text-sm transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <Link to="/login" className="text-xs font-bold text-gray-800 hover:text-[#00B207] transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
