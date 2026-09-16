import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const shippingCost = cartItems.length > 0 ? (cartTotal > 50 ? 0 : 5.0) : 0;
  const orderTotal = cartTotal + shippingCost;

  return (
    <div className="w-full bg-[#FCFCFC] py-10 font-[sans-serif]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {cartItems.length} unique items in your basket
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Your cart is currently empty</h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Looks like you haven't added any fresh groceries to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#00B207] text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#009606] transition shadow-sm"
            >
              <ArrowLeft size={16} />
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Cart Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-xs uppercase text-gray-400 font-semibold pb-3">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3 text-center">Quantity</th>
                      <th className="pb-3 text-right">Subtotal</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="text-sm text-gray-800">
                        <td className="py-4 flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg bg-emerald-50 shrink-0 flex items-center justify-center overflow-hidden">
                            {/* USER_IMAGE_SLOT: Cart Item Thumbnail (Line 61) */}
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = "none"; }} />
                            ) : (
                              <span className="font-bold text-[#00B207]">{item.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 block">{item.name}</span>
                            <span className="text-xs text-gray-400">{item.category}</span>
                          </div>
                        </td>
                        <td className="py-4 font-semibold text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="py-4">
                          <div className="flex items-center justify-center border border-gray-200 rounded-lg w-24 mx-auto overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-right font-bold text-[#00B207]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#00B207]"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Shop</span>
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Right 1 Col: Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b">Cart Summary</h3>

              <div className="flex flex-col gap-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0 ? (
                      <span className="text-[#00B207]">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                {cartTotal < 50 && (
                  <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded">
                    Add ${(50 - cartTotal).toFixed(2)} more to qualify for Free Shipping!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-lg text-[#00B207]">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => 
                      await Swal.fire({
                        title: "Order Placed",
                        text: data.message || "Checkout complete! Thank you for ordering from Ecobazar.",
                        icon: "success",
                        confirmButtonColor: "#019D3E",
                        customClass: {
                confirmButton: "bg-[#00B207] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#009606] transition"
            }
                      })}
              >
                <CheckCircle2 size={18} />
                <span>Proceed to Checkout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
