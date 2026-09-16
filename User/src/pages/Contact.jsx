import React, { useState } from "react";
import { PhoneCall, Mail, MapPin, Send, Clock } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FCFCFC] py-12 font-[sans-serif]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#00B207] uppercase tracking-wider block mb-2">
            Get In Touch
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-sm text-gray-500">
            Have questions about our organic produce, your order, or wholesale inquiries? Send us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards (Left) */}
          <div className="flex flex-col gap-4">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Store Address</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Lincoln- 344, Illinois, Chicago, USA
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
                <PhoneCall size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Call Us 24/7</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium text-gray-900">
                  (219) 555-0114
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Toll free customer support</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Email Support</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  support@ecobazar.com
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B207] flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Working Hours</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Mon - Sat: 8:00 AM - 9:00 PM
                </p>
                <p className="text-[11px] text-gray-400">Sunday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form (Right 2 Cols) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send A Message</h3>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-xl text-[#00B207]">
                <h4 className="font-bold text-lg mb-1">Thank You!</h4>
                <p className="text-xs text-emerald-800">
                  Your message has been sent successfully. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#00B207]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#00B207]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#00B207]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    className="w-full text-sm border border-gray-200 rounded-lg p-4 outline-none focus:border-[#00B207]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-fit inline-flex items-center gap-2 bg-[#00B207] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#009606] transition shadow-sm"
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
