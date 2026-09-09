import { useEffect, useState } from "react";
import { Loader2, RefreshCw, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import apimethods from "../../Methods/ApiClient";
import EmptyState from "../Common/EmptyState";
import ErrorAlert from "../Common/ErrorAlert";
import PageHeader from "../Common/PageHeader";
import StaffDetails from "./StaffDetails";
import StaffTable from "./StaffTable";

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
    } catch (requestError) {
      setError(requestError.message || "Unable to load staff members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const viewStaff = async (id) => {
    try {
      setViewingId(id);
      setError("");
      const data = await apimethods.getApi(`/get-staff/${id}`);
      setSelectedStaff(data.staffMember || data.staff || data.staffs || data);
    } catch (requestError) {
      setError(requestError.message || "Unable to load staff member.");
    } finally {
      setViewingId(null);
    }
  };

  const deleteStaff = async (id) => {
    const result = await Swal.fire({
      title: "Delete staff member?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      setError("");
      await apimethods.deleteApi(`/delete-staff/${id}`);
      setStaff((current) => current.filter((member) => member._id !== id));
      if (selectedStaff?._id === id) setSelectedStaff(null);
      await Swal.fire({
        title: "Deleted",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to delete staff member.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Staff"
        description="Manage the staff members who have access to your admin panel."
        action={<button type="button" onClick={() => navigate("/dashboard/staff/add")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37]"><UserPlus size={18} />Add Staff</button>}
      />
      <ErrorAlert message={error} onRetry={fetchStaff} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]"><Users size={20} /></div>
            <div><h2 className="text-sm font-semibold text-slate-900">Staff Members</h2><p className="text-xs text-slate-500">{staff.length} member{staff.length !== 1 ? "s" : ""}</p></div>
          </div>
          <button type="button" onClick={fetchStaff} disabled={loading} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50" title="Refresh staff"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /></button>
        </header>

        {loading ? <Loading /> : staff.length ? (
          <StaffTable staff={staff} viewingId={viewingId} deletingId={deletingId} onView={viewStaff} onEdit={(id) => navigate(`/dashboard/staff/edit/${id}`)} onDelete={deleteStaff} />
        ) : (
          <EmptyState icon={Users} title="No staff members found" description="Add your first staff member to give someone access to the admin panel.">
            <button type="button" onClick={() => navigate("/dashboard/staff/add")} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#008d37]"><UserPlus size={17} />Add Staff</button>
          </EmptyState>
        )}
      </section>

      {selectedStaff && <StaffDetails staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </div>
  );
}

function Loading() {
  return <div className="flex min-h-64 items-center justify-center"><div className="flex items-center gap-3 text-sm text-slate-500"><Loader2 size={20} className="animate-spin text-[#019D3E]" />Loading staff members...</div></div>;
}
