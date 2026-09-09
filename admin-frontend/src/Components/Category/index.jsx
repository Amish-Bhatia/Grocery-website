import { useState } from "react";
import AddEditCategory from "./AddEdit";
import PageHeader from "../Common/PageHeader";
import { Plus } from "lucide-react";

export default function Category() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mx-auto max-w-7xl">

      <PageHeader
        title="Categories"
        description="Manage your grocery product categories."
        action={(
          <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37]">
            <Plus size={18} />
            Add Category
          </button>
        )}
      />

      <AddEditCategory showForm={showForm} setShowForm={setShowForm} />

    </div>
  );
}