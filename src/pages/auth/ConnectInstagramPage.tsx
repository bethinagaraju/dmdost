import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { instagramService } from "@/services";
import { showToast } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ConnectInstagramPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
        return;
      }

      const checkStatus = async () => {
        try {
          const res = await instagramService.getStatus();
          const hasConnected = Array.isArray(res.data) && res.data.some((ws) => ws.connected);
          if (hasConnected) {
            navigate("/dashboard", { replace: true });
          } else {
            setIsCheckingStatus(false);
          }
        } catch (error) {
          setIsCheckingStatus(false);
        }
      };

      checkStatus();
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleConnect = async () => {

    setIsLoading(true);
    try {
      const response = await instagramService.connectAccount();
      if (response.success && response.data?.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      } else {
        showToast(response.message || "Failed to generate authorization URL", "error");
        setIsLoading(false);
      }
    } catch (error: any) {
      showToast(error.message || "Something went wrong", "error");
      setIsLoading(false);
    }
  };

  if (authLoading || isCheckingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#E1306C]/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border shadow-xl rounded-3xl p-8 space-y-8 text-center relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" />

          <div className="space-y-4">
            <div className="mx-auto size-20 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center shadow-lg mb-6">
              <InstagramIcon className="size-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Connect Instagram</h1>
            <p className="text-muted-foreground text-sm">
              Link your Instagram professional account to unlock powerful automation and analytics for your DMs.
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap className="size-4" />
              </div>
              <div className="text-sm font-medium">Automate your DMs & Replies</div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="size-4" />
              </div>
              <div className="text-sm font-medium">Track Engagement Analytics</div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </div>
              <div className="text-sm font-medium">Official API & Secure Access</div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-opacity border-0 text-white shadow-md hover:shadow-lg"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                "Connecting..."
              ) : (
                <>
                  Connect with Instagram
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>

            <button
              onClick={() => navigate("/login")}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              disabled={isLoading}
            >
              Sign out and try another account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
