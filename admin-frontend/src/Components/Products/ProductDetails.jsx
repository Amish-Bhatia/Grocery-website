import React, { useState } from "react";
import { Package, Star, Edit3, Save } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "../Common/Modal";
import ProductDetailsTabs from "./ProductDetailsTabs";

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
  const [price, setPrice] = useState(product.originalPrice || product.price || 0);
  const [discount, setDiscount] = useState(product.discount || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [unit, setUnit] = useState(product.unit || "kg");
  const [weight, setWeight] = useState(product.weight || "1 kg");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const basePrice = Number(price);
      const disc = Number(discount);
      const updatedData = {
        name: product.name,
        category: product.category,
        price: basePrice,
        originalPrice: basePrice,
        discount: disc,
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <Package size={28} className="text-slate-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 truncate">{product.name}</h3>
              <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[#019D3E]">
                {product.category || "Produce"}
              </span>
              {stock > 0 ? (
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">{stock} in stock</span>
              ) : (
                <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-900">
                ${(discount > 0 ? Number(price) * (1 - Number(discount) / 100) : Number(price)).toFixed(2)}{" "}
                <span className="text-xs text-slate-400 font-normal">/ {unit}</span>
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xs text-slate-400 line-through">${Number(price).toFixed(2)}</span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">{discount}% OFF</span>
                </>
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

        <ProductDetailsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          description={description}
          setDescription={setDescription}
          features={features}
          setFeatures={setFeatures}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          price={price}
          setPrice={setPrice}
          discount={discount}
          setDiscount={setDiscount}
          stock={stock}
          setStock={setStock}
          unit={unit}
          setUnit={setUnit}
        />

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
