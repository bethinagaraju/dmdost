import { motion } from "framer-motion";
import { Plus, MessageSquare, MessageCircle, Users, Zap, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils";
import type { WorkspaceAnalytics } from "@/types";

export interface AutomationHeaderProps {
  totalCount: number;
  activeCount: number;
  onCreateClick: () => void;
  analytics?: WorkspaceAnalytics | null;
}

export function AutomationHeader({
  totalCount,
  activeCount,
  onCreateClick,
  analytics,
}: AutomationHeaderProps) {
  const dmsSent = analytics?.totalDmsSent ?? 0;
  const commentsSent = analytics?.totalCommentsSent ?? 0;
  const followersGained = analytics?.totalFollowersGained ?? 0;
  const totalRuns = analytics?.totalRuns ?? 0;
  const activeAutos = analytics?.activeAutomationsCount ?? activeCount;
  const totalAutos = analytics?.totalAutomationsCount ?? totalCount;
  const buttonClicks = analytics?.totalButtonClicks ?? 0;

  const statCards = [
    {
      title: "Total DMs Sent",
      value: formatNumber(dmsSent),
      subtitle: "Direct messages sent in workspace",
      icon: MessageSquare,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      accent: "from-blue-500/10 to-transparent",
    },
    {
      title: "Total Comments Sent",
      value: formatNumber(commentsSent),
      subtitle: "Comment replies posted",
      icon: MessageCircle,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      accent: "from-purple-500/10 to-transparent",
    },
    {
      title: "Followers Gained",
      value: `+${formatNumber(followersGained)}`,
      subtitle: "Gained via follow gates",
      icon: Users,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      accent: "from-emerald-500/10 to-transparent",
      highlight: true,
    },
    {
      title: "Total Runs & Active",
      value: formatNumber(totalRuns),
      subtitle: `${activeAutos} active / ${totalAutos} total`,
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      accent: "from-amber-500/10 to-transparent",
      extraBadge: buttonClicks > 0 ? `${formatNumber(buttonClicks)} clicks` : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your comment-to-DM triggers, growth gates, and automated reply funnels
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          size="lg"
          className="gradient-brand text-white border-0 hover:opacity-90 shadow-md shadow-primary/20 rounded-xl shrink-0"
        >
          <Plus className="size-4 mr-2" />Create Automation
        </Button>
      </div>

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative overflow-hidden rounded-2xl border bg-card/70 backdrop-blur-sm p-4 hover:shadow-md transition-all hover:border-border/80 group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.accent} rounded-bl-full pointer-events-none opacity-60`} />

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                <div className={`size-8 rounded-xl flex items-center justify-center border ${card.color} transition-transform group-hover:scale-105`}>
                  <Icon className="size-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">{card.value}</span>
                {card.extraBadge && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary px-1.5 py-0.5 rounded-md bg-primary/10">
                    <MousePointerClick className="size-3" />
                    {card.extraBadge}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-1 truncate">
                {card.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
