import { useEffect, useState } from "react";
import { ArrowLeft, HelpCircle, Loader2, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";

const defaultForm = {
  question: "",
  answer: "",
  status: "Published",
  order: 1,
};

export default function FaqAddEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const fetchFaq = async () => {
      try {
        setLoading(true);
        const data = await apimethods.getApi(`/get-faq/${id}`);
        if (data?.faq) {
          setFormData({
            question: data.faq.question || "",
            answer: data.faq.answer || "",
            status: data.faq.status || "Published",
            order: data.faq.order !== undefined ? data.faq.order : 1,
          });
        }
      } catch (err) {
        console.error("Failed to load FAQ:", err);
        Swal.fire({
          icon: "error",
          title: "Error loading FAQ",
          text: err.message || "Could not retrieve the FAQ details.",
        });
        navigate("/dashboard/faqs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill in both the question and answer.",
      });
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await apimethods.putApi(`/update-faq/${id}`, formData);
        await Swal.fire({
          icon: "success",
          title: "FAQ Updated",
          text: "The frequently asked question has been updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await apimethods.postApi("/add-faq", formData);
        await Swal.fire({
          icon: "success",
          title: "FAQ Created",
          text: "The frequently asked question has been added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      navigate("/dashboard/faqs");
    } catch (err) {
      console.error("Failed to save FAQ:", err);
      Swal.fire({
        icon: "error",
        title: "Save failed",
        text: err.message || "Failed to save FAQ.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={24} className="animate-spin text-[#019D3E]" />
          <span>Loading FAQ details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top action header with Back button */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/faqs")}
            className="group mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800 cursor-pointer"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
            <span>Back to FAQs</span>
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEditing ? "Edit FAQ" : "Add FAQ"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update the question, detailed answer, display order, or publication status."
              : "Create a new frequently asked question for customers and storefront visitors."}
          </p>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]">
            <HelpCircle size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">FAQ Information</h2>
            <p className="text-xs text-slate-500">Provide clear and helpful answers for your customers.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Question */}
          <div>
            <label
              htmlFor="faq-question"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Question <span className="text-red-500">*</span>
            </label>
            <input
              id="faq-question"
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="e.g. How do I track my grocery order?"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Answer */}
          <div>
            <label
              htmlFor="faq-answer"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              id="faq-answer"
              name="answer"
              rows={6}
              value={formData.answer}
              onChange={handleChange}
              placeholder="Write a clear, thorough explanation..."
              required
              className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-relaxed text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Grid: Status & Display Order */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="faq-status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Publication Status
              </label>
              <select
                id="faq-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="Published">Published (Visible on website)</option>
                <option value="Draft">Draft (Hidden from website)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="faq-order"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Display Sequence / Order
              </label>
              <input
                id="faq-order"
                type="number"
                name="order"
                min={1}
                value={formData.order}
                onChange={handleChange}
                placeholder="1"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-1.5 text-xs text-slate-400">Lower numbers appear first in the customer list.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/dashboard/faqs")}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#019D3E] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={17} />
                  <span>{isEditing ? "Save Changes" : "Create FAQ"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
