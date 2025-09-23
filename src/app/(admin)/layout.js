import ProviderDashboardLayout from "./components/utils/ProviderDashboardLayout";




export const metadata = {
  title: "Admin | Asknani",
  description: "A marketplace for daycare services",
};

export default function Layout({ children }) {


  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderDashboardLayout>{children}</ProviderDashboardLayout>
    </div>
  );
}
