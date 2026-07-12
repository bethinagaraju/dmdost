import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services";
import { showToast } from "@/hooks";
import { APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  // Tick down timer
  useEffect(() => {
    let intervalId: any;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer]);

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

  const handleResendOtp = async () => {
    if (!email) {
      showToast("Email address is missing from the URL search params.", "error");
      return;
    }
    setResending(true);
    setApiError(null);
    try {
      await authService.resendOtp(email);
      showToast("A new verification OTP has been sent! ✉️", "success");
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setApiError(err.message || "Failed to resend OTP. Try again.");
      showToast("Resend failed", "error");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      showToast("Please enter the full 6-digit code", "error");
      return;
    }
    if (!email) {
      showToast("Email is missing from query parameters.", "error");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      await authService.verifyOtp(email, code);
      showToast("Email verification successful! You can now log in. 🎉", "success");
      navigate("/login");
    } catch (err: any) {
      setApiError(err.message || "Invalid OTP. Please try again.");
      showToast("Verification failed", "error");
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
          We sent a 6-digit code to <strong>{email || "your email"}</strong>.
          Enter it below to verify your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center mb-6">
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
                disabled={isLoading}
              />
            ))}
          </div>

          {/* API Error Notification */}
          {apiError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg mb-6 text-left">
              <AlertCircle className="size-4 shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          <Button type="submit" className="w-full gradient-brand text-white border-0 hover:opacity-90 mb-4 h-12" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mb-6">
          Didn't receive a code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="text-primary font-medium hover:underline focus:outline-none"
            >
              {resending ? "Resending..." : "Resend code"}
            </button>
          ) : (
            <span className="font-medium text-zinc-500">Resend in {timer}s</span>
          )}
        </p>

        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
