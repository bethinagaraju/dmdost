import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/constants";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] bg-gradient-to-r from-purple-600 to-pink-500 p-12 md:p-20 text-center mb-16 shadow-2xl shadow-purple-500/20"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 max-w-3xl mx-auto">
            Ready for Peak Instagram Growth?
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Don't miss out - join our waitlist now for early access, special pricing and exclusive deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="h-14 px-10 bg-white text-purple-600 hover:bg-white/90 font-bold text-lg rounded-xl shadow-lg">
              <Link to="/register">
                Start for Free
              </Link>
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-6 flex items-center justify-center gap-2">
            <span className="flex size-1.5 rounded-full bg-green-400"></span>
            More than 50k users have joined
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <img src="/logo.png" alt={APP_NAME} className="size-8 object-contain" />
              <span className="text-gradient">{APP_NAME}</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              The #1 Instagram automation platform for creators and businesses. Automate your growth on autopilot.
            </p>
            <div className="flex gap-3">
              {[X, ExternalLink, ExternalLink, ExternalLink].map((Icon, i) => (
                <a key={i} href="#" className="size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Features", "Pricing", "How It Works", "Changelog", "Roadmap"].map((item) => (
                <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Documentation", "Blog", "Tutorials", "API Reference", "Status Page"].map((item) => (
                <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/data-deletion" className="hover:text-foreground transition-colors">Data Deletion</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {year} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
