import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "@/constants";

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Start for free. Scale as you grow. No hidden fees.
          </p>

          <div className="inline-flex items-center gap-2 bg-muted rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                !isYearly ? "bg-background shadow text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                isYearly ? "bg-background shadow text-foreground" : "text-muted-foreground"
              )}
            >
              Yearly
              <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">Save 20%</Badge>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col p-6 rounded-2xl border bg-card transition-all duration-300",
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/20 scale-105"
                  : "hover:shadow-md hover:-translate-y-1"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-brand text-white border-0 px-3 py-1 shadow-lg">
                    <Sparkles className="size-3 mr-1" />Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className={cn("text-lg font-bold mb-2", plan.color)}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground text-sm">/mo</span>
                  )}
                </div>
                {isYearly && plan.price.monthly > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed ${plan.price.yearly * 12}/year
                  </p>
                )}
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  plan.popular
                    ? "gradient-brand text-white border-0 hover:opacity-90 shadow-md"
                    : ""
                )}
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link to="/register">
                  {plan.id === "free" ? "Start Free" : `Get ${plan.name}`}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
