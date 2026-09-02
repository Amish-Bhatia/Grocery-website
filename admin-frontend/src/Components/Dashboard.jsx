import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

  const Dashboard = ({ setIsAuthenticated }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f5f4f2]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-[22px] font-semibold text-[#333]">
               {activeItem === "Dashboard" ? "Dashboard" : activeItem}
            </h1>
            <button
              onClick={handleLogout}
              className="h-[36px] rounded-[6px] bg-[#00491B] px-4 text-[12px] font-semibold text-white hover:bg-[#019D3E]">
              Logout
            </button>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[130px] rounded-[12px] bg-[#dcdcdc]" />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="h-[210px] rounded-[12px] bg-[#dcdcdc]" />
            ))}
          </div>

          <div className="mt-5">
            <div className="h-[190px] rounded-[12px] bg-[#dcdcdc]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;