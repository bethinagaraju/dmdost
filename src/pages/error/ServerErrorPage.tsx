import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <div className="text-9xl font-black text-gradient leading-none mb-4">500</div>
        </div>
        <h1 className="text-2xl font-bold mb-3">Internal server error</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again in a few minutes.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="size-4 mr-2" />Retry
          </Button>
          <Button asChild className="gradient-brand text-white border-0 hover:opacity-90">
            <Link to="/dashboard">
              <Home className="size-4 mr-2" />Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
