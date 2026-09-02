import { useState } from "react";

import LoginForm from "./Components/Login";
import ResetPassword from "./Components/ResetPassword";
import Dashboard from "./Components/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const isResetPasswordPage =
    window.location.pathname === "/change";

  // ============================
  // Dashboard
  // ============================
  if (isAuthenticated) {
    return (
      <Dashboard
        setIsAuthenticated={setIsAuthenticated}
      />
    );
  }

  // ============================
  // Reset Password Page
  // ============================
  if (isResetPasswordPage) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-between overflow-hidden bg-gradient-to-r from-[#d8c5a8] via-[#c8b093] to-[#a98f70] px-2 py-2">

        {/* Blurred background girl */}
        <div className="absolute bottom-0 left-0 h-[90%] w-[70%] overflow-clip">
          <img
            src="/girl-blur.svg"
            alt=""
            className="h-[122%] w-[68%]"
          />
        </div>

        {/* Main fashion model */}
        <img
          src="/Frame 2608259.svg"
          alt="Fashion model"
          className="absolute bottom-0 left-[16%] z-10 h-[85vh] w-auto"
        />

        <div className="absolute left-[6%] top-[8%] z-10">
          <img
            src="/DRESS Your Confidence.svg"
            alt="Dress Your Confidence"
          />
        </div>

        <div className="relative z-10 ml-auto mr-[7%] flex min-h-[500px] w-[390px] items-center justify-center rounded-[20px] bg-white px-[40px] py-[45px] shadow-sm">
          <ResetPassword
            onBackToLogin={() => {
              window.history.pushState({}, "", "/");
              window.location.reload();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <LoginForm
      setIsAuthenticated={setIsAuthenticated}
    />
  );
};

export default App;