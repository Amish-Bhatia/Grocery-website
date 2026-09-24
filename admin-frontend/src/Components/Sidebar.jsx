import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  UserCog,
  Settings,
  FileText,
  HelpCircle,
  MessageSquare,
  Ticket,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Products",
    path: "/dashboard/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "Coupons",
    path: "/dashboard/coupons",
    icon: Ticket,
  },
  {
    label: "Customers",
    path: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "Categories",
    path: "/dashboard/categories",
    icon: Tags,
  },
  {
    label: "Staff",
    path: "/dashboard/staff",
    icon: UserCog,
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "FAQs",
    path: "/dashboard/faqs",
    icon: HelpCircle,
  },
  {
    label: "Content",
    path: "/dashboard/content",
    icon: FileText,
  },
  {
    label: "Testimonials",
    path: "/dashboard/testimonials",
    icon: MessageSquare,
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-slate-200 bg-white transition-all duration-300 lg:block ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="relative flex h-16 items-center border-b border-slate-100 px-5">
        <div>
          {!collapsed ? (
            <img
              src="/Logo.svg"
              alt="Grocery Admin"
              className="h-8 w-auto"
            />
          ) : (
            <img
              src="/plant.svg"
              alt="Grocery Admin"
              className="h-8 w-auto"
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-emerald-700 cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <ChevronLeft size={15} />
          )}
        </button>
      </div>

      <nav className="space-y-1.5 px-3 py-5 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={`group flex h-11 items-center rounded-lg text-sm font-medium transition ${
                collapsed ? "justify-center px-0" : "gap-3 px-3"
              } ${
                isItemActive
                  ? "bg-linear-to-r from-[#019D3E] to-[#00491B] text-white shadow-sm"
                  : "text-slate-500 hover:bg-linear-to-r hover:from-[#019D3E] hover:to-[#00491B] hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={19}
                strokeWidth={2}
                className="shrink-0"
              />

              {!collapsed && (
                <span className="truncate">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}      