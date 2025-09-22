"use client";
import Footer from "@/components/Helper/Footer";
import Navbar from "@/components/Helper/Navbar";
import useAuthStore from "@/stores/AuthStore";
import { useEffect } from "react";

export default function Layout({ children }) {
  const loadToken = useAuthStore((state) => state.loadToken);

  useEffect(() => {
    loadToken(); // ✅ load token once on app mount
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
