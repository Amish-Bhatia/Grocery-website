import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import apimethods from "../services/api";
import Swal from "sweetalert2";

import {
  categoryOrder,
  figmaCategories,
  figmaProductOrder,
  figmaDefaultProducts,
  defaultClientTestimonials,
  dealTime,
  monthSaleTime,
  getProductImageUrl,
} from "../Components/Home/constants";

import HeroBanners from "../Components/Home/HeroBanners";
import FeatureHighlights from "../Components/Home/FeatureHighlights";
import PopularCategories from "../Components/Home/PopularCategories";
import PopularProducts from "../Components/Home/PopularProducts";
import PromoBanners from "../Components/Home/PromoBanners";
import HotDealsSection from "../Components/Home/HotDealsSection";
import WideSummerSaleBanner from "../Components/Home/WideSummerSaleBanner";
import FeaturedProducts from "../Components/Home/FeaturedProducts";
import LatestNews from "../Components/Home/LatestNews";
import ClientTestimonials from "../Components/Home/ClientTestimonials";
import PartnerBrands from "../Components/Home/PartnerBrands";
import InstagramFeed from "../Components/Home/InstagramFeed";
import HomeNewsletter from "../Components/Home/HomeNewsletter";

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [hoveredDealId, setHoveredDealId] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="w-full bg-white font-[sans-serif]">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
        {/* 1. HERO BANNERS SECTION */}
        <HeroBanners />

        {/* 2. FEATURE HIGHLIGHTS BAR */}
        <FeatureHighlights />

        {/* 3. POPULAR CATEGORIES SECTION */}
        <PopularCategories categories={displayCategories} />

        <PopularProducts
          products={displayProducts}
          loading={loading}
          onAddToCart={handleAddToCartWithFeedback}
          isWishlisted={isWishlisted}
          toggleWishlist={toggleWishlist}
        />

        <PromoBanners monthSaleTime={monthSaleTime} />

        <HotDealsSection
          products={displayProducts}
          hoveredDealId={hoveredDealId}
          setHoveredDealId={setHoveredDealId}
          onAddToCart={handleAddToCartWithFeedback}
          isWishlisted={isWishlisted}
          toggleWishlist={toggleWishlist}
          dealTime={dealTime}
        />

        <WideSummerSaleBanner />

        <FeaturedProducts
          products={displayProducts}
          onAddToCart={handleAddToCartWithFeedback}
          isWishlisted={isWishlisted}
          toggleWishlist={toggleWishlist}
        />

        <LatestNews />
      </div>

      <ClientTestimonials testimonials={displayTestimonials} />

      <PartnerBrands />

      <InstagramFeed />

      <HomeNewsletter />
    </div>
  );
}