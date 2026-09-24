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
  FileText,
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

  // 2. STATE: Track whether data is currently being fetched
  const [loading, setLoading] = useState(true);

  // Helper function to fetch dashboard data from backend API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apimethods.getApi("/dashboard-stats");
      if (response && response.stats) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      path: "/dashboard/orders",
    },
    {
      label: "Customers",
      value: stats.totalCustomers,
      description: "Registered customer accounts",
      icon: Users,
      path: "/dashboard/orders",
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
      path: "/dashboard/orders",
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
          QUICK ACTIONS SECTION (Full Width Grid)
          ============================================================ */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Direct shortcuts to manage all store operations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Manage Orders */}
          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
            className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E] group-hover:bg-white shadow-2xs">
                <ShoppingCart size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Manage Orders
                </p>
                <p className="text-[11px] text-slate-400">View & update delivery status</p>
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
            className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E] group-hover:bg-white shadow-2xs">
                <Tags size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
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
            className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E] group-hover:bg-white shadow-2xs">
                <UserCog size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Manage Staff
                </p>
                <p className="text-[11px] text-slate-400">Staff accounts & permissions</p>
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
            className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E] group-hover:bg-white shadow-2xs">
                <HelpCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
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
            className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E] group-hover:bg-white shadow-2xs">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
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

          {/* Manage Content */}
          <button
            type="button"
            onClick={() => navigate("/dashboard/content")}
            className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E] group-hover:bg-white shadow-2xs">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Store Content
                </p>
                <p className="text-[11px] text-slate-400">Terms, privacy & legal policies</p>
              </div>
            </div>
            <ArrowRight
              size={16}
              className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
            />
          </button>
        </div>
      </section>
    </div>
  );
}