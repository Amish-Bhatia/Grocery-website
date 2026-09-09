import { Package } from "lucide-react";
import Modal from "../Common/Modal";

export default function ProductDetails({ product, onClose }) {
  return (
    <Modal title="Product Details" onClose={onClose}>
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-4">
          {product.image ? <img src={product.image} alt="" className="h-20 w-20 rounded-xl object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><Package size={24} /></div>}
          <div>
            <h3 className="font-semibold text-slate-900">{product.name}</h3>
            <p className="text-sm text-slate-500">{product.category || "Uncategorized"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Price">${Number(product.price).toFixed(2)}</Stat>
          <Stat label="Discount">{product.discount || 0}%</Stat>
          <Stat label="Stock">{product.stock}</Stat>
        </div>
      </div>
    </Modal>
  );
}

function Stat({ label, children }) {
  return <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-800">{children}</p></div>;
}