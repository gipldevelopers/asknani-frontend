import EmailVerificationPage from "@/components/auth/EmailVerificationPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationPage />
    </Suspense>
  );
};

export default page;
