import { motion } from "framer-motion";
import {
  MessageCircle, MessageSquare, UserCheck, BarChart3, Infinity, Webhook, Users, Shield, Zap, Sparkles
} from "lucide-react";
import { FEATURES } from "@/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle, MessageSquare, UserCheck, BarChart3, Infinity, Webhook, Users, Shield, Zap, Sparkles
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Features</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 mb-4">Everything You Need to Grow</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Based on modern invention, shifts in algorithmic changes, everything is built to help you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Sparkles;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-8 rounded-3xl bg-white card-shadow border border-white/60 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                
                <div className={`size-12 rounded-xl ${feature.bg || 'bg-purple-100'} flex items-center justify-center mb-6 relative z-10`}>
                  <Icon className={`size-6 ${feature.color || 'text-purple-600'}`} />
                </div>
                
                <h3 className="font-bold text-xl mb-3 relative z-10 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
