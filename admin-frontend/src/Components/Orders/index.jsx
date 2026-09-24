import { useState, useEffect, useMemo, useCallback } from "react";
import { ShoppingCart, Search, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apimethods.getApi("/all-orders");
      if (response && Array.isArray(response.orders)) {
        setOrders(response.orders);
      } else {
        const dashRes = await apimethods.getApi("/dashboard-stats");
        if (dashRes && Array.isArray(dashRes.recentOrders)) {
          setOrders(dashRes.recentOrders);
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      Swal.fire({
        icon: "error",
        title: "Error Loading Orders",
        text: error?.message || "Could not retrieve orders from server.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await apimethods.putApi(`/update-order-status/${orderId}`, {
        status: newStatus,
      });

      if (response?.success || response?.order) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus.toLowerCase() } : ord))
        );

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus.toLowerCase() }));
        }

        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Order status changed to ${newStatus}`,
          timer: 1300,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error?.message || "Could not update order status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (order._id && order._id.toLowerCase().includes(q)) ||
        (order.userName && order.userName.toLowerCase().includes(q)) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(q)) ||
        (order.paymentMethod && order.paymentMethod.toLowerCase().includes(q));

      const matchStatus =
        statusFilter === "all" ||
        (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <ShoppingCart className="text-[#019D3E]" size={26} />
            Orders Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View customer orders, update delivery statuses, and track fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh Orders</span>
        </button>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or order ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#019D3E] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium outline-none focus:border-[#019D3E] transition"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="on the way">On the way</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-base">
            Orders List ({filteredOrders.length})
          </h3>
          <span className="text-xs font-medium text-[#019D3E] bg-emerald-50 px-3 py-1 rounded-full">
            Live Records
          </span>
        </div>

        <OrderTable
          orders={filteredOrders}
          loading={loading}
          updatingId={updatingId}
          onStatusChange={handleStatusChange}
          onSelectOrder={(order) => setSelectedOrder(order)}
        />
      </div>

      <OrderDetailModal selectedOrder={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
