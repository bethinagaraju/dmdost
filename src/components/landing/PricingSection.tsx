import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["1 Instagram Profile", "100 DMs / Month", "No Templates Box", "Full Analytics", "Feedback"],
    popular: false,
  },
  {
    id: "local",
    name: "Local",
    price: 19,
    features: ["Business UI Kits", "500 DMs / Month", "10 Templates", "Pro Plugins", "No limit on themes", "Analytics Plugin", "100 UI Kits"],
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    price: 30,
    features: ["Monthly", "Monthly Themes Box", "Billed Monthly = Pro", "All UI Kits + Plugins", "Unlimited automations", "Full Customization", "Cancel Anytime"],
    popular: true,
  },
  {
    id: "organization",
    name: "Organization",
    price: 100,
    features: ["2-5 Pro UI Components", "Up to 10k Themes", "Custom Plugins", "Unlimited automations", "Analytics Plugin", "Dedicated Support", "1000 UI Kits"],
    popular: false,
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-pink-50/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Pricing</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Start for free. Scale as you grow. No hidden fees.
          </p>

          <div className="inline-flex items-center gap-2 bg-white rounded-full p-1 border shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                !isYearly ? "bg-purple-100 text-purple-700 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                isYearly ? "bg-purple-100 text-purple-700 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-2 py-0.5 text-xs">20% Discount</Badge>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-end">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col p-8 rounded-3xl bg-white transition-all duration-300 card-shadow",
                plan.popular ? "border-2 border-purple-500 shadow-xl shadow-purple-500/20 md:-translate-y-4" : "border border-white/60 hover:-translate-y-1"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-foreground">
                    ${isYearly ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm font-medium">/mo</span>
                  )}
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground font-medium">
                    <Check className="size-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full h-12 rounded-xl text-base font-semibold",
                  plan.popular
                    ? "gradient-brand text-white border-0 hover:opacity-90"
                    : "bg-white border-2 border-muted hover:bg-gray-50 text-foreground"
                )}
                asChild
              >
                <Link to="/register">
                  Start Free
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
