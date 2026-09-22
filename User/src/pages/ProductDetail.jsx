import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Package,
  Tag,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import PageBanner from "../Components/PageBanner";
import apimethods from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    apimethods
      .getApi(`/get-products/${id}`)
      .then((data) => {
        if (data?.product) {
          setProduct(data.product);
        } else {
          setError("Product not found.");
        }
      })
      .catch(() => setError("Could not load product. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Calculate sale percentage if both prices exist
  const salePercent =
    product?.originalPrice && product?.price < product?.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : product?.discount || 0;

  const onSale = salePercent > 0;

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="w-full bg-[#FCFCFC] py-16 font-[sans-serif]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="bg-gray-100 rounded-2xl h-[420px]" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-100 rounded w-1/3" />
              <div className="h-10 bg-gray-100 rounded w-3/4" />
              <div className="h-8 bg-gray-100 rounded w-1/4" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Error State ----
  if (error || !product) {
    return (
      <div className="w-full bg-[#FCFCFC] py-20 font-[sans-serif] flex items-center justify-center">
        <div className="text-center">
          <Package size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error || "Product not found"}</h2>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-4 inline-flex items-center gap-2 bg-[#00B207] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#009606] transition"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FCFCFC] font-sans pb-12">
      <PageBanner
        breadcrumbs={[
          { label: "Shop", path: "/shop" },
          ...(product.category ? [{ label: product.category, path: `/shop?category=${encodeURIComponent(product.category)}` }] : []),
          { label: product.name },
        ]}
      />
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ---- Left: Product Image ---- */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center min-h-[380px] relative">
            {onSale && (
              <span className="absolute top-4 left-4 bg-[#EA4B48] text-white text-xs font-bold px-3 py-1 rounded-full">
                -{salePercent}% Sale
              </span>
            )}

            {/* =========================================================
               IMAGE PLACEHOLDER
               Required image: Product detail main image for "{product.name}"
               The image URL comes from product.image (fetched from backend API)
               If image is empty in DB, upload one via the admin panel.
               ========================================================= */}
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[360px] max-w-full object-contain"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-gray-300">
                <div className="w-32 h-32 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center text-5xl font-bold">
                  {product.name.charAt(0)}
                </div>
                <p className="text-sm text-gray-400">No image available</p>
              </div>
            )}
          </div>

          {/* ---- Right: Product Info ---- */}
          <div className="flex flex-col justify-center">
            {/* Category tag */}
            {product.category && (
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] bg-emerald-50 px-3 py-1.5 rounded-full w-fit mb-4 hover:bg-emerald-100 transition"
              >
                <Tag size={12} />
                {product.category}
              </Link>
            )}

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-[#FF8A00]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < (product.rating || 5) ? "#FF8A00" : "none"}
                    color="#FF8A00"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.rating || 5} / 5)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-3xl font-bold text-[#00B207]">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              {onSale && (
                <span className="text-sm font-semibold text-[#EA4B48]">
                  Save {salePercent}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-6 border-t pt-4">
                {product.description}
              </p>
            )}

            {/* Stock info */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <Package size={16} className={product.stock > 0 ? "text-[#00B207]" : "text-red-400"} />
              {product.stock > 0 ? (
                <span className="text-[#00B207] font-medium">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-400 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  disabled={product.stock !== undefined && product.stock !== null && quantity >= product.stock}
                  onClick={() =>
                    setQuantity((q) => {
                      const maxStock =
                        product.stock !== undefined && product.stock !== null
                          ? Number(product.stock)
                          : 99;
                      return Math.min(maxStock, q + 1);
                    })
                  }
                  className={`w-10 h-10 flex items-center justify-center transition ${
                    product.stock !== undefined && product.stock !== null && quantity >= product.stock
                      ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                  }`}
                  title={
                    product.stock !== undefined && product.stock !== null && quantity >= product.stock
                      ? `Max limit reached (${product.stock} available)`
                      : "Increase quantity"
                  }
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition shadow-sm cursor-pointer ${
                  addedToCart
                    ? "bg-emerald-600 text-white"
                    : "bg-[#00B207] hover:bg-[#009606] text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingBag size={18} />
                <span>{addedToCart ? "Added!" : "Add to Cart"}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product._id)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
                  isWishlisted(product._id)
                    ? "bg-[#EA4B48] border-[#EA4B48] text-white"
                    : "border-gray-200 text-gray-500 hover:border-[#EA4B48] hover:text-[#EA4B48]"
                }`}
                title={isWishlisted(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart
                  size={20}
                  fill={isWishlisted(product._id) ? "white" : "none"}
                />
              </button>
            </div>

            {/* Back to Shop */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#00B207] transition mt-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
