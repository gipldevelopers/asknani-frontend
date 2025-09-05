export default function BookingTabs({ activeTab, setActiveTab, counts }) {
  const tabs = ["upcoming", "past", "cancelled"];

  return (
    <div className="flex sticky top-[60px] z-10 bg-gray-50 space-x-1 p-1 rounded-lg mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-2 text-sm rounded-md ${
            activeTab === tab
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          {tab === "upcoming" && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {counts.upcoming}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
