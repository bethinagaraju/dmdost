import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services";
import { showToast } from "@/hooks";
import { APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { showToast("Please enter the full 6-digit code", "error"); return; }
    setIsLoading(true);
    try {
      await authService.verifyOtp(code);
      showToast("Email verified successfully! 🎉", "success");
      navigate("/dashboard");
    } catch {
      showToast("Invalid OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-12 justify-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>
          <span className="text-gradient">{APP_NAME}</span>
        </Link>

        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
          <ShieldCheck className="size-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-muted-foreground mb-8">
          We sent a 6-digit code to <strong>alex@example.com</strong>.
          Enter it below to verify your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  "w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-background transition-all outline-none",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  digit ? "border-primary bg-primary/5" : "border-input"
                )}
              />
            ))}
          </div>

          <Button type="submit" className="w-full gradient-brand text-white border-0 hover:opacity-90 mb-4" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mb-4">
          Didn't receive a code?{" "}
          <button className="text-primary font-medium hover:underline">Resend in 60s</button>
        </p>

        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
