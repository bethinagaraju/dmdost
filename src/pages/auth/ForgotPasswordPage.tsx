import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services";
import { showToast } from "@/hooks";
import { APP_NAME } from "@/constants";

interface ForgotForm { email: string }

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    setApiError(null);
    try {
      const response = await authService.forgotPassword(data.email);
      showToast("Reset token generated successfully! 🔑", "success");
      // Since it's local development/testing, the token is returned in data.
      // Redirect directly to reset password with prefilled token & email
      const resetToken = response.data;
      setTimeout(() => {
        navigate(`/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(data.email)}`);
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to generate password reset token. Try again.";
      setApiError(errorMessage);
      showToast("Request failed", "error");
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
            <Mail className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Forgot Password?</h2>
          <p className="text-muted-foreground">Enter your email and we'll generate a reset token.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })}
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* API Error Notification */}
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="size-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          <Button type="submit" className="w-full gradient-brand text-white border-0 hover:opacity-90 h-12" disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Generate Reset Token"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" />Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
