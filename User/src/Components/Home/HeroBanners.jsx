import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSales } from "../../context/SalesContext";

export default function HeroBanners() {
  const { getBannerSale } = useSales();

  // Dynamic matching from backend sale module
  const heroSale = getBannerSale("hero");
  const topRightSale = getBannerSale("topRight");
  const bottomRightSale = getBannerSale("bottomRight");

  // Main Hero Values
  const heroTitle = heroSale?.saleName || "Fresh & Healthy Organic Food";
  const heroDiscount = heroSale
    ? heroSale.discountType === "fixed"
      ? `₹${heroSale.discountValue} OFF`
      : `${heroSale.discountValue}% OFF`
    : "30% OFF";
  const heroDescription =
    heroSale?.description || "Free shipping on all your order.";
  const heroImage = heroSale?.bannerImage || "/banner.jpg";

  // Top Right Summer Sale Values
  const trTitle = topRightSale?.saleName || "SUMMER SALE";
  const trDiscount = topRightSale
    ? topRightSale.discountType === "fixed"
      ? `₹${topRightSale.discountValue} OFF`
      : `${topRightSale.discountValue}% OFF`
    : "75% OFF";
  const trDescription = topRightSale?.description || "Only Fruit & Vegetable";
  const trImage = topRightSale?.bannerImage || "/topRight.png";

  // Bottom Right Deal of the Month Values
  const brTitle =
    bottomRightSale?.saleName || "Special Products Deal of the Month";
  const brDescription =
    bottomRightSale?.description ||
    (bottomRightSale?.discountValue
      ? `${bottomRightSale.discountValue}% DISCOUNT`
      : "");
  const brImage = bottomRightSale?.bannerImage || "/bottomRight.jpg";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
      {/* Main Large Hero Banner */}
      <div className="lg:col-span-2 bg-[#00B207] rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[460px] text-white">
        {/* Background Image expanding full width & height */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-full object-cover object-right"
            onError={(e) => {
              if (heroImage !== "/banner.jpg") {
                e.target.src = "/banner.jpg";
              }
            }}
          />
        </div>

        <div className="relative z-10 max-w-[420px]">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight drop-shadow-xs">
            {heroTitle}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm sm:text-base font-medium">Sale up to</span>
            <span className="bg-[#FF8A00] text-white text-xs sm:text-sm font-bold px-2.5 py-1 rounded shadow-xs">
              {heroDiscount}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 mb-8 leading-relaxed">
            {heroDescription}
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
              src={trImage}
              alt={trTitle}
              className="w-full h-full object-cover object-right"
              onError={(e) => {
                if (trImage !== "/topRight.png") {
                  e.target.src = "/topRight.png";
                }
              }}
            />
          </div>

          <div className="relative z-10 max-w-[210px]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              SUMMER SALE
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {trDiscount}
            </h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">
              {trDescription}
            </p>
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
            backgroundImage: `linear-gradient(rgba(15, 40, 30, 0.75), rgba(15, 40, 30, 0.85)), url('${brImage}')`,
          }}
        >
          <div className="relative z-10 max-w-[280px] mx-auto">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest block mb-2">
              BEST DEAL
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 leading-snug line-clamp-2">
              {brTitle}
            </h3>
            {brDescription && (
              <p className="text-xs text-emerald-200 font-medium mb-3">
                {brDescription}
              </p>
            )}
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
