import React, { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import PageBanner from "../Components/PageBanner";
import apimethods from "../services/api";

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apimethods
      .getApi("/get-faqs?status=Published")
      .then((data) => {
        if (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs);
        } else {
          setFaqs(defaultFaqs);
        }
      })
      .catch(() => {
        setFaqs(defaultFaqs);
      })
      .finally(() => setLoading(false));
  }, []);

  const defaultFaqs = [
    {
      _id: "df1",
      question: "How do I place an order?",
      answer:
        "Browse our organic grocery catalog, add your desired items to your shopping cart, and proceed to checkout with secure payment options.",
    },
    {
      _id: "df2",
      question: "How can I track my delivery?",
      answer:
        "Once your order is confirmed, you can track its progress directly from your account order history, or via email notifications.",
    },
    {
      _id: "df3",
      question: "What are your delivery hours and charges?",
      answer:
        "We deliver 7 days a week from 8:00 AM to 9:00 PM. We offer free shipping on eligible orders, with express delivery options available at checkout.",
    },
    {
      _id: "df4",
      question: "What is your return or refund policy?",
      answer:
        "We offer a 100% freshness guarantee and 30-day money-back policy. If any product does not meet your expectations, contact us for an instant refund or replacement.",
    },
    {
      _id: "df5",
      question: "Are all products 100% organic and fresh?",
      answer:
        "Yes, all our fruits, vegetables, and groceries are certified organic and sourced directly from verified local sustainable farms daily.",
    },
  ];

  const displayedFaqs = faqs.length > 0 ? faqs : defaultFaqs;
  const filteredFaqs = displayedFaqs.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.question?.toLowerCase().includes(q) ||
      item.answer?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-[#FCFCFC] font-sans pb-16">
      <PageBanner breadcrumbs={[{ label: "FAQs" }]} />

      <div className="w-full px-4 sm:px-6 lg:px-12 pt-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#00B207] uppercase tracking-wider block mb-2">
            Help &amp; Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500">
            Find quick answers to common questions regarding orders, shipping, organic guarantees, and more.
          </p>

          {/* Search bar */}
          <div className="relative mt-6 max-w-md mx-auto">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full outline-none focus:border-[#00B207] focus:ring-2 focus:ring-emerald-50 transition shadow-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white border border-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-xs">
            <HelpCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-800 text-base mb-1">
              No matching questions found
            </h3>
            <p className="text-xs text-gray-400">
              Try searching with different keywords or contact our support team.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq._id || index}
                  className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/70 transition"
                  >
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "bg-emerald-50 text-[#00B207] rotate-180"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
