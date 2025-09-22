

import ProviderDashboardLayout from "./components/utils/Layout";

export const metadata = {
  title: "Providers Manage Your Daycare | Asknani",
  description: "A marketplace for daycare services",
};

export default function Layout({ children }) {


  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderDashboardLayout>{children}</ProviderDashboardLayout>
    </div>
  );
}
