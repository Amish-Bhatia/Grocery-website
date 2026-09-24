import { useNavigate } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  cartCount = 0,
  cartTotal = 0,
  onRemoveItem,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50 transition-opacity duration-300 animate-fadeIn" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Shopping Cart</span>
              <span className="text-[#00B207]">({cartCount})</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close Shopping Cart"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-600">Your shopping cart is empty.</p>
                <button
                  type="button"
                  onClick={() => { onClose(); navigate("/shop"); }}
                  className="mt-4 inline-block text-xs font-semibold text-[#00B207] hover:underline"
                >
                  Start Shopping &rarr;
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-3 first:pt-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-1">
                      <img
                        src={item.image || "/greenApple.png"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = "/greenApple.png"; }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.quantity} {item.unit || "kg"} x <span className="font-semibold text-gray-900">${Number(item.price).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="w-6 h-6 rounded-full border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    title="Remove from cart"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                <span className="text-gray-500 font-normal">{cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}</span>
                <span className="text-lg font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => { onClose(); navigate("/checkout"); }}
                className="w-full bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-semibold text-sm transition-colors text-center shadow-xs cursor-pointer"
              >
                Checkout
              </button>

              <button
                type="button"
                onClick={() => { onClose(); navigate("/cart"); }}
                className="w-full bg-[#EBF7EB] hover:bg-[#d8edd8] text-[#00B207] py-3.5 rounded-full font-semibold text-sm transition-colors text-center cursor-pointer"
              >
                Go To Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
