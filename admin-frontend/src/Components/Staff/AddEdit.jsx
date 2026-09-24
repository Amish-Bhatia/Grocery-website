import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import apimethods from "../../Methods/ApiClient";
import PermissionsGrid from "./PermissionsGrid";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  permissions: {
    products: { read: false, edit: false, delete: false },
    categories: { read: false, create: false, edit: false, delete: false },
    orders: { read: false, edit: false, delete: false },
    customers: { read: false, edit: false, delete: false },
  },
};

export default function AddEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const loadStaff = async () => {
      setLoading(true);
      try {
        const data = await apimethods.getApi(`/get-staff/${id}`);
        const staffMember = data.staffMember || data.staff || data;

        setFormData({
          name: staffMember.name || "",
          email: staffMember.email || "",
          phone: staffMember.phone || "",
          password: "",
          permissions: {
            products: {
              read: Boolean(staffMember.permissions?.products?.read),
              edit: Boolean(staffMember.permissions?.products?.edit),
              delete: Boolean(staffMember.permissions?.products?.delete),
            },
            categories: {
              read: Boolean(staffMember.permissions?.categories?.read),
              create: Boolean(staffMember.permissions?.categories?.create),
              edit: Boolean(staffMember.permissions?.categories?.edit),
              delete: Boolean(staffMember.permissions?.categories?.delete),
            },
            orders: {
              read: Boolean(staffMember.permissions?.orders?.read),
              edit: Boolean(staffMember.permissions?.orders?.edit),
              delete: Boolean(staffMember.permissions?.orders?.delete),
            },
            customers: {
              read: Boolean(staffMember.permissions?.customers?.read),
              edit: Boolean(staffMember.permissions?.customers?.edit),
              delete: Boolean(staffMember.permissions?.customers?.delete),
            },
          },
        });
      } catch (error) {
        console.error(error);
        await Swal.fire({
          title: "Unable to Load Staff",
          text: error.message || "Unable to load staff member.",
          icon: "error",
        });
        navigate("/dashboard/staff");
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePermissionChange = (e) => {
    const { name, checked, dataset } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [dataset.section]: {
          ...prev.permissions[dataset.section],
          [name]: checked,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        permissions: formData.permissions,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing) {
        await apimethods.putApi(`/update-staff/${id}`, payload);
      } else {
        await apimethods.postApi("/add-staff", { ...payload, password: formData.password });
      }

      await Swal.fire({
        title: isEditing ? "Staff Updated Successfully" : "Staff Added Successfully",
        text: `${formData.name} has been ${isEditing ? "updated" : "added to the"} staff list.`,
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });

      setFormData(emptyForm);
      navigate("/dashboard/staff");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: isEditing ? "Failed to Update Staff" : "Failed to Add Staff",
        text: error.message || `Unable to ${isEditing ? "update" : "add"} staff member.`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/staff")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#019D3E] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Staff</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isEditing ? "Edit Staff" : "Add Staff"}</h1>
          <p className="mt-1 text-sm text-slate-500">{isEditing ? "Update the staff account details." : "Create a new staff account."}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]">
            <UserPlus size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Staff Information</h2>
            <p className="text-sm text-slate-500">{isEditing ? "Update details for this staff member." : "Enter details for new staff member."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="staff-name" className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input id="staff-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter staff name" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>

            <div>
              <label htmlFor="staff-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input id="staff-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>

            <div>
              <label htmlFor="staff-phone" className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input id="staff-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="staff-password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
                  required={!isEditing}
                  minLength={isEditing && !formData.password ? undefined : 6}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700 cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">{isEditing ? "Leave blank to keep current password." : "Password must contain at least 6 characters."}</p>
            </div>
          </div>

          <PermissionsGrid permissions={formData.permissions} onPermissionChange={handlePermissionChange} />

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate("/dashboard/staff")} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37] disabled:opacity-60 cursor-pointer">
              <UserPlus size={17} />
              {loading ? `${isEditing ? "Updating" : "Adding"} Staff...` : isEditing ? "Update Staff" : "Add Staff"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}