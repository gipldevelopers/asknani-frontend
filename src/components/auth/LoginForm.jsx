// components/AuthForms/LoginForm.jsx
"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Baby,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAuthStore from "@/stores/AuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "../ui/alert";

import Link from "next/link";

export default function LoginForm() {
  const { setToken } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
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
      const res = await login(data);

      // If login was successful
      if (res.success) {
        setToken(res.data.token);
        toast.success(res.data.message || "Login successful!");
        window.location.href = "/";
      } else {
        // Handle different error cases from backend
        const errorData = res.error?.response?.data;

        if (errorData) {
          // Handle validation errors (422 status)
          if (res.error.response.status === 422 && errorData.errors) {
            const backendErrors = errorData.errors;
            Object.keys(backendErrors).forEach((field) =>
              setError(field, {
                type: "server",
                message: backendErrors[field][0],
              })
            );
            setFormErrors(Object.values(backendErrors).flat());
            toast.error(
              errorData.message || "Please fix the highlighted errors"
            );
          }
          // Handle invalid credentials (401 status)
          else if (res.error.response.status === 401) {
            // The backend returns email error for invalid credentials
            if (errorData.errors && errorData.errors.email) {
              setError("email", {
                type: "server",
                message: errorData.errors.email[0],
              });
              setError("password", {
                type: "server",
                message: " ", // Empty message to highlight the field
              });
              setFormErrors([errorData.errors.email[0]]);
            } else {
              setFormErrors([errorData.message || "Invalid credentials"]);
            }
            toast.error(errorData.message || "Invalid credentials");
          }
          // Handle token generation errors (500 status)
          else if (res.error.response.status === 500) {
            setFormErrors([
              errorData.message || "Server error, please try again",
            ]);
            toast.error(errorData.message || "Server error, please try again");
          }
          // Handle other errors
          else {
            setFormErrors([errorData.message || "Login failed"]);
            toast.error(errorData.message || "Login failed");
          }
        } else {
          // Fallback for unexpected error format
          setFormErrors(["An unexpected error occurred"]);
          toast.error("An unexpected error occurred");
        }
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Login error:", error);
      setFormErrors(["Something went wrong. Please try again."]);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Centered, single-panel card */}
      <Card className="w-full max-w-sm overflow-hidden shadow-2xl rounded-2xl border-0 p-6">
        <CardHeader className="text-center px-0 pt-0">
          <div className="flex justify-center mb-4">
            {/* Simple logo and branding at the top */}
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <Baby className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Sign in to continue to your account.
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

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-0 pb-0 flex flex-col space-y-4 text-center">
          <p className="text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Secure & encrypted
              </span>
            </div>
          </div>
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
