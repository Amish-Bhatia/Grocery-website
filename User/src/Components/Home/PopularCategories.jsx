import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { localCategoryMap, getCategoryImageUrl } from "./constants";

export default function PopularCategories({ categories = [] }) {
  return (
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
        {categories.slice(0, 12).map((category, index) => {
          const imgSrc = getCategoryImageUrl(category);

          return (
            <Link
              key={category._id || index}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group p-4 bg-white rounded-lg text-center border border-gray-100 hover:border-[#00B207] hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center min-h-[160px]"
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
              <span className="text-sm font-medium transition-colors text-gray-800 group-hover:text-[#00B207]">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
