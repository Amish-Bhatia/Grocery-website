import { useEffect, useState } from "react";

import {
  UserPlus,
  Pencil,
  Trash2,
  Users,
  Loader2,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import apimethods from "../../Methods/ApiClient";


export default function Staff() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [viewingId, setViewingId] = useState(null);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const [error, setError] = useState("");


  const fetchStaff = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await apimethods.getApi("/get-staff");

      setStaff(data.staffs || data.staff || []);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to load staff members."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStaff();
  }, []);


  const handleView = async (id) => {
    try {
      setViewingId(id);

      setError("");

      const data = await apimethods.getApi(`/get-staff/${id}`);

      setSelectedStaff(
        data.staff ||
        data.staffs ||
        data
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to load staff member."
      );
    } finally {
      setViewingId(null);
    }
  };


  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError("");

      await apimethods.deleteApi(
        `/delete-staff/${id}`
      );

      setStaff((currentStaff) =>
        currentStaff.filter(
          (member) => member._id !== id
        )
      );

      if (selectedStaff?._id === id) {
        setSelectedStaff(null);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to delete staff member."
      );
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Staff
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the staff members who have access to your admin panel.
          </p>

        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/staff/add")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37]"
        >

          <UserPlus size={18} />

          Add Staff

        </button>

      </section>


      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchStaff}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >

            <RefreshCw size={15} />

            Retry

          </button>

        </div>
      )}


      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]">

              <Users size={20} />

            </div>

            <div>

              <h2 className="text-sm font-semibold text-slate-900">
                Staff Members
              </h2>

              <p className="text-xs text-slate-500">
                {staff.length} member{staff.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={fetchStaff}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh staff"
          >

            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

          </button>

        </div>


        {loading ? (
          <div className="flex min-h-64 items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-slate-500">

              <Loader2
                size={20}
                className="animate-spin text-[#019D3E]"
              />

              Loading staff members...

            </div>

          </div>
        ) : staff.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#019D3E]">

              <Users size={25} />

            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No staff members found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Add your first staff member to give someone access to the admin panel.
            </p>

            <button
              type="button"
              onClick={() => navigate("/dashboard/staff/add")}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#008d37]"
            >

              <UserPlus size={17} />

              Add Staff

            </button>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead className="border-b border-slate-100 bg-slate-50">

                <tr>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Staff Member
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {staff.map((member) => (

                  <tr
                    key={member._id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-[#019D3E]">

                          {member.name
                            ?.charAt(0)
                            .toUpperCase() || "S"}

                        </div>

                        <div>

                          <p className="text-sm font-medium text-slate-800">
                            {member.name || "Unnamed Staff"}
                          </p>

                          <p className="text-xs text-slate-400">
                            Staff member
                          </p>

                        </div>

                      </div>

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-600">
                      {member.email || "—"}
                    </td>


                    <td className="px-5 py-4">

                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">
                        {member.role || "staff"}
                      </span>

                    </td>


                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => handleView(member._id)}
                          disabled={viewingId === member._id}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="View staff"
                        >

                          {viewingId === member._id ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Eye size={17} />
                          )}

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/dashboard/staff/edit/${member._id}`
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-[#019D3E]"
                          title="Edit staff"
                        >

                          <Pencil size={17} />

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(member._id)
                          }
                          disabled={deletingId === member._id}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete staff"
                        >

                          {deletingId === member._id ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>


      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Staff Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Staff account information
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                title="Close"
              >

                <X size={19} />

              </button>

            </div>


            <div className="space-y-5 p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-lg font-semibold text-[#019D3E]">

                  {selectedStaff.name
                    ?.charAt(0)
                    .toUpperCase() || "S"}

                </div>

                <div>

                  <p className="text-lg font-semibold text-slate-900">
                    {selectedStaff.name || "Unnamed Staff"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Staff Member
                  </p>

                </div>

              </div>


              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                <div className="space-y-4">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedStaff.name || "—"}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedStaff.email || "—"}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Role
                    </p>

                    <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">
                      {selectedStaff.role || "staff"}
                    </span>

                  </div>


                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Status
                    </p>

                    <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {selectedStaff.status || "Active"}
                    </span>

                  </div>

                </div>

              </div>


              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="w-full rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008d37]"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}