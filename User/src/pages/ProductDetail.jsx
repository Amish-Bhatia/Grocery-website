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
  CheckCircle2,
  Share2,
  Check,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSales } from "../context/SalesContext";
import PageBanner from "../Components/PageBanner";
import ProductCard from "../Components/Home/ProductCard";
import { figmaDefaultProducts, getProductPricing } from "../Components/Home/constants";
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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("descriptions");

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

    apimethods
      .getApi("/get-products")
      .then((data) => {
        if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
          const others = data.products.filter((p) => (p._id || p.id) !== id);
          setRelatedProducts(others.slice(0, 5));
        } else {
          setRelatedProducts(figmaDefaultProducts.filter((p) => p._id !== id).slice(0, 5));
        }
      })
      .catch(() => {
        setRelatedProducts(figmaDefaultProducts.filter((p) => p._id !== id).slice(0, 5));
      });
  }, [id]);

  const { getProductSaleDiscount } = useSales();
  const saleDiscount = getProductSaleDiscount ? getProductSaleDiscount(product) : 0;
  const pricing = getProductPricing(product, saleDiscount);
  const onSale = pricing.onSale;
  const salePercent = pricing.salePercent;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, price: pricing.price, originalPrice: pricing.originalPrice }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="w-full bg-[#FCFCFC] py-16 font-[sans-serif]">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
    <div className="w-full bg-[#FCFCFC] font-sans pb-16">
      <PageBanner
        breadcrumbs={[
          { label: "Categories", path: "/shop" },
          ...(product.category ? [{ label: product.category, path: `/shop?category=${encodeURIComponent(product.category)}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8">
        {/* ================= TOP SECTION: Image & Details ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ---- Left: Single Main Product Image ---- */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center min-h-[380px] max-h-[460px] relative">
            {onSale && (
              <span className="absolute top-4 left-4 bg-[#EA4B48] text-white text-xs font-bold px-3 py-1 rounded-full">
                Sale {salePercent}%
              </span>
            )}
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[340px] max-w-full object-contain"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-gray-300">
                <div className="w-24 h-24 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center text-4xl font-bold">
                  {product.name.charAt(0)}
                </div>
                <p className="text-xs text-gray-400">No image available</p>
              </div>
            )}
          </div>

          {/* ---- Right Product Info (6 cols) ---- */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Title & In Stock Badge */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-[#00B207]">
                In Stock
              </span>
            </div>

            {/* Rating Stars & SKU / Review Count */}
            <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
              <div className="flex items-center text-[#FF8A00]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < (product.rating || 5) ? "#FF8A00" : "none"}
                    color="#FF8A00"
                  />
                ))}
              </div>
              {product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                <span className="text-gray-700 font-medium">
                  {product.reviews.length} {product.reviews.length === 1 ? "Review" : "Reviews"}
                </span>
              ) : product.numReviews ? (
                <span className="text-gray-700 font-medium">{product.numReviews} Reviews</span>
              ) : null}
              {product._id && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>SKU: <strong className="text-gray-700">{product._id.slice(-6).toUpperCase()}</strong></span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              {pricing.originalPrice && pricing.originalPrice > pricing.price && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  ₹{pricing.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-[#00B207]">
                ₹{pricing.price.toFixed(2)}
              </span>
              {onSale && salePercent > 0 && (
                <span className="text-xs font-bold text-[#EA4B48] bg-red-50 px-2 py-0.5 rounded-full">
                  {salePercent}% Off
                </span>
              )}
            </div>

            <hr className="border-gray-200 my-2" />

            {/* Brand and Share */}
            <div className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Brand:</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                  {product.brand || "Ecobazar"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Share item:</span>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <a href="#facebook" aria-label="Facebook" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#twitter" aria-label="Twitter" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#instagram" aria-label="Instagram" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Short description */}
            {product.description && (
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed my-3">
                {product.description}
              </p>
            )}

            <hr className="border-gray-200 my-2" />

            {/* Quantity Selector + Add to Cart + Wishlist */}
            <div className="flex flex-wrap items-center gap-3 my-4">
              {/* Quantity */}
              <div className="flex items-center border border-gray-200 rounded-full p-1 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-sm text-white transition shadow-sm cursor-pointer ${
                  addedToCart ? "bg-emerald-700" : "bg-[#00B207] hover:bg-[#009606]"
                } disabled:opacity-50`}
              >
                <ShoppingBag size={18} />
                <span>{addedToCart ? "Added to Cart!" : "Add to Cart"}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product._id)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition cursor-pointer ${
                  isWishlisted(product._id)
                    ? "bg-[#EA4B48] border-[#EA4B48] text-white"
                    : "border-gray-200 text-gray-500 hover:border-[#EA4B48] hover:text-[#EA4B48] bg-white"
                }`}
                title={isWishlisted(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={18} fill={isWishlisted(product._id) ? "white" : "none"} />
              </button>
            </div>

            <hr className="border-gray-200 my-2" />

            {/* Category & Tags meta */}
            <div className="space-y-1.5 text-xs text-gray-600 mt-2">
              {product.category && (
                <div>
                  <span className="text-gray-900 font-semibold">Category: </span>
                  <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-gray-600 hover:text-[#00B207]">
                    {product.category}
                  </Link>
                </div>
              )}
              {product.tags && (Array.isArray(product.tags) ? product.tags.length > 0 : Boolean(product.tags)) && (
                <div>
                  <span className="text-gray-900 font-semibold">Tag: </span>
                  <span className="text-gray-500">
                    {Array.isArray(product.tags) ? product.tags.join(", ") : product.tags}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= TABS SECTION (Descriptions / Additional Info / Customer Feedback) ================= */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          {/* Tab Navigation */}
          <div className="flex items-center justify-center border-b border-gray-200 gap-8 sm:gap-14 pb-4 overflow-x-auto text-sm sm:text-base font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("descriptions")}
              className={`pb-2 border-b-2 transition cursor-pointer ${
                activeTab === "descriptions"
                  ? "border-[#00B207] text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              Descriptions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("additional")}
              className={`pb-2 border-b-2 transition cursor-pointer ${
                activeTab === "additional"
                  ? "border-[#00B207] text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              Additional Information
            </button>
            {product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("feedback")}
                className={`pb-2 border-b-2 transition cursor-pointer ${
                  activeTab === "feedback"
                    ? "border-[#00B207] text-gray-900"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                Customer Feedback ({product.reviews.length})
              </button>
            )}
          </div>

          {/* Tab Content 1: Descriptions */}
          {activeTab === "descriptions" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p>
                    Fresh and high quality {product.name}. Carefully sourced from organic farms and delivered right to your doorstep to ensure maximum freshness and nutritional value.
                  </p>
                )}

                {/* Dynamic Features List if present */}
                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-gray-700">
                        <CheckCircle2 size={16} className="text-[#00B207] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promo badge box */}
              <div className="lg:col-span-5 bg-[#F2F8F2] rounded-2xl p-6 flex flex-col justify-center border border-emerald-100 space-y-4">
                {/* Dynamic Discount Promo - ONLY show if onSale & salePercent > 0 */}
                {onSale && salePercent > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00B207] text-white flex items-center justify-center shrink-0">
                      <Tag size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{salePercent}% Discount</h4>
                      <p className="text-xs text-gray-500">Save your {salePercent}% money with us</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00B207] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">100% Organic</h4>
                    <p className="text-xs text-gray-500">100% Organic Vegetables & Fruits</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Additional Information */}
          {activeTab === "additional" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-7">
                <table className="w-full text-xs sm:text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                  <tbody>
                    {(product.weight || product.unit) && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-700 w-1/3">Weight:</td>
                        <td className="px-4 py-3 text-gray-600">{product.weight || product.unit}</td>
                      </tr>
                    )}
                    {product.color && (
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 font-semibold text-gray-700">Color:</td>
                        <td className="px-4 py-3 text-gray-600">{product.color}</td>
                      </tr>
                    )}
                    {product.type && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-700">Type:</td>
                        <td className="px-4 py-3 text-gray-600">{product.type}</td>
                      </tr>
                    )}
                    {product.category && (
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 font-semibold text-gray-700">Category:</td>
                        <td className="px-4 py-3 text-gray-600">{product.category}</td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-700">Stock Status:</td>
                      <td className={`px-4 py-3 font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {product.stock > 0 ? `Available (${product.stock} in stock)` : "Out of Stock"}
                      </td>
                    </tr>
                    {product.tags && (Array.isArray(product.tags) ? product.tags.length > 0 : Boolean(product.tags)) && (
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-700">Tags:</td>
                        <td className="px-4 py-3 text-gray-600">
                          {Array.isArray(product.tags) ? product.tags.join(", ") : product.tags}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Promo Box */}
              <div className="lg:col-span-5 bg-[#F2F8F2] rounded-2xl p-6 flex flex-col justify-center border border-emerald-100 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00B207] text-white flex items-center justify-center shrink-0">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Free Delivery</h4>
                    <p className="text-xs text-gray-500">Free shipping on all orders over ₹500</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00B207] text-white flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">100% Secure Payment</h4>
                    <p className="text-xs text-gray-500">We ensure secure payment and guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Customer Feedback (ONLY when product.reviews has data) */}
          {activeTab === "feedback" && product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0 && (
            <div className="pt-8 space-y-6">
              <div className="space-y-4">
                {product.reviews.map((rev, idx) => (
                  <div key={rev.id || rev._id || idx} className="border-b border-gray-100 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {rev.avatar ? (
                          <img src={rev.avatar} alt={rev.name || rev.userName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#00B207] font-bold flex items-center justify-center text-sm">
                            {(rev.name || rev.userName || "U").charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{rev.name || rev.userName || "Customer"}</h4>
                          <div className="flex items-center text-[#FF8A00]">
                            {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                              <Star key={i} size={12} fill="#FF8A00" color="#FF8A00" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{rev.time || rev.createdAt || ""}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 ml-13 leading-relaxed">
                      {rev.comment || rev.text || rev.review}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B207] hover:underline"
              >
                <span>View All</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((relProd, index) => (
                <ProductCard
                  key={relProd._id || index}
                  product={relProd}
                  onAddToCart={(p, q) => addToCart(p, q)}
                  isWishlisted={isWishlisted}
                  toggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
