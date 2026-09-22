import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({
  products = [],
  onAddToCart,
  isWishlisted,
  toggleWishlist,
}) {
  return (
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
        {products.slice(0, 5).map((product, index) => (
          <ProductCard
            key={product._id || index}
            product={product}
            isSelected={index === 2}
            onAddToCart={onAddToCart}
            isWishlisted={isWishlisted}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}
