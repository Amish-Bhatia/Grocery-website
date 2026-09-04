import { Outlet } from "react-router-dom";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <div className="min-h-screen lg:pl-64">

        <Topbar />

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}