import { useState, useEffect } from "react";
import { X, Ticket, Percent, DollarSign, AlertCircle, Sparkles } from "lucide-react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";

const defaultFormData = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrderAmount: 0,
  maximumDiscountAmount: "",
  usageLimit: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  isActive: true,
};

export default function AddEditModal({ isOpen, onClose, couponToEdit, onSaved }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const isEditing = Boolean(couponToEdit && couponToEdit._id);

  useEffect(() => {
    if (couponToEdit) {
      setFormData({
        code: couponToEdit.code || "",
        description: couponToEdit.description || "",
        discountType: couponToEdit.discountType || "percentage",
        discountValue: couponToEdit.discountValue ?? "",
        minimumOrderAmount: couponToEdit.minimumOrderAmount ?? 0,
        maximumDiscountAmount: couponToEdit.maximumDiscountAmount && couponToEdit.maximumDiscountAmount !== Infinity
          ? couponToEdit.maximumDiscountAmount : "",
        usageLimit: couponToEdit.usageLimit && couponToEdit.usageLimit !== Infinity
          ? couponToEdit.usageLimit : "",
        startDate: couponToEdit.startDate
          ? new Date(couponToEdit.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: couponToEdit.endDate
          ? new Date(couponToEdit.endDate).toISOString().split("T")[0]
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        isActive: couponToEdit.isActive !== undefined ? couponToEdit.isActive : true,
      });
    } else {
      setFormData(defaultFormData);
    }
    setFormErrors({});
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : (name === "code" ? value.toUpperCase().replace(/\s+/g, "") : value);

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Coupon code is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    const val = Number(formData.discountValue);
    if (!formData.discountValue || isNaN(val) || val <= 0) {
      errors.discountValue = "Enter a valid positive discount";
    } else if (formData.discountType === "percentage" && val > 100) {
      errors.discountValue = "Percentage cannot exceed 100%";
    }
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = "End date must be after start date";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumOrderAmount: formData.minimumOrderAmount === "" ? 0 : Number(formData.minimumOrderAmount),
        maximumDiscountAmount: formData.maximumDiscountAmount === "" ? null : Number(formData.maximumDiscountAmount),
        usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        isActive: Boolean(formData.isActive),
      };

      if (isEditing) {
        await apimethods.putApi(`/updateCoupon/${couponToEdit._id}`, payload);
        Swal.fire({ icon: "success", title: "Coupon Updated", text: `Coupon "${payload.code}" updated.`, timer: 1500, showConfirmButton: false });
      } else {
        await apimethods.postApi("/createCoupon", payload);
        Swal.fire({ icon: "success", title: "Coupon Created", text: `Coupon "${payload.code}" is now active.`, timer: 1500, showConfirmButton: false });
      }

      onSaved();
      onClose();
    } catch (error) {
      Swal.fire({ icon: "error", title: isEditing ? "Update Failed" : "Creation Failed", text: error?.message || "Failed to save coupon." });
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (code, desc, type, val, minOrder) => {
    setFormData((prev) => ({ ...prev, code, description: desc, discountType: type, discountValue: val, minimumOrderAmount: minOrder }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#019D3E]">
              <Ticket size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{isEditing ? "Edit Coupon Code" : "Create New Coupon"}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{isEditing ? "Modify values and limits." : "Set up a new discount code."}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X size={20} />
          </button>
        </div>

        {!isEditing && (
          <div className="mb-6 rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles size={14} className="text-[#019D3E]" />
              <span>Quick Promotion Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => applyPreset("WELCOME10", "10% off for all new shoppers", "percentage", 10, 20)} className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#019D3E] hover:text-[#019D3E] transition shadow-2xs">🎉 10% Welcome</button>
              <button type="button" onClick={() => applyPreset("FRESH20", "20% off on grocery orders over $50", "percentage", 20, 50)} className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#019D3E] hover:text-[#019D3E] transition shadow-2xs">🥬 20% Fresh</button>
              <button type="button" onClick={() => applyPreset("FLAT15", "$15 flat discount on orders over $60", "fixed", 15, 60)} className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#019D3E] hover:text-[#019D3E] transition shadow-2xs">💵 $15 Flat Off</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Coupon Code *</label>
              <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="e.g. SAVE25" className={`w-full rounded-xl border ${formErrors.code ? "border-red-400 bg-red-50/20" : "border-slate-200 bg-white"} px-4 py-2.5 text-sm font-bold tracking-wider text-slate-900 outline-none focus:border-[#019D3E] transition uppercase`} />
              {formErrors.code && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {formErrors.code}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
              <button type="button" onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))} className={`flex h-[42px] w-full items-center justify-between rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${formData.isActive ? "border-emerald-200 bg-emerald-50 text-[#019D3E]" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                <span>{formData.isActive ? "Active (Live)" : "Inactive"}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${formData.isActive ? "bg-[#019D3E]" : "bg-slate-400"}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description *</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="e.g. Get 20% discount on fresh fruits" className={`w-full rounded-xl border ${formErrors.description ? "border-red-400" : "border-slate-200"} px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#019D3E] transition`} />
            {formErrors.description && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, discountType: "percentage" }))} className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${formData.discountType === "percentage" ? "border-[#019D3E] bg-emerald-50 text-[#019D3E]" : "border-slate-200 text-slate-600"}`}><Percent size={14} /> % Percent</button>
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, discountType: "fixed" }))} className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${formData.discountType === "fixed" ? "border-[#019D3E] bg-emerald-50 text-[#019D3E]" : "border-slate-200 text-slate-600"}`}><DollarSign size={14} /> $ Fixed</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Discount Value *</label>
              <input type="number" step="any" min="1" max={formData.discountType === "percentage" ? "100" : undefined} name="discountValue" value={formData.discountValue} onChange={handleChange} placeholder={formData.discountType === "percentage" ? "e.g. 20" : "e.g. 15.00"} className={`w-full rounded-xl border ${formErrors.discountValue ? "border-red-400" : "border-slate-200"} px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#019D3E] transition`} />
              {formErrors.discountValue && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {formErrors.discountValue}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Min Order ($)</label>
              <input type="number" step="any" min="0" name="minimumOrderAmount" value={formData.minimumOrderAmount} onChange={handleChange} placeholder="0 (None)" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#019D3E]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Max Cap ($)</label>
              <input type="number" step="any" min="0" name="maximumDiscountAmount" value={formData.maximumDiscountAmount} onChange={handleChange} placeholder="Unlimited" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#019D3E]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Usage Limit</label>
              <input type="number" min="1" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Unlimited" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#019D3E]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#019D3E]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={`w-full rounded-xl border ${formErrors.endDate ? "border-red-400" : "border-slate-200"} px-3 py-2 text-sm outline-none focus:border-[#019D3E]`} />
              {formErrors.endDate && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {formErrors.endDate}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#019D3E] to-[#00491B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50 cursor-pointer">
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
