import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HotDealCard from "./HotDealCard";
import { dealTime as defaultDealTime } from "./constants";

export default function HotDealsSection({
  products = [],
  hoveredDealId,
  setHoveredDealId,
  onAddToCart,
  isWishlisted,
  toggleWishlist,
  dealTime = defaultDealTime,
}) {
  return (
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
        {products.map((product) => (
          <HotDealCard
            key={product._id}
            product={product}
            isHovered={hoveredDealId === product._id}
            onMouseEnter={() => setHoveredDealId(product._id)}
            onMouseLeave={() => setHoveredDealId(null)}
            onAddToCart={onAddToCart}
            isWishlisted={isWishlisted}
            toggleWishlist={toggleWishlist}
            dealTime={dealTime}
          />
        ))}
      </div>
    </section>
  );
}
