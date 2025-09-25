import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
