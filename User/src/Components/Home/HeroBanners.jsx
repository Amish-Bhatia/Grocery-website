import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroBanners() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
      {/* Main Large Hero Banner */}
      <div className="lg:col-span-2 bg-[#00B207] rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[460px] text-white">
        {/* Background Image expanding full width & height */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img
            src="/banner.jpg"
            alt="Fresh Organic Food"
            className="w-full h-full object-cover object-right"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="relative z-10 max-w-[420px]">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight">
            Fresh &amp; Healthy Organic Food
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm sm:text-base font-medium">Sale up to</span>
            <span className="bg-[#FF8A00] text-white text-xs sm:text-sm font-bold px-2.5 py-1 rounded">
              30% OFF
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 mb-8">
            Free shipping on all your order.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full hover:bg-emerald-50 transition shadow-md"
          >
            <span>Shop now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Right Column (2 Stacked Promo Banners) */}
      <div className="flex flex-col gap-6">
        {/* Summer Sale Card */}
        <div className="bg-[#F2F2F2] rounded-2xl p-6 sm:p-7 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[215px]">
          {/* Background Image expanding full width & height */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src="/topRight.png"
              alt="Summer Sale"
              className="w-full h-full object-cover object-right"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="relative z-10 max-w-[190px]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              SUMMER SALE
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">75% OFF</h3>
            <p className="text-xs text-gray-500 mb-4">Only Fruit &amp; Vegetable</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline font-medium"
            >
              <span>Shop Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Special Deal Card */}
        <div
          className="rounded-2xl p-6 sm:p-7 relative overflow-hidden flex-1 flex flex-col justify-center min-h-[215px] text-white text-center bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15, 40, 30, 0.75), rgba(15, 40, 30, 0.85)), url('/bottomRight.jpg')",
          }}
        >
          <div className="relative z-10 max-w-[280px] mx-auto">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest block mb-2">
              BEST DEAL
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">
              Special Products Deal of the Month
            </h3>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline font-medium"
            >
              <span>Shop Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
