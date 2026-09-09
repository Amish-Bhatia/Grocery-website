import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "../Common/Modal";
import PageHeader from "../Common/PageHeader";

const STORAGE_KEY = "grocery-admin-faqs";
const initialFaqs = [
  { id: "1", question: "How do I place an order?", answer: "Browse the products, add your items to the cart, and complete checkout.", status: "Published" },
  { id: "2", question: "How can I track my delivery?", answer: "Your delivery status is available from your order details after checkout.", status: "Draft" },
];

function readFaqs() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(stored) ? stored : initialFaqs;
  } catch {
    return initialFaqs;
  }
}

export default function FAQs() {
  const [faqs, setFaqs] = useState(readFaqs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs)), [faqs]);

  const filteredFaqs = useMemo(() => faqs.filter((faq) => {
    const query = search.toLowerCase();
    const matchesSearch = faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
    return matchesSearch && (status === "all" || faq.status.toLowerCase() === status);
  }), [faqs, search, status]);

  const saveFaq = (faq) => {
    setFaqs((current) => faq.id
      ? current.map((item) => item.id === faq.id ? faq : item)
      : [{ ...faq, id: `${Date.now()}` }, ...current]);
    setEditing(null);
  };

  const deleteFaq = async (id) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setFaqs((current) => current.filter((faq) => faq.id !== id));
      await Swal.fire({
        title: "Deleted",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="FAQs"
        action={(
          <button
            type="button"
            onClick={() => setEditing({ question: "", answer: "", status: "Draft" })}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37]"
          >
            <Plus size={18} />
            Add FAQ
          </button>
        )}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex-1">
            <span className="sr-only">Search FAQs</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search FAQs" className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100" aria-label="Filter FAQs by status">
            <option value="all">All States</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {filteredFaqs.length ? <FaqTable faqs={filteredFaqs} onEdit={setEditing} onDelete={deleteFaq} /> : <div className="px-5 py-14 text-center text-sm text-slate-500">No FAQs match your search or filter.</div>}
      </section>

      {editing && <FaqModal faq={editing} onSave={saveFaq} onClose={() => setEditing(null)} />}
    </div>
  );
}

function FaqTable({ faqs, onEdit, onDelete }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-slate-100 bg-slate-50"><tr><th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Question</th><th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Answer</th><th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th><th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{faqs.map((faq) => <tr key={faq.id} className="transition hover:bg-slate-50"><td className="max-w-xs px-5 py-4 text-sm font-medium text-slate-800">{faq.question}</td><td className="max-w-md px-5 py-4 text-sm text-slate-600">{faq.answer}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${faq.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{faq.status}</span></td><td className="px-5 py-4"><div className="flex items-center justify-end gap-2"><IconButton title="Edit FAQ" onClick={() => onEdit(faq)} className="hover:bg-emerald-50 hover:text-[#019D3E]"><Pencil size={17} /></IconButton><IconButton title="Delete FAQ" onClick={() => onDelete(faq.id)} className="hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></IconButton></div></td></tr>)}</tbody></table></div>;
}

function IconButton({ children, className, ...props }) {
  return <button type="button" className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition ${className}`} {...props}>{children}</button>;
}

function FaqModal({ faq, onSave, onClose }) {
  const [form, setForm] = useState(faq);
  const isCreating = !faq.id;
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return <Modal title={isCreating ? "Add FAQ" : "Edit FAQ"} description={isCreating ? "Create a new frequently asked question." : "Update the question, answer, or publication status."} onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="space-y-4 px-6 py-5"><label className="block text-sm font-medium text-slate-700">Question<input required value={form.question} onChange={(event) => update("question", event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100" /></label><label className="block text-sm font-medium text-slate-700">Answer<textarea required rows="5" value={form.answer} onChange={(event) => update("answer", event.target.value)} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100" /></label><label className="block text-sm font-medium text-slate-700">Status<select value={form.status} onChange={(event) => update("status", event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100"><option>Published</option><option>Draft</option></select></label><div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008d37]">{isCreating ? "Create FAQ" : "Save changes"}</button></div></form></Modal>;
}