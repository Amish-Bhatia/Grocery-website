import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { localProductMap, getProductImageUrl, dealTime as defaultDealTime } from "./constants";

export default function HotDealCard({
  product,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onAddToCart,
  isWishlisted,
  toggleWishlist,
  dealTime = defaultDealTime,
}) {
  const navigate = useNavigate();
  const onSale =
    (product.discount && product.discount > 0) ||
    (product.originalPrice && product.originalPrice > product.price);

  const salePercent =
    product.discount > 0
      ? product.discount
      : product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 50;

  const wishlisted = isWishlisted ? isWishlisted(product._id) : false;
  const prodImg = getProductImageUrl(product);
  const dynamicRating =
    product.rating !== undefined && product.rating !== null
      ? Math.round(product.rating)
      : 5;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative bg-white rounded-xl border transition-all duration-300 flex flex-col justify-between ${
        isHovered
          ? "border-[#00B207] shadow-xl z-20 ring-2 ring-emerald-100 p-4"
          : "border-gray-100 hover:border-[#00B207] hover:shadow-md p-3.5"
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {onSale ? (
              <span className="bg-[#EA4B48] text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded">
                Sale {salePercent}%
              </span>
            ) : null}
            {isHovered && (
              <span className="bg-[#1a535c] text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded">
                Best Sale
              </span>
            )}
          </div>

          {/* Quick Actions (top right in standard view) */}
          {!isHovered && (
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product._id);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-sm ${
                  wishlisted
                    ? "bg-[#EA4B48] text-white"
                    : "bg-gray-50 hover:bg-[#EA4B48] hover:text-white text-gray-600"
                }`}
                title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={13} fill={wishlisted ? "white" : "none"} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product._id}`);
                }}
                className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#00B207] hover:text-white text-gray-600 flex items-center justify-center transition shadow-sm"
                title="Quick View"
              >
                <Eye size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Product Image */}
        <div
          className={`w-full flex items-center justify-center overflow-hidden my-2 cursor-pointer transition-all duration-300 ${
            isHovered ? "h-44" : "h-32 sm:h-36"
          }`}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {prodImg ? (
            <img
              src={prodImg}
              alt={product.name}
              className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
                isHovered ? "scale-105" : "group-hover:scale-105"
              }`}
              onError={(e) => {
                const clean = product.name?.toLowerCase().trim();
                const fallback = localProductMap[clean];
                if (fallback && !e.target.src.endsWith(fallback)) {
                  e.target.src = fallback;
                }
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center font-bold text-lg">
              {product.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Action buttons row shown on hover expansion */}
        {isHovered && (
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product._id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition shadow-sm ${
                wishlisted
                  ? "bg-[#EA4B48] text-white border-[#EA4B48]"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-[#EA4B48] hover:text-white"
              }`}
              title="Add to Wishlist"
            >
              <Heart size={16} fill={wishlisted ? "white" : "none"} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, 1);
              }}
              className="flex-1 bg-[#00B207] hover:bg-[#009606] text-white font-semibold text-xs py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Add to Cart</span>
              <ShoppingBag size={14} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product._id}`);
              }}
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition shadow-sm cursor-pointer"
              title="Quick View"
            >
              <Eye size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Product Details & Countdown on hover */}
      <div className={isHovered ? "text-center pt-1" : "pt-1"}>
        <h4
          className={`font-medium text-gray-800 hover:text-[#00B207] transition-colors cursor-pointer ${
            isHovered ? "text-sm sm:text-base mb-1" : "text-xs sm:text-sm line-clamp-1 mb-1"
          }`}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h4>

        <div className={`flex items-center gap-2 mb-1.5 ${isHovered ? "justify-center" : ""}`}>
          <span className={`${isHovered ? "text-base sm:text-lg" : "text-sm sm:text-base"} font-bold text-gray-900`}>
            ${Number(product.price).toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className={`flex items-center gap-1.5 mb-2 ${isHovered ? "justify-center" : ""}`}>
          <div className="flex items-center text-[#FF8A00] gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < dynamicRating ? "#FF8A00" : "none"}
                color="#FF8A00"
              />
            ))}
          </div>
          {isHovered && <span className="text-[11px] text-gray-400">(524 Feedback)</span>}
        </div>

        {/* Live Countdown Timer displayed when card is expanded on hover */}
        {isHovered && (
          <div className="pt-2 border-t border-gray-100 mt-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Hurry up! Offer ends in:
            </span>
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 text-sm">{String(dealTime.days).padStart(2, "0")}</span>
                <span className="text-[8px] uppercase tracking-wider text-gray-400">Days</span>
              </div>
              <span className="font-bold text-gray-400 -mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 text-sm">{String(dealTime.hours).padStart(2, "0")}</span>
                <span className="text-[8px] uppercase tracking-wider text-gray-400">Hours</span>
              </div>
              <span className="font-bold text-gray-400 -mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 text-sm">{String(dealTime.minutes).padStart(2, "0")}</span>
                <span className="text-[8px] uppercase tracking-wider text-gray-400">Mins</span>
              </div>
              <span className="font-bold text-gray-400 -mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 text-sm">{String(dealTime.seconds).padStart(2, "0")}</span>
                <span className="text-[8px] uppercase tracking-wider text-gray-400">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Add to cart icon button when in compact view */}
        {!isHovered && (
          <div className="flex items-center justify-end mt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, 1);
              }}
              className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#00B207] text-gray-700 group-hover:text-white flex items-center justify-center transition shadow-sm cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
