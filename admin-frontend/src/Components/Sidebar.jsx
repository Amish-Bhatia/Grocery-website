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
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";


const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/dashboard/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    path: "/customers",
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
    path: "/settings",
    icon: Settings,
  },
  {
    label: "FAQs",
    path: "/dashboard/faqs",
    icon: HelpCircle,
  },
  {
    label: "Terms & Conditions",
    path: "/dashboard/terms-conditions",
    icon: FileText,
  },
  {
    label: "Privacy Policy",
    path: "/dashboard/privacy-policy",
    icon: FileText,
  },
];


export default function Sidebar({ collapsed, setCollapsed }) {
  const [activeItem, setActiveItem] = useState("Dashboard");

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
          className="absolute -right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-emerald-700"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >

          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <ChevronLeft size={15} />
          )}

        </button>

      </div>


      <nav className="space-y-1.5 px-3 py-5">

        {navItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setActiveItem(item.label)}
              className={() =>
                `group flex h-11 items-center rounded-lg text-sm font-medium transition ${
                  collapsed
                    ? "justify-center px-0"
                    : "gap-3 px-3"
                } ${
                  activeItem === item.label
                    ? "bg-linear-to-r from-[#019D3E] to-[#00491B] text-white shadow-sm"
                    : "text-slate-500 hover:bg-linear-to-r hover:from-[#019D3E] hover:to-[#00491B] hover:text-white"
                }`
              }
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