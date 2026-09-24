import { RefreshCw, Eye, CheckCircle, Clock, Truck, XCircle, Package } from "lucide-react";

export const getStatusBadge = (status) => {
  const s = String(status || "pending").toLowerCase();
  if (s === "delivered" || s === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle size={12} /> Delivered
      </span>
    );
  }
  if (s === "on the way" || s === "shipped") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        <Truck size={12} /> On the way
      </span>
    );
  }
  if (s === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock size={12} /> Processing
      </span>
    );
  }
  if (s === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
        <XCircle size={12} /> Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      <Clock size={12} /> Pending
    </span>
  );
};

export default function OrderTable({
  orders,
  loading,
  updatingId,
  onStatusChange,
  onSelectOrder,
}) {
  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2">
        <RefreshCw size={24} className="animate-spin text-[#019D3E]" />
        <span>Loading orders from database...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">
        <Package size={40} className="mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-700">No orders found</p>
        <p className="text-xs text-slate-400 mt-1">No orders matched your current criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3.5">Order ID</th>
            <th className="px-6 py-3.5">Customer</th>
            <th className="px-6 py-3.5">Date</th>
            <th className="px-6 py-3.5">Items</th>
            <th className="px-6 py-3.5">Total</th>
            <th className="px-6 py-3.5">Payment</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5">Update Status</th>
            <th className="px-6 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {orders.map((order) => {
            const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || (order.items?.length || 0);
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : "Recently";
            const isUpdating = updatingId === order._id;

            return (
              <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                  #{String(order._id).slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{order.userName || order.customerName || "Customer"}</div>
                  <div className="text-xs text-slate-400">{order.userEmail || order.customerEmail || "N/A"}</div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{dateStr}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                  ${Number(order.total || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-xs whitespace-nowrap">
                  <span className="font-medium text-slate-800 uppercase block">{order.paymentMethod || "COD"}</span>
                  <span className={`text-[10px] font-semibold ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                    {order.paymentStatus || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status?.toLowerCase() || "pending"}
                    disabled={isUpdating}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-[#019D3E] transition cursor-pointer disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="on the way">On the way</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSelectOrder(order)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#019D3E] hover:text-[#00491B] hover:underline transition cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
