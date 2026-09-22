import { useEffect, useMemo, useState, useCallback } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageHeader from "../Common/PageHeader";
import apimethods from "../../Methods/ApiClient";

export default function FAQs() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const loadFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apimethods.getApi("/get-faqs");
      if (data?.faqs && Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
      Swal.fire({
        icon: "error",
        title: "Error loading FAQs",
        text: err.message || "Could not fetch FAQs from server.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const query = search.toLowerCase();
      const matchesSearch =
        faq.question?.toLowerCase().includes(query) ||
        faq.answer?.toLowerCase().includes(query);
      return (
        matchesSearch &&
        (status === "all" || faq.status?.toLowerCase() === status.toLowerCase())
      );
    });
  }, [faqs, search, status]);

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
      try {
        await apimethods.deleteApi(`/delete-faq/${id}`);
        setFaqs((current) => current.filter((faq) => (faq._id || faq.id) !== id));
        await Swal.fire({
          title: "Deleted",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to delete FAQ",
          text: err.message || "An error occurred while deleting.",
        });
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions displayed on the storefront help center."
        action={(
          <button
            type="button"
            onClick={() => navigate("/dashboard/faqs/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37] cursor-pointer"
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
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search FAQs"
              className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100"
            aria-label="Filter FAQs by status"
          >
            <option value="all">All States</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="px-5 py-14 text-center text-sm text-slate-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#019D3E] mb-2" />
            <p>Loading FAQs from server...</p>
          </div>
        ) : filteredFaqs.length ? (
          <FaqTable
            faqs={filteredFaqs}
            onEdit={(faq) => navigate(`/dashboard/faqs/edit/${faq._id || faq.id}`)}
            onDelete={deleteFaq}
          />
        ) : (
          <div className="px-5 py-14 text-center text-sm text-slate-500">
            No FAQs match your search or filter.
          </div>
        )}
      </section>
    </div>
  );
}

function FaqTable({ faqs, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead className="border-b border-slate-100 bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Question
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Answer
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {faqs.map((faq) => {
            const id = faq._id || faq.id;
            return (
              <tr key={id} className="transition hover:bg-slate-50">
                <td className="w-1/3 px-5 py-4 text-sm font-medium text-slate-800">
                  {faq.question}
                </td>
                <td className="w-1/2 px-5 py-4 text-sm text-slate-600">
                  {faq.answer}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      faq.status === "Published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {faq.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <IconButton
                      title="Edit FAQ"
                      onClick={() => onEdit(faq)}
                      className="hover:bg-emerald-50 hover:text-[#019D3E] cursor-pointer"
                    >
                      <Pencil size={17} />
                    </IconButton>
                    <IconButton
                      title="Delete FAQ"
                      onClick={() => onDelete(id)}
                      className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={17} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IconButton({ children, className, ...props }) {
  return (
    <button
      type="button"
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}