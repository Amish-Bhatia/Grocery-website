import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";

const emptyForm = {
  name: "",
  email: "",
  password: "",
};

export default function AddEdit({ showForm, setShowForm }) {
  const [formData, setFormData] = useState(emptyForm);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStaff = async () => {
    try {
      const data = await apimethods.getApi("/get-staff");

      setStaffList(data.staffs || []);
    } catch (error) {
      Swal.fire({
        title: "Failed to load staff",
        text: error.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await apimethods.postApi("/add-staff", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      await loadStaff();

      setFormData(emptyForm);

      setShowForm(false);

      Swal.fire({
        title: "Staff Added Successfully",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Failed to Add Staff",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id) => {
    const result = await Swal.fire({
      title: "Delete staff?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await apimethods.deleteApi(`/delete-staff/${id}`);

      await loadStaff();

      Swal.fire({
        title: "Deleted",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Delete failed",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div>

      {showForm && (
        <div className="mb-8 flex justify-center">

          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-slate-900">Add Staff</h3>
                <p className="mt-1 text-sm text-slate-500">Create a new staff account.</p>
              </div>

              <button type="button" onClick={() => setShowForm(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600">×</button>

            </div>

            <div className="mb-5">

              <label htmlFor="staff-name" className="mb-2 block text-sm font-medium text-slate-700">Name</label>

              <input id="staff-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter staff name" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />

            </div>

            <div className="mb-5">

              <label htmlFor="staff-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>

              <input id="staff-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />

            </div>

            <div className="mb-6">

              <label htmlFor="staff-password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>

              <input id="staff-password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />

            </div>

            <div className="flex gap-3">

              <button type="button" onClick={() => setShowForm(false)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>

              <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Saving..." : "Add Staff"}</button>

            </div>

          </form>

        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h3 className="font-semibold text-slate-900">Staff Members</h3>

          <p className="mt-1 text-sm text-slate-500">All staff accounts are listed below.</p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

              <tr>
                <th className="px-5 py-4 font-semibold">Name</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>

            </thead>

            <tbody>

              {staffList.length > 0 ? staffList.map((item) => (
                <tr key={item._id} className="border-t border-slate-100 transition hover:bg-slate-50">

                  <td className="px-5 py-4 font-medium text-slate-800">{item.name}</td>

                  <td className="px-5 py-4 text-slate-600">{item.email}</td>

                  <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{item.role || "staff"}</span></td>

                  <td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{item.status || "Active"}</span></td>

                  <td className="px-5 py-4 text-right"><button type="button" onClick={() => deleteStaff(item._id)} className="text-sm font-medium text-red-600 transition hover:text-red-800">Delete</button></td>

                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">No staff members found.</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}