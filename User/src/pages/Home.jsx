import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Headphones,
  ShieldCheck,
  Package,
  Heart,
  Eye,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import apimethods from "../services/api";

// Default sample categories if backend has no categories yet
const defaultCategories = [
  { id: "1", name: "Fresh Fruit", image: "" },
  { id: "2", name: "Fresh Vegetables", image: "" },
  { id: "3", name: "Meat & Fish", image: "" },
  { id: "4", name: "Snacks", image: "" },
  { id: "5", name: "Beverages", image: "" },
  { id: "6", name: "Beauty & Health", image: "" },
  { id: "7", name: "Bread & Bakery", image: "" },
  { id: "8", name: "Baking Needs", image: "" },
  { id: "9", name: "Cooking", image: "" },
  { id: "10", name: "Diabetic Food", image: "" },
  { id: "11", name: "Dish Detergents", image: "" },
  { id: "12", name: "Oil", image: "" },
];

// Default sample products if backend has no products yet
const defaultProducts = [
  { id: "p1", name: "Green Apple", price: 14.99, originalPrice: 20.99, discount: 50, rating: 4, category: "Fresh Fruit", image: "" },
  { id: "p2", name: "Fresh Indian Malta", price: 20.00, originalPrice: null, discount: 0, rating: 5, category: "Fresh Fruit", image: "" },
  { id: "p3", name: "Chinese Cabbage", price: 12.00, originalPrice: null, discount: 0, rating: 4, category: "Vegetables", image: "" },
  { id: "p4", name: "Green Lettuce", price: 9.00, originalPrice: null, discount: 0, rating: 4, category: "Vegetables", image: "" },
  { id: "p5", name: "Eggplant", price: 34.00, originalPrice: null, discount: 0, rating: 5, category: "Vegetables", image: "" },
  { id: "p6", name: "Big Potatoes", price: 20.00, originalPrice: null, discount: 0, rating: 5, category: "Vegetables", image: "" },
  { id: "p7", name: "Corn", price: 20.00, originalPrice: null, discount: 0, rating: 5, category: "Vegetables", image: "" },
  { id: "p8", name: "Fresh Cauliflower", price: 12.00, originalPrice: null, discount: 0, rating: 4, category: "Vegetables", image: "" },
  { id: "p9", name: "Green Capsicum", price: 9.00, originalPrice: 20.00, discount: 50, rating: 4, category: "Vegetables", image: "" },
  { id: "p10", name: "Green Chili", price: 34.00, originalPrice: null, discount: 0, rating: 4, category: "Vegetables", image: "" },
];

