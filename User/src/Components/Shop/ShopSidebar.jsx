import { Filter } from "lucide-react";

export default function ShopSidebar({
  categories = [],
  products = [],
  selectedCategory = "all",
  onCategorySelect,
  minPriceLimit = 0,
  maxPriceLimit = 100,
  maxPrice = 100,
  onPriceChange,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
      <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold text-base border-b pb-3">
        <Filter size={18} color="#00B207" />
        <span>Categories</span>
      </div>

      <ul className="flex flex-col gap-1.5">
        <li>
          <button
            type="button"
            onClick={() => onCategorySelect("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium flex items-center justify-between ${
              selectedCategory === "all" ? "bg-emerald-50 text-[#00B207] font-semibold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>All Categories</span>
            <span className="text-xs text-gray-400">({products.length})</span>
          </button>
        </li>

        {categories.map((cat) => {
          const count = products.filter(
            (p) => p.category && p.category.toLowerCase() === cat.name.toLowerCase()
          ).length;
          return (
            <li key={cat._id || cat.name}>
              <button
                type="button"
                onClick={() => onCategorySelect(cat.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium flex items-center justify-between ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? "bg-emerald-50 text-[#00B207] font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400">({count})</span>
              </button>
            </li>
          );
        })}
      </ul>

      <hr className="my-4 border-gray-200" />

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">Price</h3>
          <span className="text-xs font-semibold text-[#00B207]">
            ${minPriceLimit} — ${maxPrice}
          </span>
        </div>

        <input
          type="range"
          min={minPriceLimit}
          max={maxPriceLimit}
          step="1"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00B207]"
        />

        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>${minPriceLimit}</span>
          <span>${maxPriceLimit}</span>
        </div>
      </div>
    </div>
  );
}
