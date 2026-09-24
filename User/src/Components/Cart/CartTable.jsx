import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import Swal from "sweetalert2";

export default function CartTable({
  cartItems = [],
  onQuantityChange,
  onRemoveItem,
}) {
  return (
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
                  <td className="py-5 px-6 sm:px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center justify-center">
                        <img
                          src={item.image || "/greenApple.png"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = "/greenApple.png"; }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900">{item.name}</h4>
                        {isAtMax && (
                          <span className="inline-block text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1">
                            Max limit reached ({maxStock} in stock)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-5 px-6 whitespace-nowrap text-sm sm:text-base font-semibold text-gray-900">
                    ${Number(item.price).toFixed(2)}
                  </td>

                  <td className="py-5 px-6 whitespace-nowrap">
                    <div className="inline-flex items-center border border-gray-200 rounded-full p-1 bg-white">
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item, -1)}
                        className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center font-semibold text-sm text-gray-900">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={isAtMax}
                        onClick={() => onQuantityChange(item, 1)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                          isAtMax ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-50 hover:bg-gray-100 text-gray-600 cursor-pointer"
                        }`}
                        title={isAtMax ? "Maximum stock reached" : "Increase quantity"}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </td>

                  <td className="py-5 px-6 whitespace-nowrap text-sm sm:text-base font-bold text-gray-900">
                    ${itemSubtotal.toFixed(2)}
                  </td>

                  <td className="py-5 px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
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

      <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
        <Link to="/shop" className="border border-gray-200 hover:bg-white text-gray-700 font-semibold px-6 py-2.5 rounded-full text-xs transition">
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
  );
}
