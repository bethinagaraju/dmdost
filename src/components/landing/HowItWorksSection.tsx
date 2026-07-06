import { motion } from "framer-motion";
import type React from "react";
import { UserPlus, Camera, Zap, TrendingUp } from "lucide-react";
import { HOW_IT_WORKS } from "@/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus, Instagram: Camera, Zap, TrendingUp,
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">How It Works</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Up & Running in 5 Minutes</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No technical knowledge needed. Follow these 4 simple steps to automate your Instagram growth.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-16 left-16 right-16 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = iconMap[step.icon];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center relative"
                >
                  <div className="relative z-10 mb-6">
                    <div className="size-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/30 mb-3">
                      {Icon && <Icon className="size-7 text-white" />}
                    </div>
                    <div className="absolute -top-2 -right-2 size-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
