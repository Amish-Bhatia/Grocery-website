import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import PageBanner from "../Components/PageBanner";
import Newsletter from "../Components/Newsletter";
import { useCart } from "../context/CartContext";
import apimethods from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "Dianne",
    lastName: "Russell",
    companyName: "",
    streetAddress: "4140 Parker Rd. Allentown, New Mexico 31134",
    country: "United States",
    state: "Washington",
    zipCode: "20033",
    email: "dianne.russell@gmail.com",
    phone: "(603) 555-0123",
    shipToDifferent: false,
    orderNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Empty Cart",
        text: "You do not have any items in your cart to checkout.",
      });
      return;
    }

    if (!formData.firstName || !formData.streetAddress || !formData.phone) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required billing information.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Map paymentMethod to backend enum
      let backendPayment = "COD";
      if (paymentMethod === "Paypal") backendPayment = "PayPal";
      if (paymentMethod === "Credit/Debit Card" || paymentMethod === "Amazon Pay") backendPayment = "Credit/Debit Card";

      const orderPayload = {
        products: cartItems.map((item) => ({
          productId: item.id || item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartTotal,
        paymentMethod: backendPayment,
        shippingAddress: {
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          street: formData.streetAddress,
          city: `${formData.state}, ${formData.country} - ${formData.zipCode}`,
          email: formData.email,
          notes: formData.orderNotes,
        },
      };

      const res = await apimethods.postApi("/place-order", orderPayload);

      if (res?.order) {
        setOrderSuccess({
          orderId: res.order._id || res.order.id,
          total: cartTotal,
          paymentMethod,
          shippingAddress: orderPayload.shippingAddress,
          items: [...cartItems],
        });
        clearCart();
      } else {
        throw new Error(res?.message || "Order placement failed");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Order Error",
        text: err.response?.data?.message || err.message || "Failed to place order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
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
              Order ID: <span className="font-mono font-semibold text-gray-800">{orderSuccess.orderId}</span>
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-left border border-gray-100 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                {orderSuccess.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} <span className="text-gray-400">× {item.quantity}</span>
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
                  <span className="font-semibold text-[#00B207]">{orderSuccess.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Address</span>
                  <span className="font-medium text-gray-800 text-right max-w-xs">{orderSuccess.shippingAddress.street}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                  <span>Total Paid</span>
                  <span>${orderSuccess.total.toFixed(2)}</span>
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

  return (
    <div className="w-full bg-white font-sans min-h-screen flex flex-col justify-between">
      <div>
        {/* Top Banner with Breadcrumbs & Back Button */}
        <PageBanner
          breadcrumbs={[
            { label: "Shopping Cart", path: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Billing Information (Screenshot 4) */}
              <div className="lg:col-span-7 xl:col-span-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Billing Information
                </h2>

                <div className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your first name"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your last name"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207]"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Company Name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Company name"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207]"
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      required
                      placeholder="Street address"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207]"
                    />
                  </div>

                  {/* Country, State, Zip Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Country / Region
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207] bg-white"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        States
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207] bg-white"
                      >
                        <option value="Washington">Washington</option>
                        <option value="New York">New York</option>
                        <option value="California">California</option>
                        <option value="Texas">Texas</option>
                        <option value="Illinois">Illinois</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        placeholder="Zip code"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207]"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Email Address"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Phone number"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207]"
                      />
                    </div>
                  </div>

                  {/* Ship to different address checkbox */}
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                      <input
                        type="checkbox"
                        name="shipToDifferent"
                        checked={formData.shipToDifferent}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#00B207] rounded border-gray-300 focus:ring-[#00B207]"
                      />
                      <span>Ship to a different address</span>
                    </label>
                  </div>
                </div>

                {/* Additional Info / Order Notes */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Additional Info
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Order Notes <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="orderNotes"
                      rows={4}
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:border-[#00B207]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Card (Screenshot 4) */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <h3 className="text-lg font-bold text-gray-900 mb-5">
                    Order Summary
                  </h3>

                  {/* Items List */}
                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-3 first:pt-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image || "/greenApple.png"}
                            alt={item.name}
                            className="w-12 h-12 object-contain rounded bg-gray-50 p-1 border border-gray-100 shrink-0"
                            onError={(e) => {
                              e.target.src = "/greenApple.png";
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 truncate">
                              {item.name}
                            </h4>
                            <span className="text-xs text-gray-400">× {item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-100 pt-4 mt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span className="font-semibold text-[#00B207]">Free</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total:</span>
                      <span className="text-lg font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method Radio Group (Screenshot 4) */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">
                      Payment Method
                    </h4>

                    <div className="space-y-2.5">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#00B207] cursor-pointer transition-colors bg-gray-50/50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Cash on Delivery"
                          checked={paymentMethod === "Cash on Delivery"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-[#00B207] focus:ring-[#00B207]"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          Cash on Delivery
                        </span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#00B207] cursor-pointer transition-colors bg-gray-50/50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Paypal"
                          checked={paymentMethod === "Paypal"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-[#00B207] focus:ring-[#00B207]"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          Paypal
                        </span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#00B207] cursor-pointer transition-colors bg-gray-50/50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Amazon Pay"
                          checked={paymentMethod === "Amazon Pay"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-[#00B207] focus:ring-[#00B207]"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          Amazon Pay / Card
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full mt-6 bg-[#00B207] hover:bg-[#009606] text-white py-4 rounded-full font-bold text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Processing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
