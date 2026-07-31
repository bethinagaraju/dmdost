import { motion } from "framer-motion";
import { Link2, Settings2, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Connect",
    description: "Macintosh hands-on branch, frame structuring into deal auto-flow.",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    icon: Settings2,
    title: "Customize",
    description: "Working variants to customize campaign dates and details securely out the box.",
    color: "text-pink-600",
    bg: "bg-pink-100",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Launch all campaigns in autopilot to hit absolute fit in growth goals.",
    color: "text-purple-600",
    bg: "bg-purple-100",
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-4 block">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 mb-4">Up and Running in 5 Minutes</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            It's in the mornings. How to eliminate the block to lean over in your Instagram growth.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div className={`size-20 rounded-3xl ${step.bg} flex items-center justify-center mb-6 shadow-xl shadow-purple-500/10`}>
                    <Icon className={`size-10 ${step.color}`} />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.description}</p>
                  
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-10 -right-12 text-muted-foreground/30 items-center justify-center w-24">
                      <ArrowRight className="size-8" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
