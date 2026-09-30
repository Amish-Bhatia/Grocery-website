import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSales } from "../../context/SalesContext";

export default function WideSummerSaleBanner() {
  const { getBannerSale } = useSales();
  const wideSale = getBannerSale("wideSummer");

  // Dynamic values from backend sale module
  const badgeText = wideSale?.saleName ? "SUMMER SALE" : "SUMMER SALE";
  const discountText = wideSale
    ? wideSale.discountType === "fixed"
      ? `₹${wideSale.discountValue}`
      : `${wideSale.discountValue}%`
    : "37%";
  const descriptionText =
    wideSale?.description ||
    "Free on all your order, Free Shipping and 30 days money-back guarantee";
  const bgImage = wideSale?.bannerImage || "/summersale37%off.jpg";

  return (
    <section
      className="relative rounded-2xl overflow-hidden mb-14 bg-[#111A13] text-white p-8 sm:p-14 min-h-[280px] flex items-center justify-end bg-cover bg-center shadow-sm"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(17, 26, 19, 0.2), rgba(17, 26, 19, 0.9)), url('${bgImage}')`,
      }}
    >
      <div className="relative z-10 max-w-[460px] text-right sm:text-left">
        <span className="text-xs font-semibold text-white/80 uppercase tracking-widest block mb-2">
          {badgeText}
        </span>
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-3">
          <span className="text-[#FF8A00]">{discountText}</span> OFF
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
          {descriptionText}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-[#009606] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition shadow-md"
        >
          <span>Shop Now</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
