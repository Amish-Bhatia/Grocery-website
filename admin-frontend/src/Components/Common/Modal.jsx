import { X } from "lucide-react";

export default function Modal({ title, description, onClose, children, className = "max-w-md" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
      <div className={`w-full rounded-2xl border border-slate-200 bg-white shadow-2xl ${className}`}>
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Close"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}