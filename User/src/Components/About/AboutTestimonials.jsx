import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function AboutTestimonials({ testimonials = [] }) {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Testimonials</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#00B207] text-white hover:bg-[#009606] flex items-center justify-center transition shadow-xs"
              aria-label="Next testimonials"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item._id || item.name}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <Quote size={28} className="text-[#00B207] mb-4 opacity-70" />
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">{item.feedback}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || "/Robert.png"}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-gray-100"
                    onError={(e) => { e.target.src = "/Robert.png"; }}
                  />
                  <div>
                    <h5 className="font-bold text-sm text-gray-900">{item.name}</h5>
                    <span className="text-xs text-gray-400 font-normal">{item.role || "Customer"}</span>
                  </div>
                </div>

                <div className="flex items-center text-[#FF8A00]">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
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
