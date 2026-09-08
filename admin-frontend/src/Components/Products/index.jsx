import { useEffect, useMemo, useState } from "react";
import {
    Eye,
    ImageOff,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import apimethods from "../../Methods/ApiClient";
import AddEdit from "./AddEdit";

const PRODUCTS_STORAGE_KEY = "grocery-admin-products";

const readProducts = () => {
    try {
        return JSON.parse(
            localStorage.getItem(PRODUCTS_STORAGE_KEY) || "[]"
        );
    } catch {
        return [];
    }
};

export default function Products() {
    const [products, setProducts] = useState(readProducts);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);

    useEffect(() => {
        localStorage.setItem(
            PRODUCTS_STORAGE_KEY,
            JSON.stringify(products)
        );
    }, [products]);

    useEffect(() => {
        apimethods
            .getApi("/get-category")
            .then((data) => setCategories(data.categories || []))
            .catch(() => setCategories([]));
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" ||
                product.category === categoryFilter;

            const matchesStock =
                stockFilter === "all" ||
                (stockFilter === "in-stock" && product.stock > 0) ||
                (stockFilter === "low-stock" &&
                    product.stock > 0 &&
                    product.stock <= 10) ||
                (stockFilter === "out-of-stock" &&
                    product.stock === 0);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStock
            );
        });
    }, [products, search, categoryFilter, stockFilter]);

    const saveProduct = (productData) => {
        if (editingProduct?.id) {
            setProducts((current) =>
                current.map((product) =>
                    product.id === editingProduct.id
                        ? {
                              ...product,
                              ...productData,
                          }
                        : product
                )
            );
        } else {
            setProducts((current) => [
                {
                    ...productData,
                    id: `${Date.now()}`,
                },
                ...current,
            ]);
        }

        setEditingProduct(null);
    };

    const deleteProduct = (id) => {
        if (
            window.confirm(
                "Delete this product? This action cannot be undone."
            )
        ) {
            setProducts((current) =>
                current.filter((product) => product.id !== id)
            );
        }
    };

    const stockLabel = (stock) => {
        if (stock === 0) {
            return {
                label: "Out of stock",
                className: "bg-red-50 text-red-700",
            };
        }

        if (stock <= 10) {
            return {
                label: `${stock} low`,
                className: "bg-amber-50 text-amber-700",
            };
        }

        return {
            label: `${stock} in stock`,
            className: "bg-emerald-50 text-emerald-700",
        };
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">

            {/* Header */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Products
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your grocery products, pricing, and inventory.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setEditingProduct({})}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37]"
                >
                    <Plus size={18} />
                    Add Product
                </button>

            </section>

            {/* Products Section */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Filters */}
                <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">

                    {/* Search */}
                    <div className="relative min-w-0 flex-1">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search products..."
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />

                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-emerald-500"
                    >
                        <option value="all">
                            All Categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category._id || category.name}
                                value={category.name}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Stock Filter */}
                    <select
                        value={stockFilter}
                        onChange={(event) =>
                            setStockFilter(event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-emerald-500"
                    >
                        <option value="all">
                            All Stock
                        </option>

                        <option value="in-stock">
                            In stock
                        </option>

                        <option value="low-stock">
                            Low stock
                        </option>

                        <option value="out-of-stock">
                            Out of stock
                        </option>
                    </select>

                </div>

                {/* Empty State / Products Table */}
                {filteredProducts.length === 0 ? (

                    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#019D3E]">
                            <Package size={25} />
                        </div>

                        <h2 className="mt-4 text-sm font-semibold text-slate-900">
                            {products.length
                                ? "No matching products"
                                : "No products yet"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {products.length
                                ? "Try changing your search or filters."
                                : "Add your first product to start building your catalog."}
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px] text-left">

                            <thead className="border-b border-slate-100 bg-slate-50">

                                <tr>

                                    {[
                                        "Product",
                                        "Category",
                                        "Price",
                                        "Discount",
                                        "Stock",
                                        "Actions",
                                    ].map((heading) => (

                                        <th
                                            key={heading}
                                            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                                                heading === "Actions"
                                                    ? "text-right"
                                                    : ""
                                            }`}
                                        >
                                            {heading}
                                        </th>

                                    ))}

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {filteredProducts.map((product) => {

                                    const stock = stockLabel(
                                        product.stock
                                    );

                                    return (

                                        <tr
                                            key={product.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            {/* Product */}
                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-400">

                                                        {product.image ? (

                                                            <img
                                                                src={product.image}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />

                                                        ) : (

                                                            <ImageOff size={18} />

                                                        )}

                                                    </div>

                                                    <span className="text-sm font-medium text-slate-800">
                                                        {product.name}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Category */}
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {product.category ||
                                                    "Uncategorized"}
                                            </td>

                                            {/* Price */}
                                            <td className="px-5 py-4 text-sm font-medium text-slate-800">
                                                $
                                                {Number(
                                                    product.price
                                                ).toFixed(2)}
                                            </td>

                                            {/* Discount */}
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {product.discount
                                                    ? `${product.discount}%`
                                                    : "-"}
                                            </td>

                                            {/* Stock */}
                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stock.className}`}
                                                >
                                                    {stock.label}
                                                </span>

                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-end gap-1">

                                                    {/* View */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setViewingProduct(
                                                                product
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                        title="View product"
                                                    >
                                                        <Eye size={17} />
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingProduct(
                                                                product
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-[#019D3E]"
                                                        title="Edit product"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteProduct(
                                                                product.id
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                                        title="Delete product"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* Add / Edit Product Modal */}
            {editingProduct && (
                <AddEdit
                    product={
                        editingProduct.id
                            ? editingProduct
                            : null
                    }
                    categories={categories}
                    onSave={saveProduct}
                    onClose={() =>
                        setEditingProduct(null)
                    }
                />
            )}

            {/* View Product Modal */}
            {viewingProduct && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                            <h2 className="text-lg font-semibold text-slate-900">
                                Product Details
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setViewingProduct(null)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                                title="Close"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        {/* Modal Content */}
                        <div className="space-y-4 p-6">

                            {/* Product Info */}
                            <div className="flex items-center gap-4">

                                {viewingProduct.image ? (

                                    <img
                                        src={viewingProduct.image}
                                        alt=""
                                        className="h-20 w-20 rounded-xl object-cover"
                                    />

                                ) : (

                                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                        <Package size={24} />
                                    </div>

                                )}

                                <div>

                                    <h3 className="font-semibold text-slate-900">
                                        {viewingProduct.name}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {viewingProduct.category ||
                                            "Uncategorized"}
                                    </p>

                                </div>

                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">

                                <div className="rounded-lg bg-slate-50 p-3">

                                    <p className="text-xs text-slate-500">
                                        Price
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-800">
                                        $
                                        {Number(
                                            viewingProduct.price
                                        ).toFixed(2)}
                                    </p>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-3">

                                    <p className="text-xs text-slate-500">
                                        Discount
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-800">
                                        {viewingProduct.discount || 0}%
                                    </p>

                                </div>

                                <div className="rounded-lg bg-slate-50 p-3">

                                    <p className="text-xs text-slate-500">
                                        Stock
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-800">
                                        {viewingProduct.stock}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
