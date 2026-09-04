import { useLocation, useNavigate } from "react-router-dom";

const pageTitles = {
  "/dashboard": { title: "Dashboard", description: "Dashboard Page" },
  "/dashboard/staff": { title: "Staff", description: "Manage your store staff" },
  "/dashboard/categories": { title: "Categories", description: "Manage product categories" },
};

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const page = pageTitles[location.pathname] || pageTitles["/dashboard"];

  const adminName = localStorage.getItem("adminName") || "Amish Bhatia";

  const initials = adminName.split(" ").filter(Boolean).map((name) => name[0]).join("").slice(0, 2).toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="ml-12 lg:ml-0">
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">{page.title}</h1>
          <p className="hidden text-sm text-slate-500 sm:block">{page.description}</p>
        </div>

        <div className="flex items-center gap-3">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{adminName}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{initials || "A"}</div>

          <button type="button" onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">Logout</button>

        </div>

      </div>

    </header>
  );
}