import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { monthSaleTime as defaultMonthSaleTime } from "./constants";

export default function PromoBanners({ monthSaleTime = defaultMonthSaleTime }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
      {/* Banner 1: Sale of the Month */}
      <div
        className="rounded-xl p-7 relative overflow-hidden flex flex-col justify-between min-h-[380px] text-white bg-cover bg-center shadow-sm"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(33, 101, 131, 0.75), rgba(33, 101, 131, 0.4)), url('/SaleOfTheMonth.png')",
        }}
      >
        <div className="relative z-10 text-center flex flex-col items-center">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-widest block mb-2">
            BEST DEALS
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 drop-shadow">
            Sale of the Month
          </h3>

          {/* Live Countdown Timer */}
          <div className="flex items-center justify-center gap-2 mb-6 bg-black/20 backdrop-blur-sm py-2 px-4 rounded-xl">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(monthSaleTime.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">Days</span>
            </div>
            <span className="text-lg font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(monthSaleTime.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">Hours</span>
            </div>
            <span className="text-lg font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(monthSaleTime.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">Mins</span>
            </div>
            <span className="text-lg font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(monthSaleTime.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">Secs</span>
            </div>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-xs px-6 py-2.5 rounded-full hover:bg-gray-100 transition shadow"
          >
            <span>Shop Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Banner 2: Low-Fat Meat */}
      <div
        className="rounded-xl p-7 relative overflow-hidden flex flex-col justify-between min-h-[380px] text-white bg-cover bg-center shadow-sm"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.3)), url('/Low-FatMeat.png')",
        }}
      >
        <div className="relative z-10 text-center flex flex-col items-center">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-widest block mb-2">
            85% FAT FREE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow">
            Low-Fat Meat
          </h3>
          <p className="text-sm text-white/90 font-medium mb-6">
            Started at <span className="text-[#FF8A00] font-bold">$79.99</span>
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-xs px-6 py-2.5 rounded-full hover:bg-gray-100 transition shadow"
          >
            <span>Shop Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Banner 3: 100% Fresh Fruit */}
      <div
        className="rounded-xl p-7 relative overflow-hidden flex flex-col justify-between min-h-[380px] text-gray-900 bg-cover bg-center shadow-sm"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 184, 0, 0.8), rgba(255, 184, 0, 0.4)), url('/100%FreshFruit.png')",
        }}
      >
        <div className="relative z-10 text-center flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-800 uppercase tracking-widest block mb-2">
            SUMMER SALE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 drop-shadow-sm">
            100% Fresh Fruit
          </h3>
          <div className="mb-6">
            <span className="text-xs font-semibold text-gray-800 mr-2">Up to</span>
            <span className="bg-black text-[#FFB800] text-xs font-bold px-2 py-1 rounded">
              64% OFF
            </span>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold text-xs px-6 py-2.5 rounded-full hover:bg-gray-100 transition shadow"
          >
            <span>Shop Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
