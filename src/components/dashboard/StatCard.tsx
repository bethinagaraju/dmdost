import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon, gradient, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow",
        gradient && "gradient-brand text-white border-0",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("size-10 rounded-xl flex items-center justify-center", gradient ? "bg-white/20" : "bg-primary/10")}>
          <span className={cn("size-5", gradient ? "text-white" : "text-primary")}>{icon}</span>
        </div>
        {change && (
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            gradient ? "bg-white/20 text-white" :
            changeType === "positive" ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" :
            changeType === "negative" ? "bg-destructive/10 text-destructive" :
            "bg-muted text-muted-foreground"
          )}>
            {change}
          </span>
        )}
      </div>
      <div className={cn("text-3xl font-bold mb-1", gradient ? "text-white" : "text-foreground")}>{value}</div>
      <div className={cn("text-sm", gradient ? "text-white/70" : "text-muted-foreground")}>{title}</div>
    </motion.div>
  );
}
