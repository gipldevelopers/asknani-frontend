"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // ✅ reset token from email link

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setFormErrors([]);
    setIsLoading(true);

    try {
      // 🔗 call your backend API
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Password reset successful!");
        router.push("/login");
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
      console.error("Reset password error:", err);
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
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Enter your new password below.
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
              <Label htmlFor="password">New Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password_confirmation"
                  type={showConfirm ? "text" : "password"}
                  className="pl-10 pr-10"
                  {...register("password_confirmation", {
                    required: "Confirm your password",
                    validate: (val) =>
                      val === watch("password") || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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
