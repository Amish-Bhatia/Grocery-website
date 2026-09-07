import { useState } from "react";

import Swal from "sweetalert2";

import { ArrowLeft, UserPlus } from "lucide-react";

import { useNavigate } from "react-router-dom";

import apimethods from "../../Methods/ApiClient";


const emptyForm = {
  name: "",
  email: "",
  password: "",
};


export default function AddEdit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(false);


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

      await Swal.fire({
        title: "Staff Added Successfully",
        text: `${formData.name} has been added to the staff list.`,
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });

      setFormData(emptyForm);

      navigate("/dashboard/staff");
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Failed to Add Staff",
        text: error.message || "Unable to add staff member.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/staff")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#019D3E]"
          >

            <ArrowLeft size={16} />

            Back to Staff

          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Add Staff
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a new staff account for your admin panel.
          </p>

        </div>

      </section>


      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]">

              <UserPlus size={21} />

            </div>

            <div>

              <h2 className="font-semibold text-slate-900">
                Staff Information
              </h2>

              <p className="text-sm text-slate-500">
                Enter the details for the new staff member.
              </p>

            </div>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8"
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <label
                htmlFor="staff-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <input
                id="staff-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter staff name"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

            </div>


            <div>

              <label
                htmlFor="staff-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="staff-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

            </div>


            <div className="md:col-span-2">

              <label
                htmlFor="staff-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="staff-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Password must contain at least 6 characters.
              </p>

            </div>

          </div>


          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/dashboard/staff")}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <UserPlus size={17} />

              {loading ? "Adding Staff..." : "Add Staff"}

            </button>

          </div>

        </form>

      </section>

    </div>
  );
}