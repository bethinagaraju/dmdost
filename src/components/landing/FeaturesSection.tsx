import { motion } from "framer-motion";
import {
  MessageCircle, MessageSquare, UserCheck, BarChart3, Infinity, Webhook, Users, Shield,
} from "lucide-react";
import { FEATURES } from "@/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle, MessageSquare, UserCheck, BarChart3, Infinity, Webhook, Users, Shield,
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Features</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Everything You Need to Grow</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful automation tools designed for Instagram creators, businesses, and marketing agencies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-6 rounded-2xl border bg-card hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className={`size-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {Icon && <Icon className={`size-6 ${feature.color}`} />}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
