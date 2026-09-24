import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Check } from "lucide-react";
import PageBanner from "../Components/PageBanner";
import AccountSidebar from "../Components/AccountSidebar";
import Newsletter from "../Components/Newsletter";
import { getOrderById, DEFAULT_USER } from "../services/orderData";
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(() => getOrderById(id));

  useEffect(() => {
    // If it's a MongoDB ID, attempt to fetch from API
    if (id && id.length > 15) {
      apimethods
        .getApi("/my-orders")
        .then((data) => {
          if (data?.orders) {
            const found = data.orders.find((o) => o._id === id);
            if (found) {
              setOrder({
                id: found._id,
                displayId: `#${String(found._id).slice(-4).toUpperCase()}`,
                date: new Date(found.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                total: found.total,
                subtotal: found.subtotal || found.total,
                discount: found.discount ? `${found.discount}%` : "0%",
                shipping: found.shipping === 0 ? "Free" : `$${found.shipping}`,
                paymentMethod: found.paymentMethod || "Paypal",
                status:
                  found.status === "processing"
                    ? "Processing"
                    : found.status === "delivered"
                    ? "Delivered"
                    : found.status === "on the way"
                    ? "on the way"
                    : "Order received",
                step:
                  found.status === "delivered"
                    ? 4
                    : found.status === "on the way"
                    ? 3
                    : found.status === "processing"
                    ? 2
                    : 1,
                items: found.items.map((it) => ({
                  name: it.name,
                  price: it.price,
                  quantity: it.quantity,
                  image: it.image || "/GreenCapsicum.png",
                })),
              });
            }
          }
        })
        .catch(() => {});
    } else {
      setOrder(getOrderById(id));
    }
  }, [id]);

  const displayName =
    user?.billingAddress?.firstName && user?.billingAddress?.lastName
      ? `${user.billingAddress.firstName} ${user.billingAddress.lastName}`
      : user?.name || DEFAULT_USER.name;
  const displayEmail = user?.email || DEFAULT_USER.email;
  const displayPhone = user?.phone || DEFAULT_USER.phone;
  const displayAddress =
    user?.billingAddress?.street || DEFAULT_USER.billingAddress.street;

  // Tracker steps definitions
  const steps = [
    { num: "01", label: "Order received", stepIndex: 1 },
    { num: "02", label: "Processing", stepIndex: 2 },
    { num: "03", label: "On the way", stepIndex: 3 },
    { num: "04", label: "Delivered", stepIndex: 4 },
  ];

  const currentStep = order?.step || 2;

  return (
    <div className="w-full bg-[#fbfcfb] font-sans min-h-screen">
      <PageBanner
        breadcrumbs={[
          { label: "Account", path: "/account/dashboard" },
          { label: "Order History", path: "/account/order-history" },
          { label: "Order Detail" },
        ]}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <AccountSidebar activeTab="order-history" />

          {/* Right Main Content Card */}
          <div className="flex-1 w-full bg-white rounded-xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-8">
            {/* Header: Title + Back Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Order Details
                </h2>
                <span className="text-gray-400 font-normal">•</span>
                <span className="text-sm sm:text-base text-gray-600 font-medium">
                  {order.date}
                </span>
                <span className="text-gray-400 font-normal">•</span>
                <span className="text-sm sm:text-base text-gray-600 font-medium">
                  {order.items?.length || 3} Products
                </span>
              </div>
              <Link
                to="/account/order-history"
                className="text-sm font-semibold text-[#00B207] hover:text-[#009606] hover:underline transition-colors"
              >
                Back to List
              </Link>
            </div>

            {/* Top 3 Cards Row: Billing, Shipping & Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-100 rounded-xl overflow-hidden shadow-2xs divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Billing Address */}
              <div className="p-6 flex flex-col justify-between bg-white">
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block mb-3">
                    BILLING ADDRESS
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
                    {displayName}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {displayAddress}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 space-y-1">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase">
                    EMAIL
                  </div>
                  <div className="text-xs font-medium text-gray-800">
                    {displayEmail}
                  </div>
                  <div className="text-[11px] text-gray-400 font-semibold uppercase pt-1">
                    PHONE
                  </div>
                  <div className="text-xs font-medium text-gray-800">
                    {displayPhone}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-6 flex flex-col justify-between bg-white">
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block mb-3">
                    SHIPPING ADDRESS
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
                    {displayName}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {displayAddress}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 space-y-1">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase">
                    EMAIL
                  </div>
                  <div className="text-xs font-medium text-gray-800">
                    {displayEmail}
                  </div>
                  <div className="text-[11px] text-gray-400 font-semibold uppercase pt-1">
                    PHONE
                  </div>
                  <div className="text-xs font-medium text-gray-800">
                    {displayPhone}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 flex flex-col justify-between bg-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[11px] text-gray-400 font-semibold uppercase block">
                        ORDER ID:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {order.displayId}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-gray-400 font-semibold uppercase block">
                        PAYMENT METHOD:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium text-gray-900">
                        ${Number(order.subtotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Discount:</span>
                      <span className="font-medium text-gray-900">
                        {order.discount}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span className="font-medium text-gray-900">
                        {order.shipping}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-[#00B207]">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-6 sm:py-8 px-2 sm:px-8">
              <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[3px] bg-gray-200 -z-0" />
                {/* Active Progress Line */}
                <div
                  className="absolute top-1/2 left-6 -translate-y-1/2 h-[3px] bg-[#00B207] -z-0 transition-all duration-300"
                  style={{
                    width: `${((Math.min(currentStep, 4) - 1) / 3) * 100}%`,
                  }}
                />

                {steps.map((step) => {
                  const isDone = currentStep > step.stepIndex;
                  const isCurrent = currentStep === step.stepIndex;
                  const isUpcoming = currentStep < step.stepIndex;

                  return (
                    <div
                      key={step.num}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isDone
                            ? "bg-[#00B207] text-white"
                            : isCurrent
                            ? "bg-[#00B207] text-white ring-4 ring-emerald-50"
                            : "bg-white border-2 border-emerald-500/30 text-emerald-600"
                        }`}
                      >
                        {isDone ? <Check size={16} strokeWidth={3} /> : step.num}
                      </div>
                      <span
                        className={`mt-2.5 text-xs sm:text-sm font-medium whitespace-nowrap ${
                          isDone || isCurrent
                            ? "text-[#00B207] font-semibold"
                            : "text-gray-400 font-normal"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Products Table */}
            <div className="overflow-x-auto border-t border-gray-100 pt-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-bold tracking-wider text-gray-500 uppercase border-b border-gray-100">
                    <th className="py-3.5 font-bold">PRODUCT</th>
                    <th className="py-3.5 font-bold">PRICE</th>
                    <th className="py-3.5 font-bold">QUANTITY</th>
                    <th className="py-3.5 text-right font-bold">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-14 h-14 object-contain rounded-lg p-1 bg-white border border-gray-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/GreenCapsicum.png";
                            }}
                          />
                          <span className="font-semibold text-gray-900 text-sm">
                            {prod.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 font-normal text-gray-700 whitespace-nowrap">
                        ${Number(prod.price).toFixed(2)}
                      </td>
                      <td className="py-4 font-normal text-gray-700 whitespace-nowrap">
                        x{prod.quantity}
                      </td>
                      <td className="py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                        ${(Number(prod.price) * Number(prod.quantity)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
