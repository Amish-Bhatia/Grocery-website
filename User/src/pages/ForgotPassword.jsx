import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import apimethods from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your registered email address.",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/forgot", { email });
      setSubmitted(true);
      if (data?.resetLink) {
        setResetUrl(data.resetLink);
      }
      Swal.fire({
        icon: "success",
        title: "Reset Link Sent",
        text: data?.message || "Please check your email for the reset instructions.",
        confirmButtonColor: "#00B207",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text:
          err?.data?.message ||
          err?.message ||
          "Could not send reset instructions. Please verify your email.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#fbfcfb] font-sans min-h-screen flex flex-col justify-between">
      <div>
        <PageBanner
          breadcrumbs={[{ label: "Account", path: "/login" }, { label: "Forgot Password" }]}
        />

        <div className="w-full py-16 px-4 flex items-center justify-center">
          <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 p-8 sm:p-9 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Forgot Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 leading-relaxed">
              Enter your registered email address below and we'll send you instructions to reset your password.
            </p>

            {submitted ? (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 bg-emerald-50 text-[#00B207] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-base">
                    Email Sent!
                  </h3>
                  <p className="text-xs text-gray-500">
                    We've sent a password reset link to <strong className="text-gray-800">{email}</strong>.
                  </p>
                </div>

                {resetUrl && (
                  <div className="pt-2">
                    <a
                      href={resetUrl}
                      className="inline-block w-full bg-[#00B207] hover:bg-[#009606] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Click Here to Reset Password Now
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#00B207] hover:underline cursor-pointer"
                  >
                    Didn't receive email? Try again
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
                    />
                    <Mail
                      size={18}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full !mt-5 bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-bold text-sm transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            {/* Back to sign in */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
