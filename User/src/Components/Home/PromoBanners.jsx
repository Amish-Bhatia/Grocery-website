import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { monthSaleTime as defaultMonthSaleTime } from "./constants";
import { useSales } from "../../context/SalesContext";

export default function PromoBanners({ monthSaleTime = defaultMonthSaleTime }) {
  const { getBannerSale } = useSales();

  // Dynamic matching from backend sale campaigns
  const monthSale = getBannerSale("monthSale");
  const lowFatSale = getBannerSale("lowFat");
  const fruitSale = getBannerSale("freshFruit");

  // Dynamic countdown timer for "Sale of the Month"
  const [timeLeft, setTimeLeft] = useState(defaultMonthSaleTime);

  useEffect(() => {
    if (!monthSale?.endDate) {
      setTimeLeft(monthSaleTime);
      return;
    }

    const updateCountdown = () => {
      const diff = new Date(monthSale.endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [monthSale?.endDate, monthSaleTime]);

  // Card 1 Values
  const c1Title = monthSale?.saleName || "Sale of the Month";
  const c1Image = monthSale?.bannerImage || "/SaleOfTheMonth.png";

  // Card 2 Values
  const c2Title = lowFatSale?.saleName || "Low-Fat Meat";
  const c2Desc = lowFatSale?.description || "Started at ₹79.99";
  const c2Image = lowFatSale?.bannerImage || "/Low-FatMeat.png";

  // Card 3 Values
  const c3Title = fruitSale?.saleName || "100% Fresh Fruit";
  const c3Discount = fruitSale
    ? fruitSale.discountType === "fixed"
      ? `₹${fruitSale.discountValue} OFF`
      : `${fruitSale.discountValue}% OFF`
    : "64% OFF";
  const c3Image = fruitSale?.bannerImage || "/100%FreshFruit.png";

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
      {/* Banner 1: Sale of the Month */}
      <div
        className="rounded-xl p-7 relative overflow-hidden flex flex-col justify-between min-h-[380px] text-white bg-cover bg-center shadow-sm"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(33, 101, 131, 0.75), rgba(33, 101, 131, 0.4)), url('${c1Image}')`,
        }}
      >
        <div className="relative z-10 text-center flex flex-col items-center">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-widest block mb-2">
            BEST DEALS
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 drop-shadow-sm">
            {c1Title}
          </h3>

          {/* Live Countdown Timer */}
          <div className="flex items-center justify-center gap-2 mb-6 bg-black/20 backdrop-blur-sm py-2 px-4 rounded-xl">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">
                Days
              </span>
            </div>
            <span className="text-lg font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">
                Hours
              </span>
            </div>
            <span className="text-lg font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">
                Mins
              </span>
            </div>
            <span className="text-lg font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80">
                Secs
              </span>
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
          backgroundImage: `linear-gradient(to bottom, rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.3)), url('${c2Image}')`,
        }}
      >
        <div className="relative z-10 text-center flex flex-col items-center">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-widest block mb-2">
            85% FAT FREE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-sm">
            {c2Title}
          </h3>
          <p className="text-sm text-white/90 font-medium mb-6">
            {c2Desc}
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
          backgroundImage: `linear-gradient(to bottom, rgba(255, 184, 0, 0.8), rgba(255, 184, 0, 0.4)), url('${c3Image}')`,
        }}
      >
        <div className="relative z-10 text-center flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-800 uppercase tracking-widest block mb-2">
            SUMMER SALE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 drop-shadow-xs">
            {c3Title}
          </h3>
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-gray-800">Up to</span>
            <span className="bg-black text-[#FFB800] text-xs font-bold px-2 py-1 rounded">
              {c3Discount}
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
