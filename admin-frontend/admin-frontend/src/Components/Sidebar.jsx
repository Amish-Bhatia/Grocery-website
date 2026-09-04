import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "▦" },
  { label: "Products", path: "/products", icon: "□" },
  { label: "Orders", path: "/orders", icon: "☷" },
  { label: "Customers", path: "/customers", icon: "♙" },
  { label: "Categories", path: "/dashboard/categories", icon: "☰" },
  { label: "Staff", path: "/dashboard/staff", icon: "♧" },
  { label: "Settings", path: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}

      <button type="button" onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden">☰</button>

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>

        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <img src="/Logo.svg" alt="Grocery Admin" className="max-h-12 max-w-full object-contain" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Main navigation">

          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button key={item.label} type="button" onClick={() => handleNavigate(item.path)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                <span className="flex h-5 w-5 items-center justify-center text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Admin Panel</p>
            <p className="mt-1 text-sm font-medium text-slate-700">Grocery Store</p>
          </div>
        </div>

      </aside>
    </>
  );
}