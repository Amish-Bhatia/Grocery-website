import React from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { defaultClientTestimonials } from "./constants";

export default function ClientTestimonials({ testimonials = defaultClientTestimonials }) {
  return (
    <section className="bg-[#F7F7F7] py-14">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Client Testimonials
          </h2>
          {/* Arrow Navigation */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#00B207] text-white flex items-center justify-center hover:bg-[#009606] transition shadow-sm"
              aria-label="Next testimonial"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <span className="text-[#00B207] text-4xl font-serif leading-none block mb-3">
                  “
                </span>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                  {item.feedback}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm"
                    onError={(e) => {
                      const fallbackMap = {
                        "robert fox": "/Robert.png",
                        "dianne russell": "/Dennie.png",
                        "eleanor pena": "/eleanor.png",
                      };
                      const fb = fallbackMap[item.name?.toLowerCase().trim()];
                      if (fb && !e.target.src.endsWith(fb)) {
                        e.target.src = fb;
                      }
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {item.role || "Customer"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-[#FF8A00] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < (item.rating || 5) ? "#FF8A00" : "none"}
                      color="#FF8A00"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
