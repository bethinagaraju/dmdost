import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Play, TrendingUp, MessageCircle, Users, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STATS, TRUSTED_COMPANIES } from "@/constants";

const floatingCards = [
  { icon: MessageCircle, label: "DMs Sent", value: "10M+", color: "text-chart-1" },
  { icon: TrendingUp, label: "Growth Rate", value: "+340%", color: "text-chart-2" },
  { icon: Users, label: "Users", value: "50K+", color: "text-chart-3" },
  { icon: Zap, label: "Automations", value: "500K+", color: "text-chart-5" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 gradient-brand text-white border-0 px-4 py-1.5 text-sm">
              🚀 Trusted by 50,000+ Instagram creators
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-6"
          >
            Automate Your{" "}
            <span className="text-gradient">Instagram</span>
            {" "}& Amplify Your{" "}
            <span className="text-gradient">Growth</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto"
          >
            Send personalized DMs, auto-reply to comments, and engage with followers on autopilot.
            Scale your Instagram growth without lifting a finger.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" asChild className="gradient-brand text-white border-0 hover:opacity-90 shadow-lg shadow-primary/30 text-base h-12 px-8">
              <Link to="/register">
                Start Free Today <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              <Play className="mr-2 size-4" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground mb-16"
          >
            ✓ No credit card required &nbsp;&nbsp; ✓ Free plan forever &nbsp;&nbsp; ✓ Setup in 5 minutes
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="h-8 bg-muted flex items-center gap-1.5 px-4">
                <div className="size-3 rounded-full bg-destructive/60" />
                <div className="size-3 rounded-full bg-yellow-400/60" />
                <div className="size-3 rounded-full bg-green-400/60" />
                <span className="ml-2 text-xs text-muted-foreground">InstaAutoDM Dashboard</span>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {floatingCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="bg-muted/50 rounded-xl p-4 text-center border"
                  >
                    <card.icon className={`size-6 mx-auto mb-2 ${card.color}`} />
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-xs text-muted-foreground">{card.label}</div>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="bg-muted/30 rounded-xl p-4 flex items-center gap-4 border">
                  <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Zap className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">Automation Running</div>
                    <div className="text-xs text-muted-foreground">Welcome DM Campaign • 1,240 triggered today</div>
                  </div>
                  <div className="flex size-2 rounded-full bg-green-500 shrink-0">
                    <div className="size-2 rounded-full bg-green-500 animate-ping" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 hidden md:block">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-card border rounded-xl shadow-lg p-3 flex items-center gap-2"
              >
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="size-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold">New DM Sent!</div>
                  <div className="text-[10px] text-muted-foreground">to @user123</div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -bottom-4 -left-4 hidden md:block">
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="bg-card border rounded-xl shadow-lg p-3 flex items-center gap-2"
              >
                <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="size-4 text-green-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold">+340% Engagement</div>
                  <div className="text-[10px] text-muted-foreground">vs last month</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">Trusted by leading brands & creators</p>
          <div className="flex flex-wrap justify-center gap-8">
            {TRUSTED_COMPANIES.map((company) => (
              <span key={company} className="text-muted-foreground/60 font-semibold text-sm">{company}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
