"use client";

import useDaycareAuthStore from "@/stores/ProvidersStore";
import { useEffect } from "react";

export default function BrandCard() {
  const { daycare, fetchDaycare } = useDaycareAuthStore();

  useEffect(() => {
    fetchDaycare();
  }, [fetchDaycare]);
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden mt-5 md:2">
      {/* Content */}
      <div className="px-5 py-3 text-center">
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900">{daycare?.name}</h2>

        {/* Subtitle */}
        <p className="text-sm font-medium text-slate-500">
          Powered by{" "}
          <span className="text-blue-600 font-semibold">AskNani</span>
        </p>
      </div>
    </div>
  );
}
