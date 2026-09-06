import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["1 Instagram Profile", "100 DMs / Month", "No Templates Box", "Full Analytics", "Feedback"],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 39,
    features: ["3 Instagram Profiles", "Unlimited DMs / Month", "Templates Access", "Advanced Analytics", "24/7 Priority Support"],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    features: ["10 Instagram Profiles", "Unlimited DMs", "Custom Workflows", "Dedicated Manager", "API Access"],
    popular: false,
  },
];

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { isAuthenticated } = useAuth();

  return (
    <section id="pricing" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Flexible <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the plan that fits your growth needs.
          </p>

          <div className="inline-flex items-center gap-3 p-1.5 bg-muted rounded-full border shadow-inner">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold transition-all",
                billing === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5",
                billing === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Yearly <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">20% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "rounded-3xl p-8 flex flex-col relative transition-all duration-300",
                plan.popular
                  ? "bg-card border-2 border-primary shadow-xl shadow-primary/10 scale-105 z-10"
                  : "bg-card border shadow-sm hover:shadow-md"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-brand text-white border-0 px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${billing === "yearly" ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary flex-shrink-0" />
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
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to Dashboard" : (plan.id === "free" ? "Start Free" : "Get Started")}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
