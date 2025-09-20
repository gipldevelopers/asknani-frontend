// components/AuthForms/RegisterForm.jsx
"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Baby,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  User,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import API from "@/lib/api";
import { Alert, AlertDescription } from "../ui/alert";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isParent, setIsParent] = useState(true);
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setFormErrors([]);

    try {
      const res = await API.post("/auth/register", {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: isParent ? "parent" : "provider",
      });

      toast.success(res.data.message || "Registration successful!");
      reset();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const errorList = Object.keys(backendErrors).map((field) => {
          setError(field, {
            type: "server",
            message: backendErrors[field][0],
          });
          return backendErrors[field][0];
        });
        setFormErrors(errorList);
        toast.error("Please fix the highlighted errors");
      } else {
        const errorMessage = err.response?.data?.message || "Something went wrong";
        setFormErrors([errorMessage]);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden shadow-2xl rounded-2xl border-0">
        <div className="md:flex bg-white rounded-2xl">
          <div className="md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white"></div>
              <div className="absolute top-1/4 right-8 w-16 h-16 rounded-full bg-white"></div>
              <div className="absolute bottom-12 left-12 w-20 h-20 rounded-full bg-white"></div>
            </div>
            <div className="relative z-10 text-center mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Baby className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Ask Nani</h1>
              <p className="opacity-90 text-sm">
                Connecting loving parents with trusted daycare providers
              </p>
            </div>
            <div className="relative z-10 mt-8 hidden md:block">
              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 rounded-full bg-white/40 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-white/60 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <p className="text-center text-sm italic text-white/80">
                "Found the perfect daycare for my toddler in just 2 days!"
              </p>
            </div>
          </div>
          <div className="md:w-3/5 p-8">
            <CardHeader className="text-center px-0 pt-0">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600 mt-2 text-md">
                Join thousands of parents finding quality childcare
              </p>
            </CardHeader>
            {formErrors.length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <CardContent className="px-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="mb-4">
                  <Label className="block mb-2 text-sm font-medium">I am a</Label>
                  <Tabs
                    defaultValue="parent"
                    className="w-full"
                    onValueChange={(value) => setIsParent(value === "parent")}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="parent">Parent</TabsTrigger>
                      <TabsTrigger value="provider">Provider</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="relative">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      className="pl-10"
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {isParent && (
                  <div className="relative">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        placeholder="123-456-7890"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                            message: "Please enter a valid phone number",
                          },
                        })}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                )}
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
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
                <div className="relative">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
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
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="px-0 pb-0 flex flex-col space-y-4">
              <div className="text-center text-sm text-gray-600 mt-4">
                <p>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Sign in
                  </a>
                </p>
              </div>
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
          </div>
        </div>
      </Card>
    </div>
  );
}