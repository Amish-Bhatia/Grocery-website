import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Leaf, Shield, Award, Users, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <div className="w-full bg-white py-12 font-[sans-serif]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-xs font-bold text-[#00B207] uppercase tracking-wider block mb-2">
              About Ecobazar
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              100% Trusted Organic Food Store
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Ecobazar is your neighborhood destination for farm-fresh fruits, organic vegetables, and pantry essentials. We believe in providing pure, sustainable produce directly from certified local farmers straight to your kitchen table.
            </p>

            <div className="flex flex-col gap-3 mb-8 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#00B207] shrink-0" />
                <span>Healthy, chemical-free &amp; pesticide-free crops</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#00B207] shrink-0" />
                <span>Harvested fresh daily from sustainable organic farms</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#00B207] shrink-0" />
                <span>Fast &amp; temperature-controlled door delivery</span>
              </div>
            </div>

            <Link
              to="/shop"
              className="inline-block bg-[#00B207] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#009606] transition shadow-sm"
            >
              Explore Our Products
            </Link>
          </div>

          {/* About Image Spot */}
          {/* USER_IMAGE_SLOT: About Us Feature Image (Line 48) */}
          <div className="h-[380px] rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-8 overflow-hidden">
            <img
              src="" // <-- ADD ABOUT US BANNER/IMAGE URL HERE
              alt="About Ecobazar"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="text-center text-emerald-800 font-medium">
              <Leaf size={48} className="mx-auto text-[#00B207] mb-2" />
              <span>Dedicated to Freshness &amp; Health</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t">
          <div className="p-6 rounded-xl border border-gray-100 bg-[#FAFAFA] text-center">
            <Shield size={36} className="text-[#00B207] mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">100% Organic Certified</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every vegetable and fruit meets stringent quality standards.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-100 bg-[#FAFAFA] text-center">
            <Award size={36} className="text-[#00B207] mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Top Customer Rating</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Over 50,000+ satisfied families trust us for daily groceries.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-100 bg-[#FAFAFA] text-center">
            <HeartHandshake size={36} className="text-[#00B207] mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Direct From Farmers</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We empower local agriculture and fair-trade farming communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
