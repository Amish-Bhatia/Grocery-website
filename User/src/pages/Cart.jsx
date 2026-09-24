import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountPercent,
    discountAmount,
    cartFinalTotal,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("userToken");
    if (!isLoggedIn && !token) {
      Swal.fire({
        icon: "info",
        title: "Sign In Required",
        text: "Please sign in to your account to proceed to checkout.",
        confirmButtonText: "Sign In",
        confirmButtonColor: "#00B207",
      }).then(() => {
        navigate("/login?redirect=/checkout");
      });
      return;
    }
    navigate("/checkout");
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode);
    if (res.success) {
      setCouponCode("");
      Swal.fire({
        icon: "success",
        title: "Coupon Applied!",
        text: res.message,
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Invalid Coupon Code",
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    const maxStock = item.stock || 99;
    if (newQty < 1) {
      removeFromCart(item.id);
      return;
    }
    if (newQty > maxStock) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: `Limit reached! Only ${maxStock} in stock.`,
        timer: 1800,
        showConfirmButton: false,
      });
      return;
    }
    updateQuantity(item.id, newQty);
  };
  return (
    <div className="w-full bg-white font-sans min-h-screen flex flex-col justify-between">
      <div>
        <PageBanner breadcrumbs={[{ label: "Shopping Cart" }]} />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            My Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
              <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Looks like you haven't added any fresh groceries to your cart yet.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#00B207] hover:bg-[#009606] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition shadow-sm"
              >
                <span>Return to shop</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Cart Table Container */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                        <th className="py-4 px-6 sm:px-8">Product</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Quantity</th>
                        <th className="py-4 px-6">Subtotal</th>
                        <th className="py-4 px-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cartItems.map((item) => {
                        const itemSubtotal = item.price * item.quantity;
                        const maxStock = item.stock || 99;
                        const isAtMax = item.quantity >= maxStock;

                        return (
                          <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                            {/* Product */}
                            <td className="py-5 px-6 sm:px-8">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center justify-center">
                                  <img
                                    src={item.image || "/greenApple.png"}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.target.src = "/greenApple.png";
                                    }}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm sm:text-base text-gray-900">
                                    {item.name}
                                  </h4>
                                  {isAtMax && (
                                    <span className="inline-block text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1">
                                      Max limit reached ({maxStock} in stock)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-5 px-6 whitespace-nowrap text-sm sm:text-base font-semibold text-gray-900">
                              ${Number(item.price).toFixed(2)}
                            </td>

                            {/* Quantity Selector */}
                            <td className="py-5 px-6 whitespace-nowrap">
                              <div className="inline-flex items-center border border-gray-200 rounded-full p-1 bg-white">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item, -1)}
                                  className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition cursor-pointer"
                                  title="Decrease quantity"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-10 text-center font-semibold text-sm text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={isAtMax}
                                  onClick={() => handleQuantityChange(item, 1)}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                                    isAtMax
                                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 cursor-pointer"
                                  }`}
                                  title={isAtMax ? "Maximum stock reached" : "Increase quantity"}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </td>

                            {/* Subtotal */}
                            <td className="py-5 px-6 whitespace-nowrap text-sm sm:text-base font-bold text-gray-900">
                              ${itemSubtotal.toFixed(2)}
                            </td>

                            {/* Remove button */}
                            <td className="py-5 px-6 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <X size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Buttons directly under table (Screenshot 3) */}
                <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    to="/shop"
                    className="border border-gray-200 hover:bg-white text-gray-700 font-semibold px-6 py-2.5 rounded-full text-xs transition"
                  >
                    Return to shop
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Cart updated!",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    }}
                    className="border border-gray-200 hover:bg-white text-gray-700 font-semibold px-6 py-2.5 rounded-full text-xs transition cursor-pointer"
                  >
                    Update Cart
                  </button>
                </div>
              </div>

              {/* Bottom Row: Coupon Code (Left) + Cart Total (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Coupon Code Card */}
                <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 sm:p-7 shadow-xs">
                  <h3 className="text-base font-bold text-gray-900 mb-4">
                    Coupon Code
                  </h3>

                  {appliedCoupon ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#00B207]">
                            {appliedCoupon.code}
                          </span>
                          <span className="bg-emerald-100 text-[#00B207] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {appliedCoupon.discountPercent}% discount applied to your cart!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form onSubmit={handleApplyCoupon} className="relative flex items-center">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter code (e.g. SAVE10, SAVE20)"
                          className="w-full border border-gray-200 rounded-full py-3.5 pl-6 pr-36 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207]"
                        />
                        <button
                          type="submit"
                          className="absolute right-1.5 bg-[#333333] hover:bg-black text-white font-semibold text-xs px-6 py-2.5 rounded-full transition cursor-pointer"
                        >
                          Apply Coupon
                        </button>
                      </form>
                      <p className="text-[11px] text-gray-400 mt-2 pl-2">
                        Try <span className="font-mono font-bold text-gray-600">SAVE10</span> for 10% off or <span className="font-mono font-bold text-gray-600">SAVE20</span> for 20% off.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Cart Total Card */}
                <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 sm:p-7 shadow-xs">
                  <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    Cart Total
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-[#00B207] font-medium">
                        <span>Discount ({appliedCoupon.code} - {discountPercent}%):</span>
                        <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span className="font-semibold text-[#00B207]">Free</span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total:</span>
                      <div className="text-right">
                        {appliedCoupon && (
                          <span className="text-xs text-gray-400 line-through block font-normal">
                            ${cartTotal.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-gray-900">${cartFinalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Proceed to checkout button */}
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full mt-6 bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-semibold text-sm transition-colors text-center shadow-xs cursor-pointer"
                  >
                    Proceed to checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
