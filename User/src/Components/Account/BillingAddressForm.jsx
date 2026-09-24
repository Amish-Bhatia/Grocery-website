import { useState } from "react";
import Swal from "sweetalert2";
import { DEFAULT_USER } from "../../services/orderData";

export default function BillingAddressForm({ user, updateUser }) {
  const initialFirst = user?.firstName || (user?.name ? user.name.split(" ")[0] : DEFAULT_USER.billingAddress.firstName);
  const initialLast = user?.lastName || (user?.name ? user.name.split(" ").slice(1).join(" ") : DEFAULT_USER.billingAddress.lastName);

  const [billFirst, setBillFirst] = useState(user?.billingAddress?.firstName || initialFirst);
  const [billLast, setBillLast] = useState(user?.billingAddress?.lastName || initialLast);
  const [billCompany, setBillCompany] = useState(user?.billingAddress?.company || DEFAULT_USER.billingAddress.company);
  const [billStreet, setBillStreet] = useState(user?.billingAddress?.street || DEFAULT_USER.billingAddress.street);
  const [billCountry, setBillCountry] = useState(user?.billingAddress?.country || DEFAULT_USER.billingAddress.country);
  const [billState, setBillState] = useState(user?.billingAddress?.state || DEFAULT_USER.billingAddress.state);
  const [billZip, setBillZip] = useState(user?.billingAddress?.zipCode || DEFAULT_USER.billingAddress.zipCode);
  const [billEmail, setBillEmail] = useState(user?.billingAddress?.email || user?.email || DEFAULT_USER.email);
  const [billPhone, setBillPhone] = useState(user?.billingAddress?.phone || user?.phone || DEFAULT_USER.phone);

  const handleSaveBilling = (e) => {
    e.preventDefault();
    const billingAddress = {
      firstName: billFirst,
      lastName: billLast,
      company: billCompany,
      street: billStreet,
      country: billCountry,
      state: billState,
      zipCode: billZip,
      email: billEmail,
      phone: billPhone,
    };
    updateUser({ billingAddress });
    Swal.fire({
      icon: "success",
      title: "Billing Address Saved",
      text: "Your billing details have been updated successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Billing Address</h3>
      <form onSubmit={handleSaveBilling} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">First name</label>
            <input
              type="text"
              required
              value={billFirst}
              onChange={(e) => setBillFirst(e.target.value)}
              placeholder="First name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last name</label>
            <input
              type="text"
              required
              value={billLast}
              onChange={(e) => setBillLast(e.target.value)}
              placeholder="Last name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Company Name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={billCompany}
              onChange={(e) => setBillCompany(e.target.value)}
              placeholder="Company"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Street Address</label>
          <input
            type="text"
            required
            value={billStreet}
            onChange={(e) => setBillStreet(e.target.value)}
            placeholder="4140 Parker Rd."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country / Region</label>
            <select
              value={billCountry}
              onChange={(e) => setBillCountry(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#00B207] transition bg-white"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">States</label>
            <select
              value={billState}
              onChange={(e) => setBillState(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#00B207] transition bg-white"
            >
              <option value="Washington DC">Washington DC</option>
              <option value="New Mexico">New Mexico</option>
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Zip Code</label>
            <input
              type="text"
              required
              value={billZip}
              onChange={(e) => setBillZip(e.target.value)}
              placeholder="20033"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={billEmail}
              onChange={(e) => setBillEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
            <input
              type="tel"
              required
              value={billPhone}
              onChange={(e) => setBillPhone(e.target.value)}
              placeholder="(603) 555-0123"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#00B207] hover:bg-[#009606] text-white px-7 py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer shadow-xs"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
