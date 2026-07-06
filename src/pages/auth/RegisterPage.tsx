import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { showToast } from "@/hooks";
import { APP_NAME } from "@/constants";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const BENEFITS = [
  "Free plan forever, no credit card",
  "2 automations included",
  "500 messages/month",
  "Setup in under 5 minutes",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      showToast("Account created! Welcome to InstaAutoDM 🎉", "success");
      navigate("/dashboard");
    } catch {
      showToast("Registration failed. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur mb-8">
              <Zap className="size-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Join 50,000+ Creators</h2>
            <p className="text-white/80 text-lg mb-10">Start automating your Instagram growth today. It's free!</p>
            <div className="space-y-3">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="size-3 text-white" />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-8 lg:hidden">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" />
              </div>
              <span className="text-gradient">{APP_NAME}</span>
            </Link>
            <h2 className="text-3xl font-bold mb-2">Create your account</h2>
            <p className="text-muted-foreground">Start for free — no credit card required</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Alex Johnson"
                {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  {...register("password", { required: "Password required", minLength: { value: 8, message: "Min 8 characters" } })}
                  aria-invalid={!!errors.password}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (val) => val === watch("password") || "Passwords don't match",
                })}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="agree" {...register("agree", { required: "You must accept the terms" })} className="mt-0.5" />
              <Label htmlFor="agree" className="text-sm font-normal leading-relaxed cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>
            {errors.agree && <p className="text-xs text-destructive">{errors.agree.message}</p>}

            <Button type="submit" className="w-full gradient-brand text-white border-0 hover:opacity-90" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : <><UserPlus className="size-4 mr-2" />Create Free Account</>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
