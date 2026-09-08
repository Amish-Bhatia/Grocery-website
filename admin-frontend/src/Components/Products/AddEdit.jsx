import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const emptyForm = {
	name: "",
	category: "",
	price: "",
	discount: "",
	stock: "",
	image: "",
};

export default function AddEdit({ product, categories, onSave, onClose }) {
	const [formData, setFormData] = useState(emptyForm);
	const [imagePreview, setImagePreview] = useState("");

	useEffect(() => {
		const nextForm = product
			? { name: product.name || "", category: product.category || "", price: product.price ?? "", discount: product.discount ?? "", stock: product.stock ?? "", image: product.image || "" }
			: emptyForm;
		setFormData(nextForm);
		setImagePreview(nextForm.image);
	}, [product]);

	const handleChange = (event) => {
		const { name, value, files } = event.target;
		if (name === "image") {
			const file = files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result);
				setFormData((previous) => ({ ...previous, image: reader.result }));
			};
			reader.readAsDataURL(file);
			return;
		}
		setFormData((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onSave({ ...formData, price: Number(formData.price), discount: Number(formData.discount || 0), stock: Number(formData.stock) });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
					<div><h2 className="text-lg font-semibold text-slate-900">{product ? "Edit Product" : "Add Product"}</h2><p className="mt-1 text-sm text-slate-500">Keep your product details and stock information up to date.</p></div>
					<button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" title="Close"><X size={19} /></button>
				</div>

				<div className="grid gap-5 p-6 sm:grid-cols-2">
					<div className="sm:col-span-2"><label htmlFor="product-name" className="mb-2 block text-sm font-medium text-slate-700">Product name</label><input id="product-name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Organic Bananas" required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></div>
					<div><label htmlFor="product-category" className="mb-2 block text-sm font-medium text-slate-700">Category</label><select id="product-category" name="category" value={formData.category} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"><option value="">Select category</option>{categories.map((category) => <option key={category._id || category.name} value={category.name}>{category.name}</option>)}</select></div>
					<div><label htmlFor="product-price" className="mb-2 block text-sm font-medium text-slate-700">Price ($)</label><input id="product-price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} placeholder="0.00" required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></div>
					<div><label htmlFor="product-discount" className="mb-2 block text-sm font-medium text-slate-700">Discount (%)</label><input id="product-discount" name="discount" type="number" min="0" max="100" step="1" value={formData.discount} onChange={handleChange} placeholder="0" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></div>
					<div><label htmlFor="product-stock" className="mb-2 block text-sm font-medium text-slate-700">Stock quantity</label><input id="product-stock" name="stock" type="number" min="0" step="1" value={formData.stock} onChange={handleChange} placeholder="0" required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></div>
					<div className="sm:col-span-2"><label htmlFor="product-image" className="mb-2 block text-sm font-medium text-slate-700">Product image</label><div className="flex items-center gap-4"><label htmlFor="product-image" className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-emerald-500 hover:text-emerald-600">{imagePreview ? <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" /> : <ImagePlus size={24} />}</label><div><input id="product-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-medium file:text-emerald-700" /><p className="mt-2 text-xs text-slate-400">JPG, PNG or WEBP. Choose an image to show it in the product table.</p></div></div></div>
				</div>

				<div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-lg bg-[#019D3E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008d37]">{product ? "Save Changes" : "Add Product"}</button></div>
			</form>
		</div>
	);
}
