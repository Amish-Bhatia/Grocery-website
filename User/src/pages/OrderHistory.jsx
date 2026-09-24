import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageBanner from "../Components/PageBanner";
import AccountSidebar from "../Components/AccountSidebar";
import Newsletter from "../Components/Newsletter";
import { MOCK_ORDERS } from "../services/orderData";
import apimethods from "../services/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    apimethods
      .getApi("/my-orders")
      .then((data) => {
        if (data?.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          const apiOrders = data.orders.map((o) => ({
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
          // Merge API orders at the top of mock list
          setOrders([...apiOrders, ...MOCK_ORDERS]);
        }
      })
      .catch(() => {
        // Fallback to mock list
      });
  }, []);

  const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full bg-[#fbfcfb] font-sans min-h-screen">
      <PageBanner
        breadcrumbs={[{ label: "Account" }, { label: "Order History" }]}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <AccountSidebar activeTab="order-history" />

          {/* Right Main Table */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Order History
                </h3>
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
                    {currentOrders.map((order) => (
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

              {/* Pagination */}
              <div className="py-6 flex items-center justify-center gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages || 3)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#00B207] text-white font-semibold"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages || 3, p + 1))
                  }
                  disabled={currentPage === (totalPages || 3)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
