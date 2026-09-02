import { useState } from "react";

const navItems = [
  { label: "Dashboard" },
  { label: "Products" },
  { label: "Orders" },
  { label: "Customers" },
  { label: "Categories" },
  { label: "Settings" },
];

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <rect x="0" y="0" width="6" height="6" rx="1" />
    <rect x="8" y="0" width="6" height="6" rx="1" />
    <rect x="0" y="8" width="6" height="6" rx="1" />
    <rect x="8" y="8" width="6" height="6" rx="1" /> 
  </svg>
);

const Sidebar = ({ collapsed, setCollapsed, activeItem, setActiveItem }) => {
  return (
    <div
      className={`relative flex h-screen flex-col bg-white border-r border-gray-550 px-4 py-6 transition-all duration-200 ${
        collapsed ? "w-[76px]" : "w-[240px]"
      }`}
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8e6b48] shadow-md"
      >
        {collapsed ? ">" : "<"}
      </button>

      <div className="mb-8 flex flex-col items-center">
          <img src="Logo.svg" alt="Logo" />
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-[13px] transition-colors ${
                isActive
                  ? "bg-white font-semibold text-[#8e6b48] bg-[#00491B]"
                  : "text-[#5c3d21]/80 font-bold hover:bg-linear-to-r from-[#019D3E] to-[#00491B] hover:border-l-2 hover:font-bold hover:border-[#00491B] hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}>
              <GridIcon />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;