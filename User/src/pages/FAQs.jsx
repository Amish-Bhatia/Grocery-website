import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import apimethods from "../services/api";

const DEFAULT_FAQS = [
  {
    _id: "df1",
    question: "In elementum est a ante sodales iaculis.",
    answer:
      "Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.",
  },
  {
    _id: "df2",
    question: "Etiam lobortis massa eu nibh tempor elementum.",
    answer:
      "Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.",
  },
  {
    _id: "df3",
    question: "In elementum est a ante sodales iaculis.",
    answer:
      "Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.",
  },
  {
    _id: "df4",
    question: "Aenean quis quam nec lacus semper dignissim.",
    answer:
      "Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.",
  },
  {
    _id: "df5",
    question: "Nulla tincidunt eros id tempus accumsan.",
    answer:
      "Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.",
  },
];

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    apimethods
      .getApi("/get-faqs?status=Published")
      .then((data) => {
        if (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs);
        } else {
          // If no published faqs, try all faqs
          apimethods
            .getApi("/get-faqs")
            .then((allData) => {
              if (allData?.faqs && Array.isArray(allData.faqs) && allData.faqs.length > 0) {
                setFaqs(allData.faqs);
              } else {
                setFaqs(DEFAULT_FAQS);
              }
            })
            .catch(() => setFaqs(DEFAULT_FAQS));
        }
      })
      .catch(() => {
        setFaqs(DEFAULT_FAQS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const displayedFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <div className="w-full bg-white font-sans min-h-screen">
      {/* Banner */}
      <PageBanner breadcrumbs={[{ label: "Faqs" }]} />

      {/* Main 2-Column Content */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading + Dynamic Backend Accordion */}
          <div className="lg:col-span-6 xl:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-900 leading-[1.2] tracking-tight mb-8">
              Welcome, Let’s Talk
              <br />
              About Our Ecobazar
            </h1>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-[#F2F2F2] rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedFaqs.map((item, idx) => {
                  const isOpen = openIndex === idx;

                  return (
                    <div
                      key={item._id || item.id || idx}
                      className={`transition-all duration-200 rounded-lg overflow-hidden ${
                        isOpen
                          ? "border border-[#00B207] bg-white shadow-2xs"
                          : "bg-[#F2F2F2] hover:bg-[#EBEBEB] border border-transparent"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(idx)}
                        className={`w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer transition-colors ${
                          isOpen ? "pb-2" : ""
                        }`}
                      >
                        <span
                          className={`text-sm sm:text-base font-semibold transition-colors ${
                            isOpen ? "text-[#00B207]" : "text-gray-800"
                          }`}
                        >
                          {item.question}
                        </span>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 transition-colors ${
                            isOpen ? "text-[#00B207]" : "text-gray-500"
                          }`}
                        >
                          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Farmer with fresh vegetables */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[500px] flex justify-center items-center">
              <img
                src="/faqsMan.png"
                alt="Ecobazar Organic Farmer"
                className="w-full h-auto max-h-[580px] object-contain mx-auto block hover:scale-[1.02] transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/about-mission-farmer.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
