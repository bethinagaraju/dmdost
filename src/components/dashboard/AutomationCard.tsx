import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal, Zap, Trash2, Copy, Edit, Play, Pause,
  Users, MousePointerClick, MessageSquare, MessageCircle, AlertCircle, Clock, Shuffle,
  History, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { automationService } from "@/services";
import { getStatusColor, getAutomationTypeLabel, formatDate, formatNumber } from "@/utils";
import { cn } from "@/lib/utils";
import type { Automation } from "@/types";

export interface AutomationCardProps {
  automation: Automation;
  index: number;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onEdit: (automation: Automation) => void;
  onDuplicate: (automation: Automation) => void;
  onDelete: (id: string) => void;
  onTest?: (automation: Automation) => void;
  onViewExecutions?: (automation: Automation) => void;
  onViewMetrics?: (automation: Automation) => void;
}

export function AutomationCard({
  automation,
  index,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
  onTest,
  onViewExecutions,
  onViewMetrics,
}: AutomationCardProps) {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    automationService.getAutomationPosts(automation.id)
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.data)) {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.error(`Failed to fetch posts for automation ${automation.id}:`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [automation.id]);

  const firstPost = posts[0];
  const mediaSrc = firstPost
    ? firstPost.mediaType === "VIDEO"
      ? firstPost.thumbnailUrl
      : firstPost.mediaUrl
    : null;

  // Extract the 5 core per-automation metrics
  const followersGained = automation.followersGained ?? automation.metrics?.followersGained ?? automation.stats?.followersGained ?? 0;
  const runs = automation.runs ?? automation.metrics?.runs ?? automation.stats?.runs ?? automation.stats?.triggered ?? 0;
  const buttonClicks = automation.buttonClicks ?? automation.metrics?.buttonClicks ?? automation.stats?.buttonClicks ?? 0;
  const dmsSent = automation.dmsSent ?? automation.metrics?.dmsSent ?? automation.stats?.sent ?? 0;
  const commentsSent = automation.commentsSent ?? automation.metrics?.commentsSent ?? automation.stats?.commentsSent ?? 0;
  const failed = automation.stats?.failed ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border bg-card p-5 hover:shadow-md transition-all hover:border-border/80 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Thumbnail & Title & Badges */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="size-11 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-border bg-muted/20 shadow-xs">
            {mediaSrc ? (
              <img
                src={mediaSrc}
                alt={firstPost?.caption || "Post preview"}
                className="w-full h-full object-cover animate-in fade-in duration-300"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <Zap className="size-5 text-primary" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-semibold text-base text-foreground tracking-tight truncate max-w-xs sm:max-w-md">
                {automation.name}
              </span>
              <Badge variant="outline" className="text-[11px] font-medium py-0 px-2">
                {getAutomationTypeLabel(automation.type)}
              </Badge>
              <Badge className={cn("text-[11px] font-medium py-0 px-2 capitalize", getStatusColor(automation.status))}>
                {automation.status}
              </Badge>
              {automation.delaySeconds !== undefined && automation.delaySeconds > 0 ? (
                <Badge variant="secondary" className="text-[11px] font-medium py-0 px-2 flex items-center gap-1 bg-muted/80 text-muted-foreground border border-border/50">
                  {automation.delayType === "RANDOM" ? (
                    <>
                      <Shuffle className="size-3 text-primary" />
                      1-{automation.delaySeconds}s delay
                    </>
                  ) : (
                    <>
                      <Clock className="size-3 text-primary" />
                      {automation.delaySeconds}s delay
                    </>
                  )}
                </Badge>
              ) : automation.delaySeconds === 0 ? (
                <Badge variant="secondary" className="text-[11px] font-medium py-0 px-2 flex items-center gap-1 bg-muted/80 text-muted-foreground border border-border/50">
                  <Zap className="size-3 text-amber-500" />
                  Instant
                </Badge>
              ) : null}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Updated: {formatDate(automation.updatedAt)}</span>
              {failed > 0 && (
                <span className="inline-flex items-center gap-1 text-destructive font-medium">
                  <AlertCircle className="size-3" />
                  {failed} failed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Toggle Switch & Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-2">
            <Switch
              checked={automation.status === "active"}
              onCheckedChange={() => onToggleStatus(automation.id, automation.status)}
            />
            <span className="text-xs font-medium text-muted-foreground capitalize hidden md:inline">
              {automation.status}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-muted">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem onClick={() => onEdit(automation)} className="cursor-pointer">
                <Edit className="size-4 mr-2" />Edit
              </DropdownMenuItem>
              {onTest && (
                <DropdownMenuItem onClick={() => onTest(automation)} className="cursor-pointer text-primary">
                  <Play className="size-4 mr-2" />Test Simulation
                </DropdownMenuItem>
              )}
              {onViewExecutions && (
                <DropdownMenuItem onClick={() => onViewExecutions(automation)} className="cursor-pointer">
                  <History className="size-4 mr-2" />Execution Logs
                </DropdownMenuItem>
              )}
              {onViewMetrics && (
                <DropdownMenuItem onClick={() => onViewMetrics(automation)} className="cursor-pointer">
                  <BarChart3 className="size-4 mr-2" />View Metrics
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDuplicate(automation)} className="cursor-pointer">
                <Copy className="size-4 mr-2" />Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(automation.id, automation.status)} className="cursor-pointer">
                {automation.status === "active" ? (
                  <>
                    <Pause className="size-4 mr-2" />Pause
                  </>
                ) : (
                  <>
                    <Play className="size-4 mr-2" />Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(automation.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="size-4 mr-2" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 5 Core Per-Automation Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        {/* Followers Gained */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
          <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-emerald-600/80 dark:text-emerald-400/80 tracking-wider">
              Followers Gained
            </div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              +{formatNumber(followersGained)}
            </div>
          </div>
        </div>

        {/* Runs */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20">
          <div className="size-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-amber-600/80 dark:text-amber-400/80 tracking-wider">
              Runs
            </div>
            <div className="text-sm font-bold text-amber-700 dark:text-amber-300">
              {formatNumber(runs)}
            </div>
          </div>
        </div>

        {/* Button Clicks */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20">
          <div className="size-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <MousePointerClick className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-indigo-600/80 dark:text-indigo-400/80 tracking-wider">
              Button Clicks
            </div>
            <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {formatNumber(buttonClicks)}
            </div>
          </div>
        </div>

        {/* DMs Sent */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20">
          <div className="size-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <MessageSquare className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-blue-600/80 dark:text-blue-400/80 tracking-wider">
              DMs Sent
            </div>
            <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
              {formatNumber(dmsSent)}
            </div>
          </div>
        </div>

        {/* Comments Sent */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20 col-span-2 sm:col-span-1">
          <div className="size-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <MessageCircle className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-purple-600/80 dark:text-purple-400/80 tracking-wider">
              Comments Sent
            </div>
            <div className="text-sm font-bold text-purple-700 dark:text-purple-300">
              {formatNumber(commentsSent)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
