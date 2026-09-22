import { useEffect, useState } from "react";
import { ArrowLeft, Check, Loader2, Pencil, Shield, User, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";

export default function StaffView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStaffMember = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apimethods.getApi(`/get-staff/${id}`);
        const member = data.staffMember || data.staff || data.staffs || data;
        if (member) {
          setStaff(member);
        } else {
          setError("Staff member not found.");
        }
      } catch (err) {
        console.error("Failed to load staff member:", err);
        setError(err.message || "Failed to load staff member.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMember();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={24} className="animate-spin text-[#019D3E]" />
          <span>Loading staff member profile...</span>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="w-full space-y-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard/staff")}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800 cursor-pointer"
        >
          <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
          <span>Back to Staff</span>
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-base font-semibold text-red-700">{error || "Staff member not found."}</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/staff")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return to Staff List
          </button>
        </div>
      </div>
    );
  }

  const permissionModules = [
    { key: "products", label: "Products", actions: ["read", "edit", "delete"] },
    { key: "categories", label: "Categories", actions: ["read", "create", "edit", "delete"] },
    { key: "orders", label: "Orders", actions: ["read", "edit", "delete"] },
    { key: "customers", label: "Customers", actions: ["read", "edit", "delete"] },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Navigation & Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/staff")}
            className="group mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800 cursor-pointer"
          >
            <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
            <span>Back to Staff</span>
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Staff Member Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View detailed staff information, account credentials, and assigned permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/staff/edit/${staff._id || id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#019D3E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37] cursor-pointer"
          >
            <Pencil size={17} />
            <span>Edit Staff</span>
          </button>
        </div>
      </section>

      {/* Main Profile Info Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-[#019D3E]">
              {staff.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{staff.name || "Unnamed Staff"}</h2>
              <p className="text-sm text-slate-500">{staff.email || "No email provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {staff.role || "staff"}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
              {staff.status || "Active"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 border-b border-slate-100">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</span>
            <p className="mt-1 text-base font-medium text-slate-800">{staff.name || "-"}</p>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</span>
            <p className="mt-1 text-base font-medium text-slate-800">{staff.email || "-"}</p>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Phone Number</span>
            <p className="mt-1 text-base font-medium text-slate-800">{staff.phone || "Not specified"}</p>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2.5">
            <Shield size={20} className="text-[#019D3E]" />
            <h3 className="text-base font-bold text-slate-900">Module Access & Permissions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {permissionModules.map((module) => {
              const modulePerms = staff.permissions?.[module.key] || {};

              return (
                <div
                  key={module.key}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                >
                  <h4 className="text-sm font-bold text-slate-800">{module.label}</h4>

                  <div className="space-y-2">
                    {module.actions.map((action) => {
                      const granted = Boolean(modulePerms[action]);

                      return (
                        <div
                          key={action}
                          className="flex items-center justify-between text-xs py-1"
                        >
                          <span className="capitalize text-slate-600 font-medium">{action}</span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              granted
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200/70 text-slate-500"
                            }`}
                          >
                            {granted ? <Check size={12} /> : <X size={12} />}
                            <span>{granted ? "Allowed" : "Denied"}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
