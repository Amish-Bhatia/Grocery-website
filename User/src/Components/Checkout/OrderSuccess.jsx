import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import PageBanner from "../PageBanner";
import Newsletter from "../Newsletter";

export default function OrderSuccess({ orderSuccess }) {
  if (!orderSuccess) return null;

  return (
    <div className="w-full bg-white font-sans min-h-screen flex flex-col justify-between">
      <div>
        <PageBanner
          breadcrumbs={[
            { label: "Shopping Cart", path: "/cart" },
            { label: "Order Confirmation" },
          ]}
        />
        <div className="max-w-[760px] mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#00B207]">
            <CheckCircle2 size={44} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Order ID:{" "}
            <span className="font-mono font-semibold text-gray-800">
              {orderSuccess.orderId}
            </span>
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-left border border-gray-100 mb-8">
            <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Order Summary
            </h3>
            <div className="space-y-3 mb-6">
              {orderSuccess.items.map((item) => (
                <div
                  key={item.id || item.productId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.name}{" "}
                    <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Payment Method</span>
                <span className="font-semibold text-[#00B207]">
                  {orderSuccess.paymentMethod}
                </span>
              </div>
              {orderSuccess.paymentId && (
                <div className="flex justify-between text-gray-600">
                  <span>Payment ID</span>
                  <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                    {orderSuccess.paymentId}
                  </span>
                </div>
              )}
              {orderSuccess.discount > 0 && (
                <div className="flex justify-between text-[#00B207]">
                  <span>Coupon Discount {orderSuccess.couponCode ? `(${orderSuccess.couponCode})` : ""}</span>
                  <span className="font-semibold">-${Number(orderSuccess.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping Address</span>
                <span className="font-medium text-gray-800 text-right max-w-xs">
                  {orderSuccess.shippingAddress?.street}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                <span>Total Paid</span>
                <span>${Number(orderSuccess.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-[#00B207] hover:bg-[#009606] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Newsletter />
    </div>
  );
}
