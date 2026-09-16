import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingBag, Star, Filter, Heart, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import apimethods from "../services/api";

const defaultCatalog = [
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

export default function Shop() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("category") || "all";
  const searchKeyword = searchParams.get("search") || "";
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    // 1. Fetch categories
    apimethods
      .getApi("/get-category")
      .then((data) => {
        if (data?.categories) setCategories(data.categories);
      })
      .catch(() => {});

    // 2. Fetch products
    apimethods
      .getApi("/get-products")
      .then((data) => {
        if (data?.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(defaultCatalog);
        }
      })
      .catch(() => setProducts(defaultCatalog))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCat =
          selectedCategory === "all" ||
          (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
        const matchesSearch =
          !searchKeyword ||
          (item.name && item.name.toLowerCase().includes(searchKeyword.toLowerCase()));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, searchKeyword, sortBy]);

  const handleCategorySelect = (catName) => {
    const params = new URLSearchParams(searchParams);
    if (catName === "all") {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    setSearchParams(params);
  };

  return (
    <div className="w-full bg-[#FCFCFC] py-8 font-[sans-serif]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Breadcrumb / Title */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop Catalog</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {filteredProducts.length} fresh products
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-xs sm:text-sm rounded-lg px-3 py-2 outline-none focus:border-[#00B207]"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Categories Filter */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold text-base border-b pb-3">
              <Filter size={18} color="#00B207" />
              <span>Categories</span>
            </div>

            <ul className="flex flex-col gap-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategorySelect("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-emerald-50 text-[#00B207] font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-xs text-gray-400">({products.length})</span>
                </button>
              </li>

              {categories.map((cat) => (
                <li key={cat._id || cat.id || cat.name}>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? "bg-emerald-50 text-[#00B207] font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Area: Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try clearing your search query or selecting a different category.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategorySelect("all")}
                  className="mt-4 inline-block bg-[#00B207] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#009606] transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const prodImg = product.image || "";

                  return (
                    <div
                      key={product._id || product.id}
                      className="group relative bg-white rounded-xl p-4 border border-gray-100 hover:border-[#00B207] hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Badge & Actions */}
                      <div className="flex items-center justify-between w-full mb-2">
                        {product.discount > 0 ? (
                          <span className="bg-[#EA4B48] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                            Sale {product.discount}%
                          </span>
                        ) : (
                          <span />
                        )}

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#00B207] hover:text-white text-gray-600 flex items-center justify-center transition shadow-sm"
                            title="Wishlist"
                          >
                            <Heart size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Product Image Spot */}
                      {/* USER_IMAGE_SLOT: Shop Product Image (Line 204) */}
                      <div className="w-full h-36 flex items-center justify-center overflow-hidden my-2">
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
                          <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center font-bold text-lg">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <span className="text-[11px] text-gray-400 font-medium uppercase block mb-1">
                          {product.category || "Grocery"}
                        </span>
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-[#00B207] transition-colors mb-1.5">
                          {product.name}
                        </h4>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-bold text-gray-900">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ${Number(product.originalPrice).toFixed(2)}
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
                            onClick={() => addToCart(product, 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#00B207] text-gray-700 hover:text-white flex items-center justify-center transition shadow-sm"
                            title="Add to Cart"
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
