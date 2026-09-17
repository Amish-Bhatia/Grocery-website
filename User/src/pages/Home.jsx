import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Truck,
  Headphones,
  ShieldCheck,
  Package,
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Tag,
  User,
  MessageSquare,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import apimethods from "../services/api";
import Swal from "sweetalert2";

// Local fallback mapping for category images
const localCategoryMap = {
  "fresh fruits": "/categories/1788851171610-266493087.png",
  "fresh vegetables": "/categories/1788941762355-972498302.png",
  "meat & fish": "/categories/1788941780756-586862599.png",
  "snacks": "/categories/snacks.png",
  "beverages": "/categories/1789543346593-215389198.png",
  "beauty & health": "/categories/Beauty&Health.png",
  "bread & bakery": "/categories/Bread&Bakery.png",
  "baking needs": "/categories/BakingNeeds.png",
  "cooking": "/categories/Cooking.png",
  "diabetic food": "/categories/DiabeticFood.png",
  "dish detergents": "/categories/DishDetergents.png",
  "oil": "/categories/Oil.png",
};

// Local fallback mapping for product images
const localProductMap = {
  "green apple": "/greenApple.png",
  "fresh indian malta": "/orange.png",
  "chinese cabbage": "/ChineseCabbage.png",
  "green lettuce": "/GreenLettuce.png",
  "eggplant": "/EggPlant.png",
  "big potatoes": "/potato.png",
  "corn": "/corn.png",
  "fresh cauliflower": "/FreshCauliflower.png",
  "green capsicum": "/GreenCapsicum.png",
  "green chili": "/GreenChilli.png",
  "red chili": "/RedChilli.png",
  "red tomato": "/Red Tomato.png",
  "surjapur mango": "/Surjapur Mango.png",
};

// Exact Figma visual order for popular categories
const categoryOrder = [
  "Fresh Fruit",
  "Fresh Vegetables",
  "Meat & Fish",
  "Snacks",
  "Beverages",
  "Beauty & Health",
  "Bread & Bakery",
  "Baking Needs",
  "Cooking",
  "Diabetic Food",
  "Dish Detergents",
  "Oil",
];

// Fallback Figma data to ensure all 12 categories render seamlessly
const figmaCategories = [
  { name: "Fresh Fruit", image: "/categories/1788851171610-266493087.png" },
  { name: "Fresh Vegetables", image: "/categories/1788941762355-972498302.png", active: true },
  { name: "Meat & Fish", image: "/categories/1788941780756-586862599.png" },
  { name: "Snacks", image: "/categories/snacks.png" },
  { name: "Beverages", image: "/categories/1789543346593-215389198.png" },
  { name: "Beauty & Health", image: "/categories/Beauty&Health.png" },
  { name: "Bread & Bakery", image: "/categories/Bread&Bakery.png" },
  { name: "Baking Needs", image: "/categories/BakingNeeds.png" },
  { name: "Cooking", image: "/categories/Cooking.png" },
  { name: "Diabetic Food", image: "/categories/DiabeticFood.png" },
  { name: "Dish Detergents", image: "/categories/DishDetergents.png" },
  { name: "Oil", image: "/categories/Oil.png" },
];

// Product visual sequence matching Figma screenshots
const figmaProductOrder = [
  "Green Apple",
  "Fresh Indian Malta",
  "Chinese cabbage",
  "Green lettuce",
  "Eggplant",
  "Big Potatoes",
  "Corn",
  "Fresh Cauliflower",
  "Green Capsicum",
  "Green Chili",
  "Red Chili",
  "Red Tomato",
  "Surjapur Mango",
];

