import { useState } from "react";
import { ChevronDown, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ShopSidebar({
  categories = [],
  products = [],
  selectedCategory = "all",
  onCategorySelect,
  minPriceLimit = 0,
  maxPriceLimit = 100,
  maxPrice = 100,
  onPriceChange,
  // selectedRating = 0,
  // onRatingChange,
  // selectedTag = "",
  // onTagSelect,
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);

  const tags = [
    "Healthy",
    "Low fat",
    "Vegetarian",
    "Kid foods",
    "Vitamins",
    "Bread",
    "Meat",
    "Snacks",
    "Tiffin",
    "Launch",
    "Dinner",
    "Breackfast",
    "Fruit",
  ];

  const ratings = [
    { stars: 5, label: "5.0" },
    { stars: 4, label: "4.0 & up" },
    { stars: 3, label: "3.0 & up" },
    { stars: 2, label: "2.0 & up" },
    { stars: 1, label: "1.0 & up" },
  ];

  const saleProducts = products.slice(0, 3).map((p) => ({
    id: p._id || p.id,
    name: p.name,
    image: p.image || "/GreenCapsicum.png",
    price: p.price,
    originalPrice: p.originalPrice || (Number(p.price) * 1.2).toFixed(2),
    rating: p.rating || 5,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* 1. All Categories */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <button
          type="button"
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="w-full flex items-center justify-between text-base font-bold text-gray-900 pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>All Categories</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 text-gray-500 ${categoriesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {categoriesOpen && (
          <ul className="flex flex-col gap-2 mt-4 text-sm">
            <li>
              <button
                type="button"
                onClick={() => onCategorySelect("all")}
                className={`w-full text-left py-1 flex items-center justify-between transition cursor-pointer ${
                  selectedCategory === "all" ? "text-[#00B207] font-bold" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedCategory === "all" ? "border-[#00B207] bg-[#00B207]" : "border-gray-300"
                    }`}
                  >
                    {selectedCategory === "all" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>All Products</span>
                </div>
                <span className="text-xs text-gray-400">({products.length})</span>
              </button>
            </li>

            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.category && p.category.toLowerCase() === cat.name.toLowerCase()
              ).length;
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <li key={cat._id || cat.name}>
                  <button
                    type="button"
                    onClick={() => onCategorySelect(cat.name)}
                    className={`w-full text-left py-1 flex items-center justify-between transition cursor-pointer ${
                      isSelected ? "text-[#00B207] font-bold" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-[#00B207] bg-[#00B207]" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">({count})</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 2. Price Filter */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between text-base font-bold text-gray-900 pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>Price</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 text-gray-500 ${priceOpen ? "rotate-180" : ""}`}
          />
        </button>

        {priceOpen && (
          <div className="mt-4">
            <input
              type="range"
              min={minPriceLimit}
              max={maxPriceLimit}
              step="1"
              value={maxPrice}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00B207]"
            />
            <p className="mt-2 text-xs font-semibold text-gray-700">
              Price: <span className="text-gray-900 font-bold">₹{minPriceLimit} — ₹{maxPrice}</span>
            </p>
          </div>
        )}
      </div>

      {/* 3. Rating Filter */}
      {/* <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <button
          type="button"
          onClick={() => setRatingOpen(!ratingOpen)}
          className="w-full flex items-center justify-between text-base font-bold text-gray-900 pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>Rating</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 text-gray-500 ${ratingOpen ? "rotate-180" : ""}`}
          />
        </button>

        {ratingOpen && (
          <div className="flex flex-col gap-2 mt-4 text-xs">
            {ratings.map((r) => {
              const isChecked = selectedRating === r.stars;
              return (
                <button
                  key={r.stars}
                  type="button"
                  onClick={() => onRatingChange && onRatingChange(isChecked ? 0 : r.stars)}
                  className="flex items-center gap-2.5 py-1 text-left cursor-pointer hover:text-gray-900"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="w-4 h-4 rounded border-gray-300 text-[#00B207] focus:ring-[#00B207]"
                  />
                  <div className="flex text-[#FF8A00] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < r.stars ? "#FF8A00" : "none"}
                        color={i < r.stars ? "#FF8A00" : "#D1D5DB"}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium">{r.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div> */}

      {/* 4. Popular Tags */}
      {/* <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <button
          type="button"
          onClick={() => setTagsOpen(!tagsOpen)}
          className="w-full flex items-center justify-between text-base font-bold text-gray-900 pb-3 border-b border-gray-100 cursor-pointer"
        >
          <span>Popular Tag</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 text-gray-500 ${tagsOpen ? "rotate-180" : ""}`}
          />
        </button>

        {tagsOpen && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => {
              const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagSelect && onTagSelect(isSelected ? "" : tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-[#00B207] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div> */}

      {/* 5. 79% Discount Promo Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-center text-gray-900 bg-linear-to-b from-amber-50 to-orange-100 border border-amber-200">
        <span className="text-2xl sm:text-3xl font-black text-gray-900 block">
          79% <span className="text-base font-bold font-normal">Discount</span>
        </span>
        <span className="text-xs text-gray-600 block mt-0.5 mb-3">on your first order</span>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B207] hover:underline"
        >
          <span>Shop Now</span>
          <ArrowRight size={13} />
        </Link>
        <img
          src="/100%FreshFruit.png"
          alt="Discount veggies"
          className="mt-4 mx-auto max-h-32 object-contain"
          onError={(e) => { e.target.src = "/banner.jpg"; }}
        />
      </div>

      {/* 6. Sale Products Widget */}
      {saleProducts.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 mb-3">
            Sale Products
          </h3>
          <div className="divide-y divide-gray-100">
            {saleProducts.map((sp) => (
              <Link
                key={sp.id}
                to={`/product/${sp.id}`}
                className="py-3 flex items-center gap-3 hover:bg-gray-50/80 rounded-lg transition p-1.5"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                  <img src={sp.image} alt={sp.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-gray-800 truncate">{sp.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mt-0.5">
                    <span>₹{Number(sp.price).toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400 line-through font-normal">
                      ₹{Number(sp.originalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex text-[#FF8A00] gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="#FF8A00" color="#FF8A00" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
