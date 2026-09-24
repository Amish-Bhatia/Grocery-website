export default function CartSummary({
  cartTotal = 0,
  appliedCoupon = null,
  discountPercent = 0,
  discountAmount = 0,
  cartFinalTotal = 0,
  couponCode = "",
  setCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Coupon Code Card */}
      <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 sm:p-7 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-4">Coupon Code</h3>

        {appliedCoupon ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#00B207]">{appliedCoupon.code}</span>
                <span className="bg-emerald-100 text-[#00B207] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{appliedCoupon.discountPercent}% discount applied to your cart!</p>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={onApplyCoupon} className="relative flex items-center">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code (e.g. SAVE20, WELCOME10)"
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
              Try <span className="font-mono font-bold text-gray-600">SAVE20</span> or <span className="font-mono font-bold text-gray-600">WELCOME10</span>.
            </p>
          </div>
        )}
      </div>

      {/* Cart Total Card */}
      <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 sm:p-7 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Cart Total</h3>
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
                <span className="text-xs text-gray-400 line-through block font-normal">${cartTotal.toFixed(2)}</span>
              )}
              <span className="text-lg font-bold text-gray-900">${cartFinalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onProceedToCheckout}
          className="w-full mt-6 bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-semibold text-sm transition-colors text-center shadow-xs cursor-pointer"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
