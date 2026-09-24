import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  RefreshCw,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function AccountSidebar({ activeTab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00B207",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been safely signed out.",
          timer: 1300,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/account/dashboard",
      isActive:
        activeTab === "dashboard" ||
        location.pathname === "/account/dashboard" ||
        location.pathname === "/dashboard" ||
        location.pathname === "/account",
    },
    {
      id: "order-history",
      label: "Order History",
      icon: RefreshCw,
      path: "/account/order-history",
      isActive:
        activeTab === "order-history" ||
        location.pathname.startsWith("/account/order") ||
        location.pathname === "/order-history" ||
        location.pathname.startsWith("/order/"),
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      path: "/wishlist",
      isActive: location.pathname === "/wishlist",
    },
    {
      id: "cart",
      label: "Shopping Cart",
      icon: ShoppingBag,
      path: "/cart",
      isActive: location.pathname === "/cart",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/account/settings",
      isActive:
        activeTab === "settings" ||
        location.pathname === "/account/settings" ||
        location.pathname === "/settings",
    },
  ];

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
            Navigation
          </h2>
        </div>

        <nav className="flex flex-col py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3.5 px-6 py-3.5 text-sm transition-all duration-150 ${
                  active
                    ? "bg-[#EDF2EE] text-gray-900 font-semibold border-l-[3.5px] border-[#00B207]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 border-l-[3.5px] border-transparent"
                }`}
              >
                <Icon
                  size={19}
                  className={`transition-colors shrink-0 ${
                    active ? "text-[#00B207]" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-3.5 text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 border-l-[3.5px] border-transparent transition-all duration-150 w-full text-left cursor-pointer mt-1 border-t border-gray-50"
          >
            <LogOut size={19} className="text-gray-400 hover:text-rose-500 shrink-0" />
            <span>Log-out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
