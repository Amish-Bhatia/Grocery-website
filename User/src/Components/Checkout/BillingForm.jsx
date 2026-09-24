import React from "react";

export default function BillingForm({ formData, onChange }) {
  return (
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00B207] bg-white"
            >
              <option value="Delhi">Delhi</option>
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
            placeholder="Notes about your order, e.g. special notes for delivery."
            className="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:border-[#00B207]"
          />
        </div>
      </div>
    </div>
  );
}
