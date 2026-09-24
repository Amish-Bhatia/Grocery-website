import React, { useState } from "react";
import { Lock, Smartphone, Wallet, CreditCard, ShieldCheck, Tag, X } from "lucide-react";
import Swal from "sweetalert2";

export default function OrderSummary({
  cartItems,
  cartTotal,
  paymentMethod,
  setPaymentMethod,
  isSubmitting,
  appliedCoupon,
  applyCoupon,
  removeCoupon,
  discountPercent,
  discountAmount,
  cartFinalTotal,
}) {
  const [couponInput, setCouponInput] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    if (res.success) {
      setCouponInput("");
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

  const finalAmount = cartFinalTotal ?? cartTotal;

  return (
    <div className="lg:col-span-5 xl:col-span-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>

        {/* Items List */}
        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-3 first:pt-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image || "/greenApple.png"}
                  alt={item.name}
                  className="w-12 h-12 object-contain rounded bg-gray-50 p-1 border border-gray-100 shrink-0"
                  onError={(e) => {
                    e.target.src = "/greenApple.png";
                  }}
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </h4>
                  <span className="text-xs text-gray-400">× {item.quantity}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Promo / Coupon Code Section */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          {appliedCoupon ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-[#00B207]" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-[#00B207]">
                      {appliedCoupon.code}
                    </span>
                    <span className="bg-emerald-100 text-[#00B207] text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                      -{appliedCoupon.discountPercent}%
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    Saved ${discountAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-gray-400 hover:text-red-500 p-1 transition cursor-pointer"
                title="Remove Coupon"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code (e.g. SAVE10)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#00B207]"
                />
                <button
                  type="button"
                  onClick={handleApply}
                  className="bg-gray-800 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-gray-400 pl-1">
                Have a coupon? Try <span className="font-mono text-gray-600 font-semibold">SAVE10</span> or <span className="font-mono text-gray-600 font-semibold">SAVE20</span>
              </p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 pt-4 mt-4 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-gray-900">
              ${cartTotal.toFixed(2)}
            </span>
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
              <span className="text-lg font-bold text-gray-900">
                ${finalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Radio Group */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-900">Payment Method</h4>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#00B207] font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <Lock size={11} /> 256-bit Encrypted
            </span>
          </div>

          <div className="space-y-3">
            {/* Razorpay */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                paymentMethod === "Razorpay"
                  ? "border-[#00B207] bg-emerald-50/40 shadow-xs"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-0.5 w-4 h-4 text-[#00B207] focus:ring-[#00B207]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Smartphone size={15} className="text-[#00B207]" />
                    Online Payment (Razorpay)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#00B207] bg-emerald-100 px-1.5 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  UPI (GPay, PhonePe, Paytm), Cards & NetBanking
                </p>
              </div>
            </label>

            {/* Cash on Delivery */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                paymentMethod === "Cash on Delivery"
                  ? "border-[#00B207] bg-emerald-50/40 shadow-xs"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-0.5 w-4 h-4 text-[#00B207] focus:ring-[#00B207]"
              />
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Wallet size={15} className="text-gray-600" />
                  Cash on Delivery (COD)
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pay in cash upon physical delivery
                </p>
              </div>
            </label>

            {/* Paypal */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                paymentMethod === "Paypal"
                  ? "border-[#00B207] bg-emerald-50/40 shadow-xs"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Paypal"
                checked={paymentMethod === "Paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-0.5 w-4 h-4 text-[#00B207] focus:ring-[#00B207]"
              />
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <CreditCard size={15} className="text-blue-600" />
                  PayPal
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pay safely via PayPal account
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          type="submit"
          disabled={isSubmitting || cartItems.length === 0}
          className="w-full mt-6 bg-[#00B207] hover:bg-[#009606] text-white py-4 rounded-full font-bold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          <Lock size={16} />
          <span>
            {isSubmitting
              ? "Connecting Gateway..."
              : paymentMethod === "Razorpay"
              ? `Pay $${finalAmount.toFixed(2)} with Razorpay`
              : paymentMethod === "Paypal"
              ? `Pay $${finalAmount.toFixed(2)} with PayPal`
              : "Place Order (Cash on Delivery)"}
          </span>
        </button>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck size={14} className="text-[#00B207]" />
          <span>Guaranteed safe checkout & SSL protection</span>
        </div>
      </div>
    </div>
  );
}
