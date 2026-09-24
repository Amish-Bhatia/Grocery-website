import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home as HomeIcon, ChevronRight, ArrowLeft } from "lucide-react";

export default function PageBanner({ title, breadcrumbs = [], showBack = false }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full py-8 sm:py-10 bg-cover bg-center border-b border-gray-900/60"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.3) 100%), url('/account-banner.jpg')",
        backgroundPosition: "center 30%",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Breadcrumb Path */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-300" aria-label="Breadcrumb">
          <Link
            to="/"
            className="hover:text-[#00B207] transition-colors flex items-center gap-1.5 text-gray-400 hover:text-white"
            title="Go to Home"
          >
            <HomeIcon size={16} className="text-gray-400 hover:text-white transition-colors" />
          </Link>

          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label || idx}>
                <ChevronRight size={14} className="text-gray-500 shrink-0" />
                {crumb.path && !isLast ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-white transition-colors font-normal text-gray-300"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`${isLast ? "text-[#00B207] font-medium" : "text-gray-300"}`}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Back Button (only when explicitly requested) */}
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-xs"
            title="Go back a step"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
        )}
      </div>
    </div>
  );
}
