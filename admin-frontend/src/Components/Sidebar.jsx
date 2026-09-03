import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Products",
    path: "/products",
  },
  {
    label: "Orders",
    path: "/orders",
  },
  {
    label: "Customers",
    path: "/customers",
  },
  {
    label: "Categories",
    path: "/categories",
  },
  {
    label: "Staff",
    path: "/staff",
  },
  {
    label: "Settings",
    path: "/settings",
  },
];

const GridIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="currentColor"
  >
    <rect x="0" y="0" width="6" height="6" rx="1" />
    <rect x="8" y="0" width="6" height="6" rx="1" />
    <rect x="0" y="8" width="6" height="6" rx="1" />
    <rect x="8" y="8" width="6" height="6" rx="1" />
  </svg>
);

const Sidebar = ({ collapsed, setCollapsed }) => {

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`relative flex h-screen flex-col border-r border-gray-200 bg-white px-4 py-6 transition-all duration-200 ${
        collapsed ? "w-[76px]" : "w-[240px]"
      }`}
    >

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8e6b48] shadow-md"
      >
        {collapsed ? ">" : "<"}
      </button>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img src="/Logo.svg" alt="Logo" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">

        {navItems.map((item) => {

          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-[13px] transition-colors ${
                isActive
                  ? "bg-gray-200 font-semibold text-black"
                  : "font-bold text-[#5c3d21]/80 hover:border-l-2 hover:border-[#00491B] hover:bg-gradient-to-r hover:from-[#019D3E] hover:to-[#00491B] hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >

              <GridIcon />

              {!collapsed && (
                <span>{item.label}</span>
              )}

            </button>
          );
        })}

      </nav>

    </div>
  );
};

export default Sidebar;
