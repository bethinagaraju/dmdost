import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, KeyRound, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services";
import { showToast } from "@/hooks";
import { APP_NAME } from "@/constants";

interface ResetForm {
  token: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenFromUrl = searchParams.get("token") || "";

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetForm>({
    defaultValues: {
      token: tokenFromUrl,
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: ResetForm) => {
    setApiError(null);
    try {
      await authService.resetPassword({
        resetToken: data.token,
        newPassword: data.password,
      });
      showToast("Password reset successfully! Please log in with your new password.", "success");
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to reset password. Please check your token.";
      setApiError(errorMessage);
      showToast("Reset failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-12 justify-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>
          <span className="text-gradient">{APP_NAME}</span>
        </Link>

        <div className="text-center mb-8">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
            <KeyRound className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-muted-foreground">Enter your reset token and new password below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Token Field */}
          <div className="space-y-2">
            <Label htmlFor="token">Reset Token</Label>
            <Input
              id="token"
              placeholder="Enter your 36-character reset token"
              {...register("token", { required: "Reset token is required" })}
              aria-invalid={!!errors.token}
              disabled={isSubmitting || !!tokenFromUrl}
              className={tokenFromUrl ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}
            />
            {tokenFromUrl && (
              <p className="text-xs text-green-600 font-medium mt-1">Reset token prefilled from URL link</p>
            )}
            {errors.token && <p className="text-xs text-destructive">{errors.token.message}</p>}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } })}
                aria-invalid={!!errors.password}
                className="pr-10"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat new password"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (val) => val === watch("password") || "Passwords don't match",
              })}
              aria-invalid={!!errors.confirmPassword}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          {/* API Error Notification */}
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="size-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          <Button type="submit" className="w-full gradient-brand text-white border-0 hover:opacity-90 h-12" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
