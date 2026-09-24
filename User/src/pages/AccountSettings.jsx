import PageBanner from "../Components/PageBanner";
import AccountSidebar from "../Components/AccountSidebar";
import Newsletter from "../Components/Newsletter";
import { useAuth } from "../context/AuthContext";
import ProfileSettingsForm from "../Components/Account/ProfileSettingsForm";
import BillingAddressForm from "../Components/Account/BillingAddressForm";
import ChangePasswordForm from "../Components/Account/ChangePasswordForm";

export default function AccountSettings() {
  const { user, updateUser } = useAuth();

  return (
    <div className="w-full bg-[#fbfcfb] font-sans min-h-screen">
      <PageBanner
        breadcrumbs={[
          { label: "Account", path: "/account/dashboard" },
          { label: "Settings" },
        ]}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-8 items-start">
          <AccountSidebar activeTab="settings" />

          <div className="flex-1 w-full bg-white rounded-xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
            <ProfileSettingsForm user={user} updateUser={updateUser} />
            <BillingAddressForm user={user} updateUser={updateUser} />
            <ChangePasswordForm />
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
