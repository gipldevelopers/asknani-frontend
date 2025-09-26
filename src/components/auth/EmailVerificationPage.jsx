"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useAuthStore from "@/stores/AuthStore";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // from email link
  const email = searchParams.get("email");

  const [status, setStatus] = useState("pending"); // pending, success, error
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); // for resend email cooldown
  const { setToken } = useAuthStore();
  // Countdown for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle verification
  const handleVerifyEmail = async () => {
    if (!token || !email) {
      setStatus("error");
      toast.error("Invalid verification link");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`
      );

      if (res.data?.token) {
        // ✅ auto-login by setting token in AuthStore
        setToken(res.data.token);

        setStatus("success");
        toast.success("Email verified successfully!");

        // Redirect after short delay
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setStatus("error");
        toast.error(res.data?.message || "Verification failed");
      }
    } catch (err) {
      setStatus("error");
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/resend`,
        {
          email,
        }
      );
      toast.success("Verification email resent!");
      setCountdown(60);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to resend email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-8 rounded-2xl">
          <CardHeader className="text-center px-0 pt-0">
            <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-indigo-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Verify Your Email
            </h2>
            <p className="text-gray-700 mt-2 text-sm mb-2">
              We've sent a verification link to{" "}
              <span className="font-medium">{email || "your email"}</span>
            </p>
          </CardHeader>

          <CardContent className="px-0">
            {/* Alerts */}
            {status === "pending" && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800">
                  Check your inbox
                </AlertTitle>
                <AlertDescription className="text-blue-700">
                  Click the link in your email to complete your registration.
                </AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">
                  Email Verified!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Your email has been successfully verified. Redirecting...
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800">
                  Verification Failed
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  The verification link is invalid or expired.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-white/30 p-4 rounded-lg flex items-start mb-6">
              <Clock className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800">
                  Didn&apos;t receive the email?
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  Check your spam folder or request a new verification link.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {status !== "success" && (
                <Button
                  onClick={handleVerifyEmail}
                  variant="default"
                  className="w-full flex items-center justify-center"
                  disabled={loading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {loading ? "Verifying..." : "I've Verified My Email"}
                </Button>
              )}

              {status !== "success" && countdown === 0 && (
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  disabled={loading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Resend Email
                </Button>
              )}

              {countdown > 0 && status !== "success" && (
                <p className="text-center text-sm text-gray-600">
                  You can resend the email in {countdown} seconds
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="px-0 pb-0 mt-4">
            <div className="text-center text-sm text-gray-600 w-full">
              <p>
                Need help?{" "}
                <a
                  href="/support"
                  className="text-indigo-700 hover:underline font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
