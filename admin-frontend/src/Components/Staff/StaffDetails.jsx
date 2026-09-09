import Modal from "../Common/Modal";

export default function StaffDetails({ staff, onClose }) {
  return (
    <Modal title="Staff Details" description="Staff account information" onClose={onClose}>
      <div className="space-y-5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-lg font-semibold text-[#019D3E]">{staff.name?.charAt(0).toUpperCase() || "S"}</div>
          <div><p className="text-lg font-semibold text-slate-900">{staff.name || "Unnamed Staff"}</p><p className="text-sm text-slate-500">Staff Member</p></div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="space-y-4">
            <Detail label="Name">{staff.name || "-"}</Detail>
            <Detail label="Email">{staff.email || "-"}</Detail>
            <Detail label="Role" badge>{staff.role || "staff"}</Detail>
            <Detail label="Status" badge>{staff.status || "Active"}</Detail>
          </div>
        </div>
        <button type="button" onClick={onClose} className="w-full rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008d37]">Close</button>
      </div>
    </Modal>
  );
}

function Detail({ label, children, badge }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>{badge ? <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">{children}</span> : <p className="mt-1 text-sm font-medium text-slate-800">{children}</p>}</div>;
}