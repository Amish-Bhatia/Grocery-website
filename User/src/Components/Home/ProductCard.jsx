import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { localProductMap, getProductImageUrl } from "./constants";

export default function ProductCard({
  product,
  isSelected = false,
  onAddToCart,
  isWishlisted,
  toggleWishlist,
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
      : null;

  const wishlisted = isWishlisted ? isWishlisted(product._id) : false;
  const dynamicRating =
    product.rating !== undefined && product.rating !== null
      ? Math.round(product.rating)
      : 5;

  const prodImg = getProductImageUrl(product);

  return (
    <div
      className={`group relative bg-white rounded-lg p-3 sm:p-4 border transition-all duration-200 flex flex-col justify-between ${
        isSelected || product.active
          ? "border-[#00B207] shadow-sm"
          : "border-gray-100 hover:border-[#00B207] hover:shadow-md"
      }`}
    >
      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between w-full mb-1">
        {onSale ? (
          <span className="bg-[#EA4B48] text-white text-[11px] font-medium px-2 py-0.5 rounded">
            Sale {salePercent}%
          </span>
        ) : (
          <span />
        )}

        {/* Wishlist & Quick View */}
        <div className="flex flex-col gap-1.5">
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
            <Heart size={14} fill={wishlisted ? "white" : "none"} />
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
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div
        className="w-full h-32 sm:h-36 flex items-center justify-center overflow-hidden my-2 cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {prodImg ? (
          <img
            src={prodImg}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
            onError={(e) => {
              const clean = product.name?.toLowerCase().trim();
              const fallback = localProductMap[clean];
              if (fallback && !e.target.src.endsWith(fallback)) {
                e.target.src = fallback;
              } else {
                e.target.style.display = "none";
              }
            }}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center font-bold text-xl">
            {product.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div>
        <h4
          className="text-xs sm:text-sm font-normal text-gray-700 line-clamp-1 hover:text-[#00B207] transition-colors mb-1 cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h4>

        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-sm sm:text-base font-semibold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Dynamic Stars & Add to Cart */}
        <div className="flex items-center justify-between pt-1">
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, 1);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isSelected || product.active
                ? "bg-[#00B207] text-white"
                : "bg-gray-100 hover:bg-[#00B207] text-gray-700 hover:text-white"
            }`}
            title="Add to Cart"
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
