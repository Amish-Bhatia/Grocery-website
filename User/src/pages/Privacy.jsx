import React, { useState, useEffect } from "react";
import apimethods from "../services/api";

export default function Privacy() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apimethods
      .getApi("/content")
      .then((data) => {
        if (data?.content?.privacyPolicy?.body) {
          setContent(data.content.privacyPolicy.body);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-[#FCFCFC] py-12 font-[sans-serif]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-[#00B207] uppercase tracking-wider block mb-2">
            Privacy &amp; Security
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">
            Privacy Policy
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
                  <h3 className="text-base font-bold text-gray-900 mb-2">1. Information We Collect</h3>
                  <p className="mb-4">
                    We collect personal information such as your name, email address, phone number, and delivery location to fulfill grocery orders.
                  </p>
                  <h3 className="text-base font-bold text-gray-900 mb-2">2. How We Protect Your Data</h3>
                  <p className="mb-4">
                    Your personal information is encrypted and securely stored. We never sell or share your personal data with third-party advertisers.
                  </p>
                  <h3 className="text-base font-bold text-gray-900 mb-2">3. Payment Security</h3>
                  <p className="mb-4">
                    All payment transactions are processed through 100% secure, PCI-compliant payment gateways.
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
