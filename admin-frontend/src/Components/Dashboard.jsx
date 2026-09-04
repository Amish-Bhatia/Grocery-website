import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Products", value: "—", description: "Products in your store", icon: "📦" },
  { label: "Total Orders", value: "—", description: "Orders received", icon: "🛒" },
  { label: "Customers", value: "—", description: "Registered customers", icon: "👥" },
  { label: "Staff Members", value: "—", description: "Admin staff", icon: "👤" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back 👋</h2>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">{stat.icon}</div>

            </div>

            <p className="mt-4 text-xs text-slate-400">{stat.description}</p>

          </div>
        ))}

      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="font-semibold text-slate-900">Quick Actions</h3>

          <p className="mt-1 text-sm text-slate-500">Manage your store quickly.</p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <button type="button" onClick={() => navigate("/dashboard/staff")} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50">
              <p className="font-medium text-slate-800">Manage Staff</p>
              <p className="mt-1 text-xs text-slate-500">Add or edit staff members</p>
            </button>

            <button type="button" onClick={() => navigate("/dashboard/categories")} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50">
              <p className="font-medium text-slate-800">Manage Categories</p>
              <p className="mt-1 text-xs text-slate-500">Organize product categories</p>
            </button>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="font-semibold text-slate-900">System Status</h3>

          <p className="mt-1 text-sm text-slate-500">Your admin panel is ready.</p>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">

            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>

            <div>
              <p className="text-sm font-semibold text-emerald-800">System Online</p>
              <p className="text-xs text-emerald-700">Admin dashboard is connected.</p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}