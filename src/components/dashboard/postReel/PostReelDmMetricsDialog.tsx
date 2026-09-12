import { useState, useEffect } from "react";
import { BarChart3, Loader2, MessageSquare, Users, MousePointerClick, CheckCircle, Video, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { postReelDmService } from "@/services";
import { formatNumber } from "@/utils";
import type { PostReelDmMetrics } from "@/types";

export interface PostReelDmMetricsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  automationId: string | null;
  automationName?: string;
}

export function PostReelDmMetricsDialog({
  isOpen,
  onClose,
  automationId,
  automationName,
}: PostReelDmMetricsDialogProps) {
  const [metrics, setMetrics] = useState<PostReelDmMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && automationId) {
      setLoading(true);
      postReelDmService
        .getMetrics(automationId)
        .then((res) => {
          if (res.success && res.data) {
            setMetrics(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to load post/reel dm metrics:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, automationId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={true} className="max-w-xl p-6 rounded-3xl border shadow-2xl bg-card">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <BarChart3 className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Performance & Conversion Analytics
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Aggregated conversion metrics for Post/Reel DM Automation:{" "}
            <span className="font-semibold text-foreground">{automationName || "this automation"}</span>.
          </DialogDescription>
        </div>

        <div className="pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="size-8 text-pink-500 animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">Loading metrics...</p>
            </div>
          ) : metrics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Shares Received */}
                <div className="p-3.5 rounded-2xl border border-pink-500/20 bg-pink-500/5 dark:bg-pink-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-pink-600 tracking-wider">
                      Shares Received
                    </span>
                    <Video className="size-3.5 text-pink-500" />
                  </div>
                  <div className="text-xl font-bold text-pink-700 dark:text-pink-300">
                    {formatNumber(metrics.sharesReceived)}
                  </div>
                </div>

                {/* Initial DMs Sent */}
                <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-blue-600 tracking-wider">
                      Initial DMs (Stage 1)
                    </span>
                    <MessageSquare className="size-3.5 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {formatNumber(metrics.initialDmsSent)}
                  </div>
                </div>

                {/* CTA Clicks */}
                <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-amber-600 tracking-wider">
                      CTA Clicks
                    </span>
                    <MousePointerClick className="size-3.5 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    {formatNumber(metrics.ctaClicks)}
                  </div>
                </div>

                {/* Primary DMs Sent */}
                <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">
                      Primary DMs (Stage 2)
                    </span>
                    <CheckCircle className="size-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                    {formatNumber(metrics.primaryDmsSent)}
                  </div>
                </div>

                {/* Unique Users */}
                <div className="p-3.5 rounded-2xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-purple-600 tracking-wider">
                      Unique Users
                    </span>
                    <Users className="size-3.5 text-purple-500" />
                  </div>
                  <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    {formatNumber(metrics.uniqueUsers)}
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-indigo-600 tracking-wider">
                      Conversion Rate
                    </span>
                    <TrendingUp className="size-3.5 text-indigo-500" />
                  </div>
                  <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                    {metrics.conversionRate != null ? `${metrics.conversionRate.toFixed(1)}%` : "0.0%"}
                  </div>
                </div>
              </div>

              {/* Conversion Funnel Progress */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>2-Stage Conversion Funnel</span>
                  <span className="text-emerald-500">{metrics.conversionRate?.toFixed(1) || 0}% Completion</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className="bg-pink-500 h-full transition-all"
                    style={{
                      width: `${metrics.sharesReceived > 0 ? (metrics.initialDmsSent / metrics.sharesReceived) * 50 : 0}%`,
                    }}
                    title="Stage 1 Sent"
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{
                      width: `${metrics.initialDmsSent > 0 ? (metrics.primaryDmsSent / metrics.initialDmsSent) * 50 : 0}%`,
                    }}
                    title="Stage 2 Completed"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Reel Shared ({metrics.sharesReceived})</span>
                  <span>CTA Clicked ({metrics.ctaClicks})</span>
                  <span>Completed ({metrics.primaryDmsSent})</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No performance metrics recorded yet for this automation.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
