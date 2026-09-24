import { useNavigate } from "react-router-dom";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { getProductPricing } from "../Home/constants";

export default function ShopProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) {
  const navigate = useNavigate();
  const pricing = getProductPricing(product);
  const onSale = pricing.onSale;
  const saleLabel = onSale ? `Sale ${pricing.salePercent}%` : "";
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="group relative bg-white rounded-xl p-4 border border-gray-100 hover:border-[#00B207] hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between w-full mb-2">
        {onSale ? (
          <span className="bg-[#EA4B48] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            {saleLabel}
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product._id);
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer ${
            wishlisted
              ? "bg-[#EA4B48] text-white"
              : "bg-gray-50 hover:bg-[#EA4B48] hover:text-white text-gray-600"
          }`}
          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={14} fill={wishlisted ? "white" : "none"} />
        </button>
      </div>

      <div
        className="w-full h-36 flex items-center justify-center overflow-hidden my-2 cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center font-bold text-lg">
            {product.name?.charAt(0)}
          </div>
        )}
      </div>

      <div>
        <span className="text-[11px] text-gray-400 font-medium uppercase block mb-1">
          {product.category || "Grocery"}
        </span>
        <h4
          className="text-sm font-semibold text-gray-800 line-clamp-1 hover:text-[#00B207] transition-colors mb-1.5 cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h4>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-bold text-gray-900">
            ${pricing.price.toFixed(2)}
          </span>
          {pricing.originalPrice && pricing.originalPrice > pricing.price && (
            <span className="text-xs text-gray-400 line-through">
              ${pricing.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center text-[#FF8A00]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < (product.rating || 5) ? "#FF8A00" : "none"}
                color="#FF8A00"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => onAddToCart({ ...product, price: pricing.price, originalPrice: pricing.originalPrice }, 1)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#00B207] text-gray-700 hover:text-white flex items-center justify-center transition shadow-sm cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
