import React from "react";
import { Truck, Headphones, ShieldCheck, Package } from "lucide-react";

export default function FeatureHighlights() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm mb-12">
      <div className="flex items-center gap-4 p-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
          <Truck size={24} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Free Shipping</h4>
          <p className="text-xs text-gray-500">Free shipping on all your order</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
          <Headphones size={24} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Customer Support 24/7</h4>
          <p className="text-xs text-gray-500">Instant access to Support</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">100% Secure Payment</h4>
          <p className="text-xs text-gray-500">We ensure your money is save</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
          <Package size={24} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Money-Back Guarantee</h4>
          <p className="text-xs text-gray-500">30 Days Money-Back Guarantee</p>
        </div>
      </div>
    </div>
  );
}
