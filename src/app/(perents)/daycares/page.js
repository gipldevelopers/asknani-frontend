import DaycareListingsPage from "@/components/daycars/daycareList";
import React, { Suspense } from "react";

export const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DaycareListingsPage />
    </Suspense>
  );
};
