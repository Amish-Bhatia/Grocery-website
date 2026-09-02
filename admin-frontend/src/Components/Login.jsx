import { useState } from "react";
import ForgotPassword from "./ForgotPassword";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const LoginForm = ({ setIsAuthenticated }) => {
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

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || "Login failed");
        return;
      }

      alert("OTP sent to your email");
      setShowOtp(true);
    } catch (err) {
      console.log("Error connecting to backend:", err);
      setPasswordError("Unable to reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }

    setOtpError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpError(data.message || "Invalid OTP");
        return;
      }

      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
    } catch (err) {
      console.log("Error connecting to backend:", err);
      setOtpError("Unable to reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

return (
    <div className="min-h-screen w-full bg-[#f3f3f3] flex items-center justify-center">
      <div className="flex w-full min-h-screen overflow-hidden bg-white">

       
        <div className="flex w-full flex-col items-center justify-center px-8 py-12 sm:px-12 md:w-[48%] lg:px-16">
          <form onSubmit={showOtp ? handleVerifyOtp : handleSubmit} className="w-full max-w-[360px]">

           
            <div className="mb-9 flex justify-center">
              <div className="flex items-center gap-2">
              
                <img src="/Logo.svg" alt="Logo" className="w-max px-4 0" />
              </div>
            </div>

          
            <div className="mb-8 text-center">
              <h1 className="text-[27px] font-semibold leading-tight text-[#07963d]">Welcome Back</h1>
              <p className="mt-2 text-[21px] font-medium text-[#3f3f3f]">Log In</p>
            </div>

         
            <div className="mb-5">
              <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-[#444444]">Enter Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={showOtp} placeholder="Enter your email" className="h-[46px] w-full rounded-[7px] border border-[#28b957] bg-[#f1fff3] px-4 text-[14px] text-[#333333] placeholder:text-[#aaa] outline-none transition focus:border-[#009b3a] focus:ring-2 focus:ring-[#00a63c]/10 disabled:cursor-not-allowed disabled:opacity-60" />
              {emailError && <p className="mt-1.5 text-[11px] text-red-600">{emailError}</p>}
            </div>

          
            <div className="mb-2">
              <label htmlFor="password" className="mb-2 block text-[13px] font-medium text-[#444444]">Enter Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={showOtp} placeholder="Enter your password" className="h-[46px] w-full rounded-[7px] border border-transparent bg-[#effff1] px-4 pr-12 text-[14px] text-[#333333] placeholder:text-[#aaa] outline-none transition focus:border-[#28b957] focus:ring-2 focus:ring-[#00a63c]/10 disabled:cursor-not-allowed disabled:opacity-60" />
                <button type="button" onClick={togglePasswordVisibility} disabled={showOtp} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] transition hover:text-[#008f39]">
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.1A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.1 4.1" />
                      <path d="M6.6 6.6C3.7 8.7 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.3 4-.8" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className="mt-1.5 text-[11px] leading-4 text-red-600">{passwordError}</p>}
            </div>

            {/* OTP */}
            {showOtp && (
              <div className="mb-5 mt-5">
                <label htmlFor="otp" className="mb-2 block text-[13px] font-medium text-[#444444]">Enter OTP sent to your email</label>
                <input id="otp" type="text" inputMode="numeric" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit OTP" className="h-[46px] w-full rounded-[7px] border border-[#28b957] bg-[#f1fff3] px-4 text-[14px] tracking-[4px] outline-none focus:ring-2 focus:ring-[#00a63c]/10" />
                {otpError && <p className="mt-1.5 text-[11px] text-red-600">{otpError}</p>}
              </div>
            )}

           
            <div className="mb-6 flex justify-end">
              <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[12px] font-medium text-[#555555] transition hover:text-[#008f39]">Forgot Password?</button>
            </div>

           
            <button type="submit" disabled={loading} className="h-[46px] w-full rounded-[7px] bg-gradient-to-r from-[#00a63c] to-[#006b32] text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(0,150,60,0.18)] transition-all duration-200 hover:from-[#009538] hover:to-[#005c2b] hover:shadow-[0_6px_16px_rgba(0,150,60,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Please wait..." : showOtp ? "Verify OTP" : "Log In"}
            </button>

          </form>
        </div>

       
        <div className="hidden w-[52%] h-screen p-3 pl-0 md:block">
          <div className="h-full w-full overflow-hidden rounded-[12px]">
            <img src="/right-img.svg" alt="Fresh vegetables" className="h-full w-full object-cover object-center" />
          </div>
        </div>

       
        <div className="w-full px-6 pb-6 md:hidden">
          <img src="/right-img.svg" alt="Fresh vegetables" className="h-[300px] w-full rounded-[10px] object-cover object-center" />
        </div>

      </div>
    </div>
  );
};

export default LoginForm;