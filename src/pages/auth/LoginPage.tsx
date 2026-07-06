import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { showToast } from "@/hooks";
import { APP_NAME } from "@/constants";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    defaultValues: { email: "alex@example.com", password: "password123", remember: true },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      showToast("Welcome back! 🎉", "success");
      navigate("/dashboard");
    } catch {
      showToast("Invalid email or password", "error");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center"
          >
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur mb-8 mx-auto">
              <Zap className="size-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{APP_NAME}</h1>
            <p className="text-white/80 text-lg mb-12">Automate Your Instagram, Amplify Your Growth</p>
            <div className="space-y-4">
              {[
                { stat: "50,000+", label: "Active Users" },
                { stat: "10M+", label: "Messages Sent" },
                { stat: "98.5%", label: "Satisfaction Rate" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl font-bold">{item.stat}</div>
                  <div className="text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-8 lg:hidden">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" />
              </div>
              <span className="text-gradient">{APP_NAME}</span>
            </Link>
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
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
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                  aria-invalid={!!errors.password}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" {...register("remember")} />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me for 30 days</Label>
            </div>

            <Button type="submit" className="w-full gradient-brand text-white border-0 hover:opacity-90" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : <><LogIn className="size-4 mr-2" />Sign In</>}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                Demo Accounts
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border p-3 bg-muted/50">
                <div className="font-medium mb-1">User Demo</div>
                <div className="text-muted-foreground">alex@example.com</div>
                <div className="text-muted-foreground">password123</div>
              </div>
              <div className="rounded-lg border p-3 bg-muted/50">
                <div className="font-medium mb-1">Admin Demo</div>
                <div className="text-muted-foreground">admin@instaautodm.com</div>
                <div className="text-muted-foreground">admin123</div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
