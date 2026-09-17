import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Loader } from "lucide-react";
import PageBanner from "../Components/PageBanner";
import apimethods from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apimethods
      .getApi("/get-category")
      .then((data) => {
        if (data?.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.warn("Could not fetch categories:", err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-[#FCFCFC] font-sans pb-12">
      <PageBanner breadcrumbs={[{ label: "All Categories" }]} />
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Categories</h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse all {categories.length} product categories
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B207] hover:underline"
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={36} className="text-[#00B207] animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">No categories found.</p>
            <p className="text-sm mt-2">Add categories from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category._id || index}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group p-5 bg-white rounded-2xl text-center border border-gray-100 transition-all duration-200 flex flex-col items-center justify-center min-h-[170px] hover:border-[#00B207] hover:shadow-lg"
              >
                {/* Category Image */}
                <div className="w-20 h-20 mb-3 flex items-center justify-center overflow-hidden">
                  {/* =========================================================
                     IMAGE PLACEHOLDER
                     Required image: Category image for "{category.name}"
                     Upload the category image via the admin panel.
                     The image URL comes from category.image (fetched from backend).
                     ========================================================= */}
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-200"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform duration-200">
                      {category.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00B207] transition-colors leading-snug">
                  {category.name}
                </span>

                {/* Shop Now arrow on hover */}
                <span className="mt-2 text-[11px] text-[#00B207] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  Shop Now <ArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
