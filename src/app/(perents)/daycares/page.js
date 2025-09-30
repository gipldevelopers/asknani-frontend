import DaycareListingsPage from "@/components/daycars/daycareList";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DaycareListingsPage />
    </Suspense>
  );
}
