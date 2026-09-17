import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import apimethods from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/signup", { name, email, password });
      setSuccess(data?.message || "Account created! You can now sign in.");
      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.data?.message || err?.message || "Signup failed. Please try again.");
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
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
            <p className="text-xs text-gray-500 mt-1">
              Join Ecobazar and shop fresh organic groceries
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 text-[#00B207] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#00B207]"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
                  placeholder="Min. 6 characters"
                  className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#00B207]"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#00B207]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#00B207] hover:bg-[#009606] text-white py-3 rounded-full font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#00B207] font-semibold hover:underline">
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
