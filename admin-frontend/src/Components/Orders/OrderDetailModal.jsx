export default function OrderDetailModal({ selectedOrder, onClose }) {
  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Order Details #{String(selectedOrder._id).slice(-6).toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Customer Info</span>
              <p className="font-semibold text-slate-900">{selectedOrder.userName || selectedOrder.customerName || "Customer"}</p>
              <p className="text-slate-600">{selectedOrder.userEmail || selectedOrder.customerEmail || "N/A"}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Shipping Address</span>
              <p className="text-slate-700">{selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.address || "Standard Address"}</p>
              <p className="text-slate-600">
                {selectedOrder.shippingAddress?.city} {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-3">Purchased Items</h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-sm hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded-lg border border-slate-100 p-1"
                        onError={(e) => { e.target.src = "/GreenCapsicum.png"; }}
                      />
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium text-slate-900">${Number(selectedOrder.subtotal || selectedOrder.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Discount:</span>
              <span className="font-medium text-slate-900">${Number(selectedOrder.discount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping:</span>
              <span className="font-medium text-slate-900">{selectedOrder.shipping === 0 ? "Free" : `$${selectedOrder.shipping || 0}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Amount:</span>
              <span className="text-[#019D3E] text-base">${Number(selectedOrder.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
