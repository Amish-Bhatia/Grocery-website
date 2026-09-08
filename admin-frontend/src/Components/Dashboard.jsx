import {
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Tags,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Total Products",
    value: "_",
    description: "Products in your store",
    icon: Package,
  },
  {
    label: "Total Orders",
    value: "_",
    description: "Orders received",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    value: "_",
    description: "Registered customers",
    icon: Users,
  },
  {
    label: "Staff Members",
    value: "_",
    description: "Admin staff",
    icon: UserCog,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <section>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back 
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your grocery store today.
        </p>

      </section>


      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                </div>


                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]">

                  <Icon
                    size={22}
                    strokeWidth={2}
                  />

                </div>

              </div>


              <p className="mt-4 text-xs text-slate-400">
                {stat.description}
              </p>

            </div>
          );

        })}

      </section>


      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>

            <h2 className="font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your store quickly.
            </p>

          </div>


          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <button
              type="button"
              onClick={() => navigate("/dashboard/staff")}
              className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-[#019D3E] group-hover:bg-white">

                  <UserCog size={19} />

                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
                />

              </div>


              <p className="mt-4 font-medium text-slate-800">
                Manage Staff
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Add or edit staff members
              </p>

            </button>


            <button
              type="button"
              onClick={() => navigate("/dashboard/categories")}
              className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-[#019D3E] group-hover:bg-white">

                  <Tags size={19} />

                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#019D3E]"
                />

              </div>


              <p className="mt-4 font-medium text-slate-800">
                Manage Categories
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Organize product categories
              </p>

            </button>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>

            <h2 className="font-semibold text-slate-900">
              System Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your admin panel is ready.
            </p>

          </div>


          <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">

              <CheckCircle2
                size={19}
                className="text-emerald-600"
              />

            </div>


            <div>

              <p className="text-sm font-semibold text-emerald-800">
                System Online
              </p>

              <p className="text-xs text-emerald-700">
                Admin dashboard is connected.
              </p>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}