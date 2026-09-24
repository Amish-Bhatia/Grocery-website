import React from "react";
import { Link } from "react-router-dom";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";

export default function NotFound() {
  return (
    <div className="w-full bg-[#fbfcfb] font-sans min-h-screen flex flex-col justify-between">
      <div>
        <PageBanner breadcrumbs={[{ label: "404 Error Page" }]} />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 flex items-center justify-center text-center">
          <div className="max-w-[440px] w-full">
            <img
              src="/404.png"
              alt="404 - Page Not Found"
              className="w-full h-auto object-contain mx-auto"
            />
            <div className="mt-8">
              <Link
                to="/"
                className="bg-[#00B207] hover:bg-[#009606] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-xs inline-flex items-center justify-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
