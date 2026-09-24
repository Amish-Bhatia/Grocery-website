import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../Components/PageBanner";
import AccountSidebar from "../Components/AccountSidebar";
import Newsletter from "../Components/Newsletter";
import { useAuth } from "../context/AuthContext";
import { RECENT_DASHBOARD_ORDERS, DEFAULT_USER } from "../services/orderData";
import apimethods from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(RECENT_DASHBOARD_ORDERS);

  useEffect(() => {
    // Attempt to fetch real orders if available
    apimethods
      .getApi("/my-orders")
      .then((data) => {
        if (data?.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          const formatted = data.orders.slice(0, 6).map((o) => ({
            id: o._id,
            displayId: `#${String(o._id).slice(-4).toUpperCase()}`,
            date: new Date(o.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            total: o.total,
            productCount: o.items?.length || 1,
            status:
              o.status === "processing"
                ? "Processing"
                : o.status === "on the way"
                ? "on the way"
                : "Completed",
          }));
          setOrders(formatted);
        }
      })
      .catch(() => {
        // Keep realistic mock data
      });
  }, []);

  const displayName = user?.name || DEFAULT_USER.name;
  const displayEmail = user?.email || DEFAULT_USER.email;
  const displayPhone = user?.phone || DEFAULT_USER.phone;
  const displayAddress =
    user?.billingAddress?.street || DEFAULT_USER.billingAddress.street;
  const avatarUrl = user?.avatar || DEFAULT_USER.avatar;

  return (
    <div className="w-full bg-[#fbfcfb] font-sans min-h-screen">
      <PageBanner
        breadcrumbs={[{ label: "Account" }, { label: "Dashboard" }]}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <AccountSidebar activeTab="dashboard" />

          {/* Right Main Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Top Cards: Profile & Billing Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="relative mb-3.5">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-28 h-28 rounded-full object-cover border-2 border-gray-100 shadow-xs"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/dianne-avatar.jpg";
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  {displayName}
                </h3>
                <p className="text-sm text-gray-400 font-normal mt-0.5">
                  Customer
                </p>
                <Link
                  to="/account/settings"
                  className="mt-3 text-sm font-semibold text-[#00B207] hover:text-[#009606] hover:underline transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Billing Address Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block mb-3.5">
                    BILLING ADDRESS
                  </span>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {user?.billingAddress?.firstName && user?.billingAddress?.lastName
                      ? `${user.billingAddress.firstName} ${user.billingAddress.lastName}`
                      : displayName}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                    {displayAddress}
                  </p>
                  <p className="text-sm text-gray-800 font-medium mt-3">
                    {displayEmail}
                  </p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">
                    {displayPhone}
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    to="/account/settings"
                    className="text-sm font-semibold text-[#00B207] hover:text-[#009606] hover:underline transition-colors inline-block"
                  >
                    Edit Address
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Order History Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Recent Order History
                </h3>
                <Link
                  to="/account/order-history"
                  className="text-sm font-semibold text-[#00B207] hover:text-[#009606] hover:underline transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#F8F9FA] text-[11px] font-bold tracking-wider text-gray-500 uppercase border-b border-gray-100">
                      <th className="px-6 py-3.5 font-bold">ORDER ID</th>
                      <th className="px-6 py-3.5 font-bold">DATE</th>
                      <th className="px-6 py-3.5 font-bold">TOTAL</th>
                      <th className="px-6 py-3.5 font-bold">STATUS</th>
                      <th className="px-6 py-3.5 text-right font-bold sr-only">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {order.displayId}
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">
                            ${Number(order.total).toFixed(2)}
                          </span>{" "}
                          <span className="text-gray-500 font-normal">
                            ({order.productCount}{" "}
                            {order.productCount === 1 ? "Product" : "Products"})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block text-xs font-medium ${
                              order.status?.toLowerCase() === "completed"
                                ? "text-gray-700"
                                : order.status?.toLowerCase() === "processing"
                                ? "text-amber-600"
                                : "text-blue-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Link
                            to={`/account/order/${order.id}`}
                            className="text-sm font-semibold text-[#00B207] hover:text-[#009606] hover:underline transition-colors"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
