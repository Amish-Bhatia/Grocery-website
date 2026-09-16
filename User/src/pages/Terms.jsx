import React, { useState, useEffect } from "react";
import apimethods from "../services/api";

export default function Terms() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apimethods
      .getApi("/content")
      .then((data) => {
        if (data?.content?.termsAndConditions?.body) {
          setContent(data.content.termsAndConditions.body);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-[#FCFCFC] py-12 font-[sans-serif]">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-[#00B207] uppercase tracking-wider block mb-2">
            Legal &amp; Policy
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">
            Terms &amp; Conditions
          </h1>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
          ) : (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {content || (
                <>
                  <h3 className="text-base font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
                  <p className="mb-4">
                    By accessing and using Ecobazar grocery delivery services, you agree to comply with and be bound by these terms and conditions.
                  </p>
                  <h3 className="text-base font-bold text-gray-900 mb-2">2. Quality &amp; Organic Guarantee</h3>
                  <p className="mb-4">
                    All fresh products sold on Ecobazar are sourced with high standards of food safety, hygiene, and fresh organic farming practices.
                  </p>
                  <h3 className="text-base font-bold text-gray-900 mb-2">3. Orders &amp; Delivery</h3>
                  <p className="mb-4">
                    Deliveries are scheduled to the shipping address provided at checkout. Please ensure accurate contact details for smooth delivery.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
