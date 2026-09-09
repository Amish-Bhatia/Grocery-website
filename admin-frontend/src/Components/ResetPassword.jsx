import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apimethods from "../Methods/ApiClient";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");

    setConfirmPasswordError("");

    setMessage("");

    let valid = true;

    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");

    if (!token) {
      setPasswordError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);

    try {
      const data = await apimethods.postApi("/reset", {
        token,
        password,
      });

      setMessage(data.message || "Password reset successfully.");

      setPassword("");

      setConfirmPassword("");
    } catch (error) {
      console.error("Reset password error:", error);

      setPasswordError(error.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex min-h-screen bg-white">

        <div className="flex w-full items-center justify-center px-6 py-12 sm:px-10 md:w-1/2 lg:px-16">

          <form onSubmit={handleSubmit} className="w-full max-w-md">

            <div className="mb-8 flex justify-center">
              <img src="/Logo.svg" alt="Grocery Store Logo" className="h-auto max-w-[190px] object-contain" />
            </div>

            <div className="mb-7 text-center">

              <h1 className="text-3xl font-bold text-emerald-700">Reset Password</h1>

              <p className="mt-2 text-xl font-medium text-slate-700">Create New Password</p>

            </div>

            <p className="mb-7 text-center text-sm leading-6 text-slate-500">Enter your new password below.</p>

            <div className="mb-5">

              <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">New Password</label>

              <div className="relative">

                <input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create new password" className="h-12 w-full rounded-lg border border-emerald-300 bg-emerald-50/50 px-4 pr-16 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />

                <button type="button" onClick={() => setShowPassword((previous) => !previous)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>

              </div>

              {passwordError && <p className="mt-1.5 text-xs leading-5 text-red-600">{passwordError}</p>}

            </div>

            <div className="mb-5">

              <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>

              <div className="relative">

                <input id="confirm-password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="h-12 w-full rounded-lg border border-emerald-300 bg-emerald-50/50 px-4 pr-16 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />

                <button type="button" onClick={() => setShowConfirmPassword((previous) => !previous)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>

              </div>

              {confirmPasswordError && <p className="mt-1.5 text-xs text-red-600">{confirmPasswordError}</p>}

            </div>

            {message && <p className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-center text-xs leading-5 text-emerald-700">{message}</p>}

            <button type="submit" disabled={loading} className="h-12 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 text-sm font-semibold text-white shadow-md transition hover:from-emerald-700 hover:to-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Updating..." : "Reset Password"}</button>

            <div className="mt-5 flex justify-center">

              <button type="button" onClick={() => navigate("/")} className="text-sm font-medium text-slate-500 transition hover:text-emerald-700">← Back to Login</button>

            </div>

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