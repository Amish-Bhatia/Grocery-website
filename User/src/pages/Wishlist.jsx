import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, Heart, Check, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import { getProductPricing } from "../Components/Home/constants";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import apimethods from "../services/api";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default seed products matching Figma Screenshot 2
  const defaultWishlistProducts = [
    {
      _id: "seed-capsicum",
      id: "seed-capsicum",
      name: "Green Capsicum",
      price: 14.99,
      originalPrice: 20.99,
      stock: 55,
      image: "/GreenCapsicum.png",
    },
    {
      _id: "seed-cabbage",
      id: "seed-cabbage",
      name: "Chinese Cabbage",
      price: 45.0,
      stock: 30,
      image: "/ChineseCabbage.png",
    },
    {
      _id: "seed-mango",
      id: "seed-mango",
      name: "Fresh Sujapur Mango",
      price: 9.0,
      stock: 0, // Out of Stock demonstration
      image: "/Surjapur Mango.png",
    },
  ];

  useEffect(() => {
    setLoading(true);
    apimethods
      .getApi("/get-products")
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          // If user has specific wishlisted items, filter them
          const wishlisted = data.products.filter(
            (p) => wishlist.includes(p._id) || wishlist.includes(p.id)
          );

          if (wishlisted.length > 0) {
            setProducts(wishlisted);
          } else if (wishlist.length === 0) {
            // Display default demo items matching Screenshot 2
            setProducts(defaultWishlistProducts);
          } else {
            setProducts([]);
          }
        } else {
          setProducts(defaultWishlistProducts);
        }
      })
      .catch(() => {
        setProducts(defaultWishlistProducts);
      })
      .finally(() => setLoading(false));
  }, [wishlist]);

  const handleAddToCart = (item) => {
    if (item.stock === 0) {
      Swal.fire({
        icon: "warning",
        title: "Out of Stock",
        text: `Sorry, "${item.name}" is currently out of stock.`,
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }

    const pricing = getProductPricing(item);
    addToCart({ ...item, price: pricing.price, originalPrice: pricing.originalPrice }, 1);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Added "${item.name}" to cart!`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleRemove = (item) => {
    const id = item._id || item.id;
    removeFromWishlist(id);
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
  };

  return (
    <div className="w-full bg-white font-sans min-h-screen flex flex-col justify-between">
      <div>
        {/* Breadcrumb Top Banner with Back Button */}
        <PageBanner breadcrumbs={[{ label: "Wishlist" }]} />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Centered Heading (Screenshot 2) */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            My Wishlist
          </h1>

          {/* Table Container */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            {products.length === 0 ? (
              <div className="py-20 text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Heart size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Your Wishlist is Empty
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Explore our fresh catalog and click the heart icon on any product to save it to your wishlist.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-[#009606] text-white px-7 py-3 rounded-full font-semibold text-sm transition shadow-sm"
                >
                  <span>Explore Products</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                      <th className="py-4 px-6 sm:px-8">Product</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Stock Status</th>
                      <th className="py-4 px-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((item) => {
                      const id = item._id || item.id;
                      const inStock = item.stock > 0;
                      return (
                        <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                          {/* Product Image + Title */}
                          <td className="py-5 px-6 sm:px-8">
                            <Link
                              to={`/product/${id}`}
                              className="flex items-center gap-4 group"
                            >
                              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center justify-center">
                                <img
                                  src={item.image || "/greenApple.png"}
                                  alt={item.name}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    e.target.src = "/greenApple.png";
                                  }}
                                />
                              </div>
                              <span className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#00B207] transition-colors">
                                {item.name}
                              </span>
                            </Link>
                          </td>

                          {/* Price */}
                          <td className="py-5 px-6 whitespace-nowrap">
                            {(() => {
                              const pricing = getProductPricing(item);
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm sm:text-base font-bold text-gray-900">
                                    ${pricing.price.toFixed(2)}
                                  </span>
                                  {pricing.originalPrice && pricing.originalPrice > pricing.price && (
                                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                                      ${pricing.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                          </td>

                          {/* Stock Status */}
                          <td className="py-5 px-6 whitespace-nowrap">
                            {inStock ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#00B207] border border-emerald-200">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                                Out of Stock
                              </span>
                            )}
                          </td>

                          {/* Actions: Add to Cart + Remove Button */}
                          <td className="py-5 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-3 sm:gap-4">
                              <button
                                type="button"
                                disabled={!inStock}
                                onClick={() => handleAddToCart(item)}
                                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                                  inStock
                                    ? "bg-[#00B207] hover:bg-[#009606] text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                Add to Cart
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemove(item)}
                                className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                                title="Remove from wishlist"
                                aria-label="Remove item"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Table Footer: Social Share (Screenshot 2) */}
                <div className="p-5 sm:p-6 border-t border-gray-200 bg-gray-50/50 flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Share:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-[#00B207] text-white flex items-center justify-center hover:bg-[#009606] transition shadow-xs"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.18 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                      </svg>
                    </a>
                    <a
                      href="https://pinterest.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition"
                      aria-label="Share on Pinterest"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition"
                      aria-label="Share on Instagram"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pre-Footer Newsletter */}
      <Newsletter />
    </div>
  );
}
