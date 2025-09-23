"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setFormErrors([]);
    setIsLoading(true);

    try {
      // 🔗 call your backend API to send reset link
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Reset link sent to your email!");
      } else {
        if (res.status === 422 && result.errors) {
          Object.keys(result.errors).forEach((field) =>
            setError(field, { type: "server", message: result.errors[field][0] })
          );
          setFormErrors(Object.values(result.errors).flat());
        } else {
          setFormErrors([result.message || "Something went wrong"]);
          toast.error(result.message || "Something went wrong");
        }
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setFormErrors(["Something went wrong, please try again later."]);
      toast.error("Something went wrong, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm overflow-hidden shadow-2xl rounded-2xl border-0 p-6">
        <CardHeader className="text-center px-0 pt-0">
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Enter your registered email to receive a reset link.
          </p>
        </CardHeader>

        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {formErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <CardContent className="px-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-0 pb-0 flex flex-col space-y-4 text-center">
          <p className="text-sm text-gray-600 mt-4">
            Back to{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Login
            </Link>
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              <span>Privacy First</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
