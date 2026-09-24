import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound({ backTo = "/dashboard", backLabel = "Back to Home" }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center">
      <div className="max-w-[420px] w-full">
        <img
          src="/404.png"
          alt="404 - Page Not Found"
          className="w-full h-auto object-contain mx-auto"
        />
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="bg-[#019D3E] hover:bg-[#00491B] text-white px-8 py-3 rounded-full font-bold text-sm transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center">
            {backLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
