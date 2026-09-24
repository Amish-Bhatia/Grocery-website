import { useState } from "react";
import Swal from "sweetalert2";
import { DEFAULT_USER } from "../../services/orderData";

export default function ProfileSettingsForm({ user, updateUser }) {
  const initialFirst = user?.firstName || (user?.name ? user.name.split(" ")[0] : DEFAULT_USER.billingAddress.firstName);
  const initialLast = user?.lastName || (user?.name ? user.name.split(" ").slice(1).join(" ") : DEFAULT_USER.billingAddress.lastName);

  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [email, setEmail] = useState(user?.email || DEFAULT_USER.email);
  const [phone, setPhone] = useState(user?.phone || DEFAULT_USER.phone);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    updateUser({ name: fullName, firstName, lastName, email, phone });
    Swal.fire({
      icon: "success",
      title: "Settings Saved",
      text: "Your account profile has been updated.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Account Settings</h3>
      <form onSubmit={handleSaveProfile} className="w-full space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">First name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00B207] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
