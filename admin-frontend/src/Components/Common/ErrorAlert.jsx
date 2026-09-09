import { RefreshCw } from "lucide-react";

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          <RefreshCw size={15} />
          Retry
        </button>
      )}
    </div>
  );
}