import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const adminName =
    localStorage.getItem("AdminName") ||
    localStorage.getItem("adminName") ||
    "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("AdminName");
    localStorage.removeItem("AdminEmail");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");

    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-linear-to-r from-[#019D3E] to-[#00491B] shadow-sm">
      <div className="flex h-full items-center justify-end px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Admin Section */}
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/20 text-sm font-semibold text-white">
              {adminName.charAt(0).toUpperCase()}
            </div>

            {/* Admin Name */}
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-white">
                {adminName}
              </p>

              <p className="text-[11px] text-white/70">
                Admin
              </p>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                aria-label="Open admin menu"
                aria-expanded={isMenuOpen}>
                <ChevronDown
                  size={17}
                  className={`transition-transform duration-200 ${
                    isMenuOpen ? "rotate-180" : ""}`}/>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-[#00491B] p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    title="Logout"
                  >
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
