import { useState, useEffect } from "react";
import { BarChart3, Loader2, MessageSquare, Users, MousePointerClick, ShieldCheck, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { dmAutomationService } from "@/services";
import { formatNumber, formatDate } from "@/utils";
import type { DmAutomationMetrics } from "@/types";

export interface DmMetricsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  automationId: string | null;
  automationName?: string;
}

export function DmMetricsDialog({
  isOpen,
  onClose,
  automationId,
  automationName,
}: DmMetricsDialogProps) {
  const [metrics, setMetrics] = useState<DmAutomationMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && automationId) {
      setLoading(true);
      dmAutomationService
        .getMetrics(automationId)
        .then((res) => {
          if (res.success && res.data) {
            setMetrics(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to load metrics:", err);
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
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Performance & Analytics
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Aggregated conversion metrics and message dispatch statistics for{" "}
            <span className="font-semibold text-foreground">{automationName || "this automation"}</span>.
          </DialogDescription>
        </div>

        <div className="pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">Loading metrics...</p>
            </div>
          ) : metrics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Runs */}
                <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-amber-600 tracking-wider">
                      Total Runs
                    </span>
                    <Zap className="size-3.5 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    {formatNumber(metrics.runs)}
                  </div>
                </div>

                {/* DMs Sent */}
                <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-blue-600 tracking-wider">
                      DMs Sent
                    </span>
                    <MessageSquare className="size-3.5 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {formatNumber(metrics.dmsSent)}
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

                {/* Button Clicks */}
                <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-indigo-600 tracking-wider">
                      Button Clicks
                    </span>
                    <MousePointerClick className="size-3.5 text-indigo-500" />
                  </div>
                  <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                    {formatNumber(metrics.buttonClicks)}
                  </div>
                </div>

                {/* Follow Prompts */}
                <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">
                      Follow Prompts
                    </span>
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                    {formatNumber(metrics.followPrompts ?? 0)}
                  </div>
                </div>

                {/* Conversions */}
                <div className="p-3.5 rounded-2xl border border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-teal-600 tracking-wider">
                      Conversions
                    </span>
                    <CheckCircle className="size-3.5 text-teal-500" />
                  </div>
                  <div className="text-xl font-bold text-teal-700 dark:text-teal-300">
                    {formatNumber(metrics.conversions ?? 0)}
                  </div>
                </div>
              </div>

              {metrics.failed > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-xs">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>
                    <strong>{metrics.failed}</strong> execution(s) failed or were rejected due to Instagram API limits.
                  </span>
                </div>
              )}

              <div className="text-right text-[11px] text-muted-foreground pt-1">
                Last updated: {formatDate(metrics.updatedAt || new Date().toISOString())}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-muted-foreground">
              No metrics available for this automation yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