const figmaDefaultProducts = [
  { _id: "f1", name: "Green Apple", price: 14.99, originalPrice: 20.99, discount: 50, rating: 4, image: "/greenApple.png" },
  { _id: "f2", name: "Fresh Indian Malta", price: 20.00, originalPrice: null, discount: 0, rating: 5, image: "/orange.png" },
  { _id: "f3", name: "Chinese cabbage", price: 12.00, originalPrice: 24.00, discount: 50, rating: 5, image: "/ChineseCabbage.png", active: true },
  { _id: "f4", name: "Green lettuce", price: 9.00, originalPrice: null, discount: 0, rating: 4, image: "/GreenLettuce.png" },
  { _id: "f5", name: "Eggplant", price: 34.00, originalPrice: null, discount: 0, rating: 5, image: "/EggPlant.png" },
  { _id: "f6", name: "Big Potatoes", price: 20.00, originalPrice: null, discount: 0, rating: 4, image: "/potato.png" },
  { _id: "f7", name: "Corn", price: 20.00, originalPrice: null, discount: 0, rating: 5, image: "/corn.png" },
  { _id: "f8", name: "Fresh Cauliflower", price: 12.00, originalPrice: null, discount: 0, rating: 4, image: "/FreshCauliflower.png" },
  { _id: "f9", name: "Green Capsicum", price: 9.00, originalPrice: 20.99, discount: 50, rating: 4, image: "/GreenCapsicum.png" },
  { _id: "f10", name: "Green Chili", price: 34.00, originalPrice: null, discount: 0, rating: 4, image: "/GreenChilli.png" },
  { _id: "f11", name: "Red Chili", price: 12.00, originalPrice: null, discount: 0, rating: 5, image: "/RedChilli.png" },
  { _id: "f12", name: "Red Tomato", price: 9.00, originalPrice: 20.99, discount: 50, rating: 4, image: "/Red Tomato.png" },
  { _id: "f13", name: "Surjapur Mango", price: 34.00, originalPrice: null, discount: 0, rating: 5, image: "/Surjapur Mango.png" },
];

