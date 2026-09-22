import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Tags,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import apimethods from "../Methods/ApiClient";

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. STATE: Store dashboard numbers from the backend
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalStaff: 0,
    totalCategories: 0,
    totalRevenue: 0,
  });

  // 2. STATE: Store the list of recent orders from the backend
  const [recentOrders, setRecentOrders] = useState([]);

  // 3. STATE: Track whether data is currently being fetched
  const [loading, setLoading] = useState(true);

  // Helper function to fetch dashboard data from backend API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Call backend route: GET /dashboard-stats
      const response = await apimethods.getApi("/dashboard-stats");

      if (response && response.stats) {
        setStats(response.stats);
      }
      if (response && Array.isArray(response.recentOrders)) {
        setRecentOrders(response.recentOrders);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run once when this Dashboard page opens
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Card items configuration with live data from stats state
  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      description: "Active products in catalog",
      icon: Package,
      path: "/dashboard/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      description: "Customer orders received",
      icon: ShoppingCart,
      path: "/dashboard",
    },
    {
      label: "Customers",
      value: stats.totalCustomers,
      description: "Registered customer accounts",
      icon: Users,
      path: "/dashboard",
    },
    {
      label: "Staff Members",
      value: stats.totalStaff,
      description: "Admin & staff accounts",
      icon: UserCog,
      path: "/dashboard/staff",
    },
    {
      label: "Total Revenue",
      value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`,
      description: "Gross revenue from orders",
      icon: DollarSign,
      path: "/dashboard",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      description: "Product categories created",
      icon: Tags,
      path: "/dashboard/categories",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* ============================================================
          HEADER: Welcome greeting & Refresh Button
          ============================================================ */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Live overview of your grocery store data, products, orders, and staff.
          </p>
        </div>

        {/* Refresh button to re-fetch live data from backend */}
        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </section>

      {/* ============================================================
          STATS GRID: Live counts fetched from backend
          ============================================================ */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              onClick={() => stat.path && navigate(stat.path)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {loading ? "..." : stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]">
                  <Icon size={22} strokeWidth={2} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* ============================================================
          TWO-COLUMN SECTION: Recent Orders (Left) + Quick Actions (Right)
          ============================================================ */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* RECENT ORDERS TABLE (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Orders</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest customer purchases from the store
              </p>
            </div>
            <span className="text-xs font-medium text-[#019D3E] bg-emerald-50 px-2.5 py-1 rounded-full">
              {recentOrders.length} Recent
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-400">
              Loading orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No orders received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentOrders.map((order) => {
                    const itemCount =
                      order.items?.reduce(
                        (sum, item) => sum + (item.quantity || 1),
                        0
                      ) || 0;
                    const dateStr = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Recently";

                    return (
                      <tr key={order._id} className="hover:bg-slate-50/60">
                        <td className="py-3 font-medium text-slate-900">
                          {order.userName || "Customer"}
                          <span className="block text-xs font-normal text-slate-400">
                            {order.userEmail}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-slate-500">
                          {dateStr}
                        </td>
                        <td className="py-3 text-xs text-slate-600">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </td>
                        <td className="py-3 font-semibold text-slate-900">
                          ${Number(order.total || 0).toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span className="inline-flex rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 text-xs font-medium capitalize">
                            {order.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS (1 Col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Quick Actions</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Direct shortcuts to manage sections
            </p>

            <div className="mt-5 space-y-3">
              {/* Manage Products */}
              <button
                type="button"
                onClick={() => navigate("/dashboard/products")}
                className="w-full group flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#019D3E] group-hover:bg-white">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Manage Products
                    </p>
                    <p className="text-[11px] text-slate-400">Add, edit prices & stock</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
                />
              </button>

              {/* Manage Categories */}
              <button
                type="button"
                onClick={() => navigate("/dashboard/categories")}
                className="w-full group flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#019D3E] group-hover:bg-white">
                    <Tags size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Manage Categories
                    </p>
                    <p className="text-[11px] text-slate-400">Organize store categories</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
                />
              </button>

              {/* Manage Staff */}
              <button
                type="button"
                onClick={() => navigate("/dashboard/staff")}
                className="w-full group flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#019D3E] group-hover:bg-white">
                    <UserCog size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Manage Staff
                    </p>
                    <p className="text-[11px] text-slate-400">Staff members & permissions</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
                />
              </button>

              {/* Manage FAQs */}
              <button
                type="button"
                onClick={() => navigate("/dashboard/faqs")}
                className="w-full group flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#019D3E] group-hover:bg-white">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Manage FAQs
                    </p>
                    <p className="text-[11px] text-slate-400">Add & edit support questions</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
                />
              </button>

              {/* Manage Testimonials */}
              <button
                type="button"
                onClick={() => navigate("/dashboard/testimonials")}
                className="w-full group flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#019D3E] group-hover:bg-white">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Manage Reviews
                    </p>
                    <p className="text-[11px] text-slate-400">Customer testimonials</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}