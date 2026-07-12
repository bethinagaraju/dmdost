"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { showToast } from "@/hooks";
import { APP_NAME } from "@/constants";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setApiError(null);
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      showToast("Account registered! Please verify your email. 🎉", "success");
      // Redirect to OTP verification page
      navigate(`/otp-verification?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed. Please try again.";
      setApiError(errorMessage);
      showToast("Registration failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Header */}
      <header className="w-full px-6 py-6 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#4F46E5]" />
          <span className="font-medium text-[15px] tracking-tight text-zinc-900">{APP_NAME}</span>
        </Link>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <h1 className="text-[26px] font-bold tracking-tight text-zinc-900 mb-1.5">
              Create your account
            </h1>
            <p className="text-zinc-500 text-sm">Get started with {APP_NAME} today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Inline First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-[13px] font-medium text-zinc-700 mb-1.5 block">
                  First name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", { required: "First name is required" })}
                  className={`h-11 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] ${errors.firstName ? "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className="text-[12px] text-red-500 mt-1.5">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-[13px] font-medium text-zinc-700 mb-1.5 block">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", { required: "Last name is required" })}
                  className={`h-11 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] ${errors.lastName ? "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <p className="text-[12px] text-red-500 mt-1.5">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-[13px] font-medium text-zinc-700 mb-1.5 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" }
                })}
                className={`h-11 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] ${errors.email ? "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400" : ""}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-[12px] text-red-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-[13px] font-medium text-zinc-700 mb-1.5 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" }
                  })}
                  className={`h-11 pr-10 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] ${errors.password ? "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400" : ""}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-red-500 mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-zinc-700 mb-1.5 block">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) => val === watch("password") || "Passwords don't match",
                  })}
                  className={`h-11 pr-10 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] ${errors.confirmPassword ? "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400" : ""}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[12px] text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <Checkbox
                id="agree"
                {...register("agree", { required: "You must accept the terms" })}
                className="mt-0.5"
                disabled={isSubmitting}
              />
              <Label htmlFor="agree" className="text-[13px] font-normal text-zinc-500 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-zinc-900 hover:text-[#4F46E5] transition-colors font-medium">Terms</a>
                {" "}and{" "}
                <a href="#" className="text-zinc-900 hover:text-[#4F46E5] transition-colors font-medium">Privacy Policy</a>
              </Label>
            </div>
            {errors.agree && (
              <p className="text-[12px] text-red-500 mt-0.5">{errors.agree.message}</p>
            )}

            {/* API Error Notification */}
            {apiError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="size-4 shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-[14px] font-medium bg-[#4F46E5] hover:bg-[#4338CA] text-white mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="size-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#FAFAF9] px-3 text-[12px] text-zinc-400">or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-2.5 rounded-md border border-zinc-200 bg-white text-[14px] font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors mb-6"
            disabled={isSubmitting}
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[13px] text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-zinc-900 font-medium hover:text-[#4F46E5] transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
