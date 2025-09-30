"use client"; // Required if you are using hooks (like useState) in Next.js App Router

import React, { useEffect, useState } from "react";
// shadcn/ui imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display

// Icons (assuming you use lucide-react)
import { User, Bell, CreditCard, Save, Lock, User2Icon } from "lucide-react";
import API from "@/lib/api";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("payments"); // Start on the Payments tab
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    accountName: "",
    upiId: "",
  });
  // Fetch existing payment settings on mount
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/provider/payment-setting");
        if (res.data.payment_setting) {
          setPaymentData({
            accountName: res.data.payment_setting.name || "",
            upiId: res.data.payment_setting.upi_id || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch payment settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePayments = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    if (!paymentData.accountName || !paymentData.upiId) {
      setError("Please fill in both Account Name and UPI ID.");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        name: paymentData.accountName,
        upi_id: paymentData.upiId,
      };
      const res = await API.post("/provider/payment-setting", payload);
      alert("Payment details saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save payment settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Loading payment settings...</p>;
  return (
    // Outer container with responsive padding and max width
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* 🛑 Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account preferences, payments, and notifications.
        </p>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <Separator className="mb-8" />

      {/* 🏆 CORRECTED Vertical Tabs Structure 🏆 
          The Tabs component now acts as the flex container for its children.
      */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        // Add flex properties directly to the Tabs component to create the two columns
        className="flex space-x-12 w-full flex-row"
      >
        {/* 1. Vertical Tabs Menu (TabsList) - The first column */}
        <TabsList className="flex flex-col flex-shrink-0 w-52 h-auto p-0 space-y-1 bg-transparent border-r dark:border-gray-700">
          {/* Payments Tab Trigger (Your primary focus) */}
          <TabsTrigger
            value="payments"
            className="justify-start px-4 py-2 text-md data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:border-l-2 data-[state=active]:border-primary  transition-colors"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="justify-start px-4 py-2 text-md data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:border-l-2 data-[state=active]:border-primary  transition-colors"
          >
            <Lock className="h-4 w-4 mr-2" />
            Password
          </TabsTrigger>
          <TabsTrigger
            value="userinfo"
            className="justify-start px-4 py-2 text-md data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:border-l-2 data-[state=active]:border-primary  transition-colors"
          >
            <User2Icon className="h-4 w-4 mr-2" />
            User Info
          </TabsTrigger>
        </TabsList>

        {/* 2. Tabs Content Area - The second column, takes up remaining space */}
        <div className="flex-1 min-w-0">
          {/* --- Payments Content (Your requested form) --- */}
          {/* ✅ TabsContent is now a direct descendant of the <Tabs> component, fixing the error. */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Provider Settings</CardTitle>
                <CardDescription>
                  Enter your details for receiving payments via UPI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePayments} className="space-y-6">
                  {/* Your Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Your Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Enter your full name"
                      value={paymentData.accountName}
                      onChange={(e) =>
                        handleInputChange("accountName", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* UPI ID Input */}
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="e.g., yourhandle@bank"
                      value={paymentData.upiId}
                      onChange={(e) =>
                        handleInputChange("upiId", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Payment Details"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
