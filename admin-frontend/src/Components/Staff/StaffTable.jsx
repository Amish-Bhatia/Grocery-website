import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";

export default function StaffTable({ staff, viewingId, deletingId, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left">
        <thead className="border-b border-slate-100 bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Staff Member</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {staff.map((member) => (
            <tr key={member._id} className="transition hover:bg-slate-50">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-[#019D3E]">{member.name?.charAt(0).toUpperCase() || "S"}</div>
                  <div><p className="text-sm font-medium text-slate-800">{member.name || "Unnamed Staff"}</p><p className="text-xs text-slate-400">Staff member</p></div>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{member.email || "-"}</td>
              <td className="px-5 py-4"><span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">{member.role || "staff"}</span></td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <IconButton title="View staff" disabled={viewingId === member._id} onClick={() => onView(member._id)}>
                    {viewingId === member._id ? <Loader2 size={17} className="animate-spin" /> : <Eye size={17} />}
                  </IconButton>
                  <IconButton title="Edit staff" onClick={() => onEdit(member._id)} className="hover:bg-emerald-50 hover:text-[#019D3E]"><Pencil size={17} /></IconButton>
                  <IconButton title="Delete staff" disabled={deletingId === member._id} onClick={() => onDelete(member._id)} className="hover:bg-red-50 hover:text-red-600">
                    {deletingId === member._id ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IconButton({ children, className = "hover:bg-blue-50 hover:text-blue-600", ...props }) {
  return <button type="button" className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}