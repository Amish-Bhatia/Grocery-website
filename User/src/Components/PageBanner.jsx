import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home as HomeIcon, ChevronRight, ArrowLeft } from "lucide-react";

export default function PageBanner({ title, breadcrumbs = [] }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full py-8 sm:py-10 bg-cover bg-center border-b border-gray-800"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10, 20, 15, 0.88), rgba(10, 20, 15, 0.94)), url('/bottomRight.jpg')",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Breadcrumb Path */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400" aria-label="Breadcrumb">
          <Link
            to="/"
            className="hover:text-white transition-colors flex items-center gap-1.5"
            title="Go to Home"
          >
            <HomeIcon size={16} className="text-gray-400 hover:text-white" />
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label || idx}>
              <ChevronRight size={14} className="text-gray-500 shrink-0" />
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="hover:text-white transition-colors font-medium text-gray-300"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#00B207] font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-xs"
          title="Go back a step"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}
