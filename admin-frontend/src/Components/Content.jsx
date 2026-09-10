import { useEffect, useRef, useState } from "react";
import { Bold, Check, FileText, Palette, Pencil, ShieldCheck, Underline, X } from "lucide-react";
import PageHeader from "./Common/PageHeader";
import apimethods from "../Methods/ApiClient";

const sections = [
  { key: "termsAndConditions", icon: FileText },
  { key: "privacyPolicy", icon: ShieldCheck },
];

export default function Content() {
  const [content, setContent] = useState(null);
  const [selectedSection, setSelectedSection] = useState("termsAndConditions");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const editorRef = useRef(null);
  const isAdmin = localStorage.getItem("userRole") === "admin";

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await apimethods.getApi("/content");
        setContent(response.content);
      } catch (requestError) {
        setError(requestError.message || "Unable to load content.");
      }
    };

    loadContent();
  }, []);

  const selectedContent = content?.[selectedSection];

  const runCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const startEditing = () => {
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setMessage("");
    setIsEditing(false);
  };

  const saveContent = async () => {
    const body = editorRef.current?.innerHTML || "";

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await apimethods.putApi("/content", {
        section: selectedSection,
        body,
      });
      setContent(response.content);
      setIsEditing(false);
      setMessage("Content updated successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to update content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Content" description="Read the website's legal content." />

      <section className="space-y-4">
        <nav className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm" aria-label="Content sections">
          {sections.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedSection(key)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${selectedSection === key ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon size={18} />
              {content?.[key]?.heading || (key === "termsAndConditions" ? "Terms & Conditions" : "Privacy Policy")}
            </button>
          ))}
        </nav>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {message && <p role="status" className="mb-4 text-sm text-emerald-700">{message}</p>}
          {!error && !selectedContent && <p className="text-sm text-slate-500">Loading content...</p>}
          {selectedContent && (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-slate-900">{selectedContent.heading}</h2>
                {isAdmin && !isEditing && (
                  <button type="button" onClick={startEditing} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                    <Pencil size={16} />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <>
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3" aria-label="Text formatting tools">
                    <button type="button" onClick={() => runCommand("bold")} className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50" title="Bold" aria-label="Bold"><Bold size={17} /></button>
                    <button type="button" onClick={() => runCommand("underline")} className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50" title="Underline" aria-label="Underline"><Underline size={17} /></button>
                    <label className="flex h-9 items-center gap-2 rounded border border-slate-200 px-2 text-slate-700" title="Text color">
                      <Palette size={17} />
                      <input type="color" defaultValue="#334155" onChange={(event) => runCommand("foreColor", event.target.value)} aria-label="Text color" className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0" />
                    </label>
                    <label className="flex h-9 items-center gap-2 rounded border border-slate-200 px-2 text-sm text-slate-700" title="Font size">
                      <span className="font-semibold">A</span>
                      <select defaultValue="3" onChange={(event) => runCommand("fontSize", event.target.value)} aria-label="Font size" className="bg-transparent outline-none">
                        <option value="2">Small</option>
                        <option value="3">Normal</option>
                        <option value="4">Large</option>
                        <option value="5">Extra large</option>
                      </select>
                    </label>
                  </div>
                  <div ref={editorRef} contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: selectedContent.body }} className="mt-4 min-h-44 max-w-3xl rounded-lg border border-slate-200 p-4 text-sm leading-7 text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={saveContent} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><Check size={16} />{isSaving ? "Saving..." : "Save"}</button>
                    <button type="button" onClick={cancelEditing} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><X size={16} />Cancel</button>
                  </div>
                </>
              ) : (
                <div className="prose prose-slate mt-4 max-w-3xl text-sm leading-7" dangerouslySetInnerHTML={{ __html: selectedContent.body }} />
              )}
            </>
          )}
        </article>
      </section>
    </div>
  );
}