import React, { useState } from "react";
import {
  Package,
  Star,
  Plus,
  Trash2,
  Check,
  Tag,
  FileText,
  Sliders,
  Edit3,
  Save,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import Modal from "../Common/Modal";

export default function ProductDetails({ product, onSave, onEdit, onClose }) {
  const [description, setDescription] = useState(
    product.description ||
      "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi vel neque id libero imperdiet aliquet. Sed ultrices tellus non odio efficitur, at aliquet mauris mollis."
  );

  const [features, setFeatures] = useState(
    Array.isArray(product.features) && product.features.length > 0
      ? product.features
      : [
          "100% Organic certified farm produce",
          "Freshly harvested within 24 hours of delivery",
          "Zero artificial pesticides, waxes, or preservatives",
          "High nutritional value and natural farm flavor",
        ]
  );

  const [newFeature, setNewFeature] = useState("");
  const [price, setPrice] = useState(product.price || 0);
  const [discount, setDiscount] = useState(product.discount || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [unit, setUnit] = useState(product.unit || "kg");
  const [weight, setWeight] = useState(product.weight || "1 kg");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "features" | "inventory"

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };

  const handleRemoveFeature = (idx) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        name: product.name,
        category: product.category,
        price: Number(price),
        discount: Number(discount),
        stock: Number(stock),
        description,
        features,
        unit,
        weight,
      };

      if (onSave) {
        await onSave(updatedData);
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Product details saved successfully!",
        timer: 1800,
        showConfirmButton: false,
      });
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.message || "Failed to update product details.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Product Description & Details"
      description="View and dynamically manage product features, descriptions, and specifications."
      onClose={onClose}
      className="w-full max-w-full"
    >
      <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
        {/* Product Quick Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <Package size={28} className="text-slate-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {product.name}
              </h3>
              <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[#019D3E]">
                {product.category || "Produce"}
              </span>
              {stock > 0 ? (
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {stock} in stock
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                ${Number(price).toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ {unit}</span>
              </span>
              {discount > 0 && (
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  {discount}% OFF
                </span>
              )}
              <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                <Star size={13} fill="currentColor" />
                <span>{product.rating || 5}.0</span>
              </div>
            </div>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white hover:text-[#019D3E] transition cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Full Edit</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "description"
                ? "border-[#019D3E] text-[#019D3E]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText size={16} />
            <span>Product Description</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("features")}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "features"
                ? "border-[#019D3E] text-[#019D3E]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 size={16} />
            <span>Dynamic Features ({features.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === "inventory"
                ? "border-[#019D3E] text-[#019D3E]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sliders size={16} />
            <span>Pricing &amp; Specs</span>
          </button>
        </div>

        {/* TAB 1: Product Description */}
        {activeTab === "description" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detailed Product Description (Displayed on Customer Product Page)
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter rich details about origin, flavor profile, organic certification, and cooking recommendations..."
                className="w-full border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#019D3E]"
              />
              <p className="text-xs text-slate-400 mt-1">
                Tip: Detailed descriptions improve customer conversion and search clarity.
              </p>
            </div>

            {/* Live Customer Preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Customer View Preview
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{description || "No description provided."}"
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Features */}
        {activeTab === "features" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Add Dynamic Feature / Specification Highlight
              </label>
              <form onSubmit={handleAddFeature} className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g. 100% Pesticide-Free, Farm Fresh Picked"
                  className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]"
                />
                <button
                  type="submit"
                  className="bg-[#019D3E] hover:bg-[#018635] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Features &amp; Highlights
              </label>
              {features.length === 0 ? (
                <p className="text-sm text-slate-400 py-3 italic">
                  No features added yet. Add one above!
                </p>
              ) : (
                features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-sm text-slate-800">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#019D3E] flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-red-600 transition p-1 rounded hover:bg-red-50 cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Inventory & Specs */}
        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Unit Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Stock Quantity (Pieces / Units available)
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Packaging Unit (e.g. kg, pcs, pack)
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="bg-[#019D3E] hover:bg-[#018635] text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>{isSaving ? "Saving..." : "Save Product Details"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
