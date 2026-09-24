import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import debounce from "lodash.debounce";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import PageBanner from "../Components/PageBanner";
import apimethods from "../services/api";
import ShopSidebar from "../Components/Shop/ShopSidebar";
import ShopProductCard from "../Components/Shop/ShopProductCard";

export default function Shop() {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("category") || "all";
  const searchKeyword = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchKeyword);
  const [debouncedQuery, setDebouncedQuery] = useState(searchKeyword);
  const [sortBy, setSortBy] = useState("latest");

  const { minPriceLimit, maxPriceLimit } = useMemo(() => {
    if (!products || products.length === 0) return { minPriceLimit: 0, maxPriceLimit: 100 };
    const prices = products.map((p) => Number(p.price) || 0);
    return {
      minPriceLimit: Math.floor(Math.min(...prices)),
      maxPriceLimit: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [maxPrice, setMaxPrice] = useState(100);

  useEffect(() => {
    if (products.length > 0) {
      const highest = Math.ceil(Math.max(...products.map((p) => Number(p.price) || 0)));
      setMaxPrice(highest);
    }
  }, [products]);

  useEffect(() => {
    apimethods
      .getApi("/get-category")
      .then((data) => {
        if (data?.categories) setCategories(data.categories);
      })
      .catch(() => {});

    apimethods
      .getApi("/get-products")
      .then((data) => {
        if (data?.products && data.products.length > 0) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const query = (debouncedQuery || "").trim().toLowerCase();
    return products
      .filter((item) => {
        const matchesCat =
          selectedCategory === "all" ||
          (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
        const matchesSearch = !query || (item.name && item.name.toLowerCase().includes(query));
        const matchesPrice = Number(item.price) <= maxPrice;
        return matchesCat && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, debouncedQuery, sortBy, maxPrice]);

  const handleCategorySelect = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    setSearchParams(params);
  };

  useEffect(() => {
    if (searchKeyword !== debouncedQuery) {
      setLocalSearch(searchKeyword);
      setDebouncedQuery(searchKeyword);
    }
  }, [searchKeyword]);

  const debouncedSetSearch = useRef(
    debounce((value) => {
      setDebouncedQuery(value);
      const params = new URLSearchParams(window.location.search);
      if (value && value.trim()) params.set("search", value.trim());
      else params.delete("search");
      navigate(`?${params.toString()}`, { replace: true });
    }, 250)
  ).current;

  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedSetSearch.cancel();
    setDebouncedQuery(localSearch);
    const params = new URLSearchParams(window.location.search);
    if (localSearch.trim()) params.set("search", localSearch.trim());
    else params.delete("search");
    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <div className="w-full bg-[#FCFCFC] font-sans pb-12">
      <PageBanner
        breadcrumbs={[
          { label: "Shop", path: selectedCategory !== "all" ? "/shop" : null },
          ...(selectedCategory !== "all" ? [{ label: selectedCategory }] : []),
        ]}
      />
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedCategory !== "all" ? selectedCategory : "Shop Catalog"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Showing {filteredProducts.length} products</p>
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

        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#00B207] bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-[#00B207] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#009606] transition cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ShopSidebar
            categories={categories}
            products={products}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            minPriceLimit={minPriceLimit}
            maxPriceLimit={maxPriceLimit}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
          />

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
                <p className="text-sm text-gray-500 mt-1">Try clearing your search query or selecting a different category.</p>
                <button
                  type="button"
                  onClick={() => {
                    debouncedSetSearch.cancel();
                    setLocalSearch("");
                    setDebouncedQuery("");
                    const params = new URLSearchParams(searchParams);
                    params.delete("category");
                    params.delete("search");
                    setSearchParams(params);
                  }}
                  className="mt-4 inline-block bg-[#00B207] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#009606] transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ShopProductCard
                    key={product._id}
                    product={product}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