const defaultClientTestimonials = [
  {
    _id: "t1",
    name: "Robert Fox",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/Robert.png",
    order: 1,
  },
  {
    _id: "t2",
    name: "Dianne Russell",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/Dennie.png",
    order: 2,
  },
  {
    _id: "t3",
    name: "Eleanor Pena",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/eleanor.png",
    order: 3,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [hoveredDealId, setHoveredDealId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Static countdown timers matching Figma designs
  const dealTime = {
    days: 1,
    hours: 23,
    minutes: 34,
    seconds: 57,
  };

  const monthSaleTime = {
    days: 0,
    hours: 2,
    minutes: 18,
    seconds: 46,
  };

  const handleAddToCartWithFeedback = (product, quantity = 1) => {
    const prodToCart = {
      ...product,
      id: product._id || product.id,
      image: getProductImageUrl(product) || product.image || "",
      stock:
        product.stock !== undefined && product.stock !== null && !isNaN(product.stock)
          ? Number(product.stock)
          : 99,
    };
    const res = addToCart(prodToCart, quantity);
    if (res && res.reachedLimit) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: `Max limit reached! Only ${res.maxStock} in stock.`,
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: false,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${product.name} added to cart!`,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: false,
      });
    }
  };

  useEffect(() => {
    // 1. Fetch categories dynamically from backend
    apimethods
      .getApi("/get-category")
      .then((data) => {
        if (data?.categories && data.categories.length > 0) {
          const backendCats = [...data.categories];
          // Sort by visual sequence
          backendCats.sort((a, b) => {
            const getRank = (name) => {
              const clean = name.toLowerCase().replace(/s$/, "").trim();
              const idx = categoryOrder.findIndex(
                (co) => co.toLowerCase().replace(/s$/, "").trim() === clean
              );
              return idx >= 0 ? idx : 99;
            };
            return getRank(a.name) - getRank(b.name);
          });

          setCategories(backendCats);
        } else {
          setCategories(figmaCategories);
        }
      })
      .catch(() => {
        setCategories(figmaCategories);
      });

    // 2. Fetch products dynamically from backend (only admin/database products)
    apimethods
      .getApi("/get-products")
      .then((data) => {
        if (data?.products && data.products.length > 0) {
          const backendProds = [...data.products];
          // Sort according to visual order
          backendProds.sort((a, b) => {
            const getProdRank = (name) => {
              const idx = figmaProductOrder.findIndex(
                (fp) => fp.toLowerCase().trim() === name.toLowerCase().trim()
              );
              return idx >= 0 ? idx : 999;
            };
            return getProdRank(a.name) - getProdRank(b.name);
          });

          setProducts(backendProds);
        } else {
          setProducts(figmaDefaultProducts);
        }
      })
      .catch(() => {
        setProducts(figmaDefaultProducts);
      })
      .finally(() => setLoading(false));

    // 3. Fetch testimonials dynamically from backend
    apimethods
      .getApi("/get-testimonials")
      .then((data) => {
        if (data?.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        } else {
          setTestimonials(defaultClientTestimonials);
        }
      })
      .catch(() => {
        setTestimonials(defaultClientTestimonials);
      });
  }, []);

  const displayCategories = categories.length > 0 ? categories : figmaCategories;
  const displayProducts = products.length > 0 ? products : figmaDefaultProducts;
  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultClientTestimonials;

  // Selected product for the Hot Deals deal item (Green Apple)
  const dealProduct =
    displayProducts.find((p) => p.name.toLowerCase().includes("green apple")) ||
    displayProducts[0] ||
    figmaDefaultProducts[0];

  // Helper to get image URL for category with local fallback
  const getCategoryImageUrl = (category) => {
    if (category.image && category.image.trim()) {
      return category.image;
    }
    const clean = category.name?.toLowerCase().replace(/s$/, "").trim();
    return localCategoryMap[clean] || "";
  };

  // Helper to get image URL for product with local fallback
  const getProductImageUrl = (product) => {
    if (product.image && product.image.trim()) {
      return product.image;
    }
    const clean = product.name?.toLowerCase().trim();
    return localProductMap[clean] || "";
  };

  // Render individual product card matching Figma cards exactly
  const renderProductCard = (product, isSelected = false) => {
    const onSale =
      (product.discount && product.discount > 0) ||
      (product.originalPrice && product.originalPrice > product.price);

    const salePercent =
      product.discount > 0
        ? product.discount
        : product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const wishlisted = isWishlisted(product._id);
    const dynamicRating =
      product.rating !== undefined && product.rating !== null
        ? Math.round(product.rating)
        : 5;

    const prodImg = getProductImageUrl(product);

    return (
      <div
        key={product._id}
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
                handleAddToCartWithFeedback(product, 1);
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
  };

  // Render Hot Deal card: Not big initially; expands on hover for ANY product
  const renderHotDealCard = (product) => {
    const isHovered = hoveredDealId === product._id;
    const onSale =
      (product.discount && product.discount > 0) ||
      (product.originalPrice && product.originalPrice > product.price);

    const salePercent =
      product.discount > 0
        ? product.discount
        : product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 50;

    const wishlisted = isWishlisted(product._id);
    const prodImg = getProductImageUrl(product);
    const dynamicRating =
      product.rating !== undefined && product.rating !== null
        ? Math.round(product.rating)
        : 5;

    return (
      <div
        key={product._id}
        onMouseEnter={() => setHoveredDealId(product._id)}
        onMouseLeave={() => setHoveredDealId(null)}
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
                  handleAddToCartWithFeedback(product, 1);
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
                  handleAddToCartWithFeedback(product, 1);
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
  };

  return (
    <div className="w-full bg-white font-[sans-serif]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ============================================================
            1. HERO BANNERS SECTION (Screenshot 1)
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          {/* Main Large Hero Banner */}
          <div className="lg:col-span-2 bg-[#00B207] rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[460px] text-white">
            {/* Background Image expanding full width & height */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <img
                src="/banner.jpg"
                alt="Fresh Organic Food"
                className="w-full h-full object-cover object-right"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <div className="relative z-10 max-w-[420px]">
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight">
                Fresh &amp; Healthy Organic Food
              </h1>
              <div className="flex items-center gap-3 mb-4">
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
                  src="/topRight.png"
                  alt="Summer Sale"
                  className="w-full h-full object-cover object-right"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              <div className="relative z-10 max-w-[190px]">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  SUMMER SALE
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">75% OFF</h3>
                <p className="text-xs text-gray-500 mb-4">Only Fruit &amp; Vegetable</p>
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
                backgroundImage:
                  "linear-gradient(rgba(15, 40, 30, 0.75), rgba(15, 40, 30, 0.85)), url('/bottomRight.jpg')",
              }}
            >
              <div className="relative z-10 max-w-[280px] mx-auto">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest block mb-2">
                  BEST DEAL
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">
                  Special Products Deal of the Month
                </h3>
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

        {/* ============================================================
            2. FEATURE HIGHLIGHTS BAR (Screenshot 1)
            ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm mb-12">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Free Shipping</h4>
              <p className="text-xs text-gray-500">Free shipping on all your order</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Customer Support 24/7</h4>
              <p className="text-xs text-gray-500">Instant access to Support</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">100% Secure Payment</h4>
              <p className="text-xs text-gray-500">We ensure your money is save</p>
            </div>
          </div>
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
            3. POPULAR CATEGORIES SECTION (Screenshot 1)
            12 Categories with images from backend and local fallbacks
            ============================================================ */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Popular Categories
            </h2>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B207] hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayCategories.slice(0, 12).map((category, index) => {
              const isSelected =
                category.active ||
                category.name.toLowerCase().includes("fresh vegetable");
              const imgSrc = getCategoryImageUrl(category);

              return (
                <Link
                  key={category._id || index}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className={`group p-4 bg-white rounded-lg text-center border transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] ${
                    isSelected
                      ? "border-[#00B207] shadow-sm"
                      : "border-gray-100 hover:border-[#00B207] hover:shadow-md"
                  }`}
                >
                  <div className="w-20 h-20 mb-3 flex items-center justify-center overflow-hidden">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={category.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const clean = category.name
                            ?.toLowerCase()
                            .replace(/s$/, "")
                            .trim();
                          const fallback = localCategoryMap[clean];
                          if (
                            fallback &&
                            !e.target.src.endsWith(fallback)
                          ) {
                            e.target.src = fallback;
                          } else {
                            e.target.style.display = "none";
                          }
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
                      isSelected
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
            4. POPULAR PRODUCTS SECTION (Screenshots 1 & 2)
            10 cards in 2 rows of 5 with dynamic backend ratings and images
            ============================================================ */}
        <section className="mb-14">
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
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayProducts.slice(0, 10).map((product, index) =>
                renderProductCard(product, index === 2)
              )}
            </div>
          )}
        </section>

        {/* ============================================================
            5. THREE PROMO BANNERS ROW (Screenshot 2)
            1: Sale of the Month (Blue + Countdown)
            2: Low-Fat Meat (Dark)
            3: 100% Fresh Fruit (Yellow)
            ============================================================ */}
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

        {/* ============================================================
            6. HOT DEALS SECTION (Screenshot 2)
            Clean 5-column grid initially (Green Apple is standard size, not big initially).
            When the user hovers on ANY product card in this section, that card expands
            into the rich deal presentation with badges, actions, rating, and countdown!
            ============================================================ */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hot Deals
            </h2>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B207] hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayProducts.map((product) => renderHotDealCard(product))}
          </div>
        </section>

        {/* ============================================================
            7. WIDE SUMMER SALE BANNER (Screenshot 3)
            Full width dark banner with 37% OFF and summersale37%off.jpg background
            ============================================================ */}
        <section
          className="relative rounded-2xl overflow-hidden mb-14 bg-[#111A13] text-white p-8 sm:p-14 min-h-[280px] flex items-center justify-end bg-cover bg-center shadow-sm"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(17, 26, 19, 0.2), rgba(17, 26, 19, 0.9)), url('/summersale37%off.jpg')",
          }}
        >
          <div className="relative z-10 max-w-[460px] text-right sm:text-left">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-widest block mb-2">
              SUMMER SALE
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-3">
              <span className="text-[#FF8A00]">37%</span> OFF
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
              Free on all your order, Free Shipping and 30 days money-back guarantee
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

        {/* ============================================================
            8. FEATURED PRODUCTS SECTION (Screenshot 3)
            Row of 5 product cards with dynamic backend ratings and images
            ============================================================ */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B207] hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayProducts.slice(0, 5).map((product, index) =>
              renderProductCard(product, index === 2)
            )}
          </div>
        </section>

        {/* ============================================================
            9. LATEST NEWS SECTION (Screenshot 3)
            3 blog cards with date badges, metadata, titles, and links
            ============================================================ */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Latest News
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* News Card 1 */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
              <div className="relative h-56 bg-sky-100 overflow-hidden group">
                <img
                  src="/Image.png"
                  alt="Curabitur porttitor orci"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Date Badge */}
                <div className="absolute left-4 bottom-4 bg-white rounded-md px-3 py-1.5 text-center shadow">
                  <span className="block text-lg font-bold text-gray-900 leading-none">
                    18
                  </span>
                  <span className="block text-[10px] font-semibold uppercase text-gray-400 mt-0.5">
                    NOV
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} className="text-gray-400" />
                      <span>Food</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" />
                      <span>By Admin</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-gray-400" />
                      <span>65 Comments</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 hover:text-[#00B207] transition-colors mb-4 line-clamp-2 leading-snug">
                    Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.
                  </h3>
                </div>
                <Link
                  to="#"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
                >
                  <span>Read More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* News Card 2 */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
              <div className="relative h-56 bg-amber-50 overflow-hidden group">
                <img
                  src="/Image-1.png"
                  alt="Eget lobortis lorem lacinia"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Date Badge */}
                <div className="absolute left-4 bottom-4 bg-white rounded-md px-3 py-1.5 text-center shadow">
                  <span className="block text-lg font-bold text-gray-900 leading-none">
                    29
                  </span>
                  <span className="block text-[10px] font-semibold uppercase text-gray-400 mt-0.5">
                    JAN
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} className="text-gray-400" />
                      <span>Food</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" />
                      <span>By Admin</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-gray-400" />
                      <span>65 Comments</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 hover:text-[#00B207] transition-colors mb-4 line-clamp-2 leading-snug">
                    Eget lobortis lorem lacinia. Vivamus pharetra semper.
                  </h3>
                </div>
                <Link
                  to="#"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
                >
                  <span>Read More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* News Card 3 */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
              <div className="relative h-56 bg-emerald-50 overflow-hidden group">
                <img
                  src="/Image-2.png"
                  alt="Maecenas blandit risus"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Date Badge */}
                <div className="absolute left-4 bottom-4 bg-white rounded-md px-3 py-1.5 text-center shadow">
                  <span className="block text-lg font-bold text-gray-900 leading-none">
                    21
                  </span>
                  <span className="block text-[10px] font-semibold uppercase text-gray-400 mt-0.5">
                    FEB
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} className="text-gray-400" />
                      <span>Food</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" />
                      <span>By Admin</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-gray-400" />
                      <span>65 Comments</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 hover:text-[#00B207] transition-colors mb-4 line-clamp-2 leading-snug">
                    Maecenas blandit risus elementum mauris malesuada.
                  </h3>
                </div>
                <Link
                  to="#"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
                >
                  <span>Read More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          10. CLIENT TESTIMONIALS SECTION (Screenshot 3)
          Full-width light gray background (#F7F7F7)
          ============================================================ */}
      <section className="bg-[#F7F7F7] py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Client Testimonials
            </h2>
            {/* Arrow Navigation */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-[#00B207] text-white flex items-center justify-center hover:bg-[#009606] transition shadow-sm"
                aria-label="Next testimonial"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <span className="text-[#00B207] text-4xl font-serif leading-none block mb-3">
                    “
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {item.feedback}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm"
                      onError={(e) => {
                        const fallbackMap = {
                          "robert fox": "/Robert.png",
                          "dianne russell": "/Dennie.png",
                          "eleanor pena": "/eleanor.png",
                        };
                        const fb = fallbackMap[item.name?.toLowerCase().trim()];
                        if (fb && !e.target.src.endsWith(fb)) {
                          e.target.src = fb;
                        }
                      }}
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {item.role || "Customer"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#FF8A00] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < (item.rating || 5) ? "#FF8A00" : "none"}
                        color="#FF8A00"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          11. PARTNER BRANDS STRIP (Screenshot 3)
          ============================================================ */}
      <div className="border-b border-gray-100 bg-white py-6 sm:py-8">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <img
            src="/above follow us on insta.png"
            alt="Partner Brands"
            className="w-full max-w-[1320px] h-auto object-contain"
          />
        </div>
      </div>

      {/* ============================================================
          12. FOLLOW US ON INSTAGRAM (Screenshot 4)
          6 square images
          ============================================================ */}
      <section className="py-14 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Follow us on Instagram
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
            {[
              { id: "01", src: "/Instagram Post-01.png", alt: "Instagram Post 1" },
              { id: "02", src: "/Instagram Post-02.png", alt: "Instagram Post 2" },
              { id: "03", src: "/Instagram Post-03.png", alt: "Instagram Post 3" },
              { id: "04", src: "/Instagram Post-04.png", alt: "Instagram Post 4" },
              { id: "05", src: "/Instagram Post-05.png", alt: "Instagram Post 5" },
              { id: "06", src: "/Instagram Post-06.png", alt: "Instagram Post 6" },
            ].map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer shadow-xs border border-gray-100"
              >
                <img
                  src={post.src}
                  alt={post.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = `/Instagram Post-${post.id.replace(/^0+/, "")}.png`;
                  }}
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
                  <div className="w-10 h-10 rounded-xl border border-white/80 bg-black/30 backdrop-blur-[2px] flex items-center justify-center text-white shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          13. SUBSCRIBE OUR NEWSLETTER BAR (Screenshot 4)
          Full-width light gray background (#F7F7F7) directly flush above footer
          ============================================================ */}
      <section className="bg-[#F7F7F7] py-10 border-t border-gray-100">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Content */}
            <div className="text-center lg:text-left max-w-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Subscribe our Newsletter
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.
              </p>
            </div>

            {/* Right: Email Input + Social Icons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to our newsletter!");
                }}
                className="relative flex items-center w-full sm:w-[440px]"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-6 pr-32 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-[#00B207] hover:bg-[#009606] text-white font-semibold text-sm px-7 py-2.5 rounded-full transition shadow"
                >
                  Subscribe
                </button>
              </form>

              {/* Social Icons */}
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#00B207] text-white flex items-center justify-center hover:bg-[#009606] transition shadow-sm"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#00B207] text-gray-700 hover:text-white border border-gray-200 hover:border-[#00B207] flex items-center justify-center transition shadow-sm"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#00B207] text-gray-700 hover:text-white border border-gray-200 hover:border-[#00B207] flex items-center justify-center transition shadow-sm"
                  aria-label="Pinterest"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.268-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#00B207] text-gray-700 hover:text-white border border-gray-200 hover:border-[#00B207] flex items-center justify-center transition shadow-sm"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