export default function Home() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch categories from backend
    apimethods
      .getApi("/get-category")
      .then((data) => {
        if (data?.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(defaultCategories);
        }
      })
      .catch(() => setCategories(defaultCategories));

    // 2. Fetch products from backend
    apimethods
      .getApi("/get-products")
      .then((data) => {
        if (data?.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(defaultProducts);
        }
      })
      .catch(() => setProducts(defaultProducts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-white font-[sans-serif] pb-16">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
       

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
       
          <div className="lg:col-span-2 bg-[#00B207] rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[440px] text-white">
            <div className="relative z-10 max-w-[420px]">
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight">
                Fresh &amp; Healthy Organic Food
              </h1>
              <div className="flex items-center gap-3 mb-6">
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
                className="inline-flex items-center gap-2 bg-white text-[#00B207] font-semibold text-sm sm:text-base px-7 py-3 rounded-full hover:bg-emerald-50 transition shadow-md"
              >
                <span>Shop now</span>
                <ArrowRight size={18} />
              </Link>
            </div>

           
            <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden sm:flex items-end justify-end pointer-events-none">
              <img
                src="" 
                alt="Fresh Organic Food"
                className="max-h-full object-contain object-bottom"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Right Column (2 Stacked Promo Banners) */}
          <div className="flex flex-col gap-6">
            {/* Summer Sale Card (Top) */}
            <div className="bg-[#F2F2F2] rounded-2xl p-6 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[200px]">
              <div className="relative z-10 max-w-[200px]">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  SUMMER SALE
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  75% OFF
                </h3>
                <p className="text-xs text-gray-500 mb-4">Only Fruit &amp; Vegetable</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Summer Sale Banner Image Spot */}
              {/* USER_IMAGE_SLOT: Summer Sale Banner Image (Line 150) */}
              <div className="absolute right-2 bottom-2 w-36 h-36 flex items-end justify-end pointer-events-none">
                <img
                  src="User/public/summersale.jpg" // <-- ADD SUMMER SALE IMAGE URL HERE (e.g. fruit bag)
                  alt="Summer Sale"
                  className="max-h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Special Deal Card (Bottom) */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[200px] text-white">
              <div className="relative z-10 max-w-[240px]">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  BEST DEAL
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">
                  Special Products Deal of the Month
                </h3>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            FEATURE HIGHLIGHTS BAR (4 Pillars)
            ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm mb-12">
          {/* 1. Free Shipping */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Free Shipping</h4>
              <p className="text-xs text-gray-500">Free shipping on all your order</p>
            </div>
          </div>

          {/* 2. Customer Support 24/7 */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Customer Support 24/7</h4>
              <p className="text-xs text-gray-500">Instant access to Support</p>
            </div>
          </div>

          {/* 3. 100% Secure Payment */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">100% Secure Payment</h4>
              <p className="text-xs text-gray-500">We ensure your money is safe</p>
            </div>
          </div>

          {/* 4. Money-Back Guarantee */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
              <Package size={24} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Money-Back Guarantee</h4>
              <p className="text-xs text-gray-500">30 Days Money-Back Guarantee</p>
            </div>
          </div>
        </div>

        {/* ============================================================
            POPULAR CATEGORIES SECTION (12 Grid Cards)
            ============================================================ */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Popular Categories
            </h2>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B207] hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category, index) => {
              const isHighlight = index === 1; // "Fresh Vegetables" highlighted in reference screenshot
              const catImg = category.image
                ? category.image.startsWith("http") || category.image.startsWith("data:")
                  ? category.image
                  : `http://localhost:3000/uploads/categories/${category.image}`
                : "";

              return (
                <Link
                  key={category._id || category.id || index}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className={`group p-4 bg-white rounded-xl text-center border transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] ${
                    isHighlight
                      ? "border-[#00B207] shadow-sm ring-1 ring-[#00B207]"
                      : "border-gray-100 hover:border-[#00B207] hover:shadow-md"
                  }`}
                >
                  <div className="w-20 h-20 mb-3 flex items-center justify-center overflow-hidden">
                    {/* USER_IMAGE_SLOT: Category Image Spot (Line 274) */}
                    {catImg ? (
                      <img
                        src={catImg}
                        alt={category.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                        {category.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isHighlight
                        ? "text-[#00B207] font-semibold"
                        : "text-gray-800 group-hover:text-[#00B207]"
                    }`}
                  >
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            POPULAR PRODUCTS SECTION (10 Grid Cards)
            ============================================================ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Popular Products
            </h2>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B207] hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.slice(0, 10).map((product, index) => {
                const isHighlighted = index === 2; // "Chinese Cabbage" highlighted in screenshot
                const prodImg = product.image || "";

                return (
                  <div
                    key={product._id || product.id || index}
                    className={`group relative bg-white rounded-xl p-3 sm:p-4 border transition-all duration-200 flex flex-col justify-between ${
                      isHighlighted
                        ? "border-[#00B207] ring-1 ring-[#00B207] shadow-sm"
                        : "border-gray-100 hover:border-[#00B207] hover:shadow-md"
                    }`}
                  >
                    {/* Top Badges & Actions */}
                    <div className="flex items-center justify-between w-full mb-2">
                      {product.discount > 0 ? (
                        <span className="bg-[#EA4B48] text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded">
                          Sale {product.discount}%
                        </span>
                      ) : (
                        <span />
                      )}

                      {/* Wishlist & Quick View */}
                      <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#00B207] hover:text-white text-gray-600 flex items-center justify-center transition shadow-sm"
                          title="Wishlist"
                        >
                          <Heart size={14} />
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#00B207] hover:text-white text-gray-600 flex items-center justify-center transition shadow-sm"
                          title="Quick View"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Product Image Spot */}
                    {/* USER_IMAGE_SLOT: Product Card Image (Line 368) */}
                    <div className="w-full h-36 sm:h-40 flex items-center justify-center overflow-hidden my-2">
                      {prodImg ? (
                        <img
                          src={prodImg}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                          {product.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-[#00B207] transition-colors mb-1">
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-sm sm:text-base font-semibold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ${Number(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Stars & Add to Cart button */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                        <div className="flex items-center text-[#FF8A00]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < (product.rating || 5) ? "#FF8A00" : "none"}
                              color="#FF8A00"
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isHighlighted
                              ? "bg-[#00B207] text-white hover:bg-[#009606]"
                              : "bg-gray-100 text-gray-700 hover:bg-[#00B207] hover:text-white"
                          }`}
                          title="Add to Cart"
                        >
                          <ShoppingBag size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
