import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Edit2, Trash2, Plus, Check, X } from "lucide-react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";
import PageHeader from "../Common/PageHeader";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "Customer",
    feedback: "",
    rating: 5,
    image: "",
    order: 1,
  });

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await apimethods.getApi("/get-testimonials");
      if (data?.testimonials) {
        setTestimonials(data.testimonials);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setForm({
      name: item.name,
      role: item.role || "Customer",
      feedback: item.feedback,
      rating: item.rating || 5,
      image: item.image || "",
      order: item.order || 1,
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setForm({ name: "", role: "Customer", feedback: "", rating: 5, image: "", order: 1 });
  };

  const handleSave = async (id) => {
    try {
      if (id) {
        await apimethods.putApi(`/update-testimonial/${id}`, form);
        Swal.fire({ icon: "success", title: "Updated", timer: 1200, showConfirmButton: false });
      } else {
        await apimethods.postApi("/add-testimonial", form);
        Swal.fire({ icon: "success", title: "Created", timer: 1200, showConfirmButton: false });
      }
      handleCancel();
      loadTestimonials();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to save", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete Testimonial?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (res.isConfirmed) {
      try {
        await apimethods.deleteApi(`/delete-testimonial/${id}`);
        loadTestimonials();
        Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message });
      }
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <PageHeader
        title="Client Testimonials"
        description="Manage the client reviews shown on the storefront home page."
        action={
          editingItem === "new" ? null : (
            <button
              type="button"
              onClick={() => {
                setEditingItem("new");
                setForm({
                  name: "",
                  role: "Customer",
                  feedback: "",
                  rating: 5,
                  image: "",
                  order: testimonials.length + 1,
                });
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37]"
            >
              <Plus size={18} />
              Add Testimonial
            </button>
          )
        }
      />

      {/* New / Edit Form Modal or Card */}
      {editingItem && (
        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-gray-900">
            {editingItem === "new" ? "Add New Testimonial" : "Edit Testimonial"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-[#019D3E] focus:outline-none"
                placeholder="e.g. Robert Fox"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-[#019D3E] focus:outline-none"
                placeholder="e.g. Customer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Image Path / URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-[#019D3E] focus:outline-none"
                placeholder="/Robert.png or image URL"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-[#019D3E] focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Review Feedback</label>
            <textarea
              rows={3}
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-[#019D3E] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(editingItem === "new" ? null : editingItem)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#019D3E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008d37]"
            >
              <Check size={16} /> Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Testimonials List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item._id}
            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                  Order #{item.order}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">
                "{item.feedback}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                  <span className="text-xs text-gray-400">{item.role || "Customer"}</span>
                </div>
              </div>
              <div className="flex items-center text-[#FF8A00]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < (item.rating || 5) ? "#FF8A00" : "none"}
                    color="#FF8A00"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
