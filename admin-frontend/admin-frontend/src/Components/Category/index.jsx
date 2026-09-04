import { useState } from "react";
import AddEditCategory from "./AddEdit";

export default function Category() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your grocery product categories.</p>
        </div>

        <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">Add Category</button>

      </div>

      <AddEditCategory showForm={showForm} setShowForm={setShowForm} />

    </div>
  );
}