import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tag, User, MessageSquare } from "lucide-react";

export default function LatestNews() {
  return (
    <section className="mb-14">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Latest News
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* News Card 1 */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
          <div className="relative h-56 bg-sky-100 overflow-hidden group">
            <img
              src="/Image.png"
              alt="Curabitur porttitor orci"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {/* Date Badge */}
            <div className="absolute left-4 bottom-4 bg-white rounded-md px-3 py-1.5 text-center shadow">
              <span className="block text-lg font-bold text-gray-900 leading-none">
                18
              </span>
              <span className="block text-[10px] font-semibold uppercase text-gray-400 mt-0.5">
                NOV
              </span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <Tag size={14} className="text-gray-400" />
                  <span>Food</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" />
                  <span>By Admin</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-gray-400" />
                  <span>65 Comments</span>
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 hover:text-[#00B207] transition-colors mb-4 line-clamp-2 leading-snug">
                Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.
              </h3>
            </div>
            <Link
              to="#"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
            >
              <span>Read More</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* News Card 2 */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
          <div className="relative h-56 bg-amber-50 overflow-hidden group">
            <img
              src="/Image-1.png"
              alt="Eget lobortis lorem lacinia"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {/* Date Badge */}
            <div className="absolute left-4 bottom-4 bg-white rounded-md px-3 py-1.5 text-center shadow">
              <span className="block text-lg font-bold text-gray-900 leading-none">
                29
              </span>
              <span className="block text-[10px] font-semibold uppercase text-gray-400 mt-0.5">
                JAN
              </span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <Tag size={14} className="text-gray-400" />
                  <span>Food</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" />
                  <span>By Admin</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-gray-400" />
                  <span>65 Comments</span>
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 hover:text-[#00B207] transition-colors mb-4 line-clamp-2 leading-snug">
                Eget lobortis lorem lacinia. Vivamus pharetra semper.
              </h3>
            </div>
            <Link
              to="#"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
            >
              <span>Read More</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* News Card 3 */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
          <div className="relative h-56 bg-emerald-50 overflow-hidden group">
            <img
              src="/Image-2.png"
              alt="Maecenas blandit risus"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {/* Date Badge */}
            <div className="absolute left-4 bottom-4 bg-white rounded-md px-3 py-1.5 text-center shadow">
              <span className="block text-lg font-bold text-gray-900 leading-none">
                21
              </span>
              <span className="block text-[10px] font-semibold uppercase text-gray-400 mt-0.5">
                FEB
              </span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <Tag size={14} className="text-gray-400" />
                  <span>Food</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" />
                  <span>By Admin</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-gray-400" />
                  <span>65 Comments</span>
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 hover:text-[#00B207] transition-colors mb-4 line-clamp-2 leading-snug">
                Maecenas blandit risus elementum mauris malesuada.
              </h3>
            </div>
            <Link
              to="#"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B207] hover:underline"
            >
              <span>Read More</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
