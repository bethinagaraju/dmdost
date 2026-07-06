import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <div className="text-9xl font-black text-gradient leading-none mb-4">404</div>
          <div className="size-24 mx-auto rounded-full gradient-brand opacity-10 absolute blur-3xl -z-10" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Check the URL or head back to the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => history.back()}>
            <ArrowLeft className="size-4 mr-2" />Go Back
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
