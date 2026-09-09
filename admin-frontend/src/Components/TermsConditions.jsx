import { useState } from "react";
import { Plus, Search } from "lucide-react";
import PageHeader from "./Common/PageHeader";

export default function TermsConditions() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = () => setMessage("The page hasn't been created yet.");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Terms & Conditions" />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search terms and conditions</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search terms and conditions"
              className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#019D3E] focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <button type="button" onClick={handleCreate} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-5 text-sm font-semibold text-white transition hover:bg-[#008d37]">
            <Plus size={18} />
            Create
          </button>
        </div>
        {message && <p role="status" className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{message}</p>}
      </section>
    </div>
  );
}