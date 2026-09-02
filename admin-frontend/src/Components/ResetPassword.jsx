import { useState } from "react";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ResetPassword = ({ onBackToLogin }) => {
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

    let isValid = true;

    // Validate password
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ characters with uppercase, lowercase, number, and special character."
      );
      isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;

    // Get reset token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("Reset token:", token);

    if (!token) {
      setPasswordError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(
          data.message || "Unable to reset password."
        );
        return;
      }

      setMessage(
        "Password reset successfully. You can now login."
      );

      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.log("Reset password error:", err);

      setPasswordError(
        "Unable to reach server. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] flex items-center justify-center">

      {/* Main Container */}
      <div className="flex w-full min-h-screen overflow-hidden bg-white">

        {/* =========================
            LEFT SIDE - FORM
        ========================== */}
        <div className="flex w-full flex-col items-center justify-center px-8 py-12 sm:px-12 md:w-[48%] lg:px-16">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[360px]"
          >

            {/* =========================
                LOGO
            ========================== */}
            <div className="mb-9 flex justify-center">
              <div className="flex items-center gap-2">
                <img
                  src="/Logo.svg"
                  alt="Logo"
                  className="w-max px-4"
                />
              </div>
            </div>

            {/* =========================
                HEADING
            ========================== */}
            <div className="mb-8 text-center">

              <h1 className="text-[27px] font-semibold leading-tight text-[#07963d]">
                Reset Password
              </h1>

              <p className="mt-2 text-[21px] font-medium text-[#3f3f3f]">
                Create New Password
              </p>

            </div>

            {/* =========================
                DESCRIPTION
            ========================== */}
            <p className="mb-7 text-center text-[12px] leading-5 text-[#777777]">
              Enter your new password below.
            </p>

            {/* =========================
                NEW PASSWORD
            ========================== */}
            <div className="mb-5">

              <label
                htmlFor="new-password"
                className="mb-2 block text-[13px] font-medium text-[#444444]"
              >
                Create New Password
              </label>

              <div className="relative">

                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Create new password"
                  className="h-[46px] w-full rounded-[7px] border border-transparent bg-[#effff1] px-4 pr-12 text-[14px] text-[#333333] placeholder:text-[#aaa] outline-none transition focus:border-[#28b957] focus:ring-2 focus:ring-[#00a63c]/10"
                />

                {/* Password Visibility Button */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#008f39]"
                >

                  {showPassword ? (

                    /* Eye Icon */
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>

                  ) : (

                    /* Eye Off Icon */
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.1A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.1 4.1" />
                      <path d="M6.6 6.6C3.7 8.7 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.3 4-.8" />
                    </svg>

                  )}

                </button>

              </div>

              {/* Password Error */}
              {passwordError && (
                <p className="mt-1.5 text-[11px] leading-4 text-red-600">
                  {passwordError}
                </p>
              )}

            </div>

            {/* =========================
                CONFIRM PASSWORD
            ========================== */}
            <div className="mb-5">

              <label
                htmlFor="confirm-password"
                className="mb-2 block text-[13px] font-medium text-[#444444]"
              >
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                  placeholder="Confirm new password"
                  className="h-[46px] w-full rounded-[7px] border border-transparent bg-[#effff1] px-4 pr-12 text-[14px] text-[#333333] placeholder:text-[#aaa] outline-none transition focus:border-[#28b957] focus:ring-2 focus:ring-[#00a63c]/10"
                />

                {/* Confirm Password Visibility Button */}
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#008f39]"
                >

                  {showConfirmPassword ? (

                    /* Eye Icon */
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>

                  ) : (

                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.1A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.1 4.1" />
                      <path d="M6.6 6.6C3.7 8.7 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.3 4-.8" />
                    </svg>

                  )}

                </button>

              </div>

              {confirmPasswordError && (
                <p className="mt-1.5 text-[11px] leading-4 text-red-600">
                  {confirmPasswordError}
                </p>
              )}

            </div>

          
            {message && (
              <p className="mb-5 rounded-[7px] bg-[#f1fff3] px-4 py-3 text-center text-[11px] text-[#07963d]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-[46px] w-full rounded-[7px] bg-gradient-to-r from-[#00a63c] to-[#006b32] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(0,150,60,0.18)] transition-all duration-200 hover:from-[#009538] hover:to-[#005c2b] hover:shadow-[0_6px_16px_rgba(0,150,60,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Updating..."
                : "Reset Password"}
            </button>

          
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

     
        <div className="hidden w-[52%] h-screen p-3 pl-0 md:block">

          <div className="h-full w-full overflow-hidden rounded-[12px]">

            <img
              src="/right-img.svg"
              alt="Fresh vegetables"
              className="h-full w-full object-cover object-center"
            />

          </div>

        </div>

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

export default ResetPassword;