import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, X, ExternalLink } from "lucide-react";
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
          className="rounded-2xl gradient-brand p-12 text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Instagram?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join 50,000+ creators and businesses automating their Instagram growth with InstaAutoDM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="h-12 px-8 bg-white text-primary hover:bg-white/90">
              <Link to="/register">
                Start Free Today <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
          <p className="text-white/60 text-sm mt-4">No credit card required • Free plan forever</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" />
              </div>
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
              {["About Us", "Careers", "Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {year} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
